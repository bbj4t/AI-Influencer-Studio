import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store';
import { generateInfluencerBio } from '../services/gemini';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';

export function CreateInfluencer() {
  const navigate = useNavigate();
  const { addInfluencer } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    toneOfVoice: '',
    visualStyle: '',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateBio = async () => {
    if (!formData.name || !formData.niche || !formData.toneOfVoice) {
      alert("Please fill in Name, Niche, and Tone of Voice first.");
      return;
    }
    setLoading(true);
    try {
      const bio = await generateInfluencerBio(formData.name, formData.niche, formData.toneOfVoice);
      setFormData({ ...formData, bio });
    } catch (error) {
      console.error("Failed to generate bio", error);
      alert("Failed to generate bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.niche || !formData.toneOfVoice || !formData.visualStyle || !formData.bio) {
      alert("Please fill in all fields.");
      return;
    }

    const newInfluencer = {
      id: uuidv4(),
      ...formData,
      createdAt: Date.now(),
    };

    addInfluencer(newInfluencer);
    navigate(`/influencer/${newInfluencer.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Influencer</h1>
        <p className="text-zinc-400">Define the persona, niche, and style of your new AI influencer.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Persona Details</CardTitle>
            <CardDescription>This information will be used to generate content that matches the influencer's unique voice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Alex Rivera" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="niche" className="text-sm font-medium">Niche / Industry</label>
              <Input 
                id="niche" 
                name="niche" 
                placeholder="e.g. Sustainable Fashion, Tech Reviews, Fitness" 
                value={formData.niche} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="toneOfVoice" className="text-sm font-medium">Tone of Voice</label>
              <Input 
                id="toneOfVoice" 
                name="toneOfVoice" 
                placeholder="e.g. Enthusiastic and professional, Sarcastic and witty" 
                value={formData.toneOfVoice} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="visualStyle" className="text-sm font-medium">Visual Style (for image generation)</label>
              <Input 
                id="visualStyle" 
                name="visualStyle" 
                placeholder="e.g. Cinematic lighting, 35mm film, vibrant colors, minimalist" 
                value={formData.visualStyle} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateBio}
                  disabled={loading}
                  className="h-8 text-xs"
                >
                  {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Wand2 className="w-3 h-3 mr-2" />}
                  Auto-generate Bio
                </Button>
              </div>
              <Textarea 
                id="bio" 
                name="bio" 
                placeholder="A short description of the influencer..." 
                value={formData.bio} 
                onChange={handleChange} 
                rows={4}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-zinc-800 pt-6">
            <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
            <Button type="submit">Create Influencer</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
