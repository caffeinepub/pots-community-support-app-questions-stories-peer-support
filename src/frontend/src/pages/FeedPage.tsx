import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetPosts } from '../hooks/usePosts';
import { PostType } from '../backend';
import HeroBanner from '../components/branding/HeroBanner';
import PostCard from '../components/posts/PostCard';
import FeedControls from '../components/feed/FeedControls';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FeedPage() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<PostType | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const { data: posts, isLoading, error } = useGetPosts(filterType, searchKeyword);

  const handleClearFilters = () => {
    setFilterType(null);
    setSearchKeyword('');
  };

  return (
    <div className="container py-8 space-y-8">
      <HeroBanner />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community Feed</h2>
          <p className="text-muted-foreground">
            Questions, stories, and support from the community
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/create' })} className="gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Share Your Story
        </Button>
      </div>

      <FeedControls
        filterType={filterType}
        searchKeyword={searchKeyword}
        onFilterChange={setFilterType}
        onSearchChange={setSearchKeyword}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load posts. Please try again later.
          </AlertDescription>
        </Alert>
      ) : !posts || posts.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground text-lg">
            {searchKeyword || filterType
              ? 'No posts found matching your filters.'
              : 'No posts yet. Be the first to share!'}
          </p>
          {(searchKeyword || filterType) && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
