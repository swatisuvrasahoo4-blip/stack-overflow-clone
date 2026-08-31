import { useState } from "react";

import type { Post } from "@/types/community";

const useEditPostState = () => {
  const [
    editingPost,
    setEditingPost,
  ] = useState<Post | null>(
    null
  );

  const [
    editContent,
    setEditContent,
  ] = useState("");

  const [
    editHashtags,
    setEditHashtags,
  ] = useState("");

  const [
    editTagInput,
    setEditTagInput,
  ] = useState("");

  const [
    editImage,
    setEditImage,
  ] = useState<File | null>(
    null
  );

  const [
    editProjectTitle,
    setEditProjectTitle,
  ] = useState("");

  const [
    editProjectLink,
    setEditProjectLink,
  ] = useState("");

  const [
    editAchievementTitle,
    setEditAchievementTitle,
  ] = useState("");

  const [
    editAchievementDescription,
    setEditAchievementDescription,
  ] = useState("");

  const [
    editCodeSnippet,
    setEditCodeSnippet,
  ] = useState("");

  return {
    editingPost,
    setEditingPost,

    editContent,
    setEditContent,

    editHashtags,
    setEditHashtags,

    editTagInput,
    setEditTagInput,

    editImage,
    setEditImage,

    editProjectTitle,
    setEditProjectTitle,

    editProjectLink,
    setEditProjectLink,

    editAchievementTitle,
    setEditAchievementTitle,

    editAchievementDescription,
    setEditAchievementDescription,

    editCodeSnippet,
    setEditCodeSnippet,
  };
};

export default useEditPostState;