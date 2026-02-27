import React, { createContext, useContext, useState, useEffect } from 'react';
import { Influencer, ContentItem } from './types';

interface StoreContextType {
  influencers: Influencer[];
  content: ContentItem[];
  addInfluencer: (influencer: Influencer) => void;
  updateInfluencer: (id: string, data: Partial<Influencer>) => void;
  deleteInfluencer: (id: string) => void;
  addContent: (item: ContentItem) => void;
  deleteContent: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [influencers, setInfluencers] = useState<Influencer[]>(() => {
    const saved = localStorage.getItem('influencers');
    return saved ? JSON.parse(saved) : [];
  });

  const [content, setContent] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('content');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('influencers', JSON.stringify(influencers));
  }, [influencers]);

  useEffect(() => {
    localStorage.setItem('content', JSON.stringify(content));
  }, [content]);

  const addInfluencer = (influencer: Influencer) => {
    setInfluencers(prev => [influencer, ...prev]);
  };

  const updateInfluencer = (id: string, data: Partial<Influencer>) => {
    setInfluencers(prev => prev.map(inf => inf.id === id ? { ...inf, ...data } : inf));
  };

  const deleteInfluencer = (id: string) => {
    setInfluencers(prev => prev.filter(inf => inf.id !== id));
    setContent(prev => prev.filter(c => c.influencerId !== id));
  };

  const addContent = (item: ContentItem) => {
    setContent(prev => [item, ...prev]);
  };

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(c => c.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      influencers,
      content,
      addInfluencer,
      updateInfluencer,
      deleteInfluencer,
      addContent,
      deleteContent
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
