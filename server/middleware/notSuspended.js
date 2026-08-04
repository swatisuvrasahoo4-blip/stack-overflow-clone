import User from "../models/auth.js";

const notSuspended = async (req, res, next) => {
  try {
    const user = await User.findById(req.userid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message:
          user.suspensionReason || "Your account has been suspended.",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export default notSuspended;