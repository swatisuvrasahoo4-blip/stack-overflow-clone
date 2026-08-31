import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import CreatePostFeaturedOption from "@/components/community/create/CreatePostFeaturedOption";
import CreatePostHashtags from "@/components/community/create/CreatePostHashtags";
import CreatePostImageUpload from "@/components/community/create/CreatePostImageUpload";
import CreatePostMentions from "@/components/community/create/CreatePostMentions";
import CreatePostTypeFields from "@/components/community/create/CreatePostTypeFields";

import MentionText from "@/components/mentions/MentionText";

import { createPost } from "@/components/services/communityService";
import { getSubscription } from "@/components/services/subscriptionService";

import Mainlayout from "@/layout/Mainlayout";

import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";

interface CommunityUser {
  username?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface GetUsersResponse {
  data?: CommunityUser[];
}

interface CreatePostForm {
  content: string;
  postType: string;
  isFeatured: boolean;
  image: File | null;
  codeSnippet: string;
  projectTitle: string;
  projectLink: string;
  achievementTitle: string;
  achievementDescription: string;
}

const CreatePost = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { t } = useTranslation();

  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const [
    form,
    setForm,
  ] = useState<CreatePostForm>({
    content: "",
    postType: "Technical Update",
    isFeatured: false,
    image: null,
    codeSnippet: "",
    projectTitle: "",
    projectLink: "",
    achievementTitle: "",
    achievementDescription: "",
  });

  const [
    mentionMatches,
    setMentionMatches,
  ] = useState<string[]>([]);

  const [
    allUsernames,
    setAllUsernames,
  ] = useState<string[]>([]);

  const [
    selectedMentions,
    setSelectedMentions,
  ] = useState<string[]>([]);

  const [
    tags,
    setTags,
  ] = useState<string[]>([]);

