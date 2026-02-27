import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PlusCircle, User, MessageSquare, Image as ImageIcon } from 'lucide-react';

export function Dashboard() {
  const { influencers, content } = useStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-zinc-400">Manage your AI influencers and content.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <User className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Text Content</CardTitle>
            <MessageSquare className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.filter(c => c.type !== 'image').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.filter(c => c.type === 'image').length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Your Influencers</h2>
          <Link to="/create">
            <Button size="sm" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              New Influencer
            </Button>
          </Link>
        </div>

        {influencers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No influencers yet</h3>
            <p className="text-zinc-400 mb-6 max-w-sm">
              Create your first AI influencer to start generating content automatically.
            </p>
            <Link to="/create">
              <Button>Create Influencer</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {influencers.map((influencer) => (
              <Link key={influencer.id} to={`/influencer/${influencer.id}`}>
                <Card className="hover:border-fuchsia-500/50 transition-colors cursor-pointer h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {influencer.avatarUrl ? (
                        <img src={influencer.avatarUrl} alt={influencer.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-6 h-6 text-zinc-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{influencer.name}</CardTitle>
                        <CardDescription>{influencer.niche}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-zinc-400 line-clamp-3">{influencer.bio}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
