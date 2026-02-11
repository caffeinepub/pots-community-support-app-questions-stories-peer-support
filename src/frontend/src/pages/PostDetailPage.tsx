import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPost } from '../hooks/usePostDetail';
import { useGetComments } from '../hooks/useComments';
import { useGetUserProfile } from '../hooks/useUserProfile';
import { PostType } from '../backend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentThread from '../components/comments/CommentThread';
import CommentComposer from '../components/comments/CommentComposer';
import ReactionBar from '../components/reactions/ReactionBar';
import ReportDialog from '../components/report/ReportDialog';
import { Loader2, ArrowLeft, HelpCircle, BookOpen, Flag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const { data: post, isLoading, error } = useGetPost(BigInt(postId));
  const { data: comments } = useGetComments(BigInt(postId));
  const { data: authorProfile } = useGetUserProfile(post?.author);

  const isAuthenticated = !!identity;

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-12 max-w-3xl">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load post. It may have been removed or doesn't exist.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </div>
    );
  }

  const isQuestion = post.postType === PostType.question;
  const createdAt = new Date(Number(post.createdAt) / 1000000);
  const topLevelComments = comments?.filter((c) => !c.parentCommentId) || [];

  return (
    <div className="container py-8 max-w-4xl space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isQuestion ? 'default' : 'secondary'} className="gap-1.5">
                {isQuestion ? (
                  <>
                    <HelpCircle className="h-3 w-3" />
                    Question
                  </>
                ) : (
                  <>
                    <BookOpen className="h-3 w-3" />
                    Story
                  </>
                )}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportDialogOpen(true)}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium">{authorProfile?.name || 'Community Member'}</span>
            <span>•</span>
            <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{post.body}</p>
          </div>

          <Separator />

          <ReactionBar postId={post.id} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Comments ({topLevelComments.length})
        </h2>

        {isAuthenticated ? (
          <CommentComposer postId={post.id} />
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                Sign in to join the conversation
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentThread key={comment.id.toString()} comment={comment} postId={post.id} />
          ))}
        </div>
      </div>

      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        contentId={post.id}
        isComment={false}
      />
    </div>
  );
}
