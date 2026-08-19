import {UAParser} from "ua-parser-js";

export const getDeviceInfo = (userAgent) => {
  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser().name || "Unknown";
  const operatingSystem = parser.getOS().name || "Unknown";

  let deviceType = "unknown";

  if (parser.getDevice().type === "mobile") {
    deviceType = "mobile";
  } else if (parser.getDevice().type === "tablet") {
    deviceType = "tablet";
  } else if (!parser.getDevice().type) {
    deviceType = "desktop";
  }

  return {
    browser,
    operatingSystem,
    deviceType,
  };
};