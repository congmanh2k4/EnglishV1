import React, { useState } from 'react';
import { CURRICULUM } from '../data/curriculum';
import { Category, Lesson } from '../types';

interface CourseSelectorProps {
  onSelectLesson: (lesson: Lesson) => void;
  isLoading: boolean;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({ onSelectLesson, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  if (selectedCategory) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="mb-4 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          ← Back to Categories
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">{selectedCategory.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedCategory.title}</h2>
            <p className="text-slate-400">{selectedCategory.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {selectedCategory.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              disabled={isLoading}
              className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl p-5 text-left transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wider">Lesson {index + 1}</div>
                <h3 className="text-lg font-medium text-slate-100 mb-1 group-hover:text-blue-300 transition-colors">{lesson.title}</h3>
                <p className="text-sm text-slate-400">{lesson.description}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-300 mb-6">Choose a Topic</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRICULUM.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            disabled={isLoading}
            className="bg-slate-800 hover:bg-slate-750 border border-slate-700/50 hover:border-slate-600 rounded-xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{category.title}</h3>
            <p className="text-sm text-slate-400">{category.description}</p>
            <div className="mt-4 text-xs font-medium text-slate-500 flex items-center gap-2">
              <span>{category.lessons.length} lessons</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};