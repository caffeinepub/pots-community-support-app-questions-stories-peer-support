import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useReportContent } from '../../hooks/useReportContent';
import { ReportReason } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: bigint;
  isComment: boolean;
}

export default function ReportDialog({ open, onOpenChange, contentId, isComment }: ReportDialogProps) {
  const { identity } = useInternetIdentity();
  const reportContent = useReportContent();
  const [reason, setReason] = useState<ReportReason>(ReportReason.spam);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to report content');
      return;
    }

    try {
      await reportContent.mutateAsync({ contentId, isComment, reason });
      toast.success('Report submitted. Thank you for helping keep our community safe.');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {isComment ? 'Comment' : 'Post'}</DialogTitle>
          <DialogDescription>
            Help us maintain a supportive community by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              Please sign in to report content.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Reason for reporting</Label>
              <RadioGroup value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ReportReason.spam} id="spam" />
                  <Label htmlFor="spam" className="font-normal cursor-pointer">
                    Spam or misleading
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ReportReason.abuse} id="abuse" />
                  <Label htmlFor="abuse" className="font-normal cursor-pointer">
                    Harassment or abuse
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ReportReason.offTopic} id="offTopic" />
                  <Label htmlFor="offTopic" className="font-normal cursor-pointer">
                    Off-topic or irrelevant
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ReportReason.other} id="other" />
                  <Label htmlFor="other" className="font-normal cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={reportContent.isPending}
                className="flex-1"
              >
                {reportContent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={reportContent.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
