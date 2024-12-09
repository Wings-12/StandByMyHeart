import React, { useState } from 'react';
import { format } from 'date-fns';
import { Smile, Meh, Frown, Pencil, Trash2, X, Check } from 'lucide-react';
import { useCoachingStore } from '../store/useCoachingStore';
import { JournalForm } from './JournalForm';
import type { EmotionLevel } from '../types';

const EmotionIcon: React.FC<{ level: EmotionLevel }> = ({ level }) => {
  const size = 20;
  if (level <= 2) return <Frown size={size} className="text-red-500" />;
  if (level === 3) return <Meh size={size} className="text-yellow-500" />;
  return <Smile size={size} className="text-green-500" />;
};

interface EditableEntryProps {
  id: string;
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const EditableEntry: React.FC<EditableEntryProps> = ({ id, content: initialContent, onSave, onCancel }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave(content);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Check size={16} />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
};

export const JournalHistory: React.FC = () => {
  const { journalEntries, updateJournalEntry, deleteJournalEntry } = useCoachingStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string, content: string) => {
    updateJournalEntry(id, content);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        <div className="space-y-8">
          <JournalForm />
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Journal History</h2>
            {journalEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No journal entries yet. Start writing to see your entries here!
              </p>
            ) : (
              <div className="space-y-6">
                {[...journalEntries].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <EmotionIcon level={entry.emotionLevel} />
                        <span className="text-sm text-gray-500">
                          {format(new Date(entry.timestamp), "MMMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(entry.id)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          aria-label="Edit entry"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {editingId === entry.id ? (
                      <EditableEntry
                        id={entry.id}
                        content={entry.content}
                        onSave={(content) => handleEdit(entry.id, content)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};