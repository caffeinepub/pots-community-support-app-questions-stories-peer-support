import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { ReactionType } from '../backend';

export function useGetReactionCounts(postId: bigint) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const supportQuery = useQuery<bigint>({
    queryKey: ['reactionCount', postId.toString(), ReactionType.support],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.countPostReactions(postId, ReactionType.support);
    },
    enabled: !!actor && !isFetching,
  });

  const helpfulQuery = useQuery<bigint>({
    queryKey: ['reactionCount', postId.toString(), ReactionType.helpful],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.countPostReactions(postId, ReactionType.helpful);
    },
    enabled: !!actor && !isFetching,
  });

  const userReactionsQuery = useQuery<ReactionType[]>({
    queryKey: ['userReactions', postId.toString(), identity?.getPrincipal().toString()],
    queryFn: async () => {
      return [];
    },
    enabled: !!identity,
  });

  return {
    supportCount: supportQuery.data || BigInt(0),
    helpfulCount: helpfulQuery.data || BigInt(0),
    userReactions: userReactionsQuery.data || [],
  };
}

interface ToggleReactionParams {
  postId: bigint;
  reactionType: ReactionType;
}

export function useToggleReaction() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ToggleReactionParams) => {
      if (!actor) throw new Error('Actor not available');

      const userReactions = queryClient.getQueryData<ReactionType[]>([
        'userReactions',
        params.postId.toString(),
        identity?.getPrincipal().toString(),
      ]) || [];

      const hasReaction = userReactions.includes(params.reactionType);

      if (hasReaction) {
        await actor.removeReaction(params.postId, params.reactionType);
      } else {
        await actor.addReaction(params.postId, params.reactionType);
      }

      return { hasReaction, reactionType: params.reactionType };
    },
    onMutate: async (params) => {
      const userReactionsKey = [
        'userReactions',
        params.postId.toString(),
        identity?.getPrincipal().toString(),
      ];

      await queryClient.cancelQueries({ queryKey: userReactionsKey });

      const previousReactions = queryClient.getQueryData<ReactionType[]>(userReactionsKey) || [];
      const hasReaction = previousReactions.includes(params.reactionType);

      const newReactions = hasReaction
        ? previousReactions.filter((r) => r !== params.reactionType)
        : [...previousReactions, params.reactionType];

      queryClient.setQueryData(userReactionsKey, newReactions);

      return { previousReactions };
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: ['reactionCount', params.postId.toString(), params.reactionType],
      });
    },
    onError: (_, params, context) => {
      if (context?.previousReactions) {
        queryClient.setQueryData(
          ['userReactions', params.postId.toString(), identity?.getPrincipal().toString()],
          context.previousReactions
        );
      }
    },
  });
}
