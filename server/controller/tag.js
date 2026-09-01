import question from "../models/question.js";
import Post from "../models/post.js";

// Get all tags with pagination
export const getAllTags = async (
  req,
  res
) => {
  try {
    const page = Math.max(
      Number.parseInt(
        req.query.page,
        10
      ) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(
          req.query.limit,
          10
        ) || 12,
        1
      ),
      50
    );

    const [
      questionTags,
      postTags,
    ] = await Promise.all([
      question.aggregate([
        {
          $unwind:
            "$questiontags",
        },
        {
          $project: {
            tag: {
              $toLower: {
                $trim: {
                  input:
                    "$questiontags",
                },
              },
            },
          },
        },
        {
          $match: {
            tag: {
              $ne: "",
            },
          },
        },
        {
          $group: {
            _id: "$tag",
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Post.aggregate([
        {
          $unwind:
            "$hashtags",
        },
        {
          $project: {
            tag: {
              $toLower: {
                $trim: {
                  input:
                    "$hashtags",
                },
              },
            },
          },
        },
        {
          $match: {
            tag: {
              $ne: "",
            },
          },
        },
        {
          $group: {
            _id: "$tag",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const tagCountMap = {};

    [
      ...questionTags,
      ...postTags,
    ].forEach(
      ({ _id, count }) => {
        const tag = String(_id)
          .replace(/^#/, "")
          .trim();

        if (!tag) {
          return;
        }

        tagCountMap[tag] =
          (tagCountMap[tag] ||
            0) + count;
      }
    );

    const allTags =
      Object.entries(
        tagCountMap
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .map(
          ([name, count]) => ({
            name,
            count,
          })
        );

    const totalTags =
      allTags.length;

    const totalPages =
      Math.ceil(
        totalTags / limit
      );

    const skip =
      (page - 1) * limit;

    const tags =
      allTags.slice(
        skip,
        skip + limit
      );

    return res
      .status(200)
      .json({
        data: {
          tags,
          pagination: {
            currentPage: page,
            totalPages,
            totalTags,
            limit,
            hasNextPage:
              page < totalPages,
            hasPreviousPage:
              page > 1,
          },
        },
      });
  } catch (error) {
    console.error(
      "Failed to fetch tags:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to fetch tags",
      });
  }
};

// Get content for a specific tag
export const getTagContent =
  async (
    req,
    res
  ) => {
    try {
      const { tag } =
        req.params;

      const normalizedTag =
        decodeURIComponent(tag)
          .replace(/^#/, "")
          .trim()
          .toLowerCase();

      if (!normalizedTag) {
        return res
          .status(400)
          .json({
            message:
              "Tag is required",
          });
      }

      // Question pagination
      const page =
        Math.max(
          Number.parseInt(
            req.query.page,
            10
          ) || 1,
          1
        );

      const limit =
        Math.min(
          Math.max(
            Number.parseInt(
              req.query.limit,
              10
            ) || 5,
            1
          ),
          50
        );

      const skip =
        (page - 1) *
        limit;

      // Tag filters
      const questionFilter = {
        questiontags: {
          $regex:
            `^${normalizedTag}$`,
          $options: "i",
        },
      };

      const postFilter = {
        hashtags: {
          $regex:
            `^${normalizedTag}$`,
          $options: "i",
        },
      };

      const [
        questions,
        totalQuestions,
        posts,
      ] =
        await Promise.all([
          // Current question page
          question
            .find(
              questionFilter
            )
            .sort({
              _id: -1,
            })
            .skip(skip)
            .limit(limit),

          // Total question count
          question.countDocuments(
            questionFilter
          ),

          // Community posts
          Post.find(
            postFilter
          ).sort({
            _id: -1,
          }),
        ]);

      const totalPages =
        Math.ceil(
          totalQuestions /
            limit
        );

      return res
        .status(200)
        .json({
          data: {
            questions,
            posts,
            pagination: {
              currentPage:
                page,
              totalPages,
              totalQuestions,
              limit,
              hasNextPage:
                page <
                totalPages,
              hasPreviousPage:
                page > 1,
            },
          },
        });
    } catch (error) {
      console.error(
        "Failed to fetch tag content:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Failed to fetch tag content",
        });
    }
  };