export const Tag = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <div className="mr-2 inline-flex items-center rounded bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
    {label}
    <button
      className="ml-2 text-gray-500 hover:text-red-600 focus:outline-none"
      onClick={onRemove}
    >
      x
    </button>
  </div>
);
