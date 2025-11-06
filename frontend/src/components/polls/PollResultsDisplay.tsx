// PollResultsDisplay: shows vote counts and percentages for each option

import { Poll, PollResults } from "../../api/client";

interface PollResultsDisplayProps {
  poll: Poll;
  results: PollResults;
}

export default function PollResultsDisplay({ poll, results }: PollResultsDisplayProps) {
  const total = results.total;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Results {total > 0 && <span className="text-gray-500">({total} votes)</span>}
      </h4>
      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const count = results.counts[index] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{option}</span>
                <span className="text-gray-600">
                  {count} {count === 1 ? "vote" : "votes"} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

