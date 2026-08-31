import axiosInstance from "@/lib/axiosinstance";

import type { Post } from "@/types/community";

export interface TagQuestion {
  _id: string;
  questiontitle: string;
  questionbody: string;
  questiontags: string[];
}

export interface TagPagination {
  currentPage: number;
  totalPages: number;
  totalQuestions: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TagContentResponse {
  questions: TagQuestion[];
  posts: Post[];
  pagination: TagPagination;
}

// Get all tags
export const getTags = async () => {
  const response =
    await axiosInstance.get(
      "/tags"
    );

  return (
    response.data?.data || []
  );
};

// Get content for a specific tag
export const getTagContent = async (
  tag: string,
  page = 1,
  limit = 5
): Promise<TagContentResponse> => {
  const response =
    await axiosInstance.get(
      `/tags/${encodeURIComponent(
        tag
      )}`,
      {
        params: {
          page,
          limit,
        },
      }
    );

  return (
    response.data?.data || {
      questions: [],
      posts: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalQuestions: 0,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  );
};