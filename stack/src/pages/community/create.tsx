import React, { useState } from "react";
import { useRouter } from "next/router";
import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import { createPost } from "@/components/services/communityService";
export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState({
    content: "",
    postType: "Technical Update",
    image: "",
    codeSnippet: "",
    hashtags: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      await createPost({
  authorId: user?._id,
  authorName: user?.name,
  content: form.content,
  postType: form.postType,
  image: form.image,
  codeSnippet: form.codeSnippet,
  hashtags: form.hashtags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
});

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

  return (
    <Mainlayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          Create Community Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <textarea
            name="content"
            rows={5}
            placeholder="Share something with the community..."
            value={form.content}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />

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

          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <textarea
            name="codeSnippet"
            rows={4}
            placeholder="Code Snippet (optional)"
            value={form.codeSnippet}
            onChange={handleChange}
            className="w-full border rounded p-3 font-mono"
          />

          <input
            type="text"
            name="hashtags"
            placeholder="e.g. react, nextjs, mongodb"
            value={form.hashtags}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

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