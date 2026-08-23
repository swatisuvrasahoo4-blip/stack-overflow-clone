import axios from "axios";

export const getIpLocation = async (ipAddress) => {
  try {
    // Local/private IPs cannot be meaningfully geolocated
    if (
      !ipAddress ||
      ipAddress === "127.0.0.1" ||
      ipAddress === "::1" ||
      ipAddress.startsWith("192.168.") ||
      ipAddress.startsWith("10.") ||
      ipAddress.startsWith("172.16.")
    ) {
      return "Unknown";
    }

    const response = await axios.get(
      `https://ipapi.co/${ipAddress}/json/`,
      {
        timeout: 3000,
      }
    );

    const { city, region, country_name } = response.data;

    if (!city && !region && !country_name) {
      return "Unknown";
    }

    return [city, region, country_name]
      .filter(Boolean)
      .join(", ");
  } catch (error) {
    console.error(
      "IP location lookup failed:",
      error.response?.data || error.message
    );

    return "Unknown";
  }
};