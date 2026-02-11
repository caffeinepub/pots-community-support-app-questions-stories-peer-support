import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PostType } from '../backend';

interface CreatePostParams {
  postType: PostType;
  title: string;
  body: string;
  tags: string[];
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePostParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(params.postType, params.title, params.body, params.tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
