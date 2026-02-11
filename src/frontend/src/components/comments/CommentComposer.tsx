import { useState } from 'react';
import { useCreateComment } from '../../hooks/useComments';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CommentComposerProps {
  postId: bigint;
  parentCommentId?: bigint;
  onSuccess?: () => void;
}

export default function CommentComposer({ postId, parentCommentId, onSuccess }: CommentComposerProps) {
  const [body, setBody] = useState('');
  const createComment = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    try {
      await createComment.mutateAsync({
        postId,
        parentCommentId: parentCommentId || null,
        body: body.trim()
      });
      setBody('');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder={parentCommentId ? 'Write a reply...' : 'Share your thoughts...'}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={createComment.isPending}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            {parentCommentId && onSuccess && (
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                disabled={createComment.isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!body.trim() || createComment.isPending}>
              {createComment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : parentCommentId ? (
                'Reply'
              ) : (
                'Comment'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
