import React from 'react';
import { ChecklistCategory } from '../../types';

interface ChecklistTabsProps {
  categories: ChecklistCategory[];
  activeTab: ChecklistCategory;
  setActiveTab: (category: ChecklistCategory) => void;
}

export function ChecklistTabs({ categories, activeTab, setActiveTab }: ChecklistTabsProps): React.ReactNode {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-300 pb-3">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => setActiveTab(category)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200
            ${activeTab === category
              ? 'bg-green-600 text-white shadow'
              : 'bg-white text-green-700 hover:bg-green-100 border border-green-600'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}