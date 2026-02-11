import { PostType } from '../../backend';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface FeedControlsProps {
  filterType: PostType | null;
  searchKeyword: string;
  onFilterChange: (type: PostType | null) => void;
  onSearchChange: (keyword: string) => void;
  onClear: () => void;
}

export default function FeedControls({
  filterType,
  searchKeyword,
  onFilterChange,
  onSearchChange,
  onClear
}: FeedControlsProps) {
  const hasActiveFilters = filterType !== null || searchKeyword !== '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs
          value={filterType || 'all'}
          onValueChange={(value) => onFilterChange(value === 'all' ? null : value as PostType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={PostType.question}>Questions</TabsTrigger>
            <TabsTrigger value={PostType.story}>Stories</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="icon" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
