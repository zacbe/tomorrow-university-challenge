import Image from 'next/image';

type EmptyTableProps = {
  route: string;
  onClick: () => void;
};

export default function EmptyTable({ route, onClick }: EmptyTableProps) {
  return (
    <tr>
      <td colSpan={4} className="px-4 py-8 text-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <Image src="https://cdn.dribbble.com/users/357797/screenshots/3998541/media/4d331a7ea014fa08a6e3ee9083ad684a.jpg?resize=400x300&vertical=center" alt="No lessons" width={96} height={96} className="mb-4" />
          <p className="text-gray-500 mb-4">You currently don’t have any entries.</p>
          <button
            onClick={onClick}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            + Create {route}
          </button>
        </div>
      </td>
    </tr>
  );
}