import { useState, useEffect } from 'react';
import TableEntry from './ChallengeEntry';
import EmptyTable from './EmptyTable';
import CreateChallengeForm from './CreateChallengeForm';
import ChallengeDetailsModal from './ChallengeDetailsModal';
import { createOneChallenge, deleteOneChallenge, findAllChallenges } from '@/app/actions'

export default function ChallengeTable() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [reload, setReload] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (reload) {
      const handleFetchChallenges = async () => {
        const data = await findAllChallenges([], page, limit);
        setChallenges(data.challenges);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      };
      handleFetchChallenges();
      setReload(false);
    }
  }, [reload, page, limit]);

  const handleSaveChallenge = async (
    challenge: {
      title: string;
      description: string;
      content: string;
      lessons: string[]
    }
  ) => {
    await createOneChallenge(challenge);
    toggleReload();
  };

  const toggleReload = () => {
    setReload(previousState => !previousState);
  };

  const handleView = (id?: string) => {
    if (!id) return;
    const challenge = challenges.find(chal => chal.id === id);
    if (challenge) setSelectedChallenge(challenge);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteOneChallenge(id);
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
          <h2 className="text-xl font-semibold text-gray-700">Challenges</h2>
          <button onClick={() => setIsFormOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg">+ Create Challenge</button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Title <span className="inline-block">&#x25BC;</span></th>
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Short Description <span className="inline-block">&#x25BC;</span></th>
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Lessons <span className="inline-block">&#x25BC;</span></th>
              <th className="w-1/4 px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges?.length > 0 ? challenges.map((challenge) => (
              <TableEntry
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                count={challenge.lessons?.length || 0}
                onView={() => handleView(challenge.id)}
                onDelete={() => handleDelete(challenge.id)}
              />
            )) : <EmptyTable route="Challenge" onClick={() => setIsFormOpen(true)} />}
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
        <CreateChallengeForm
          onSave={handleSaveChallenge}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {selectedChallenge && (
        <ChallengeDetailsModal
          title={selectedChallenge.title}
          description={selectedChallenge.description}
          content={selectedChallenge.content}
          lessonIds={selectedChallenge.lessons}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}
