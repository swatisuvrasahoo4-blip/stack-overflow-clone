import question from "../models/question.js";
import Subscription from "../models/subscription.js";

const questionLimit = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
  userid: req.userid,
  status: "Active",
  renewaldate: { $gt: new Date() },
});

    let plan = "Free";
    let limit = 1;

    if (subscription) {
      plan = subscription.plan;

      if (plan === "Bronze") limit = 5;
      else if (plan === "Silver") limit = 15;
      else if (plan === "Gold") limit = Infinity;
    }

    if (limit === Infinity) {
      return next();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalQuestions = await question.countDocuments({
      userid: req.userid,
      askedon: {
        $gte: today,
      },
    });

    if (totalQuestions >= limit) {
  return res.status(403).json({
    success: false,
    message: `You have reached today's limit of ${limit} question${limit > 1 ? "s" : ""} for your ${plan} plan. Please try again tomorrow or upgrade your subscription.`,
  });
}

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export default questionLimit;