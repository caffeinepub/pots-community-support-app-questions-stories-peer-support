import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetCommunityGuidelines() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['communityGuidelines'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCommunityGuidelines();
    },
    enabled: !!actor && !isFetching,
  });
}
