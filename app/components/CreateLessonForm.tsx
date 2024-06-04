import { useState } from 'react';
import dynamic from 'next/dynamic';
import SuccessMessage from './SuccessMessage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

type CreateLessonFormProps = {
  onSave: (lesson: {
    title: string;
    description: string;
    content: string
  }) => void;
  onClose: () => void;
};

export default function CreateLessonForm({ onSave, onClose }: CreateLessonFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await onSave({ title, description, content });
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess ? (
        <SuccessMessage model={"lesson"} onClose={onClose} />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Lesson</h2>
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
