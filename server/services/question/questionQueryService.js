import mongoose from "mongoose";

import question from "../../models/question.js";

// Get all questions
export const getAllQuestionsService = async ({
  limit = 10,
  cursor = null,
}) => {
  const safeLimit = Math.min(
    parseInt(limit) || 10,
    50
  );

  let query = {};

  if (cursor) {
    const decodedCursor = JSON.parse(
      Buffer.from(
        cursor,
        "base64"
      ).toString("utf-8")
    );

    const cursorDate = new Date(
      decodedCursor.askedon
    );

    const cursorId = decodedCursor.id;

    if (
      Number.isNaN(cursorDate.getTime()) ||
      !cursorId ||
      !mongoose.Types.ObjectId.isValid(
        cursorId
      )
    ) {
      const error = new Error(
        "Invalid cursor"
      );

      error.status = 400;

      throw error;
    }

    query = {
      $or: [
        {
          askedon: {
            $lt: cursorDate,
          },
        },
        {
          askedon: cursorDate,
          _id: {
            $lt:
              new mongoose.Types.ObjectId(
                cursorId
              ),
          },
        },
      ],
    };
  }

  const questions = await question
    .find(query)
    .sort({
      askedon: -1,
      _id: -1,
    })
    .limit(safeLimit + 1);

  const hasMore =
    questions.length > safeLimit;

  const data = hasMore
    ? questions.slice(0, safeLimit)
    : questions;

  let nextCursor = null;

  if (hasMore && data.length > 0) {
    const lastQuestion =
      data[data.length - 1];

    nextCursor = Buffer.from(
      JSON.stringify({
        askedon:
          lastQuestion.askedon,
        id:
          lastQuestion._id.toString(),
      })
    ).toString("base64");
  }

  return {
    data,
    pagination: {
      limit: safeLimit,
      hasMore,
      nextCursor,
    },
  };
};

// Get question by ID
export const getQuestionByIdService =
  async (
    questionId,
    userId
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        questionId
      )
    ) {
      const error = new Error(
        "Question unavailable"
      );

      error.status = 400;

      throw error;
    }

    let questionData = null;

    if (userId) {
      const viewerId =
        String(userId);

      questionData =
        await question.findOneAndUpdate(
          {
            _id: questionId,
            viewedBy: {
              $ne: viewerId,
            },
          },
          {
            $addToSet: {
              viewedBy: viewerId,
            },
            $inc: {
              views: 1,
            },
          },
          {
            new: true,
          }
        );

      // User has already viewed this question
      if (!questionData) {
        questionData =
          await question.findById(
            questionId
          );
      }
    } else {
      questionData =
        await question.findById(
          questionId
        );
    }

    if (!questionData) {
      const error = new Error(
        "Question not found"
      );

      error.status = 404;

      throw error;
    }

    return questionData;
  };

// Search questions
export const searchQuestionsService =
  async ({
    search,
    cursor = null,
    limit = 10,
  }) => {
    const safeLimit = Math.min(
      Number(limit) || 10,
      50
    );

    if (
      !search ||
      !String(search).trim()
    ) {
      return {
        data: [],
        pagination: {
          limit: safeLimit,
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    const searchQuery =
      String(search).trim();

    const searchConditions = [
      {
        questiontitle: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        questionbody: {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        questiontags: {
          $regex: searchQuery,
          $options: "i",
        },
      },
    ];

    let query = {
      $or: searchConditions,
    };

    if (cursor) {
      const decodedCursor = JSON.parse(
        Buffer.from(
          cursor,
          "base64"
        ).toString("utf-8")
      );

      const cursorDate = new Date(
        decodedCursor.askedon
      );

      const cursorId =
        decodedCursor.id;

      if (
        Number.isNaN(
          cursorDate.getTime()
        ) ||
        !cursorId ||
        !mongoose.Types.ObjectId.isValid(
          cursorId
        )
      ) {
        const error = new Error(
          "Invalid cursor"
        );

        error.status = 400;

        throw error;
      }

      query = {
        $and: [
          {
            $or:
              searchConditions,
          },
          {
            $or: [
              {
                askedon: {
                  $lt:
                    cursorDate,
                },
              },
              {
                askedon:
                  cursorDate,
                _id: {
                  $lt:
                    new mongoose.Types.ObjectId(
                      cursorId
                    ),
                },
              },
            ],
          },
        ],
      };
    }

    const questions = await question
      .find(query)
      .sort({
        askedon: -1,
        _id: -1,
      })
      .limit(safeLimit + 1);

    const hasMore =
      questions.length > safeLimit;

    const data = hasMore
      ? questions.slice(
          0,
          safeLimit
        )
      : questions;

    let nextCursor = null;

    if (
      hasMore &&
      data.length > 0
    ) {
      const lastQuestion =
        data[data.length - 1];

      nextCursor = Buffer.from(
        JSON.stringify({
          askedon:
            lastQuestion.askedon,
          id:
            lastQuestion._id.toString(),
        })
      ).toString("base64");
    }

    return {
      data,
      pagination: {
        limit: safeLimit,
        hasMore,
        nextCursor,
      },
    };
  };