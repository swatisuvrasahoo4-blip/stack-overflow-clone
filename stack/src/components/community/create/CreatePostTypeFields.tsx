import type {
  ChangeEvent,
} from "react";

import { useTranslation } from "react-i18next";

interface CreatePostTypeFieldsProps {
  postType: string;

  projectTitle: string;
  projectLink: string;

  achievementTitle: string;
  achievementDescription: string;

  codeSnippet: string;

  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
}

const CreatePostTypeFields = ({
  postType,
  projectTitle,
  projectLink,
  achievementTitle,
  achievementDescription,
  codeSnippet,
  onChange,
}: CreatePostTypeFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Project showcase fields */}
      {postType ===
        "Project Showcase" && (
        <>
          <input
            type="text"
            name="projectTitle"
            placeholder={t(
              "createpost.project_title"
            )}
            value={projectTitle}
            onChange={onChange}
            className="w-full rounded border p-2"
          />

          <input
            type="url"
            name="projectLink"
            placeholder={t(
              "createpost.github_or_live_demo_url"
            )}
            value={projectLink}
            onChange={onChange}
            className="w-full rounded border p-2"
          />
        </>
      )}

      {/* Learning achievement fields */}
      {postType ===
        "Learning Achievement" && (
        <>
          <input
            type="text"
            name="achievementTitle"
            placeholder={t(
              "createpost.achievement_title"
            )}
            value={achievementTitle}
            onChange={onChange}
            className="w-full rounded border p-2"
          />

          <textarea
            name="achievementDescription"
            placeholder={t(
              "createpost.describe_your_achievement"
            )}
            value={
              achievementDescription
            }
            onChange={onChange}
            rows={3}
            className="w-full rounded border p-2"
          />
        </>
      )}

      {/* Code snippet field */}
      {postType ===
        "Code Snippet" && (
        <textarea
          name="codeSnippet"
          value={codeSnippet}
          onChange={onChange}
          placeholder={t(
            "createpost.paste_your_code_snippet"
          )}
          className="min-h-40 w-full rounded border p-3 font-mono"
        />
      )}
    </>
  );
};

export default CreatePostTypeFields;