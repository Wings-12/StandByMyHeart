import React from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'journal-history';
  onNavigate: (page: 'home' | 'journal-history') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-4">
          <button
            onClick={() => onNavigate('home')}
            className={`py-4 px-6 flex items-center gap-2 border-b-2 ${
              currentPage === 'home'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle size={20} />
            <span>Coaching</span>
          </button>
          <button
            onClick={() => onNavigate('journal-history')}
            className={`py-4 px-6 flex items-center gap-2 border-b-2 ${
              currentPage === 'journal-history'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen size={20} />
            <span>Journal History</span>
          </button>
        </div>
      </div>
    </nav>
  );
};