import MentionSuggestions from "./MentionSuggestions";

interface MentionTextProps {
  value: string;
  matches: string[];
  onChange: (value: string) => void;
    onSelectMention:(username: string) => void;
  onClearSuggestions: () => void;

}

export default function MentionText({
  value,
  matches,
  onChange,
  onSelectMention,
  onClearSuggestions,
}: MentionTextProps) {
  const replaceMention = (username: string) => {
    const updatedContent = value.replace(
      /(?:^|\s)@([a-zA-Z0-9_]{0,20})$/,
      (matchedText) => {
        const leadingSpace = matchedText.startsWith(" ") ? " " : "";

        return `${leadingSpace}@${username} `;
      }
    );

    onChange(updatedContent);
    onSelectMention(username);
    onClearSuggestions();
  };

  return (
    <div className="relative">
      <textarea
        name="content"
        rows={5}
        placeholder="Share something with the community..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border p-3"
        required
      />

      <MentionSuggestions
        matches={matches}
        onSelect={replaceMention}
      />
    </div>
  );
}