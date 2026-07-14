import React, { useState, useEffect, FormEvent } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  ShieldAlert, Plus, Edit2, Trash2, LogIn, LogOut, LayoutDashboard, 
  FileVideo, BarChart2, Check, AlertCircle, X, ExternalLink, HelpCircle, User, Chrome
} from 'lucide-react';
import { Video } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut 
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { addVideoToDb, updateVideoInDb, deleteVideoFromDb } from '../lib/videoService';

interface AdminPanelProps {
  videos: Video[];
  onRefreshVideos: () => Promise<void>;
}

type AdminTab = 'analytics' | 'videos';

export default function AdminPanel({ videos, onRefreshVideos }: AdminPanelProps) {
  // Auth state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [videoSearch, setVideoSearch] = useState('');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('All');

  // Video Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formDuration, setFormDuration] = useState('10:00');
  const [formCategory, setFormCategory] = useState('Sci-Fi');
  const [formViews, setFormViews] = useState('0');
  const [formLikes, setFormLikes] = useState('0');
  const [formChannelName, setFormChannelName] = useState('CineStream Originals');
  const [formChannelAvatar, setFormChannelAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop');
  const [formChannelSubscribers, setFormChannelSubscribers] = useState('1.2M');

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Quick Demo Auto-Fill credentials
  const fillDemoCredentials = () => {
    setEmail('admin@cinestream.com');
    setPassword('password123');
    setAuthError(null);
  };

  // Auth Handlers
  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }

    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, email, password);
        setAuthSuccess('Account created successfully!');
        setIsRegisterMode(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setAuthSuccess('Logged in successfully!');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        // Since this is a demo environment, let's auto-register if user doesn't exist
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setAuthSuccess('Admin account created and logged in automatically!');
        } catch (regErr: any) {
          setAuthError(regErr.message || 'Authentication failed.');
        }
      } else {
        setAuthError(err.message || 'Authentication failed. Please check credentials.');
      }
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthSuccess('Logged in with Google successfully!');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Google Auth failed.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthSuccess('Signed out successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  // Open Modal for Add
  const openAddModal = () => {
    setEditingVideo(null);
    setFormTitle('');
    setFormDescription('');
    setFormVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-star-temple-by-night-42400-large.mp4');
    setFormThumbnailUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop');
    setFormDuration('12:45');
    setFormCategory('Sci-Fi');
    setFormViews('12.5K');
    setFormLikes('4.2K');
    setFormChannelName('CineStream Studio');
    setFormChannelAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop');
    setFormChannelSubscribers('450K');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (video: Video) => {
    setEditingVideo(video);
    setFormTitle(video.title);
    setFormDescription(video.description);
    setFormVideoUrl(video.videoUrl);
    setFormThumbnailUrl(video.thumbnailUrl);
    setFormDuration(video.duration);
    setFormCategory(video.category);
    setFormViews(video.views);
    setFormLikes(video.likes);
    setFormChannelName(video.channel?.name || 'CineStream Studio');
    setFormChannelAvatar(video.channel?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop');
    setFormChannelSubscribers(video.channel?.subscribers || '250K');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Submit Video form
  const handleSaveVideo = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle || !formDescription || !formVideoUrl || !formThumbnailUrl) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setFormSubmitting(true);
    const videoData: Video = {
      id: editingVideo ? editingVideo.id : Math.random().toString(36).substring(2, 11),
      title: formTitle,
      description: formDescription,
      videoUrl: formVideoUrl,
      thumbnailUrl: formThumbnailUrl,
      duration: formDuration,
      views: formViews,
      likes: formLikes,
      uploadedAt: editingVideo ? editingVideo.uploadedAt : 'Just Now',
      category: formCategory,
      channel: {
        name: formChannelName,
        avatar: formChannelAvatar,
        subscribers: formChannelSubscribers
      }
    };

    try {
      if (editingVideo) {
        await updateVideoInDb(editingVideo.id, videoData);
      } else {
        await addVideoToDb(videoData);
      }
      await onRefreshVideos();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save video to Firestore.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this cinematic video?')) {
      return;
    }

    try {
      await deleteVideoFromDb(videoId);
      await onRefreshVideos();
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete video: ' + err.message);
    }
  };

  // Calculate stats for Analytics Dashboard
  const parseMetric = (valStr: string): number => {
    if (!valStr) return 0;
    const cleanStr = valStr.toUpperCase().replace(/[^0-9.KMB]/g, '');
    let factor = 1;
    if (cleanStr.endsWith('K')) factor = 1000;
    else if (cleanStr.endsWith('M')) factor = 1000000;
    else if (cleanStr.endsWith('B')) factor = 1000000000;

    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num * factor;
  };

  const formatMetric = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const totalVideos = videos.length;
  const totalViewsNum = videos.reduce((sum, v) => sum + parseMetric(v.views), 0);
  const totalLikesNum = videos.reduce((sum, v) => sum + parseMetric(v.likes), 0);
  const avgViewsPerVideo = totalVideos > 0 ? Math.round(totalViewsNum / totalVideos) : 0;

  // Category chart data
  const categoryCountMap: Record<string, number> = {};
  const categoryViewsMap: Record<string, number> = {};
  videos.forEach(v => {
    categoryCountMap[v.category] = (categoryCountMap[v.category] || 0) + 1;
    categoryViewsMap[v.category] = (categoryViewsMap[v.category] || 0) + parseMetric(v.views);
  });

  const categoryChartData = Object.keys(categoryCountMap).map(cat => ({
    name: cat,
    videos: categoryCountMap[cat],
    views: Math.round(categoryViewsMap[cat] / 1000) // in Thousands
  }));

  const videoViewsPerformanceData = videos
    .map(v => ({
      title: v.title.length > 20 ? v.title.substring(0, 18) + '...' : v.title,
      views: parseMetric(v.views),
      likes: parseMetric(v.likes)
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // COLORS for charts
  const COLORS = ['#FFD400', '#F5F1E8', '#9D9889', '#343020', '#8A2BE2', '#FF4500', '#00FA9A'];

  // Filtered videos for manager list
  const filteredVideos = videos.filter(video => {
    const matchSearch = video.title.toLowerCase().includes(videoSearch.toLowerCase()) || 
                        video.description.toLowerCase().includes(videoSearch.toLowerCase()) ||
                        (video.channel?.name || '').toLowerCase().includes(videoSearch.toLowerCase());
    const matchCategory = videoCategoryFilter === 'All' || video.category === videoCategoryFilter;
    return matchSearch && matchCategory;
  });

  const uniqueCategories = ['All', ...Array.from(new Set(videos.map(v => v.category)))];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#100F08] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-[#FFD400] animate-spin"></div>
          <span className="text-[#9D9889] text-sm font-medium tracking-widest animate-pulse uppercase">Securing Cinematic Gateway...</span>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN VIEW IF NOT AUTHENTICATED ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#100F08] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#15130A] border border-[#343020] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD400] to-transparent"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-[#FFD400]/10 border border-[#FFD400]/30 rounded-full flex items-center justify-center mb-4 text-[#FFD400]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#F5F1E8] tracking-tight">Admin Terminal</h1>
            <p className="text-[#9D9889] text-xs text-center mt-1">
              Access the master dashboard of CineStream. Please verify your credentials.
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#9D9889] uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cinestream.com"
                className="w-full px-4 py-3 bg-[#100F08] border border-[#343020] rounded-xl text-[#F5F1E8] text-sm focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#9D9889] uppercase tracking-wider mb-2">
                Secret Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#100F08] border border-[#343020] rounded-xl text-[#F5F1E8] text-sm focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>

            <AnimatePresence mode="wait">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2 text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </motion.div>
              )}
              {authSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2 text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl text-xs"
                >
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-3 bg-[#FFD400] hover:bg-[#FFE353] text-[#100F08] font-bold rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[#FFD400]/10 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegisterMode ? 'Initialize Master Credentials' : 'Access Master Dashboard'}</span>
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#343020]"></div>
            </div>
            <span className="relative px-3 bg-[#15130A] text-xs uppercase text-[#9D9889] tracking-widest font-semibold">
              Or Authenticate With
            </span>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full py-3 border border-[#343020] bg-[#100F08] hover:bg-[#15130A] text-[#F5F1E8] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-[#FFD400]/30"
          >
            <Chrome className="w-4 h-4 text-red-400" />
            <span>Google Authentication</span>
          </button>

          <div className="mt-8 pt-6 border-t border-[#343020] flex flex-col gap-4 text-center">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-[#9D9889] hover:text-[#FFD400] underline cursor-pointer transition-colors"
            >
              {isRegisterMode ? 'Already have an Admin key? Sign In' : 'Create a brand new Admin key (Register)'}
            </button>

            <div className="bg-[#100F08] p-4 rounded-xl border border-[#343020] text-left">
              <div className="flex items-center gap-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Sandbox Demo Admin Details</span>
              </div>
              <p className="text-[#9D9889] text-[11px] leading-relaxed mb-3">
                For instant access, use our pre-configured administrator credentials below:
              </p>
              <button
                onClick={fillDemoCredentials}
                className="w-full py-2 bg-[#FFD400]/5 hover:bg-[#FFD400]/10 border border-[#FFD400]/20 hover:border-[#FFD400]/40 text-[#FFD400] rounded-lg text-xs font-bold transition-all"
              >
                Auto-Fill Demo Admin Credentials
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDER MASTER DASHBOARD VIEW IF AUTHENTICATED ---
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 text-[#F5F1E8]">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#15130A] p-6 border border-[#343020] rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FFD400]/10 border border-[#FFD400]/30 rounded-xl flex items-center justify-center text-[#FFD400]">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-[#FFD400] tracking-widest px-2 py-0.5 rounded bg-[#FFD400]/10 border border-[#FFD400]/20">
                MASTER SECURE MODE
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#F5F1E8] tracking-tight mt-1">CineStream Admin Control</h1>
            <p className="text-xs text-[#9D9889] flex items-center gap-2 mt-0.5">
              <User className="w-3 h-3 text-[#FFD400]" />
              <span>Signed in as: <strong className="text-[#F5F1E8] font-medium">{user.email || 'Authenticated User'}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#FFD400] hover:bg-[#FFE353] text-[#100F08] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#FFD400]/10"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Upload New Cinematic</span>
          </button>
          
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-[#343020] hover:border-red-900 bg-[#100F08] hover:bg-red-950/15 text-[#9D9889] hover:text-red-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 p-1 bg-[#15130A] border border-[#343020] rounded-xl max-w-xs mb-8">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'analytics' 
              ? 'bg-[#FFD400] text-[#100F08]' 
              : 'text-[#9D9889] hover:text-[#F5F1E8] hover:bg-[#100F08]'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'videos' 
              ? 'bg-[#FFD400] text-[#100F08]' 
              : 'text-[#9D9889] hover:text-[#F5F1E8] hover:bg-[#100F08]'
          }`}
        >
          <FileVideo className="w-4 h-4" />
          <span>Video Manager</span>
        </button>
      </div>

      {/* TABS VIEWS */}
      <AnimatePresence mode="wait">
        {activeTab === 'analytics' ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#15130A] border border-[#343020] rounded-xl p-5 shadow-md">
                <span className="text-[10px] font-bold text-[#9D9889] uppercase tracking-widest">Total Cinematics</span>
                <p className="text-2xl font-bold text-[#FFD400] mt-1">{totalVideos}</p>
                <div className="text-[10px] text-[#9D9889] mt-2">Active database entries</div>
              </div>

              <div className="bg-[#15130A] border border-[#343020] rounded-xl p-5 shadow-md">
                <span className="text-[10px] font-bold text-[#9D9889] uppercase tracking-widest">Master Views</span>
                <p className="text-2xl font-bold text-[#F5F1E8] mt-1">{formatMetric(totalViewsNum)}</p>
                <div className="text-[10px] text-emerald-400 mt-2">▲ 14.2% this week</div>
              </div>

              <div className="bg-[#15130A] border border-[#343020] rounded-xl p-5 shadow-md">
                <span className="text-[10px] font-bold text-[#9D9889] uppercase tracking-widest">Cinematic Endorsements</span>
                <p className="text-2xl font-bold text-[#F5F1E8] mt-1">{formatMetric(totalLikesNum)}</p>
                <div className="text-[10px] text-emerald-400 mt-2">▲ 8.7% ratio</div>
              </div>

              <div className="bg-[#15130A] border border-[#343020] rounded-xl p-5 shadow-md">
                <span className="text-[10px] font-bold text-[#9D9889] uppercase tracking-widest">Average Engagement</span>
                <p className="text-2xl font-bold text-[#F5F1E8] mt-1">{formatMetric(avgViewsPerVideo)}</p>
                <div className="text-[10px] text-[#9D9889] mt-2">Views per title average</div>
              </div>
            </div>

            {/* Recharts Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#15130A] border border-[#343020] rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-bold text-[#F5F1E8] mb-6 uppercase tracking-wider">Video Category Distribution</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252318" />
                      <XAxis dataKey="name" stroke="#9D9889" fontSize={11} />
                      <YAxis stroke="#9D9889" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#15130A', borderColor: '#343020', borderRadius: '8px' }}
                        labelStyle={{ color: '#F5F1E8', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="videos" name="Total Videos" fill="#FFD400" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#15130A] border border-[#343020] rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-bold text-[#F5F1E8] mb-6 uppercase tracking-wider">Top Performing Cinematics (Views)</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={videoViewsPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252318" />
                      <XAxis dataKey="title" stroke="#9D9889" fontSize={10} angle={-15} textAnchor="end" height={50} />
                      <YAxis stroke="#9D9889" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#15130A', borderColor: '#343020', borderRadius: '8px' }}
                        labelStyle={{ color: '#F5F1E8', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="views" name="Views" stroke="#FFD400" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="likes" name="Likes" stroke="#F5F1E8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Filters and search line */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#15130A] p-4 border border-[#343020] rounded-xl shadow-md">
              <input
                type="text"
                placeholder="Search cinematics by title or channel..."
                value={videoSearch}
                onChange={e => setVideoSearch(e.target.value)}
                className="w-full md:max-w-md px-4 py-2.5 bg-[#100F08] border border-[#343020] rounded-xl text-[#F5F1E8] text-xs focus:outline-none focus:border-[#FFD400] transition-colors"
              />

              <div className="flex items-center gap-3 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-semibold text-[#9D9889] uppercase tracking-wider shrink-0">Filter:</span>
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setVideoCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      videoCategoryFilter === cat 
                        ? 'bg-[#FFD400] text-[#100F08]' 
                        : 'bg-[#100F08] border border-[#343020] text-[#9D9889] hover:text-[#F5F1E8] hover:border-[#FFD400]/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Videos List Table / Cards */}
            <div className="bg-[#15130A] border border-[#343020] rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-[#343020] flex items-center justify-between bg-[#1C1A0F]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFD400]">Database Records ({filteredVideos.length})</h3>
                <span className="text-[11px] text-[#9D9889]">Live synchronization connected</span>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="py-20 text-center text-[#9D9889] text-sm">
                  No cinematic videos found matching search filters.
                </div>
              ) : (
                <div className="divide-y divide-[#343020] max-h-[600px] overflow-y-auto">
                  {filteredVideos.map((v) => (
                    <div key={v.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#1C1A0F]/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-14 shrink-0 rounded-lg overflow-hidden border border-[#343020] bg-black">
                          <img 
                            src={v.thumbnailUrl} 
                            alt={v.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-bold text-[#F5F1E8]">
                            {v.duration}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase bg-[#FFD400]/10 border border-[#FFD400]/20 text-[#FFD400] px-1.5 py-0.5 rounded">
                              {v.category}
                            </span>
                            <span className="text-[10px] text-[#9D9889]">
                              {v.uploadedAt}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#F5F1E8] mt-1 hover:text-[#FFD400] transition-colors flex items-center gap-1.5">
                            <a href={`/watch/${v.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                              <span>{v.title}</span>
                              <ExternalLink className="w-3 h-3 text-[#9D9889] shrink-0" />
                            </a>
                          </h4>
                          <p className="text-[11px] text-[#9D9889] mt-0.5 max-w-xl line-clamp-1">
                            {v.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#9D9889]">
                            <span>Views: <strong className="text-[#F5F1E8] font-medium">{v.views}</strong></span>
                            <span>Likes: <strong className="text-[#F5F1E8] font-medium">{v.likes}</strong></span>
                            <span>Channel: <strong className="text-[#F5F1E8] font-medium">{v.channel?.name}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-2 border border-[#343020] bg-[#100F08] hover:bg-[#FFD400]/10 hover:border-[#FFD400]/30 text-[#9D9889] hover:text-[#FFD400] rounded-lg transition-all cursor-pointer"
                          title="Edit Cinematic Video"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(v.id)}
                          className="p-2 border border-[#343020] bg-[#100F08] hover:bg-red-950/20 hover:border-red-900/40 text-[#9D9889] hover:text-red-400 rounded-lg transition-all cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#15130A] border border-[#343020] rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg border border-[#343020] hover:border-[#FFD400]/30 text-[#9D9889] hover:text-[#F5F1E8] transition-all cursor-pointer bg-[#100F08]"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-base font-bold text-[#FFD400] uppercase tracking-widest mb-6">
                {editingVideo ? 'Modify Cinematic Masterpiece' : 'Publish New Cinematic Vision'}
              </h2>

              <form onSubmit={handleSaveVideo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#9D9889] uppercase tracking-wider mb-1.5">
                        Video Title <span className="text-[#FFD400]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Inception of Infinity"
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#9D9889] uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none focus:border-[#FFD400]"
                      >
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Action">Action</option>
                        <option value="Drama">Drama</option>
                        <option value="Documentary">Documentary</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Cyberpunk">Cyberpunk</option>
                        <option value="Anime">Anime</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#9D9889] uppercase tracking-wider mb-1.5">
                        Video Stream URL (MP4) <span className="text-[#FFD400]">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://example.com/stream.mp4"
                        value={formVideoUrl}
                        onChange={e => setFormVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#9D9889] uppercase tracking-wider mb-1.5">
                        Thumbnail URL <span className="text-[#FFD400]">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://unsplash.com/photos/..."
                        value={formThumbnailUrl}
                        onChange={e => setFormThumbnailUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-[#9D9889] uppercase tracking-wider mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          required
                          value={formDuration}
                          onChange={e => setFormDuration(e.target.value)}
                          className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#9D9889] uppercase tracking-wider mb-1">
                          Views Count
                        </label>
                        <input
                          type="text"
                          required
                          value={formViews}
                          onChange={e => setFormViews(e.target.value)}
                          className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-[#9D9889] uppercase tracking-wider mb-1">
                          Likes Count
                        </label>
                        <input
                          type="text"
                          required
                          value={formLikes}
                          onChange={e => setFormLikes(e.target.value)}
                          className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#9D9889] uppercase tracking-wider mb-1.5">
                        Description <span className="text-[#FFD400]">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Type cinematic lore or plot details here..."
                        value={formDescription}
                        onChange={e => setFormDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[#100F08] border border-[#343020] rounded-lg text-[#F5F1E8] text-xs focus:outline-none focus:border-[#FFD400] resize-none"
                      />
                    </div>

                    <div className="p-4 bg-[#100F08] border border-[#343020] rounded-xl space-y-3">
                      <span className="text-[10px] font-bold text-[#FFD400] uppercase tracking-widest block">Channel Information</span>
                      
                      <div>
                        <label className="block text-[9px] font-bold text-[#9D9889] uppercase tracking-wider mb-1">
                          Channel Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formChannelName}
                          onChange={e => setFormChannelName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#15130A] border border-[#343020] rounded-md text-[#F5F1E8] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-[#9D9889] uppercase tracking-wider mb-1">
                          Channel Subscribers
                        </label>
                        <input
                          type="text"
                          required
                          value={formChannelSubscribers}
                          onChange={e => setFormChannelSubscribers(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#15130A] border border-[#343020] rounded-md text-[#F5F1E8] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-[#9D9889] uppercase tracking-wider mb-1">
                          Channel Avatar URL
                        </label>
                        <input
                          type="url"
                          required
                          value={formChannelAvatar}
                          onChange={e => setFormChannelAvatar(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#15130A] border border-[#343020] rounded-md text-[#F5F1E8] text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#343020] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#343020] text-[#9D9889] hover:text-[#F5F1E8] rounded-xl text-xs font-bold hover:bg-[#100F08] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2 bg-[#FFD400] hover:bg-[#FFE353] disabled:opacity-50 text-[#100F08] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#FFD400]/10"
                  >
                    {formSubmitting && <div className="w-3.5 h-3.5 border-2 border-[#100F08] border-t-transparent rounded-full animate-spin"></div>}
                    <span>{editingVideo ? 'Update Records' : 'Publish Cinematic'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
