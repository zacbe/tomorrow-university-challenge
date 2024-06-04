import { useState, useEffect } from 'react';
import { findAllLessons } from '@/app/actions/lessons';

type ChallengeDetailsModalProps = {
  title: string;
  description: string;
  lessonIds: string[];
  content: string;
  onClose: () => void;
};

export default function ChallengeDetailsModal({ title, description, lessonIds, content, onClose }: ChallengeDetailsModalProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await findAllLessons(lessonIds)
      setLessons(data.lessons);
    };

    if (lessonIds.length > 0) fetchLessons();
  }, [lessonIds]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">&times;</button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">{description}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content:</label>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Lessons:</label>
          <div>
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex justify-between items-center mb-2 p-2 border rounded-lg">
                <span>{lesson.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
