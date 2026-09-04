import question from "../models/question.js";
import Subscription from "../models/subscription.js";

// Get current question limit information
const getQuestionLimitInfo = async (userId) => {
  const subscription = await Subscription.findOne({
    userid: userId,
    status: "Active",
    renewaldate: {
      $gt: new Date(),
    },
  });

  let plan = "Free";
  let limit = 1;

  if (subscription) {
    plan = subscription.plan;

    if (plan === "Bronze") {
      limit = 5;
    } else if (plan === "Silver") {
      limit = 15;
    } else if (plan === "Gold") {
      limit = Infinity;
    }
  }

  if (limit === Infinity) {
    return {
      allowed: true,
      plan,
      limit: null,
      totalQuestions: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalQuestions =
    await question.countDocuments({
      userid: userId,
      askedon: {
        $gte: today,
      },
    });

  return {
    allowed:
      totalQuestions < limit,
    plan,
    limit,
    totalQuestions,
  };
};

// Check limit before opening Ask Question page
export const getQuestionLimitStatus =
  async (req, res) => {
    try {
      const limitInfo =
        await getQuestionLimitInfo(
          req.userid
        );

      return res.status(200).json({
        success: true,
        ...limitInfo,
      });
    } catch (error) {
      console.error(
        "Question limit check failed:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong.",
      });
    }
  };

// Protect question creation
const questionLimit = async (
  req,
  res,
  next
) => {
  try {
    const limitInfo =
      await getQuestionLimitInfo(
        req.userid
      );

    if (!limitInfo.allowed) {
      const {
        plan,
        limit,
      } = limitInfo;

      return res
        .status(403)
        .json({
          success: false,
          message: `You have reached today's limit of ${limit} question${limit > 1 ? "s" : ""} for your ${plan} plan. Please try again tomorrow or upgrade your subscription.`,
        });
    }

    next();
  } catch (error) {
    console.error(
      "Question limit check failed:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Something went wrong.",
      });
  }
};

export default questionLimit;