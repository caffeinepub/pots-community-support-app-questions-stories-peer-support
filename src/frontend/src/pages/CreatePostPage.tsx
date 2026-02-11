import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreatePost } from '../hooks/useCreatePost';
import { PostType } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TagsInput from '../components/posts/TagsInput';
import { Loader2, HelpCircle, BookOpen, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createPost = useCreatePost();

  const [postType, setPostType] = useState<PostType>(PostType.question);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      const postId = await createPost.mutateAsync({
        postType,
        title: title.trim(),
        body: body.trim(),
        tags
      });
      navigate({ to: '/post/$postId', params: { postId: postId.toString() } });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to sign in to share your story or ask a question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })} className="gap-2">
              <LogIn className="h-4 w-4" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Share with the Community</h1>
          <p className="text-muted-foreground mt-2">
            Ask a question or share your story to connect with others
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
            <CardDescription>
              Choose whether you're asking a question or sharing a story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Post Type</Label>
                <Tabs
                  value={postType}
                  onValueChange={(value) => setPostType(value as PostType)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={PostType.question} className="gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Question
                    </TabsTrigger>
                    <TabsTrigger value={PostType.story} className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      Story
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder={
                    postType === PostType.question
                      ? 'What would you like to ask?'
                      : 'Give your story a title'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={createPost.isPending}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">
                  {postType === PostType.question ? 'Question Details' : 'Your Story'} *
                </Label>
                <Textarea
                  id="body"
                  placeholder={
                    postType === PostType.question
                      ? 'Provide more details about your question...'
                      : 'Share your experience...'
                  }
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={createPost.isPending}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <TagsInput
                  tags={tags}
                  onChange={setTags}
                  disabled={createPost.isPending}
                  placeholder="Add tags (press Enter or comma to add)"
                />
              </div>

              {createPost.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create post. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!title.trim() || !body.trim() || createPost.isPending}
                  className="flex-1"
                >
                  {createPost.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Post'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={createPost.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
