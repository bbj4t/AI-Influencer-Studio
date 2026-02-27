import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store';
import { generateContentText, generateInfluencerImage } from '../services/gemini';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Loader2, Wand2, Trash2, ArrowLeft, Image as ImageIcon, MessageSquare } from 'lucide-react';

export function InfluencerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { influencers, content, deleteInfluencer, addContent, deleteContent } = useStore();
  
  const influencer = influencers.find(inf => inf.id === id);
  const influencerContent = content.filter(c => c.influencerId === id).sort((a, b) => b.createdAt - a.createdAt);

  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [topic, setTopic] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');

  if (!influencer) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Influencer not found</h2>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this influencer and all their content?')) {
      deleteInfluencer(influencer.id);
      navigate('/');
    }
  };

  const handleGenerateText = async (type: 'blog' | 'social') => {
    if (!topic) return;
    setLoadingText(true);
    try {
      const result = await generateContentText(influencer, topic, type);
      addContent({
        id: uuidv4(),
        influencerId: influencer.id,
        type,
        prompt: topic,
        result,
        createdAt: Date.now(),
      });
      setTopic('');
    } catch (error) {
      console.error("Failed to generate text", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoadingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setLoadingImage(true);
    try {
      const result = await generateInfluencerImage(influencer, imagePrompt);
      addContent({
        id: uuidv4(),
        influencerId: influencer.id,
        type: 'image',
        prompt: imagePrompt,
        result,
        createdAt: Date.now(),
      });
      setImagePrompt('');
    } catch (error) {
      console.error("Failed to generate image", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{influencer.name}</h1>
            <p className="text-zinc-400">{influencer.niche} • {influencer.toneOfVoice}</p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* Content Generation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Content</CardTitle>
              <CardDescription>Create new posts or images in {influencer.name}'s unique style.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Content Topic</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. 5 tips for sustainable living" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={loadingText}
                    />
                    <Button 
                      onClick={() => handleGenerateText('social')} 
                      disabled={loadingText || !topic}
                      variant="secondary"
                    >
                      {loadingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                      Social Post
                    </Button>
                    <Button 
                      onClick={() => handleGenerateText('blog')} 
                      disabled={loadingText || !topic}
                    >
                      {loadingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                      Blog Post
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <label className="text-sm font-medium">Image Generation Prompt</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Drinking coffee at a modern cafe in Paris" 
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      disabled={loadingImage}
                    />
                    <Button 
                      onClick={handleGenerateImage} 
                      disabled={loadingImage || !imagePrompt}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                      Generate Image
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Feed */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Generated Content</h2>
            {influencerContent.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
                No content generated yet. Use the tools above to create some!
              </div>
            ) : (
              <div className="space-y-4">
                {influencerContent.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        {item.type === 'image' ? <ImageIcon className="w-4 h-4 text-purple-500" /> : <MessageSquare className="w-4 h-4 text-fuchsia-500" />}
                        <span className="text-sm font-medium text-zinc-400 capitalize">{item.type} Post</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteContent(item.id)} className="h-8 w-8 text-zinc-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-500 mb-3">Prompt: {item.prompt}</div>
                      {item.type === 'image' ? (
                        <img src={item.result} alt={item.prompt} className="rounded-md max-w-full h-auto" />
                      ) : (
                        <div className="whitespace-pre-wrap text-zinc-200 bg-zinc-950 p-4 rounded-md border border-zinc-800">
                          {item.result}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Persona Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-zinc-500 block mb-1">Bio</span>
                <p className="text-zinc-200">{influencer.bio}</p>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Visual Style</span>
                <p className="text-zinc-200">{influencer.visualStyle}</p>
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <span className="text-zinc-500 block mb-1">Created</span>
                <p className="text-zinc-200">{new Date(influencer.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
