import Post from "../../models/post.js";

// Get all community posts
export const getAllPostsService = async (req) => {
  const limit = Math.min(
    Number(req.query.limit) || 10,
    50
  );

  const {
    feed = "trending",
    type,
    followingIds,
    cursor,
  } = req.query;

  const query = {};

  if (type) {
    query.postType = type;
  }

  // Filter following feed
  if (feed === "following") {
    const ids = (followingIds || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    query.authorId = {
      $in: ids,
    };
  }

  // Decode cursor
  let decodedCursor = null;

  if (cursor) {
    decodedCursor = JSON.parse(
      Buffer.from(
        cursor,
        "base64"
      ).toString("utf-8")
    );
  }

  // Apply cursor condition
  if (decodedCursor) {
    query.$or = [
      {
        createdAt: {
          $lt: new Date(
            decodedCursor.createdAt
          ),
        },
      },
      {
        createdAt: new Date(
          decodedCursor.createdAt
        ),
        _id: {
          $lt: decodedCursor._id,
        },
      },
    ];
  }

  // Fetch one extra post
  const posts = await Post.find(query)
    .sort({
      createdAt: -1,
      _id: -1,
    })
    .limit(limit + 1);

  const hasMore =
    posts.length > limit;

  const pageItems = hasMore
    ? posts.slice(0, limit)
    : posts;

  let nextCursor = null;

  if (
    hasMore &&
    pageItems.length > 0
  ) {
    const last =
      pageItems[
        pageItems.length - 1
      ];

    nextCursor = Buffer.from(
      JSON.stringify({
        createdAt:
          last.createdAt,
        _id:
          last._id,
      })
    ).toString("base64");
  }

  return {
    success: true,
    data: pageItems,
    pagination: {
      hasMore,
      nextCursor,
    },
  };
};

// Search community posts
export const searchPostsService = async (req) => {
  const {
    q,
    type,
    cursor,
  } = req.query;

  const limit = Math.min(
    Number(req.query.limit) || 10,
    50
  );

  if (
    !q ||
    !String(q).trim()
  ) {
    return {
      success: true,
      data: [],
      pagination: {
        hasMore: false,
        nextCursor: null,
      },
    };
  }

  const searchQuery =
    String(q).trim();

  const query = {
    $or: [
      {
        content: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        hashtags: {
          $regex: searchQuery,
          $options: "i",
        },
      },
    ],
  };

  // Apply post type filter
  if (
    type &&
    type !== "All"
  ) {
    query.postType =
      type;
  }

  // Decode cursor
  let decodedCursor =
    null;

  if (cursor) {
    try {
      decodedCursor =
        JSON.parse(
          Buffer.from(
            cursor,
            "base64"
          ).toString(
            "utf-8"
          )
        );
    } catch {
      const error =
        new Error(
          "Invalid cursor"
        );

      error.status = 400;
      throw error;
    }
  }

  // Apply cursor condition
  if (
    decodedCursor
  ) {
    const cursorCondition =
      [
        {
          createdAt: {
            $lt: new Date(
              decodedCursor.createdAt
            ),
          },
        },
        {
          createdAt:
            new Date(
              decodedCursor.createdAt
            ),
          _id: {
            $lt:
              decodedCursor._id,
          },
        },
      ];

    query.$and = [
      {
        $or:
          query.$or,
      },
      {
        $or:
          cursorCondition,
      },
    ];

    delete query.$or;
  }

  // Fetch one extra post
  const posts =
    await Post.find(
      query
    )
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(
        limit + 1
      );

  const hasMore =
    posts.length > limit;

  const data =
    hasMore
      ? posts.slice(
          0,
          limit
        )
      : posts;

  let nextCursor =
    null;

  if (
    hasMore &&
    data.length > 0
  ) {
    const last =
      data[
        data.length -
          1
      ];

    nextCursor =
      Buffer.from(
        JSON.stringify({
          createdAt:
            last.createdAt,
          _id:
            last._id.toString(),
        })
      ).toString(
        "base64"
      );
  }

  return {
    success: true,
    data,
    pagination: {
      limit,
      hasMore,
      nextCursor,
    },
  };
};