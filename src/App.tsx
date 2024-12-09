import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CoachingPage } from './components/CoachingPage';
import { JournalHistory } from './components/JournalHistory';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'journal-history'>('home');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-800">AI Coaching System</h1>
          <p className="text-gray-600">Your personal AI coach for emotional well-being</p>
        </div>
      </header>

      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="py-8">
        {currentPage === 'home' ? <CoachingPage /> : <JournalHistory />}
      </main>
    </div>
  );
}

export default App;