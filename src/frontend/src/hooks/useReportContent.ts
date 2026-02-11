import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ReportReason } from '../backend';

interface ReportContentParams {
  contentId: bigint;
  isComment: boolean;
  reason: ReportReason;
}

export function useReportContent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: ReportContentParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reportContent(params.contentId, params.isComment, params.reason);
    },
  });
}
