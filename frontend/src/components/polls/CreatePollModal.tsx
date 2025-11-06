// CreatePollModal: modal form to create a new poll

import { useState } from "react";

interface CreatePollModalProps {
  onClose: () => void;
  onCreate: (title: string, options: string[]) => void;
  loading: boolean;
}

export default function CreatePollModal({ onClose, onCreate, loading }: CreatePollModalProps) {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!title.trim() || !/^[A-Za-z0-9 ]+$/.test(title)) {
      newErrors.push("Title must be alphanumeric (spaces allowed)");
    }
    if (options.length < 2 || options.length > 6) {
      newErrors.push("Poll must have between 2 and 6 options");
    }
    const validOptions = options.filter((opt) => opt.trim() && /^[A-Za-z0-9 ]+$/.test(opt));
    if (validOptions.length !== options.length) {
      newErrors.push("All options must be alphanumeric (spaces allowed)");
    }
    if (validOptions.length < 2) {
      newErrors.push("At least 2 valid options required");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const validOptions = options.filter((opt) => opt.trim());
    onCreate(title.trim(), validOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Poll</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Poll Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekend Plans"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options ({options.length}/6)
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={loading}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                  disabled={loading}
                >
                  + Add Option
                </button>
              )}
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Poll"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

