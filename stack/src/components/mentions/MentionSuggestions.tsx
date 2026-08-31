interface MentionSuggestionsProps {
  matches: string[];
  onSelect: (username: string) => void;
}

const MentionSuggestions = ({
  matches,
  onSelect,
}: MentionSuggestionsProps) => {
  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-b border bg-white shadow-sm">
      {/* Mention suggestions */}

      {matches.map((match) => (
        <button
          key={match}
          type="button"
          onClick={() =>
            onSelect(match)
          }
          className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          @{match}
        </button>
      ))}
    </div>
  );
};

export default MentionSuggestions;