export const extractHashtags = (content = "", providedHashtags = []) => {
  const hashtagsFromContent =
    content.match(/#[a-zA-Z0-9_+-]+/g)?.map((tag) =>
      tag.substring(1).toLowerCase()
    ) || [];

  let manualHashtags = [];

  if (Array.isArray(providedHashtags)) {
    manualHashtags = providedHashtags;
  } else if (typeof providedHashtags === "string") {
    manualHashtags = providedHashtags.split(",");
  }

  manualHashtags = manualHashtags
    .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
    .filter(Boolean);

  return [...new Set([...hashtagsFromContent, ...manualHashtags])];
};