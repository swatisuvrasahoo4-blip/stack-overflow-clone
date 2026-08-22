import jwt from "jsonwebtoken";
import LoginSession from "../models/loginSession.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedata = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = decodedata.id;
req.sessionToken = decodedata.sessionToken;

    const inactivityDays =
  Number(process.env.SESSION_INACTIVITY_DAYS) || 3;

const inactiveSince = new Date();
inactiveSince.setDate(inactiveSince.getDate() - inactivityDays);

const session = await LoginSession.findOne({
  userId: decodedata.id,
  sessionTokenHash: decodedata.sessionToken,
  isRevoked: false,
  lastActivityAt: { $gt: inactiveSince },
  expiresAt: { $gt: new Date() },
});

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked",
      });
    }

    const now = new Date();

session.lastActivityAt = now;

const newExpiresAt = new Date(now);
newExpiresAt.setDate(
  newExpiresAt.getDate() + inactivityDays
);

session.expiresAt = newExpiresAt;

await session.save();

    req.userid = decodedata.id;
    req.sessionId = session._id;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default auth;