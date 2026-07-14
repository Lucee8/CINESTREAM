import { Video } from '../types';

export const CATEGORIES = ['All', 'Music', 'Gaming', 'Technology', 'Education', 'Entertainment'];

export const mockVideos: Video[] = [
  {
    id: 'cyberpunk-synthwave',
    title: 'Neon Horizon - A Cyberpunk Synthwave Odyssey (3-Hour Live Set)',
    description: 'Immerse yourself in the glowing neon rain-soaked streets of New Kyoto. This custom curated live synthwave set fuses 80s nostalgia with modern heavy retro basslines. Perfect for late-night driving, coding, or relaxation.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    duration: '2:58:40',
    views: '1.2M views',
    uploadedAt: '2 days ago',
    category: 'Music',
    likes: '45K',
    channel: {
      name: 'RetroPulse Beats',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      subscribers: '340K subscribers'
    }
  },
  {
    id: 'next-gen-quantum',
    title: 'How Quantum Computing Works: A Deep Dive into Quantum Superposition',
    description: 'We explore the fundamental physics governing quantum mechanics and how qubits utilize entanglement and superposition to solve complex problems faster than traditional supercomputers. No advanced degree required!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    duration: '18:42',
    views: '425K views',
    uploadedAt: '5 days ago',
    category: 'Technology',
    likes: '18K',
    channel: {
      name: 'QuantumTheory',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      subscribers: '1.2M subscribers'
    }
  },
  {
    id: 'speedrun-championship',
    title: 'Elden Ring Speedrun World Record Shattered! (Any% Glitchless)',
    description: 'Witness history as the ultimate Elden Ring challenge gets broken by under 42 seconds in an incredible run of pure execution, routing perfection, and clutch boss battles. Complete analysis of key shortcuts inside.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    duration: '45:12',
    views: '2.8M views',
    uploadedAt: '1 week ago',
    category: 'Gaming',
    likes: '112K',
    channel: {
      name: 'SpeedRun Central',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      subscribers: '890K subscribers'
    }
  },
  {
    id: 'ai-evolution-explained',
    title: 'AGI is Closer Than You Think: Demystifying Large Reasoning Models',
    description: 'From transformers to tree-of-thought planning, we break down the newest advancements in reasoning neural architectures. What does self-correction mean for the software engineering industry?',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    duration: '22:15',
    views: '670K views',
    uploadedAt: '3 days ago',
    category: 'Technology',
    likes: '34K',
    channel: {
      name: 'The Tech Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      subscribers: '650K subscribers'
    }
  },
  {
    id: 'learn-design-fundamentals',
    title: 'The Art of Negative Space: UI/UX Principles You Must Master',
    description: 'Why do premium designs feel premium? It is not about the colors or shadows; it is about spacing, typography scale, and visual rhythm. Master the secrets of layout constraints to level up your UI game.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    duration: '14:30',
    views: '150K views',
    uploadedAt: '4 hours ago',
    category: 'Education',
    likes: '9.2K',
    channel: {
      name: 'DesignCraft Studio',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      subscribers: '210K subscribers'
    }
  },
  {
    id: 'cinematic-scoring-secrets',
    title: 'How Hans Zimmer Builds Tension: Analyzing the Inception Sound Design',
    description: 'A deep musical breakdown of the brass chord progressions, low-frequency sub-basses, and ticking clocks that define Hans Zimmers legendary Tension Orchestration. Learn how to apply these directly to your films.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    duration: '25:08',
    views: '830K views',
    uploadedAt: '3 weeks ago',
    category: 'Music',
    likes: '51K',
    channel: {
      name: 'ScoreBreakdown',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      subscribers: '410K subscribers'
    }
  },
  {
    id: 'unreal-engine-five-secrets',
    title: 'Unreal Engine 5.5: Creating Photorealistic Cinematic Environments',
    description: 'Step-by-step masterclass demonstrating dynamic Lumen lighting, Nanite geometry streaming, and custom volumetric fog. Learn to sculpt rich mountains and ancient ruin gates in under an hour.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600&auto=format&fit=crop&q=80',
    duration: '52:40',
    views: '1.1M views',
    uploadedAt: '6 days ago',
    category: 'Gaming',
    likes: '78K',
    channel: {
      name: 'RenderForge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      subscribers: '1.5M subscribers'
    }
  },
  {
    id: 'physics-of-black-holes',
    title: 'What Happens Inside a Rotating Black Hole? (Kerr Metric Visualized)',
    description: 'Journey past the static limit and outer event horizon. In this lesson, we use full 3D relativity simulations to trace photon paths and explore the mind-bending physics of the ring-shaped ring singularity.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    duration: '31:10',
    views: '3.4M views',
    uploadedAt: '1 month ago',
    category: 'Education',
    likes: '220K',
    channel: {
      name: 'CosmosAcademy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      subscribers: '5.2M subscribers'
    }
  },
  {
    id: 'indie-game-developer-journey',
    title: 'Why I Spent 4 Years Developing a Solo Indie RPG About Deep Sea Fishing',
    description: 'An honest retrospective on the emotional rollercoasters, scope creeps, code refactoring, and art updates of building my custom sub-oceanic horror game, Deep Trench. Full release trailer at the end.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    duration: '19:55',
    views: '290K views',
    uploadedAt: '4 days ago',
    category: 'Entertainment',
    likes: '21K',
    channel: {
      name: 'VoxelVentures',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      subscribers: '450K subscribers'
    }
  },
  {
    id: 'blockchain-cryptography',
    title: 'Zero Knowledge Proofs (ZKP) Explained for Web Developers',
    description: 'How do you verify a secret without ever revealing it? This tutorial walks through zk-SNARKs and zk-STARKs from absolute scratch using interactive animations and simple javascript code snippets.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    duration: '16:04',
    views: '88K views',
    uploadedAt: '12 hours ago',
    category: 'Technology',
    likes: '4.8K',
    channel: {
      name: 'CyberSec Labs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      subscribers: '120K subscribers'
    }
  },
  {
    id: 'lofi-beats-live',
    title: 'Late Night Lofi Radio 📚 Chill Lofi Hip Hop Beats to Study/Relax To',
    description: 'Welcome to the 24/7 lofi hip hop stream! Put on your headphones, open up your editor, grab a warm drink, and dive into the soothing aesthetic sounds curated by our global network of bedroom beat producers.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    duration: '4:15:00',
    views: '12.4M views',
    uploadedAt: 'Live',
    category: 'Music',
    likes: '480K',
    channel: {
      name: 'Sleepy Panda Music',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      subscribers: '2.4M subscribers'
    }
  },
  {
    id: 'cinema-composition-masterclass',
    title: 'The Director’s Frame: 10 Cinematic Framing Secrets of Roger Deakins',
    description: 'We dissect the cinematography of Roger Deakins, looking at how wide lenses, natural key lights, silhouette framing, and geometric grids construct unforgettable, emotionally rich storytelling frames.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetFor5G.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    duration: '28:14',
    views: '1.5M views',
    uploadedAt: '2 weeks ago',
    category: 'Entertainment',
    likes: '89K',
    channel: {
      name: 'CineAesthetic',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      subscribers: '720K subscribers'
    }
  }
];
