import question from "../models/question.js";
import Post from "../models/post.js";

export const getAllTags = async (req, res) => {
  try {
    const [questionTags, postTags] = await Promise.all([
      question.aggregate([
        { $unwind: "$questiontags" },
        {
          $project: {
            tag: {
              $toLower: {
                $trim: { input: "$questiontags" },
              },
            },
          },
        },
        {
          $match: {
            tag: { $ne: "" },
          },
        },
        {
          $group: {
            _id: "$tag",
            count: { $sum: 1 },
          },
        },
      ]),

      Post.aggregate([
        { $unwind: "$hashtags" },
        {
          $project: {
            tag: {
              $toLower: {
                $trim: { input: "$hashtags" },
              },
            },
          },
        },
        {
          $match: {
            tag: { $ne: "" },
          },
        },
        {
          $group: {
            _id: "$tag",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const tagCountMap = {};

    [...questionTags, ...postTags].forEach(({ _id, count }) => {
      const tag = String(_id).replace(/^#/, "").trim();

      if (!tag) return;

      tagCountMap[tag] = (tagCountMap[tag] || 0) + count;
    });

    const tags = Object.entries(tagCountMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
      }));

    res.status(200).json({
      data: tags,
    });
  } catch (error) {
    console.error("Failed to fetch tags:", error);

    res.status(500).json({
      message: "Failed to fetch tags",
    });
  }
};

export const getTagContent = async (req, res) => {
  try {
    const { tag } = req.params;

    const normalizedTag = decodeURIComponent(tag)
      .replace(/^#/, "")
      .trim()
      .toLowerCase();

    if (!normalizedTag) {
      return res.status(400).json({
        message: "Tag is required",
      });
    }

    const [questions, posts] = await Promise.all([
      question.find({
        questiontags: {
          $regex: `^${normalizedTag}$`,
          $options: "i",
        },
      }),

      Post.find({
        hashtags: {
          $regex: `^${normalizedTag}$`,
          $options: "i",
        },
      }),
    ]);

    res.status(200).json({
      data: {
        questions,
        posts,
      },
    });
  } catch (error) {
    console.error("Failed to fetch tag content:", error);

    res.status(500).json({
      message: "Failed to fetch tag content",
    });
  }
};