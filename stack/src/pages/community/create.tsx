import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import { createPost } from "@/components/services/communityService";
import MentionText from "@/components/mentions/MentionText";
import { getSubscription } from "@/components/services/subscriptionService";

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [mentionInput, setMentionInput] = useState("");
  const [mentionInputMatches, setMentionInputMatches] = useState<string[]>([]);
  const [isGoldUser, setIsGoldUser] = useState(false);

  const [form, setForm] = useState({
    content: "",
    postType: "Technical Update",
    isFeatured: false,
    image: null as File | null,
    codeSnippet: "",
    hashtags: "",
    projectTitle: "",
    projectLink: "",
    achievementTitle: "",
    achievementDescription: "",
    codeLanguage: "javascript",
    codeTitle: "",
  });

  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionMatches, setMentionMatches] = useState<string[]>([]);
  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const nextForm = {
      ...form,
      [e.target.name]: e.target.value,
    };

    if (e.target.name === "content") {
      const mentionMatch = nextForm.content.match(/(?:^|\s)@([a-zA-Z0-9_]{0,20})$/);
      const query = mentionMatch ? mentionMatch[1] : "";
      setMentionQuery(query);
      if (query.length > 0) {
        const filtered = allUsernames.filter(
          (username) =>
            username.toLowerCase().startsWith(query.toLowerCase()) &&
            username !== user?.username
        );
        setMentionMatches(filtered.slice(0, 5));
      } else {
        setMentionMatches([]);
      }
    }

    setForm(nextForm);
  };
const addTag = () => {
  const tag = tagInput.trim();

  if (!tag) return;

  if (!tags.includes(tag)) {
    setTags([...tags, tag]);
  }

  setTagInput("");
};
  useEffect(() => {
    const loadUsernames = async () => {
      try {
        const res = await axiosInstance.get("/user/getalluser");
        const usernames = res.data.data
          .map((u: any) => u.username)
          .filter(Boolean);
        setAllUsernames(usernames);
      } catch (err) {
        console.error("Failed to load usernames", err);
      }
    };

    loadUsernames();
  }, []);

  useEffect(() => {
  const checkSubscription = async () => {
    if (!user) return;

    try {
      const response = await getSubscription();

      setIsGoldUser(
        response.data.plan?.toLowerCase() === "gold"
      );
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setIsGoldUser(false);
    }
  };

  checkSubscription();
}, [user]);
 

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      
      
      const formData = new FormData();

formData.append("authorId", user?.id || user?._id || "");
formData.append("authorName", user?.name || user?.username || user?.email || "");
formData.append("content", form.content);
formData.append("postType", form.postType);
formData.append("isFeatured", form.isFeatured ? "true" : "false");
formData.append("codeSnippet", form.codeSnippet);
formData.append("projectTitle", form.projectTitle);
formData.append("projectLink", form.projectLink);
formData.append("achievementTitle", form.achievementTitle);
formData.append("achievementDescription", form.achievementDescription);



if (tags.length > 0) {
  formData.append("hashtags", tags.join(","));
}

if (selectedMentions.length > 0) {
  formData.append("mentions", selectedMentions.join(","));
}

if (form.image instanceof File) {
  formData.append("image", form.image);
}

await createPost(formData);

      alert("Post created successfully!");
     await router.push("/community");
      router.reload();
    } catch (err: any) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };
 const handleAddMention = () => {
  const username = mentionInput
    .trim()
    .replace(/^@/, "")
    .toLowerCase();

  if (!username) return;

  if (!allUsernames.includes(username)) {
    alert("User not found");
    return;
  }

  if (!selectedMentions.includes(username)) {
    setSelectedMentions((previousMentions) => [
      ...previousMentions,
      username,
    ]);
  }

  setMentionInput("");
  setMentionInputMatches([]);
};

  return (
    <Mainlayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          Create Community Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

         <MentionText
  value={form.content}
  matches={mentionMatches}
  onChange={(content) =>
    setForm((previousForm) => ({
      ...previousForm,
      content,
    }))
  }
  onSelectMention={(username) => {
    if (!selectedMentions.includes(username)) {
      setSelectedMentions((previousMentions) => [
        ...previousMentions,
        username,
      ]);
    }
  }}
  onClearSuggestions={() => {
    setMentionQuery("");
    setMentionMatches([]);
  }}
/>

{selectedMentions.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2">
    {selectedMentions.map((username) => (
      <span
        key={username}
        className="flex items-center gap-2 rounded-md bg-purple-100 px-3 py-1 text-sm text-purple-700"
      >
        @{username}

        <button
          type="button"
          onClick={() => {
  setSelectedMentions((previousMentions) =>
    previousMentions.filter(
      (mention) => mention !== username
    )
  );

  setForm((previousForm) => ({
    ...previousForm,
    content: previousForm.content
      .replace(
        new RegExp(`@${username}\\b`, "gi"),
        ""
      )
      .replace(/\s{2,}/g, " ")
      .trim(),
  }));
}}
          className="font-semibold hover:text-purple-900"
        >
          ×
        </button>
      </span>
    ))}
  </div>
)}

          <select
  name="postType"
  value={form.postType}
  onChange={handleChange}
  className="w-full border rounded p-2"
