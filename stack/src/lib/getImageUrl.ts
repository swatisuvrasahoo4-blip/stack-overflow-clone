export const getImageUrl = (
  imagePath?: string | null
): string => {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000";

  const normalizedPath = imagePath.replace(/\\/g, "/");

  return `${backendUrl}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
};