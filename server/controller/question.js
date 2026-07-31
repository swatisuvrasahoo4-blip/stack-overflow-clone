import mongoose from "mongoose";
import question from "../models/question.js";
import auth from "../models/auth.js"

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
    const allquestion = await question.find().sort({ askedon: -1 });
    res.status(200).json({ data: allquestion });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
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
      } else {
        questionDoc.downvote = questionDoc.downvote.filter(
          (id) => id !== String(userid)
        );
      }
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
 const questionData = await question.findById(id);

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