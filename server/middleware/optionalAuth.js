import jwt from "jsonwebtoken";

import LoginSession from "../models/loginSession.js";

const optionalAuth = async (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization;

  // Allow logged-out users
  if (!authHeader) {
    return next();
  }

  try {
    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decodedata = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const inactivityDays =
      Number(
        process.env
          .SESSION_INACTIVITY_DAYS
      ) || 3;

    const inactiveSince =
      new Date();

    inactiveSince.setDate(
      inactiveSince.getDate() -
        inactivityDays
    );

    const session =
      await LoginSession.findOne({
        userId: decodedata.id,
        sessionTokenHash:
          decodedata.sessionToken,
        isRevoked: false,
        lastActivityAt: {
          $gt: inactiveSince,
        },
        expiresAt: {
          $gt: new Date(),
        },
      });

    // Invalid or expired session behaves as logged out
    if (!session) {
      return next();
    }

    req.userid = decodedata.id;
    req.sessionToken =
      decodedata.sessionToken;
    req.sessionId = session._id;

    const now = new Date();

    session.lastActivityAt = now;

    const newExpiresAt =
      new Date(now);

    newExpiresAt.setDate(
      newExpiresAt.getDate() +
        inactivityDays
    );

    session.expiresAt =
      newExpiresAt;

    await session.save();

    return next();
  } catch (error) {
    console.log(
      "Optional auth error:",
      error
    );

    // Do not block public question viewing
    return next();
  }
};

export default optionalAuth;