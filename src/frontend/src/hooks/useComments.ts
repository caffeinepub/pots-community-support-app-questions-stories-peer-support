import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Comment } from '../backend';

export function useGetComments(postId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommentsByPost(postId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReplies(commentId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['replies', commentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRepliesByComment(commentId);
    },
    enabled: !!actor && !isFetching,
  });
}

interface CreateCommentParams {
  postId: bigint;
  parentCommentId: bigint | null;
  body: string;
}

export function useCreateComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateCommentParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createComment(params.postId, params.parentCommentId, params.body);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId.toString()] });
      if (variables.parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ['replies', variables.parentCommentId.toString()] });
      }
    },
  });
}
