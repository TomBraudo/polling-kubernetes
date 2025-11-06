// VoteButton: button to vote on a poll option

interface VoteButtonProps {
  option: string;
  index: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoteButton({ option, onClick, disabled }: VoteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-4 py-3 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="font-medium text-gray-900">{option}</span>
    </button>
  );
}

