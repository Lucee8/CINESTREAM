import React from 'react';
import { motion } from 'motion/react';
import VideoCard from './VideoCard';

import { Video } from '../types';
import { Film } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  onWatch: (videoId: string) => void;
}

export default function VideoGrid({ videos, onWatch }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1D1B11] border border-[#343020] flex items-center justify-center text-[#FFD400] mb-4 shadow-inner">
          <Film className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#F5F1E8] mb-1">
          No Cinematic Matches Found
        </h3>
        <p className="text-[#9D9889] text-xs max-w-xs mx-auto">
          We couldn&apos;t find any videos matching your search criteria. Try using different keywords or clearing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 pb-24 md:pb-8">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onWatch={onWatch} />
        ))}
      </motion.div>
    </div>
  );
}
