import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Comment {
    id: bigint;
    parentCommentId?: bigint;
    body: string;
    createdAt: Time;
    author: Principal;
    postId: bigint;
}
export interface Post {
    id: bigint;
    postType: PostType;
    title: string;
    body: string;
    createdAt: Time;
    tags: Array<string>;
    author: Principal;
}
export interface Report {
    id: bigint;
    createdAt: Time;
    isComment: boolean;
    reportedId: bigint;
    reporter: Principal;
    reason: ReportReason;
}
export interface UserProfile {
    name: string;
}
export enum PostType {
    question = "question",
    story = "story"
}
export enum ReactionType {
    support = "support",
    helpful = "helpful"
}
export enum ReportReason {
    abuse = "abuse",
    other = "other",
    spam = "spam",
    offTopic = "offTopic"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReaction(postId: bigint, reactionType: ReactionType): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    countPostReactions(postId: bigint, reactionType: ReactionType): Promise<bigint>;
    createComment(postId: bigint, parentCommentId: bigint | null, body: string): Promise<bigint>;
    createPost(postType: PostType, title: string, body: string, tags: Array<string>): Promise<bigint>;
    getAllPostsSorted(oldFirst: boolean): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsByPost(postId: bigint): Promise<Array<Comment>>;
    getCommunityGuidelines(): Promise<string>;
    getPost(id: bigint): Promise<Post | null>;
    getPostsByType(postType: PostType | null): Promise<Array<Post>>;
    getRepliesByComment(commentId: bigint): Promise<Array<Comment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeReaction(postId: bigint, reactionType: ReactionType): Promise<void>;
    reportContent(contentId: bigint, isComment: boolean, reason: ReportReason): Promise<void>;
    reviewSubmittedReports(): Promise<Array<Report>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPosts(keyword: string): Promise<Array<Post>>;
}
