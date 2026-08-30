import mongoose from "mongoose";
import question from "../models/question.js";
import auth from "../models/auth.js"
import { updateReputation } from "../services/reputationServices.js";

export const Askquestion = async (req, res) => {
  const { postquestiondata } = req.body;
  const user = await auth.findById(req.userid);
  const postques = new question({ 
    ...postquestiondata,
    userid: req.userid,
    userposted: user.name,
  });
  try {
    await postques.save();
    res.status(200).json({ data: postques });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

export const getallquestion = async (req, res) => {
  try {
    const limit = Math.min(
      parseInt(req.query.limit) || 10,
      50
    );

    const cursor = req.query.cursor || null;

    let query = {};

    if (cursor) {
      try {
        const decodedCursor = JSON.parse(
          Buffer.from(cursor, "base64").toString("utf-8")
        );

        const cursorDate = new Date(
          decodedCursor.askedon
        );

        const cursorId =
          decodedCursor.id;

        if (
          !cursorDate ||
          !cursorId ||
          !mongoose.Types.ObjectId.isValid(cursorId)
        ) {
          return res.status(400).json({
            message: "Invalid cursor",
          });
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
                $lt: new mongoose.Types.ObjectId(
                  cursorId
                ),
              },
            },
          ],
        };
      } catch (error) {
        return res.status(400).json({
          message: "Invalid cursor",
        });
      }
    }

    const questions = await question
      .find(query)
      .sort({
        askedon: -1,
        _id: -1,
      })
      .limit(limit + 1);

    const hasMore =
      questions.length > limit;

    const data = hasMore
      ? questions.slice(0, limit)
      : questions;

    let nextCursor = null;

    if (hasMore && data.length > 0) {
      const lastQuestion =
        data[data.length - 1];

      const cursorData = {
        askedon:
          lastQuestion.askedon,
        id:
          lastQuestion._id.toString(),
      };

      nextCursor = Buffer.from(
        JSON.stringify(cursorData)
      ).toString("base64");
    }

    return res.status(200).json({
      data,
      pagination: {
        limit,
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error(
      "Get all questions error:",
      error
    );

    return res.status(500).json({
      message: "Something went wrong..",
    });
  }
};
export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    await question.findByIdAndDelete(_id);
    res.status(200).json({ message: "question deleted" });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const votequestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value ,userid} = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    const questionDoc = await question.findById(_id);
    const upindex = questionDoc.upvote.findIndex((id) => id === String(userid));
    const downindex = questionDoc.downvote.findIndex(
      (id) => id === String(userid)
    );
    if (value === "upvote") {
      if (downindex !== -1) {
  questionDoc.downvote = questionDoc.downvote.filter(
    (id) => id !== String(userid)
  );

  await updateReputation({
    userId: questionDoc.userid,
    points: 2,
    type: "downvote",
    reason: "Question downvote removed",
    relatedId: questionDoc._id,
  });
}
      if (upindex === -1) {
        questionDoc.upvote.push(userid);
      } else {
        questionDoc.upvote = questionDoc.upvote.filter((id) => id !== String(userid));
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        questionDoc.upvote = questionDoc.upvote.filter((id) => id !== String(userid));
      }
      if (downindex === -1) {
  questionDoc.downvote.push(userid);

  await updateReputation({
    userId: questionDoc.userid,
    points: -2,
    type: "downvote",
    reason: "Question received a downvote",
    relatedId: questionDoc._id,
  });
} else {
  questionDoc.downvote = questionDoc.downvote.filter(
    (id) => id !== String(userid)
  );

  await updateReputation({
    userId: questionDoc.userid,
    points: 2,
    type: "downvote",
    reason: "Question downvote removed",
    relatedId: questionDoc._id,
  });
}
    }
    // Give +2 reputation once when question reaches 10 upvotes
if (
  questionDoc.upvote.length >= 10 &&
  !questionDoc.tenUpvotesRewarded
) {
  await updateReputation({
    userId: questionDoc.userid,
    points: 2,
    type: "question_upvotes",
    reason: "Question received 10 upvotes",
    relatedId: questionDoc._id,
  });

  questionDoc.tenUpvotesRewarded = true;
}

    const questionvote = await question.findByIdAndUpdate(_id, questionDoc, { new: true });

    res.status(200).json({ data: questionvote });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};

export const getQuestionById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Question unavailable",
    });
  }

  try {
 const questionData = await question.findByIdAndUpdate(
   id,
   { $inc: { views: 1 } },
   { new: true }
 );

if (!questionData) {
  return res.status(404).json({
    message: "Question not found",
  });
}

    if (!questionData) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    return res.status(200).json({
      data: questionData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const answerQuestion = async (req, res) => {
  const { id } = req.params;
  const { answerbody, useranswered, userid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Question unavailable",
    });
  }

  try {
    const questionData = await question.findById(id);

    if (!questionData) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    questionData.answer.push({
      answerbody,
      useranswered,
      userid,
    });

    questionData.noofanswer = questionData.answer.length;

    await questionData.save();

    await updateReputation({
  userId: userid,
  points: 5,
  type: "answer_posted",
  reason: "Posted an answer",
  relatedId: id,
});

    return res.status(200).json({
      data: questionData,
      message: "Answer added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const deleteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;

  try {
    const questionData = await question.findById(questionId);

    if (!questionData) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    questionData.answer = questionData.answer.filter(
      (answer) => String(answer._id) !== String(answerId)
    );

    questionData.noofanswer = questionData.answer.length;

    await questionData.save();

    return res.status(200).json({
      message: "Answer deleted successfully",
      question: questionData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete answer",
    });
  }
};
export const editQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const { questiontitle, questionbody, questiontags } = req.body;

    const updatedQuestion = await question.findByIdAndUpdate(
      id,
      {
        questiontitle,
        questionbody,
        questiontags,
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const questionData = await question.findById(id);

    if (!questionData) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (questionData.userid !== req.userid) {
      return res.status(403).json({
        message: "You can only delete your own question",
      });
    }

    await question.findByIdAndDelete(id);

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const searchQuestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !String(q).trim()) {
      return res.status(200).json({
        data: [],
      });
    }

    const searchQuery = String(q).trim();

    const questions = await question
      .find({
        $or: [
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
        ],
      })
      .sort({ askedon: -1 });

    res.status(200).json({
      data: questions,
    });
  } catch (error) {
    console.error("Question search error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};