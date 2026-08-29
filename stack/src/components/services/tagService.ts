import axiosInstance from "@/lib/axiosinstance";

const getTags = async () => {
  const res = await axiosInstance.get("/tags");
  return res.data?.data || [];
};

const getTagContent = async (tag: string) => {
  const res = await axiosInstance.get(
    `/tags/${encodeURIComponent(tag)}`
  );

  return res.data?.data || {
    questions: [],
    posts: [],
  };
};

export { getTagContent };
export default getTags;