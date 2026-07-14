import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, ThumbsUp, Share2, Heart, Tv, UserPlus, Check, ExternalLink } from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { Video } from '../types';
import { mockVideos } from '../data/mockVideos';

interface WatchViewProps {
  videoId: string;
  onBack: () => void;
  onSelectVideo: (videoId: string) => void;
  videos?: Video[];
}

export default function WatchView({ videoId, onBack, onSelectVideo, videos = mockVideos }: WatchViewProps) {
  const video = videos.find((v) => v.id === videoId) || videos[0] || mockVideos[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to extract YouTube ID and build the embed URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0&rel=0`;
    }
    return null;
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(video.videoUrl);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/watch/${video.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }).catch(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    });
  };

  // Social & Interactivity state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: number; author: string; avatar: string; text: string; time: string }>>([
    {
      id: 1,
      author: 'Aria Sterling',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80',
      text: 'The cinematography in this piece is absolutely breathtaking! The color grading matches the near-black theme perfectly.',
      time: '3 hours ago',
    },
    {
      id: 2,
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80',
      text: 'Incredible pacing. Hans Zimmer analysis was spot on! Saved this for my sound design reference folder.',
      time: '1 day ago',
    },
  ]);

  // Recommended list (excluding current)
  const recommendedVideos = videos.filter((v) => v.id !== video.id);

  // Auto play video when video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay blocked or video changed', err);
        });
    }
  }, [videoId]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  // Handle Can Play callback to guarantee immediate playback when media is loaded
  const handleCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay attempted on canplay:', err);
        });
    }
  };

  // Handle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Handle Scrubber/Timeline change
  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Time update callback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Metadata loaded callback
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Fullscreen helper
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Format helper (seconds to h:mm:ss or mm:ss)
  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return '0:00';
    const hours = Math.floor(timeInSecs / 3600);
    const mins = Math.floor((timeInSecs % 3600) / 60);
    const secs = Math.floor(timeInSecs % 60);

    const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

    if (hours > 0) {
      const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
      return `${hours}:${minsStr}:${secsStr}`;
    }
    return `${mins}:${secsStr}`;
  };

  // Handle subscribe toggle
  const handleSubscribeToggle = () => {
    setIsSubscribed(!isSubscribed);
  };

  // Handle Like click
  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(video.likes);
    } else {
      setIsLiked(true);
      setLikeCount('Liked');
    }
  };

  // Handle Adding mock comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments([
      {
        id: Date.now(),
        author: 'You (Cinestreamer)',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=50&auto=format&fit=crop&q=80',
        text: commentText,
        time: 'Just now',
      },
      ...comments,
    ]);
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-[#100F08] text-[#F5F1E8] pb-16">
      {/* Top action: Back button bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-[#343020]/40">
        <button
          id="btn-watch-back"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D1B11] border border-[#343020] text-[#9D9889] hover:text-[#FFD400] hover:border-[#FFD400]/40 transition-all text-xs font-semibold cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </button>
        <div className="flex items-center gap-2 text-xs font-mono text-[#9D9889]">
          <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
          <span>CINEMA MODE</span>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 py-6 grid gap-6 ${isTheaterMode ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
        
        {/* Main Content: Video and details */}
        <div className={`${isTheaterMode ? 'lg:col-span-1' : 'lg:col-span-2'} flex flex-col gap-4`}>
          
          {/* Custom Video Player Container */}
          <div
            id="cinestream-custom-player"
            className={`relative rounded-xl overflow-hidden bg-[#15130A] border border-[#343020] shadow-2xl transition-all duration-300 group/player aspect-video`}
          >
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={video.title}
                className="w-full h-full object-contain bg-black border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  autoPlay
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onCanPlay={handleCanPlay}
                  onClick={togglePlay}
                  className="w-full h-full object-contain"
                />

                {/* Custom Control Overlay: Fades in on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#100F08]/90 via-[#100F08]/20 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  
                  {/* Timeline Progress Scrubber */}
                  <div className="w-full flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-[#F5F1E8] select-none">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      id="video-progress-scrubber"
                      type="range"
                      min="0"
                      max={duration || 100}
                      step="0.1"
                      value={currentTime}
                      onChange={handleScrubChange}
                      className="flex-1 h-1.5 rounded-lg bg-gray-600/60 appearance-none cursor-pointer accent-[#FFD400] focus:outline-none"
                    />
                    <span className="text-xs font-mono text-[#9D9889] select-none">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Action Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause */}
                      <button
                        id="player-toggle-play"
                        onClick={togglePlay}
                        className="p-1.5 rounded-full bg-[#FFD400] hover:scale-105 transition-transform text-[#100F08]"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-[#100F08]" />
                        ) : (
                          <Play className="w-5 h-5 fill-[#100F08] ml-0.5" />
                        )}
                      </button>

                      {/* Volume controls */}
                      <div className="flex items-center gap-2 group/volume">
                        <button
                          id="player-toggle-mute"
                          onClick={toggleMute}
                          className="text-[#F5F1E8] hover:text-[#FFD400] transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          id="player-volume-slider"
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-0 overflow-hidden group-hover/volume:w-16 h-1 rounded-lg bg-gray-600 appearance-none cursor-pointer accent-[#FFD400] transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-3">
                      {/* Theater Mode Toggle */}
                      <button
                        id="player-toggle-theater"
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className={`hidden sm:flex text-xs font-semibold px-2.5 py-1 rounded-md border transition-all ${
                          isTheaterMode
                            ? 'bg-[#FFD400]/10 text-[#FFD400] border-[#FFD400]'
                            : 'bg-[#1D1B11]/80 text-[#9D9889] border-[#343020] hover:text-[#FFD400]'
                        }`}
                      >
                        {isTheaterMode ? 'Wide Off' : 'Theater Mode'}
                      </button>

                      {/* Fullscreen */}
                      <button
                        id="player-toggle-fullscreen"
                        onClick={handleFullscreen}
                        className="text-[#F5F1E8] hover:text-[#FFD400] transition-colors p-1"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Video Metadata Panel */}
          <div className="bg-[#1D1B11] border border-[#343020] rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <span className="inline-block bg-[#FFD400]/10 text-[#FFD400] text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                  {video.category}
                </span>
                <h1 className="text-lg md:text-xl font-bold font-sans text-[#F5F1E8] leading-snug">
                  {video.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#9D9889] font-mono">
                  <span>{video.views}</span>
                  <span>•</span>
                  <span>{video.uploadedAt}</span>
                </div>
              </div>

              {/* Action Row: Like, Share */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-video-like"
                  onClick={handleLikeClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-semibold select-none cursor-pointer ${
                    isLiked
                      ? 'bg-[#FFD400] text-[#100F08] border-[#FFD400] font-bold shadow-lg shadow-[#FFD400]/10'
                      : 'bg-[#15130A] border-[#343020] text-[#F5F1E8] hover:border-[#FFD400]/30 hover:text-[#FFD400]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#100F08]' : ''}`} />
                  {likeCount}
                </button>

                <button
                  id="btn-video-share"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border bg-[#15130A] border-[#343020] text-[#9D9889] hover:text-[#F5F1E8] hover:border-[#FFD400]/20 transition-all text-xs font-semibold cursor-pointer select-none"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-video-redirect"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border bg-[#FFD400]/10 border-[#FFD400]/30 text-[#FFD400] hover:bg-[#FFD400] hover:text-[#100F08] hover:border-[#FFD400] transition-all text-xs font-bold cursor-pointer select-none"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Redirect to Source
                </a>
              </div>
            </div>

            {/* Channel Info Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-[#343020]/40">
              <div className="flex items-center gap-3">
                <img
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-[#343020]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#F5F1E8]">{video.channel.name}</h3>
                  <p className="text-xs text-[#9D9889]">{video.channel.subscribers}</p>
                </div>
              </div>

              {/* Subscribe Toggle Button */}
              <button
                id="btn-channel-subscribe"
                onClick={handleSubscribeToggle}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  isSubscribed
                    ? 'bg-[#15130A] border border-[#343020] text-[#9D9889] hover:text-[#F5F1E8] hover:border-red-500'
                    : 'bg-[#FFD400] text-[#100F08] hover:bg-[#FFD400]/95 shadow-md hover:shadow-lg hover:shadow-[#FFD400]/10'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>
            </div>

            {/* Collapsible Video Description */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9D9889] mb-1.5">Description</h4>
              <p className="text-xs text-[#9D9889] leading-relaxed bg-[#15130A]/60 p-3 rounded-lg border border-[#343020]/20">
                {video.description}
              </p>
            </div>
          </div>

          {/* Interactive Comments Section */}
          <div className="bg-[#1D1B11] border border-[#343020] rounded-xl p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F1E8] mb-4">
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
                alt="Your avatar"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-[#343020]"
              />
              <div className="flex-1 flex flex-col gap-2">
                <input
                  id="comment-input"
                  type="text"
                  placeholder="Share your thoughts on this stream..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[#100F08] border border-[#343020] rounded-lg px-3 py-2 text-xs placeholder-[#9D9889] text-[#F5F1E8] focus:outline-none focus:border-[#FFD400]"
                />
                <div className="flex justify-end">
                  <button
                    id="btn-comment-submit"
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                      commentText.trim()
                        ? 'bg-[#FFD400] text-[#100F08] cursor-pointer'
                        : 'bg-[#15130A] text-[#9D9889] cursor-not-allowed border border-[#343020]'
                    }`}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {comments.map((cmt) => (
                  <motion.div
                    key={cmt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 pb-3 border-b border-[#343020]/20 last:border-0"
                  >
                    <img
                      src={cmt.avatar}
                      alt={cmt.author}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#343020]"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-[#F5F1E8]">{cmt.author}</span>
                        <span className="text-[10px] text-[#9D9889] font-mono">{cmt.time}</span>
                      </div>
                      <p className="text-xs text-[#9D9889] leading-relaxed">
                        {cmt.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Recommended Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#343020]/40">
            <Sparkles className="w-4 h-4 text-[#FFD400]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">Recommended For You</h2>
          </div>

          <div className="flex flex-col gap-3">
            {recommendedVideos.map((v) => (
              <div
                key={v.id}
                id={`recommended-card-${v.id}`}
                onClick={() => onSelectVideo(v.id)}
                className="group flex gap-3 bg-[#1D1B11] border border-[#343020] rounded-lg p-2.5 cursor-pointer hover:border-[#FFD400]/40 hover:shadow-[0_0_15px_rgba(255,212,0,0.06)] transition-all duration-300"
              >
                {/* Compact Thumbnail */}
                <div className="relative w-32 aspect-video rounded-md overflow-hidden bg-[#100F08] flex-shrink-0">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-[#F5F1E8] font-mono text-[9px] px-1 rounded">
                    {v.duration}
                  </div>
                </div>

                {/* Compact Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#F5F1E8] line-clamp-2 leading-snug group-hover:text-[#FFD400] transition-colors mb-0.5">
                      {v.title}
                    </h4>
                    <p className="text-[#9D9889] text-[10px] truncate">{v.channel.name}</p>
                  </div>
                  <p className="text-[#9D9889] text-[9px] font-mono mt-1">{v.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating share confirmation toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#FFD400] text-[#100F08] font-semibold text-xs py-3 px-5 rounded-xl shadow-xl shadow-[#FFD400]/20 flex items-center gap-2 border border-[#FFD400]"
          >
            <Check className="w-4 h-4 text-[#100F08] stroke-[3]" />
            <span>Cinematic sharing link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
