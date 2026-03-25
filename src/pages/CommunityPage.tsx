import { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageSquare, HelpCircle, TrendingUp, Clock, Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { useCommunityHub } from '@/hooks/useCommunityHub';
import type { CommunityCategory, SortOption } from '@/hooks/useCommunityHub';
import { QuestionCard } from '@/components/community/QuestionCard';

const CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'flavor-talk', label: 'Flavor Talk' },
  { value: 'new-releases', label: 'New Releases' },
  { value: 'tips', label: 'Tips & Tricks' },
  { value: 'general', label: 'General' },
];

const SORTS: { value: SortOption; label: string; Icon: typeof Clock }[] = [
  { value: 'newest', label: 'Newest', Icon: Clock },
  { value: 'most_liked', label: 'Most Liked', Icon: Heart },
  { value: 'most_discussed', label: 'Most Discussed', Icon: TrendingUp },
];

export default function CommunityPage() {
  const [category, setCategory] = useState<CommunityCategory>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const { posts, questions, isLoading } = useCommunityHub(category, sort);

  const handleCategoryChange = useCallback((val: string) => {
    setCategory(val as CommunityCategory);
  }, []);

  return (
    <>
      <SEO title="Community | SnusFriend" description="Join the SnusFriend community. Share reviews, ask questions, and connect with fellow enthusiasts." />
      <Layout>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Community Hub</h1>
            <p className="text-sm text-muted-foreground mt-1">Discuss, share, and discover with fellow pouch enthusiasts</p>
          </div>

          {/* Sort buttons */}
          <div className="flex items-center gap-2 mb-6">
            {SORTS.map(({ value, label, Icon }) => (
              <Button
                key={value}
                variant={sort === value ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setSort(value)}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid h-11 rounded-xl bg-muted/20 border border-border/20 p-1">
              <TabsTrigger value="feed" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <MessageSquare className="h-4 w-4" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <HelpCircle className="h-4 w-4" />
                Ask the Community
              </TabsTrigger>
            </TabsList>

            {/* Feed Tab */}
            <TabsContent value="feed">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="font-serif">Community Feed</CardTitle>
                  <CardDescription>See what the community is talking about</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">Loading posts…</p>
                  ) : posts.length === 0 ? (
                    <EmptyState
                      variant="generic"
                      title="No posts yet"
                      description="Be the first to share something with the community! Post from any product page or your account."
                    />
                  ) : (
                    <div className="space-y-3">
                      {posts.map((post) => (
                        <div key={post.id} className="rounded-lg border border-border/20 bg-secondary/20 p-4">
                          <p className="text-sm break-words whitespace-pre-wrap">{post.body}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>❤️ {post.likes_count}</span>
                            <span>💬 {post.comments_count}</span>
                            <span className="ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Q&A Tab */}
            <TabsContent value="questions">
              {/* Category filter */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {CATEGORIES.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={category === value ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => handleCategoryChange(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground py-6 text-center">Loading questions…</p>
              ) : questions.length === 0 ? (
                <EmptyState
                  variant="generic"
                  title="No questions yet"
                  description="Got a question about nicotine pouches? Ask the community!"
                />
              ) : (
                <div className="space-y-3">
                  {questions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
