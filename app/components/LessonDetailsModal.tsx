import { useState, useEffect } from 'react';
import { findAllChallenges } from '@/app/actions';

type LessonDetailsModalProps = {
  title: string;
  description: string;
  content: string;
  challengeIds: string[];
  onClose: () => void;
};

export default function LessonDetailsModal({ title, description, content, challengeIds, onClose }: LessonDetailsModalProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const data = await findAllChallenges(challengeIds);
      setChallenges(data.challenges);
    };
    
    if (challengeIds.length > 0) fetchChallenges();
  }, [challengeIds]);

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
          <label className="block text-gray-700 mb-2">Challenges:</label>
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex justify-between items-center mb-2 p-2 border rounded-lg">
                <span>{challenge.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
