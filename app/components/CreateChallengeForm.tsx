'use client';

import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { findAllLessons } from '@/app/actions/lessons';
import SuccessMessage from './SuccessMessage';

type CreateChallengeFormProps = {
  onSave: (challenge: {
    title: string;
    description: string;
    content: string;
    lessons: string[]
  }) => void;
  onClose: () => void;
};

export default function CreateChallengeForm({ onSave, onClose }: CreateChallengeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedLessons, setSelectedLessons] = useState<Lesson[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await findAllLessons();
        setLessons(data.lessons);
      } catch (err) {
        setError('Failed to fetch lessons');
      }
    };
    fetchLessons();
  }, []);

  const handleAddLesson = (lesson: Lesson) => {
    if (!selectedLessons.find((l) => l.id === lesson.id)) {
      setSelectedLessons([...selectedLessons, lesson]);
    }
  };

  const handleRemoveLesson = (lesson: Lesson) => {
    setSelectedLessons(selectedLessons.filter((l) => l.id !== lesson.id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await onSave({
        title,
        description,
        content,
        lessons: selectedLessons.flatMap((lesson) => lesson.id || [])
      });
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lesson = lessons.find((lesson) => lesson.id === e.target.value);
    if (lesson) handleAddLesson(lesson);
  }

  return (
    <>
      {showSuccess ? (
        <SuccessMessage model={"challenge"} onClose={onClose} />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Challenge</h2>
              <button onClick={onClose} className="text-gray-500">&times;</button>
            </div>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Short Description</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Content</label>
              <ReactQuill value={content} onChange={setContent} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Lessons</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                onChange={handleSelectLesson}
              >
                <option value="">Select one or more lessons</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Selected Lessons:</label>
              <div>
                {selectedLessons.map((lesson) => (
                  <div key={lesson.id} className="flex justify-between items-center mb-2 p-2 border rounded-lg">
                    <span>{lesson.title}</span>
                    <button onClick={() => handleRemoveLesson(lesson)} className="text-red-500">&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>)}
    </>
  );
}