>
  <option value="Technical Update">Technical Update</option>
  <option value="Project Showcase">Project Showcase</option>
  <option value="Learning Achievement">Learning Achievement</option>
  <option value="Code Snippet">Code Snippet</option>
</select>


{isGoldUser ? (
  <label className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.isFeatured}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          isFeatured: e.target.checked,
        }))
      }
      className="h-4 w-4 accent-yellow-500"
    />

    <div>
      <p className="font-medium text-yellow-800">
        Feature this post
      </p>
      <p className="text-sm text-yellow-700">
        Give this post premium visibility in the community.
      </p>
    </div>
  </label>
) : (
  <div
    onClick={() => router.push("/subscription")}
    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
  >
    <input
      type="checkbox"
      disabled
      className="h-4 w-4 cursor-not-allowed"
    />

    <div>
      <p className="font-medium text-gray-700">
        Feature this post
      </p>
      <p className="text-sm text-gray-500">
        Gold feature — Upgrade to Gold to feature your posts.
      </p>
    </div>
  </div>
)}
          <div className="space-y-2">


  <input
    ref={imageInputRef}
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0] || null;

      setForm((previousForm) => ({
        ...previousForm,
        image: file,
      }));
    }}
  />
  {form.postType !== "Code Snippet" && (
  <div className="flex items-center rounded border p-2">
    <button
      type="button"
      className="cursor-pointer rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
      onClick={() => imageInputRef.current?.click()}
    >
      Choose file
    </button>

    <span
  className={`ml-auto truncate px-3 text-sm ${
    form.image ? "text-gray-700" : "text-red-600"
  }`}
>
  {form.image ? form.image.name : "No file chosen"}
</span>

    {form.image && (
      <button
        type="button"
        className="cursor-pointer px-2 text-xl font-bold text-red-600 hover:text-red-800"
        aria-label="Remove selected image"
        onClick={() => {
          setForm((previousForm) => ({
            ...previousForm,
            image: null,
          }));

          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
        }}
      >
        ×
      </button>
    )}
  </div>
  )}
</div>

{form.postType === "Project Showcase" && (
  <>
  <input
    type="text"
    name="projectTitle"
    placeholder="Project title"
    value={form.projectTitle}
    onChange={handleChange}
    className="w-full rounded border p-2"
  />
  <input
      type="url"
      name="projectLink"
      placeholder="GitHub or Live Demo URL"
      value={form.projectLink}
      onChange={handleChange}
      className="w-full rounded border p-2"
    />
</>
)}

{form.postType === "Learning Achievement" && (
  <>
    <input
      type="text"
      name="achievementTitle"
      placeholder="Achievement title"
      value={form.achievementTitle}
      onChange={handleChange}
      className="w-full rounded border p-2"
    />

    <textarea
      name="achievementDescription"
      placeholder="Describe your achievement..."
      value={form.achievementDescription}
      onChange={handleChange}
      rows={3}
      className="w-full rounded border p-2"
    />
  </>
)}

          {form.postType === "Code Snippet" && (
  <textarea
    name="codeSnippet"
    value={form.codeSnippet}
    onChange={handleChange}
    placeholder="Paste your code snippet..."
    className="min-h-40 w-full rounded border p-3 font-mono"
  />
)}


<div className="relative space-y-2">
  <label className="text-sm font-medium">Mention users</label>

  <div className="flex gap-2">
    <input
      type="text"
      value={mentionInput}
      onChange={(e) => {
        const value = e.target.value;
        setMentionInput(value);

        const query = value
          .trim()
          .replace(/^@/, "")
          .toLowerCase();

        if (!query) {
          setMentionInputMatches([]);
          return;
        }

        const filteredUsers = allUsernames
  .filter((username) => {
    const lowerUsername = username.toLowerCase();

    return (
      lowerUsername.startsWith(query) &&
      !selectedMentions.includes(username)
    );
  })
  .slice(0, 5);

        setMentionInputMatches(filteredUsers);
      }}
      placeholder="Type a username"
      className="w-full rounded-md border px-3 py-2"
    />

    <button
      type="button"
      onClick={handleAddMention}
      className="rounded-md bg-purple-600 px-4 py-2 text-white"
    >
      +
    </button>
  </div>

  {mentionInputMatches.length > 0 && (
    <div className="absolute left-0 right-14 top-full z-50 mt-1 overflow-hidden rounded-md border bg-white shadow-lg">
      {mentionInputMatches.map((username) => (
        <button
          key={username}
          type="button"
          onClick={() => {
            setMentionInput(username);
            setMentionInputMatches([]);
          }}
          className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
        >
          @{username}
        </button>
      ))}
    </div>
  )}
</div>

    <div className="space-y-2">
  <label className="block text-sm font-medium">
    Hashtags
  </label>

  <div className="grid w-full grid-cols-[minmax(0,1fr)_44px] gap-2">
    <input
      type="text"
      placeholder="e.g. react"
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      className="h-11 min-w-0 w-full rounded-md border px-3 text-sm"
    />

    <button
      type="button"
      onClick={addTag}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-600 text-x\ text-white hover:bg-blue-700"
    >
      +
    </button>
  </div>

  {tags.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700"
        >
          #{tag}
        </span>
      ))}
    </div>
  )}
</div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {loading ? "Posting..." : "Create Post"}
          </button>

        </form>
      </div>
    </Mainlayout>
  );
}