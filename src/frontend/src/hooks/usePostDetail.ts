import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Post } from '../backend';

export function useGetPost(postId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ['post', postId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPost(postId);
    },
    enabled: !!actor && !isFetching,
  });
}
