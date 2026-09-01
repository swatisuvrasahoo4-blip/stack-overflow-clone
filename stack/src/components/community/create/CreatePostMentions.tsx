import {
  useState,
} from "react";

import { useTranslation } from "react-i18next";

interface CreatePostMentionsProps {
  allUsernames: string[];
  selectedMentions: string[];
  setSelectedMentions: (
    mentions: string[]
  ) => void;
}

const CreatePostMentions = ({
  allUsernames,
  selectedMentions,
  setSelectedMentions,
}: CreatePostMentionsProps) => {
  const { t } =
    useTranslation("create_post");

  const [
    mentionInput,
    setMentionInput,
  ] = useState("");

  const [
    mentionInputMatches,
    setMentionInputMatches,
  ] = useState<string[]>([]);

  const handleMentionChange = (
    value: string
  ): void => {
    setMentionInput(value);

    const query = value
      .trim()
      .replace(/^@/, "")
      .toLowerCase();

    if (!query) {
      setMentionInputMatches([]);
      return;
    }

    const filteredUsers =
      allUsernames
        .filter((username) => {
          const lowerUsername =
            username.toLowerCase();

          return (
            lowerUsername.startsWith(
              query
            ) &&
            !selectedMentions.includes(
              username
            )
          );
        })
        .slice(0, 5);

    setMentionInputMatches(
      filteredUsers
    );
  };

  const handleAddMention =
    (): void => {
      const username =
        mentionInput
          .trim()
          .replace(/^@/, "")
          .toLowerCase();

      if (!username) {
        return;
      }

      if (
        !allUsernames.includes(
          username
        )
      ) {
        alert(
          t(
            "mentions.user_not_found"
          )
        );

        return;
      }

      if (
        !selectedMentions.includes(
          username
        )
      ) {
        setSelectedMentions([
          ...selectedMentions,
          username,
        ]);
      }

      setMentionInput("");
      setMentionInputMatches([]);
    };

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-medium">
        {t(
          "mentions.mention_users"
        )}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={mentionInput}
          onChange={(event) =>
            handleMentionChange(
              event.target.value
            )
          }
          placeholder={t(
            "mentions.type_username"
          )}
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          type="button"
          onClick={
            handleAddMention
          }
          className="rounded-md bg-purple-600 px-4 py-2 text-white"
          aria-label={t(
            "mentions.add_user"
          )}
        >
          +
        </button>
      </div>

      {mentionInputMatches.length >
        0 && (
        <div className="absolute left-0 right-14 top-full z-50 mt-1 overflow-hidden rounded-md border bg-white shadow-lg">
          {mentionInputMatches.map(
            (username) => (
              <button
                key={username}
                type="button"
                onClick={() => {
                  setMentionInput(
                    username
                  );

                  setMentionInputMatches(
                    []
                  );
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                @{username}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePostMentions;