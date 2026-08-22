import LoginSession from "../models/loginSession.js";

export const getLoginActivity = async (req, res) => {
  try {
    const sessions = await LoginSession.find()
      .populate("userId", "name username email")
      .sort({ loginAt: -1 });

    const activity = sessions.map((session) => ({
      _id: session._id,
      user: session.userId
        ? {
            _id: session.userId._id,
            name: session.userId.name,
            username: session.userId.username,
            email: session.userId.email,
          }
        : null,
      browser: session.browser,
      operatingSystem: session.operatingSystem,
      deviceType: session.deviceType,
      ipAddress: session.ipAddress,
      loginAt: session.loginAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
      isRevoked: session.isRevoked,
      isTrustedDevice: session.isTrustedDevice,
    }));

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Get login activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch login activity",
    });
  }
};