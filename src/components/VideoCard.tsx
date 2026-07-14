import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Video } from '../types';


interface VideoCardProps {
  key?: string | number;
  video: Video;
  onWatch: (videoId: string) => void;
}

export default function VideoCard({ video, onWatch }: VideoCardProps) {
  return (
    <motion.div
      layout
      onClick={() => onWatch(video.id)}
      className="group flex flex-col bg-[#1D1B11] border border-[#343020] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#FFD400] hover:shadow-[0_0_20px_rgba(255,212,0,0.12)]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* 16:9 Thumbnail Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#100F08]">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Large Circular Yellow Play Button (Centered) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#FFD400] text-[#100F08] flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-[#FFD400]/40">
            <Play className="w-6 h-6 fill-[#100F08] text-[#100F08] ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/85 text-[#F5F1E8] font-mono text-[10px] tracking-wider font-semibold px-2 py-0.5 rounded-md border border-[#343020]/40">
          {video.duration}
        </div>

        {/* Live Indicator (Optional for Music Live stream) */}
        {video.uploadedAt === 'Live' && (
          <div className="absolute top-2 left-2 bg-rose-600 text-[#F5F1E8] font-semibold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Live
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-4 flex gap-3">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#343020] group-hover:border-[#FFD400]/50 transition-colors">
            <img
              src={video.channel.avatar}
              alt={video.channel.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text Metadata */}
        <div className="flex-1 min-w-0">
          {/* Title - limited to two lines */}
          <h3 className="font-sans font-medium text-sm text-[#F5F1E8] leading-snug line-clamp-2 group-hover:text-[#FFD400] transition-colors mb-1">
            {video.title}
          </h3>

          {/* Channel Name */}
          <p className="text-[#9D9889] text-xs hover:text-[#F5F1E8] transition-colors truncate mb-0.5">
            {video.channel.name}
          </p>

          {/* Views & Date */}
          <div className="flex items-center gap-1.5 text-[#9D9889] text-[11px] truncate">
            <span>{video.views}</span>
            <span className="text-[#343020]">•</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
