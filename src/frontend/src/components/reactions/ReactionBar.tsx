import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetReactionCounts, useToggleReaction } from '../../hooks/useReactions';
import { ReactionType } from '../../backend';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

interface ReactionBarProps {
  postId: bigint;
}

export default function ReactionBar({ postId }: ReactionBarProps) {
  const { identity } = useInternetIdentity();
  const { supportCount, helpfulCount, userReactions } = useGetReactionCounts(postId);
  const toggleReaction = useToggleReaction();

  const isAuthenticated = !!identity;

  const handleReaction = async (reactionType: ReactionType) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to react to posts');
      return;
    }

    try {
      await toggleReaction.mutateAsync({ postId, reactionType });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reaction');
    }
  };

  const hasSupport = userReactions.includes(ReactionType.support);
  const hasHelpful = userReactions.includes(ReactionType.helpful);

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={hasSupport ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleReaction(ReactionType.support)}
        disabled={toggleReaction.isPending}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${hasSupport ? 'fill-current' : ''}`} />
        Support
        {supportCount > 0 && <span className="font-semibold">{supportCount.toString()}</span>}
      </Button>

      <Button
        variant={hasHelpful ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleReaction(ReactionType.helpful)}
        disabled={toggleReaction.isPending}
        className="gap-2"
      >
        <ThumbsUp className={`h-4 w-4 ${hasHelpful ? 'fill-current' : ''}`} />
        Helpful
        {helpfulCount > 0 && <span className="font-semibold">{helpfulCount.toString()}</span>}
      </Button>
    </div>
  );
}
