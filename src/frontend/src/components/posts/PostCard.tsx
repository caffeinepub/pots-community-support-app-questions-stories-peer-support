import { useNavigate } from '@tanstack/react-router';
import { Post, PostType } from '../../backend';
import { useGetUserProfile } from '../../hooks/useUserProfile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, HelpCircle, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { data: authorProfile } = useGetUserProfile(post.author);

  const isQuestion = post.postType === PostType.question;
  const createdAt = new Date(Number(post.createdAt) / 1000000);

  const handleClick = () => {
    navigate({ to: '/post/$postId', params: { postId: post.id.toString() } });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-soft transition-all duration-200 hover:border-primary/30"
      onClick={handleClick}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isQuestion ? 'default' : 'secondary'} className="gap-1.5">
              {isQuestion ? (
                <>
                  <HelpCircle className="h-3 w-3" />
                  Question
                </>
              ) : (
                <>
                  <BookOpen className="h-3 w-3" />
                  Story
                </>
              )}
            </Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-semibold leading-tight hover:text-primary transition-colors">
          {post.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">
          {post.body}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium">
              {authorProfile?.name || 'Community Member'}
            </span>
            <span>•</span>
            <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