  const [
    isGoldUser,
    setIsGoldUser,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  // Update normal form fields
  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ): void => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );
  };

  // Update main post content and mention suggestions
  const handleContentChange = (
    content: string
  ): void => {
    setForm(
      (previousForm) => ({
        ...previousForm,
        content,
      })
    );

    const mentionMatch =
      content.match(
        /(?:^|\s)@([a-zA-Z0-9_]{0,20})$/
      );

    const query =
      mentionMatch?.[1] ?? "";

    if (!query) {
      setMentionMatches([]);
      return;
    }

    const filteredUsers =
      allUsernames
        .filter(
          (username) =>
            username
              .toLowerCase()
              .startsWith(
                query.toLowerCase()
              ) &&
            username !==
              user?.username
        )
        .slice(0, 5);

    setMentionMatches(
      filteredUsers
    );
  };

  // Add mention selected from MentionText
  const handleSelectMention = (
    username: string
  ): void => {
    if (
      selectedMentions.includes(
        username
      )
    ) {
      return;
    }

    setSelectedMentions(
      (previousMentions) => [
        ...previousMentions,
        username,
      ]
    );
  };

  // Remove selected mention
  const handleRemoveMention = (
    username: string
  ): void => {
    setSelectedMentions(
      (previousMentions) =>
        previousMentions.filter(
          (mention) =>
            mention !== username
        )
    );

    setForm(
      (previousForm) => ({
        ...previousForm,
        content:
          previousForm.content
            .replace(
              new RegExp(
                `@${username}\\b`,
                "gi"
              ),
              ""
            )
            .replace(
              /\s{2,}/g,
              " "
            )
            .trim(),
      })
    );
  };

  // Load usernames
  useEffect(() => {
    const loadUsernames =
      async (): Promise<void> => {
        try {
          const response =
            await axiosInstance.get<GetUsersResponse>(
              "/user/getalluser"
            );

          const usernames =
            (response.data.data ??
              [])
              .map(
                (
                  currentUser
                ) =>
                  currentUser.username
              )
              .filter(
                (
                  username
                ): username is string =>
                  Boolean(username)
              );

          setAllUsernames(
            usernames
          );
        } catch (error: unknown) {
          console.error(
            "Failed to load usernames:",
            error
          );
        }
      };

    void loadUsernames();
  }, []);

  // Check Gold subscription
  useEffect(() => {
    const checkSubscription =
      async (): Promise<void> => {
        if (!user) {
          return;
        }

        try {
          const response =
            await getSubscription();

          setIsGoldUser(
            response.data.plan
              ?.toLowerCase() ===
              "gold"
          );
        } catch (error: unknown) {
          console.error(
            "Failed to check subscription:",
            error
          );

          setIsGoldUser(
            false
          );
        }
      };

    void checkSubscription();
  }, [user]);

  // Submit post
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setLoading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "authorId",
        user?.id ||
          user?._id ||
          ""
      );

      formData.append(
        "authorName",
        user?.name ||
          user?.username ||
          user?.email ||
          ""
      );

      formData.append(
        "content",
        form.content
      );

      formData.append(
        "postType",
        form.postType
      );

      formData.append(
        "isFeatured",
        form.isFeatured
          ? "true"
          : "false"
      );

      formData.append(
        "codeSnippet",
        form.codeSnippet
      );

      formData.append(
        "projectTitle",
        form.projectTitle
      );

      formData.append(
        "projectLink",
        form.projectLink
      );

      formData.append(
        "achievementTitle",
        form.achievementTitle
      );

      formData.append(
        "achievementDescription",
        form.achievementDescription
      );

      if (tags.length > 0) {
        formData.append(
          "hashtags",
          tags.join(",")
        );
      }

      if (
        selectedMentions.length > 0
      ) {
        formData.append(
          "mentions",
          selectedMentions.join(
            ","
          )
        );
      }

      if (
        form.image instanceof File
      ) {
        formData.append(
          "image",
          form.image
        );
      }

      await createPost(formData);

      alert(
        t(
          "alert.post_created_successfully"
        )
      );

      await router.push(
        "/community"
      );

      router.reload();
    } catch (error: unknown) {
      const apiError =
        error as ApiError;

      console.error(
        "Failed to create post:",
        error
      );

      alert(
        apiError.response?.data
          ?.message ||
          t(
            "alert.failed_to_create_post"
          )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Mainlayout>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        {/* Page heading */}
        <h1 className="mb-6 text-2xl font-bold">
          {t(
            "createpost.create_community_post"
          )}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Post content */}
          <MentionText
            value={form.content}
            matches={
              mentionMatches
            }
            onChange={
              handleContentChange
            }
            onSelectMention={
              handleSelectMention
            }
            onClearSuggestions={() =>
              setMentionMatches(
                []
              )
            }
          />

          {/* Selected mentions */}
          {selectedMentions.length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedMentions.map(
                (username) => (
                  <span
                    key={username}
                    className="flex items-center gap-2 rounded-md bg-purple-100 px-3 py-1 text-sm text-purple-700"
                  >
                    @{username}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMention(
                          username
                        )
                      }
                      className="font-semibold hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )
              )}
            </div>
          )}

          {/* Post type */}
          <select
            name="postType"
            value={form.postType}
            onChange={handleChange}
            className="w-full rounded border p-2"
          >
            <option value="Technical Update">
              {t(
                "createpost.technical_update"
              )}
            </option>

            <option value="Project Showcase">
              {t(
                "createpost.project_showcase"
              )}
            </option>

            <option value="Learning Achievement">
              {t(
                "createpost.learning_achievement"
              )}
            </option>

            <option value="Code Snippet">
              {t(
                "createpost.code_snippet"
              )}
            </option>
          </select>

          {/* Featured option */}
          <CreatePostFeaturedOption
            isGoldUser={
              isGoldUser
            }
            isFeatured={
              form.isFeatured
            }
            onFeaturedChange={(
              isFeatured
            ) =>
              setForm(
                (
                  previousForm
                ) => ({
                  ...previousForm,
                  isFeatured,
                })
              )
            }
          />

          {/* Image upload */}
          <CreatePostImageUpload
            postType={
              form.postType
            }
            image={
              form.image
            }
            imageInputRef={
              imageInputRef
            }
            onImageChange={(
              image
            ) =>
              setForm(
                (
                  previousForm
                ) => ({
                  ...previousForm,
                  image,
                })
              )
            }
          />

          {/* Post-specific fields */}
          <CreatePostTypeFields
            postType={
              form.postType
            }
            projectTitle={
              form.projectTitle
            }
            projectLink={
              form.projectLink
            }
            achievementTitle={
              form.achievementTitle
            }
            achievementDescription={
              form.achievementDescription
            }
            codeSnippet={
              form.codeSnippet
            }
            onChange={
              handleChange
            }
          />

          {/* Manual mentions */}
          <CreatePostMentions
            allUsernames={
              allUsernames
            }
            selectedMentions={
              selectedMentions
            }
            setSelectedMentions={
              setSelectedMentions
            }
          />

          {/* Hashtags */}
          <CreatePostHashtags
            tags={tags}
            setTags={setTags}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? t(
                  "createpost.posting"
                )
              : t(
                  "createpost.create_post"
                )}
          </button>
        </form>
      </div>
    </Mainlayout>
  );
};

export default CreatePost;