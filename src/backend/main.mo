import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";

import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Option "mo:core/Option";
import Int "mo:core/Int";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile System
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Post System
  type PostType = { #question; #story };
  type ReactionType = { #helpful; #support };

  type Post = {
    id : Nat;
    postType : PostType;
    title : Text;
    body : Text;
    author : Principal;
    createdAt : Time.Time;
    tags : [Text];
  };

  type Comment = {
    id : Nat;
    postId : Nat;
    parentCommentId : ?Nat;
    body : Text;
    author : Principal;
    createdAt : Time.Time;
  };

  type Reaction = {
    id : Nat;
    postId : Nat;
    reactionType : ReactionType;
    user : Principal;
    createdAt : Time.Time;
  };

  // Report System
  type ReportReason = {
    #spam;
    #abuse;
    #offTopic;
    #other;
  };

  type Report = {
    id : Nat;
    reportedId : Nat;
    isComment : Bool;
    reason : ReportReason;
    reporter : Principal;
    createdAt : Time.Time;
  };

  module Post {
    public func compareById(post1 : Post, post2 : Post) : Order.Order {
      Nat.compare(post1.id, post2.id);
    };
  };

  var nextPostId = 1;
  var nextCommentId = 1;
  var nextReportId = 1;

  let posts = Map.empty<Nat, Post>();
  let comments = Map.empty<Nat, Comment>();
  let reactions = Map.empty<Nat, Reaction>();
  let reports = Map.empty<Nat, Report>();

  // Posts
  public shared ({ caller }) func createPost(postType : PostType, title : Text, body : Text, tags : [Text]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let post : Post = {
      id = postId;
      postType;
      title;
      body;
      author = caller;
      createdAt = Time.now();
      tags;
    };

    posts.add(postId, post);
    postId;
  };

  public query ({ caller }) func getPost(id : Nat) : async ?Post {
    posts.get(id);
  };

  public query ({ caller }) func getPostsByType(postType : ?PostType) : async [Post] {
    posts.values().toArray().filter(
      func(post) {
        switch (postType) {
          case (null) { true };
          case (?pt) { post.postType == pt };
        };
      }
    );
  };

  public query ({ caller }) func searchPosts(keyword : Text) : async [Post] {
    posts.values().toArray().filter(
      func(post) {
        post.title.contains(#text keyword) or post.body.contains(#text keyword);
      }
    );
  };

  public query ({ caller }) func getAllPostsSorted(oldFirst : Bool) : async [Post] {
    let postsArray = posts.values().toArray();
    postsArray.sort(
      func(a, b) {
        switch (oldFirst) {
          case (true) { Int.compare(a.createdAt, b.createdAt) };
          case (false) { Int.compare(b.createdAt, a.createdAt) };
        };
      }
    );
  };

  // Comments
  public shared ({ caller }) func createComment(postId : Nat, parentCommentId : ?Nat, body : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create comments");
    };

    if (not posts.containsKey(postId)) { Runtime.trap("Post does not exist") };

    let commentId = nextCommentId;
    nextCommentId += 1;

    let comment : Comment = {
      id = commentId;
      postId;
      parentCommentId;
      body;
      author = caller;
      createdAt = Time.now();
    };

    comments.add(commentId, comment);
    commentId;
  };

  public query ({ caller }) func getCommentsByPost(postId : Nat) : async [Comment] {
    comments.values().toArray().filter(
      func(comment) {
        comment.postId == postId;
      }
    );
  };

  public query ({ caller }) func getRepliesByComment(commentId : Nat) : async [Comment] {
    comments.values().toArray().filter(
      func(comment) {
        switch (comment.parentCommentId) {
          case (null) { false };
          case (?parentId) { parentId == commentId };
        };
      }
    );
  };

  // Reactions
  public shared ({ caller }) func addReaction(postId : Nat, reactionType : ReactionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reactions");
    };

    if (not posts.containsKey(postId)) { Runtime.trap("Post does not exist") };

    // Check if user already reacted
    let existingReaction = reactions.values().toArray().find(
      func(reaction) {
        reaction.postId == postId and reaction.user == caller and reaction.reactionType == reactionType
      }
    );

    switch (existingReaction) {
      case (null) {
        let reactionId = reactions.size();
        let reaction : Reaction = {
          id = reactionId;
          postId;
          reactionType;
          user = caller;
          createdAt = Time.now();
        };
        reactions.add(reactionId, reaction);
      };
      case (?_) {
        Runtime.trap("You have already reacted to this post");
      };
    };
  };

  public shared ({ caller }) func removeReaction(postId : Nat, reactionType : ReactionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove reactions");
    };

    let toRemove = reactions.toArray().find(
      func(entry) {
        let (id, reaction) = entry;
        reaction.postId == postId and reaction.user == caller and reaction.reactionType == reactionType
      }
    );
    switch (toRemove) {
      case (?entry) { let (id, _) = entry; reactions.remove(id) };
      case (null) { Runtime.trap("No reaction found to remove") };
    };
  };

  public query ({ caller }) func countPostReactions(postId : Nat, reactionType : ReactionType) : async Nat {
    reactions.values().toArray().filter(
      func(r) { r.postId == postId and r.reactionType == reactionType }
    ).size();
  };

  // Reports
  public shared ({ caller }) func reportContent(contentId : Nat, isComment : Bool, reason : ReportReason) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report content");
    };

    let reportId = nextReportId;
    nextReportId += 1;

    let report : Report = {
      id = reportId;
      reportedId = contentId;
      isComment;
      reason;
      reporter = caller;
      createdAt = Time.now();
    };

    reports.add(reportId, report);
  };

  public query ({ caller }) func reviewSubmittedReports() : async [Report] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can review reports");
    };
    reports.values().toArray();
  };

  // Community Guidelines
  public query ({ caller }) func getCommunityGuidelines() : async Text {
    "Welcome to our peer support community. Treat each other with respect, be kind, and help foster a supportive environment."
  };
};
