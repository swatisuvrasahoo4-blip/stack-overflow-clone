"use client";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import type { User } from "@/types/community";

interface PostCommentInputProps {
  postId: string;
  user: User | null;

  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;

  activeCommentPost: string | null;

  handleComment: (
    postId: string
  ) => Promise<void>;
}

const PostCommentInput = ({
  postId,
  user,
  commentText,
  setCommentText,
  activeCommentPost,
  handleComment,
}: PostCommentInputProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (activeCommentPost !== postId) {
    return null;
  }

  const handleCommentSubmit = () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      void router.push("/auth");
      return;
    }

    const reputation = Number(
      user.reputation ?? 0
    );

    if (reputation < 50) {
      alert(
        t(
          `alert.you_need_atleast_50_reputation_points_to_comment_your_current_reputation_is, ${reputation}.`
        )
      );

      return;
    }

    void handleComment(postId);
  };

  return (
    <div className="mt-4">
      {/* Comment input */}
      <textarea
        onClick={(event) =>
          event.stopPropagation()
        }
        value={commentText}
        onChange={(event) =>
          setCommentText(event.target.value)
        }
        placeholder="Write a comment..."
        className="w-full rounded-lg border p-2"
      />

      {/* Submit comment */}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleCommentSubmit();
        }}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        {t("community.comment")}
      </button>
    </div>
  );
};

export default PostCommentInput;