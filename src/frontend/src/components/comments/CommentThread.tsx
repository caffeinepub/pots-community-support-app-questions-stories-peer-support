import { useState } from 'react';
import { Comment } from '../../backend';
import { useGetReplies } from '../../hooks/useComments';
import { useGetUserProfile } from '../../hooks/useUserProfile';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommentComposer from './CommentComposer';
import ReportDialog from '../report/ReportDialog';
import { MessageSquare, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentThreadProps {
  comment: Comment;
  postId: bigint;
}

interface ReplyItemProps {
  reply: Comment;
}

function ReplyItem({ reply }: ReplyItemProps) {
  const { data: authorProfile } = useGetUserProfile(reply.author);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const createdAt = new Date(Number(reply.createdAt) / 1000000);

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {authorProfile?.name || 'Community Member'}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{reply.body}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportDialogOpen(true)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        contentId={reply.id}
        isComment={true}
      />
    </>
  );
}

export default function CommentThread({ comment, postId }: CommentThreadProps) {
  const { identity } = useInternetIdentity();
  const { data: authorProfile } = useGetUserProfile(comment.author);
  const { data: replies } = useGetReplies(comment.id);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const isAuthenticated = !!identity;
  const createdAt = new Date(Number(comment.createdAt) / 1000000);

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {authorProfile?.name || 'Community Member'}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{comment.body}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportDialogOpen(true)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyComposer(!showReplyComposer)}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Reply
              </Button>
            )}
            {replies && replies.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {showReplyComposer && (
            <CommentComposer
              postId={postId}
              parentCommentId={comment.id}
              onSuccess={() => setShowReplyComposer(false)}
            />
          )}
        </CardContent>
      </Card>

      {replies && replies.length > 0 && (
        <div className="ml-8 space-y-3">
          {replies.map((reply) => (
            <ReplyItem key={reply.id.toString()} reply={reply} />
          ))}
        </div>
      )}

      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        contentId={comment.id}
        isComment={true}
      />
    </div>
  );
}
