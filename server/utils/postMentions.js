import auth from "../models/auth.js";

// Normalize mentioned usernames
export const normalizeMentionUsernames = (mentions) => {
  let mentionUsernames = [];

  if (Array.isArray(mentions)) {
    mentionUsernames = mentions;
  } else if (typeof mentions === "string") {
    mentionUsernames = mentions.split(",");
  }

  return [
    ...new Set(
      mentionUsernames
        .map((username) =>
          username
            .trim()
            .replace(/^@/, "")
            .toLowerCase()
        )
        .filter(Boolean)
    ),
  ];
};

// Get mentioned users
export const getMentionedUsers = async (mentions) => {
  const mentionUsernames =
    normalizeMentionUsernames(mentions);

  if (mentionUsernames.length === 0) {
    return [];
  }

  const mentionedUsers = await auth.find({
    username: {
      $in: mentionUsernames,
    },
  });

  return mentionedUsers.map((person) => ({
    userId: person._id,
    username: person.username,
    name: person.name,
  }));
};