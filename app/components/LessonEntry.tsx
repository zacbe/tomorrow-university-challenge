type LessonTableEntryProps = {
  title: string;
  description: string;
  challenges: number;
  onView: () => void;
  onDelete: () => void;
};

export default function TableEntry({ title, description, challenges, onView, onDelete }: LessonTableEntryProps) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2 text-gray-700">{title}</td>
      <td className="px-4 py-2 text-gray-700">{description}</td>
      <td className="px-4 py-2 text-gray-700 text-center">{challenges}</td>
      <td className="px-4 py-2 text-center">
        <button onClick={onView} className="bg-purple-600 text-white px-4 py-1 rounded-md mr-2">View</button>
        <button onClick={onDelete} className="bg-red-600 text-white px-4 py-1 rounded-md">Delete</button>
      </td>
    </tr>
  );
}
