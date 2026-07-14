import { useState, useEffect } from 'react';
import { Home, Compass, PlaySquare, FolderHeart, Laptop, Film, Settings, AlertCircle, HelpCircle, Flame, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import VideoGrid from './components/VideoGrid';
import MobileBottomNavigation, { TabId } from './components/MobileBottomNavigation';
import WatchView from './components/WatchView';
import { ExploreView, SubscriptionsView, LibraryView } from './components/SpecialTabs';
import AdminPanel from './components/AdminPanel';
import { mockVideos } from './data/mockVideos';
import { Video } from './types';
import { getVideosFromDb } from './lib/videoService';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<TabId>('Home');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Dynamic videos list stored in Firestore database
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  // Sync state with URL parameters/paths on mount and when user navigates
  useEffect(() => {
    const handleUrlSync = () => {
      const pathname = window.location.pathname;
      const watchMatch = pathname.match(/^\/watch\/([^\/]+)/);

      if (watchMatch && watchMatch[1]) {
        setCurrentVideoId(watchMatch[1]);
      } else {
        const params = new URLSearchParams(window.location.search);
        const videoParam = params.get('v');
        const tabParam = params.get('tab');

        if (videoParam) {
          setCurrentVideoId(videoParam);
        } else {
          setCurrentVideoId(null);
        }

        if (tabParam) {
          setActiveTab(tabParam as TabId);
        } else {
          setActiveTab('Home');
        }
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, []);

  // Fetch videos from Firestore on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const dbVideos = await getVideosFromDb();
        setVideos(dbVideos);
      } catch (err) {
        console.error('Failed to load videos from Firestore, falling back to mocks:', err);
      }
    };
    loadVideos();
  }, []);

  const handleRefreshVideos = async () => {
    try {
      const dbVideos = await getVideosFromDb();
      setVideos(dbVideos);
    } catch (err) {
      console.error('Failed to refresh videos:', err);
    }
  };


  // Handler: Watching a video (changes route state and URL path)
  const handleWatchVideo = (id: string) => {
    setCurrentVideoId(id);
    window.history.pushState({}, '', `/watch/${id}`);
    // Scroll to top when watching a new video
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Return to browse grid
  const handleBackToBrowse = () => {
    setCurrentVideoId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('v');
    const tabParam = activeTab || 'Home';
    params.set('tab', tabParam);
    window.history.pushState({}, '', `/?${params.toString()}`);
  };

  // Handler: Changing bottom nav tabs
  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    setCurrentVideoId(null); // Clear active video to return to tab list
    const params = new URLSearchParams(window.location.search);
    params.delete('v');
    params.set('tab', tab);
    window.history.pushState({}, '', `/?${params.toString()}`);
    // Reset categories when leaving Home
    if (tab !== 'Home') {
      setActiveCategory('All');
    }
  };

  // Handler: Category selection
  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    // If watching a video, exit to show category results
    if (currentVideoId) {
      handleBackToBrowse();
    }
    // Set active tab to Home to show category results
    if (activeTab !== 'Home') {
      setActiveTab('Home');
    }
  };

  // Handler: Custom Search Query update
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // If searching while on another tab or watching, redirect to Home browse feed
    if (activeTab !== 'Home' || currentVideoId) {
      setActiveTab('Home');
      setCurrentVideoId(null);
      const params = new URLSearchParams();
      params.set('tab', 'Home');
      window.history.pushState({}, '', `/?${params.toString()}`);
    }
  };

  // Filter videos based on category and search query
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.channel?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sidebar Links Configuration
  const sidebarLinks = [
    { id: 'Home' as TabId, label: 'Home', icon: Home },
    { id: 'Explore' as TabId, label: 'Explore', icon: Compass },
    { id: 'Subscriptions' as TabId, label: 'Subscriptions', icon: PlaySquare },
    { id: 'Library' as TabId, label: 'Library', icon: FolderHeart },
    { id: 'Admin' as TabId, label: 'Admin Control', icon: ShieldAlert },
  ];

  // Mock subscriptions list for sidebar decoration
  const sidebarSubscriptions = [
    { name: 'RetroPulse Beats', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', unread: true },
    { name: 'QuantumTheory', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', unread: false },
    { name: 'SpeedRun Central', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', unread: true },
    { name: 'DesignCraft Studio', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#100F08] text-[#F5F1E8] font-sans flex flex-col selection:bg-[#FFD400]/30 selection:text-[#FFD400]">
      {/* Header component */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onMenuToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onHomeClick={() => handleSelectTab('Home')}
      />

      {/* Main Body Area */}
      <div className="flex flex-1 relative">
        
        {/* Desktop Sidebar (Hides on mobile) */}
        <aside
          id="desktop-sidebar"
          className={`hidden md:flex flex-col bg-[#15130A] border-r border-[#343020] transition-all duration-300 select-none ${
            isSidebarExpanded ? 'w-64' : 'w-18'
          } shrink-0`}
        >
          {/* Main Links */}
          <div className="p-3 flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id && !currentVideoId;

              return (
                <button
                  key={link.id}
                  id={`sidebar-link-${link.id.toLowerCase()}`}
                  onClick={() => handleSelectTab(link.id)}
                  className={`
                    flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left
                    ${
                      isActive
                        ? 'bg-[#FFD400] text-[#100F08] font-bold shadow-md shadow-[#FFD400]/5'
                        : 'text-[#9D9889] hover:text-[#F5F1E8] hover:bg-[#1D1B11]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#100F08]' : ''}`} />
                  {isSidebarExpanded && (
                    <span className="text-xs font-semibold tracking-wide">
                      {link.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subscriptions section inside sidebar (only when sidebar is expanded) */}
          {isSidebarExpanded && (
            <div className="mt-6 px-4 py-2 border-t border-[#343020]/40 flex-1">
              <h4 className="text-[10px] font-black tracking-wider text-[#9D9889] uppercase mb-3 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FFD400]" />
                Subscriptions
              </h4>
              <div className="flex flex-col gap-1">
                {sidebarSubscriptions.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1D1B11] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.avatar}
                        alt={sub.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-[#343020]"
                      />
                      <span className="text-xs text-[#9D9889] group-hover:text-[#F5F1E8] truncate max-w-[130px] transition-colors">
                        {sub.name}
                      </span>
                    </div>
                    {sub.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer inside sidebar */}
          {isSidebarExpanded && (
            <div className="p-4 border-t border-[#343020]/40 text-[10px] text-[#9D9889] leading-relaxed">
              <p>© 2026 CINESTREAM Corp.</p>
              <p className="mt-1 font-mono text-[9px] hover:text-[#FFD400] cursor-pointer">CINEMATIC PRESETS ACTIVE</p>
            </div>
          )}
        </aside>

        {/* Scrollable Feed and Content Area */}
        <main className="flex-1 min-w-0 bg-[#100F08]">
          <AnimatePresence mode="wait">
            {currentVideoId ? (
              // 1. WATCH VIEW
              <motion.div
                key="watch-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <WatchView
                  videoId={currentVideoId}
                  onBack={handleBackToBrowse}
                  onSelectVideo={handleWatchVideo}
                  videos={videos}
                />
              </motion.div>
            ) : (
              // 2. BROWSE VIEWS (Home, Explore, Subscriptions, Library, Admin)
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                {/* Category chips only render on Home browse page */}
                {activeTab === 'Home' && (
                  <CategoryFilter
                    activeCategory={activeCategory}
                    onSelectCategory={handleSelectCategory}
                  />
                )}

                {/* Main Dynamic View Switch */}
                <div className="pt-2">
                  {activeTab === 'Home' && (
                    <VideoGrid videos={filteredVideos} onWatch={handleWatchVideo} />
                  )}

                  {activeTab === 'Explore' && (
                    <ExploreView onWatch={handleWatchVideo} />
                  )}

                  {activeTab === 'Subscriptions' && (
                    <SubscriptionsView onWatch={handleWatchVideo} />
                  )}

                  {activeTab === 'Library' && (
                    <LibraryView onWatch={handleWatchVideo} />
                  )}

                  {activeTab === 'Admin' && (
                    <AdminPanel videos={videos} onRefreshVideos={handleRefreshVideos} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Fixed bottom navigation for mobile screen size */}
      <MobileBottomNavigation activeTab={activeTab} onSelectTab={handleSelectTab} />
    </div>
  );
}
