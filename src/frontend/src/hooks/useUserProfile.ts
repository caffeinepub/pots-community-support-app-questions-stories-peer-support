import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetUserProfile(user: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}
