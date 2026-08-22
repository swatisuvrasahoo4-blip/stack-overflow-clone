import TrustedDevice from "../models/trustedDevice.js";

export const isTrustedDevice = async (userId, deviceId) => {
  const trustedDevice = await TrustedDevice.findOne({
    userId,
    deviceId,
    isRevoked: false,
  });

  return !!trustedDevice;
};

export const trustDevice = async ({
  userId,
  deviceId,
  browser,
  operatingSystem,
  deviceType,
}) => {
  const trustedDevice = await TrustedDevice.findOneAndUpdate(
    {
      userId,
      deviceId,
    },
    {
      $set: {
        browser,
        operatingSystem,
        deviceType,
        isRevoked: false,
        trustedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return trustedDevice;
};

export const revokeTrustedDevice = async (userId, deviceId) => {
  return await TrustedDevice.findOneAndUpdate(
    {
      userId,
      deviceId,
    },
    {
      $set: {
        isRevoked: true,
      },
    },
    {
      new: true,
    }
  );
};