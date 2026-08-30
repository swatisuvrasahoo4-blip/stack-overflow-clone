export interface Answer {
  _id: string;
  answerbody: string;
  userid: string;
  useranswered: string;
  answeredon?: string;
  upvote: string[];
  downvote: string[];
  isAccepted?: boolean;
}

export interface Question {
  _id: string;
  questiontitle: string;
  questionbody: string;
  userid: string;
  userposted: string;
  askedon?: string;
  questiontags: string[];
  upvote: string[];
  downvote: string[];
  answer: Answer[];
  noofanswer?: number;
  isBookmarked?: boolean;
  isClosed?: boolean;

  // Required by VoteToClose
  tenUpvotesRewarded?: boolean;
  views?: number;
}