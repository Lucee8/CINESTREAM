import { Home, Compass, PlaySquare, FolderHeart, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export type TabId = 'Home' | 'Explore' | 'Subscriptions' | 'Library' | 'Admin';

interface MobileBottomNavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export default function MobileBottomNavigation({
  activeTab,
  onSelectTab,
}: MobileBottomNavigationProps) {
  const navItems = [
    { id: 'Home' as TabId, label: 'Home', icon: Home },
    { id: 'Explore' as TabId, label: 'Explore', icon: Compass },
    { id: 'Subscriptions' as TabId, label: 'Subscriptions', icon: PlaySquare },
    { id: 'Library' as TabId, label: 'Library', icon: FolderHeart },
    { id: 'Admin' as TabId, label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#15130A] border-t border-[#343020] px-4 py-2 flex justify-around items-center h-16 shadow-lg">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id.toLowerCase()}`}
            onClick={() => onSelectTab(item.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-center cursor-pointer select-none focus:outline-none"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-[#FFD400]' : 'text-[#9D9889]'
              }`}
            >
              <div className="relative p-1">
                <IconComponent className="w-5.5 h-5.5" />
                {isActive && (
                  <motion.span
                    layoutId="mobileNavActiveDot"
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#FFD400]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
