import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Post, PostType } from '../backend';

export function useGetPosts(filterType: PostType | null, searchKeyword: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts', filterType, searchKeyword],
    queryFn: async () => {
      if (!actor) return [];

      if (searchKeyword.trim()) {
        return actor.searchPosts(searchKeyword.trim());
      }

      if (filterType) {
        return actor.getPostsByType(filterType);
      }

      return actor.getAllPostsSorted(false);
    },
    enabled: !!actor && !isFetching,
  });
}
