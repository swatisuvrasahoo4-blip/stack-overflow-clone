import user from "../models/auth.js";

const admin = async (req, res, next) => {
  try {
    const adminUser = await user.findById(req.userid);
 
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed.",
    });
  }
};

export default admin;