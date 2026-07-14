import React from 'react';
import { Compass, PlaySquare, FolderHeart, Flame, Music, Gamepad2, GraduationCap, Popcorn, Clock, Sparkles, Heart, Bell, CheckCircle, ListVideo, History, Plus } from 'lucide-react';

import { motion } from 'motion/react';
import { Video } from '../types';
import { mockVideos } from '../data/mockVideos';
import VideoCard from './VideoCard';

interface SpecialTabsProps {
  onWatch: (videoId: string) => void;
}

// ----------------------------------------------------
// 1. EXPLORE VIEW
// ----------------------------------------------------
export function ExploreView({ onWatch }: SpecialTabsProps) {
  const exploreCategories = [
    { name: 'Trending', icon: Flame, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'Music Hub', icon: Music, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Gaming Zone', icon: Gamepad2, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Academy', icon: GraduationCap, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Theater', icon: Popcorn, color: 'text-rose-500 bg-rose-500/10' },
  ];

  // Highlight some premium videos in Explore
  const featuredVideo = mockVideos[0]; // Neon Horizon
  const trendingVideos = mockVideos.slice(1, 5);

  return (
    <div className="px-4 md:px-6 pb-24 md:pb-8 flex flex-col gap-8">
      {/* Dynamic Header */}
      <div className="flex items-center gap-3 py-2 border-b border-[#343020]/40">
        <Compass className="w-5 h-5 text-[#FFD400]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F1E8]">Explore Cinematic Universe</h2>
      </div>

      {/* Grid of Interactive Explore Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {exploreCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.03, borderColor: '#FFD400' }}
              className="flex items-center gap-3 bg-[#1D1B11] border border-[#343020] rounded-xl p-3.5 cursor-pointer transition-all duration-300"
            >
              <div className={`p-2 rounded-lg ${cat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#F5F1E8] tracking-wide">{cat.name}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Big Hero Featured Spot */}
      <div className="relative rounded-2xl overflow-hidden bg-[#1D1B11] border border-[#343020] p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-center shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD400]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => onWatch(featuredVideo.id)}>
          <img src={featuredVideo.thumbnailUrl} alt={featuredVideo.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#FFD400] text-[#100F08] flex items-center justify-center shadow-lg shadow-[#FFD400]/30 transform group-hover:scale-110 transition-transform duration-300">
              <Popcorn className="w-6 h-6 fill-[#100F08]" />
            </div>
          </div>
          <span className="absolute bottom-3 right-3 bg-black/80 font-mono text-xs px-2 py-0.5 rounded text-[#F5F1E8]">{featuredVideo.duration}</span>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFD400] text-[#100F08] font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">FEATURED STREAM</span>
            <span className="text-xs font-mono text-[#9D9889]">{featuredVideo.views}</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-black text-[#F5F1E8] hover:text-[#FFD400] cursor-pointer transition-colors leading-tight" onClick={() => onWatch(featuredVideo.id)}>
            {featuredVideo.title}
          </h3>
          <p className="text-xs text-[#9D9889] leading-relaxed line-clamp-3">
            {featuredVideo.description}
          </p>
          <div className="flex items-center gap-3">
            <img src={featuredVideo.channel.avatar} alt="channel avatar" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-[#343020]" />
            <span className="text-xs font-semibold text-[#F5F1E8]">{featuredVideo.channel.name}</span>
          </div>
        </div>
      </div>

      {/* Trending Feed */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-[#9D9889] mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          Top Trending Setlists
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {trendingVideos.map((video) => (
            <VideoCard key={video.id} video={video} onWatch={onWatch} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. SUBSCRIPTIONS VIEW
// ----------------------------------------------------
export function SubscriptionsView({ onWatch }: SpecialTabsProps) {
  // Mock list of creators subscribed to
  const channels = [
    { name: 'RetroPulse Beats', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', active: true },
    { name: 'QuantumTheory', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
    { name: 'CosmosAcademy', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', active: false },
    { name: 'RenderForge', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', active: true },
    { name: 'ScoreBreakdown', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', active: false },
  ];

  // Show videos from subscribed channels
  const subscriptionVideos = mockVideos.slice(0, 6);

  return (
    <div className="px-4 md:px-6 pb-24 md:pb-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3 py-2 border-b border-[#343020]/40">
        <PlaySquare className="w-5 h-5 text-[#FFD400]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F1E8]">My Subscriptions</h2>
      </div>

      {/* Horizontal Creator Ribbon */}
      <div className="flex items-center gap-5 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        {channels.map((chan) => (
          <div key={chan.name} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FFD400]/40 group-hover:border-[#FFD400] transition-colors p-0.5 bg-[#100F08]">
                <img src={chan.avatar} alt={chan.name} referrerPolicy="no-referrer" className="w-full h-full rounded-full object-cover" />
              </div>
              {chan.active && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#FFD400] rounded-full border-2 border-[#100F08]" />
              )}
            </div>
            <span className="text-[10px] text-[#9D9889] group-hover:text-[#F5F1E8] font-medium max-w-[80px] text-center truncate transition-colors">
              {chan.name}
            </span>
          </div>
        ))}
        {/* Manage Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-[#1D1B11] border border-dashed border-[#343020] flex items-center justify-center text-[#9D9889] hover:text-[#FFD400] hover:border-[#FFD400] transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-[#9D9889] font-medium">Manage</span>
        </div>
      </div>

      {/* Grid Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#9D9889] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FFD400]" />
            Latest Uploads
          </h3>
          <button className="text-[10px] font-bold text-[#FFD400] hover:underline cursor-pointer">Mark all read</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {subscriptionVideos.map((video) => (
            <VideoCard key={video.id} video={video} onWatch={onWatch} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. LIBRARY VIEW
// ----------------------------------------------------
export function LibraryView({ onWatch }: SpecialTabsProps) {
  const historyVideos = mockVideos.slice(3, 7);
  const watchLaterVideos = mockVideos.slice(8, 11);

  return (
    <div className="px-4 md:px-6 pb-24 md:pb-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3 py-2 border-b border-[#343020]/40">
        <FolderHeart className="w-5 h-5 text-[#FFD400]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F1E8]">Personal Library</h2>
      </div>

      {/* Library Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1D1B11] border border-[#343020] rounded-xl p-5 flex items-center justify-between shadow-sm hover:border-[#FFD400]/20 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#FFD400]/10 text-[#FFD400] rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs text-[#9D9889] font-bold uppercase tracking-wide">Watch History</h4>
              <p className="text-sm font-extrabold text-[#F5F1E8]">42 streams</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1D1B11] border border-[#343020] rounded-xl p-5 flex items-center justify-between shadow-sm hover:border-[#FFD400]/20 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs text-[#9D9889] font-bold uppercase tracking-wide">Watch Later</h4>
              <p className="text-sm font-extrabold text-[#F5F1E8]">7 streams saved</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1D1B11] border border-[#343020] rounded-xl p-5 flex items-center justify-between shadow-sm hover:border-[#FFD400]/20 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs text-[#9D9889] font-bold uppercase tracking-wide">Liked Streams</h4>
              <p className="text-sm font-extrabold text-[#F5F1E8]">128 liked</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Carousel/Row */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-[#9D9889] mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FFD400]" />
          Recent History
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {historyVideos.map((video) => (
            <VideoCard key={video.id} video={video} onWatch={onWatch} />
          ))}
        </div>
      </div>

      {/* Watch Later */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-[#9D9889] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Watch Later Playlist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {watchLaterVideos.map((video) => (
            <VideoCard key={video.id} video={video} onWatch={onWatch} />
          ))}
        </div>
      </div>
    </div>
  );
}
