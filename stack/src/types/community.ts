export interface Mention {
  userId?: string;
  username?: string;
  name?: string;
}

export interface Reply {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  replies?: Reply[];
}

export interface Post {
  _id: string;

  content: string;
  createdAt: string;

  authorId?: string;
  authorName?: string;

  userId?: string;
  userid?: string;

  postType?: string;

  isFeatured?: boolean;
  isEdited?: boolean;

  projectTitle?: string;
  projectLink?: string;

  achievementTitle?: string;
  achievementDescription?: string;

  image?: string;
  codeSnippet?: string;

  hashtags?: string[] | string;

  likes?: string[];
  comments?: Comment[];

  mentions?: Mention[];

  isBookmarked?: boolean;
}

export interface User {
  _id?: string;
  id?: string;
  userId?: string;

  name?: string;
  username?: string;
  email?: string;

  reputation?: number;

  bookmarks?: string[];
}