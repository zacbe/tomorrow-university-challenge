'use client';

import { useState, useEffect } from 'react';
import TableEntry from './LessonEntry';
import EmptyTable from './EmptyTable';
import CreateLessonForm from './CreateLessonForm';
import LessonDetailsModal from './LessonDetailsModal';
import { createOneLesson, deleteOneLesson, findAllLessons } from '@/app/actions'

export default function LessonTable() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [reload, setReload] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (reload) {
      const handleFetchLessons = async () => {
        const data = await findAllLessons([], page, limit);
        setLessons(data.lessons);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      };
      handleFetchLessons();
      setReload(false);
    }
  }, [reload, page, limit]);

  const handleSaveLesson = async (
    lesson: {
      title: string;
      description: string;
      content: string;
    }
  ) => {
    await createOneLesson(lesson)
    toggleReload();
  };

  const toggleReload = () => {
    setReload(previousState => !previousState);
  };

  const handleView = (id?: string) => {
    if (!id) return;
    const lesson = lessons.find(les => les.id === id);
    if (lesson) setSelectedLesson(lesson);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteOneLesson(id)
    toggleReload();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    toggleReload();
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
    toggleReload();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="shadow-lg rounded-lg overflow-hidden bg-white">
        <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Lessons</h2>
          <button onClick={() => setIsFormOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg">+ Create Lesson</button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Title <span className="inline-block">&#x25BC;</span></th>
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Short Description <span className="inline-block">&#x25BC;</span></th>
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Challenges <span className="inline-block">&#x25BC;</span></th>
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons?.length > 0 ? lessons.map((lesson) => (
              <TableEntry
                key={lesson.id}
                title={lesson.title}
                description={lesson.description}
                challenges={lesson.challenges?.length || 0}
                onView={() => handleView(lesson.id)}
                onDelete={() => handleDelete(lesson.id)}
              />
            )) : <EmptyTable route='Lesson' onClick={() => setIsFormOpen(true)} />}
          </tbody>
        </table>
        <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="text-gray-600">
            Rows per page:
            <select className="ml-2 border-gray-300 rounded-md" value={limit} onChange={handleLimitChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="text-gray-600">
            Total: {total}
          </div>
          <div className="text-gray-600">
          Page {page} of {totalPages}
            <button className="ml-4" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</button>
            <button className="ml-2" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>&gt;</button>
          </div>
        </div>
      </div>
      {isFormOpen && (
        <CreateLessonForm
          onSave={handleSaveLesson}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {selectedLesson && (
        <LessonDetailsModal
          title={selectedLesson.title}
          description={selectedLesson.description}
          content={selectedLesson.content}
          challengeIds={selectedLesson.challenges}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}
