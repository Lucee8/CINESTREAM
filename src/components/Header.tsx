import { useState } from 'react';
import { Menu, Search, X, User, Film, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle: () => void;
  onHomeClick: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onMenuToggle,
  onHomeClick,
}: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-[#15130A] border-b border-[#343020] px-4 md:px-6 flex items-center justify-between">
      {/* Left Area: Menu & Brand */}
      <div className="flex items-center gap-3">
        <button
          id="btn-sidebar-hamburger"
          onClick={onMenuToggle}
          className="p-1.5 md:p-2 rounded-full hover:bg-[#1D1B11] text-[#F5F1E8] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-[#F5F1E8]" />
        </button>

        <div
          id="brand-logo"
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FFD400] flex items-center justify-center shadow-lg shadow-[#FFD400]/10">
            <Play className="w-5 h-5 text-[#100F08] fill-[#100F08]" />
          </div>
          <span className="font-sans text-xl font-black tracking-wider text-[#F5F1E8] bg-clip-text">
            CINE<span className="text-[#FFD400]">STREAM</span>
          </span>
        </div>
      </div>

      {/* Center Area: Desktop Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className="relative w-full flex items-center">
          <input
            id="desktop-search-input"
            type="text"
            placeholder="Search videos, channels, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#100F08] text-[#F5F1E8] text-sm rounded-full pl-5 pr-12 py-2.5 border border-[#343020] placeholder-[#9D9889] focus:outline-none focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 transition-all"
          />
          <div className="absolute right-12 text-[#9D9889]">
            {searchQuery && (
              <button
                id="btn-desktop-clear-search"
                onClick={handleClearSearch}
                className="p-1 rounded-full hover:bg-[#1D1B11] text-[#9D9889] hover:text-[#F5F1E8]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            id="btn-desktop-search-submit"
            className="absolute right-1 bg-[#1D1B11] hover:bg-[#FFD400] hover:text-[#100F08] p-2 rounded-full text-[#F5F1E8] transition-colors cursor-pointer mr-0.5"
            aria-label="Search button"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Area: Search (mobile) & Profile */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Toggle */}
        <button
          id="btn-mobile-search-toggle"
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden p-2 rounded-full hover:bg-[#1D1B11] text-[#F5F1E8] transition-colors"
          aria-label="Open search"
        >
          <Search className="w-5 h-5 text-[#F5F1E8]" />
        </button>

        {/* User Profile avatar icon */}
        <div
          id="user-profile-btn"
          className="w-9 h-9 rounded-full bg-[#1D1B11] border border-[#343020] flex items-center justify-center cursor-pointer hover:border-[#FFD400] transition-colors relative group"
        >
          <img
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
            alt="User profile avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#15130A]" />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 bg-[#15130A] z-50 px-4 flex items-center"
          >
            <div className="relative w-full flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  id="mobile-search-input"
                  autoFocus
                  type="text"
                  placeholder="Search videos, channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#100F08] text-[#F5F1E8] text-sm rounded-full pl-10 pr-10 py-2.5 border border-[#343020] placeholder-[#9D9889] focus:outline-none focus:border-[#FFD400]"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D9889]" />
                {searchQuery && (
                  <button
                    id="btn-mobile-clear-search"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#1D1B11] text-[#9D9889]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                id="btn-mobile-search-close"
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-sm font-semibold text-[#9D9889] hover:text-[#FFD400] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
