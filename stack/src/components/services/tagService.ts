import axiosInstance from "@/lib/axiosinstance";

import type { Post } from "@/types/community";
import type { Tag } from "@/types/tag";

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

export interface TagsPagination {
  currentPage: number;
  totalPages: number;
  totalTags: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TagsResponse {
  tags: Tag[];
  pagination: TagsPagination;
}

export interface TagContentResponse {
  questions: TagQuestion[];
  posts: Post[];
  pagination: TagPagination;
}

// Get tags with pagination
export const getTags = async (
  page = 1,
  limit = 12
): Promise<TagsResponse> => {
  const response =
    await axiosInstance.get(
      "/tags",
      {
        params: {
          page,
          limit,
        },
      }
    );

  return (
    response.data?.data || {
      tags: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalTags: 0,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
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