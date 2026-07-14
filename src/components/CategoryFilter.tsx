import { CATEGORIES } from '../data/mockVideos';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full py-4 px-4 md:px-6 bg-[#100F08] overflow-hidden select-none">
      <div
        id="categories-scroller"
        className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              id={`cat-chip-${category.toLowerCase()}`}
              onClick={() => onSelectCategory(category)}
              className={`
                px-5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer border
                ${
                  isActive
                    ? 'bg-[#FFD400] text-[#100F08] border-[#FFD400] font-bold shadow-md shadow-[#FFD400]/10 scale-105'
                    : 'bg-[#1D1B11] text-[#F5F1E8] border-[#343020] hover:border-[#FFD400]/40 hover:text-[#FFD400]'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
