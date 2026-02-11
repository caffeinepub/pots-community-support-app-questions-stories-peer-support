import { useGetCommunityGuidelines } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield, Users, AlertCircle } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  const { data: backendGuidelines } = useGetCommunityGuidelines();

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Community Guidelines</h1>
        <p className="text-lg text-muted-foreground">
          Creating a safe, supportive space for everyone
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> This is a peer support community. Content shared here is not 
          medical advice and should not replace professional healthcare guidance.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Be Kind and Supportive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              We're all here because we understand the challenges of living with POTS. Treat others 
              with the same compassion and understanding you'd want to receive.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Offer encouragement and empathy</li>
              <li>Share your experiences without judgment</li>
              <li>Respect different perspectives and experiences</li>
              <li>Avoid dismissive or invalidating language</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Respect Privacy and Boundaries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Everyone has the right to share as much or as little as they're comfortable with.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Don't pressure others to share personal details</li>
              <li>Keep shared information within the community</li>
              <li>Respect when someone doesn't want to discuss certain topics</li>
              <li>Don't share others' stories without permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Stay On Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              This community is specifically for people affected by POTS to connect and support each other.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Keep discussions relevant to POTS and related experiences</li>
              <li>Avoid promotional content or spam</li>
              <li>Don't use the community for commercial purposes</li>
              <li>Political and religious discussions should relate to POTS experiences</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Medical Information Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="font-medium text-foreground">
              This is a peer support community, not a source of medical advice.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Share personal experiences, not medical recommendations</li>
              <li>Always consult healthcare professionals for medical decisions</li>
              <li>Don't diagnose or prescribe treatments for others</li>
              <li>Emergency situations require professional medical help, not community posts</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {backendGuidelines && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{backendGuidelines}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Reporting Concerns</h3>
          <p className="text-sm text-muted-foreground">
            If you see content that violates these guidelines, please use the report feature. 
            Our goal is to maintain a safe, supportive environment for everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
