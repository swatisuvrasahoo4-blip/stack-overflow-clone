import QuestionDetail from "@/components/QuestionDetail";
import Mainlayout from "@/layout/Mainlayout";

import { useRouter } from "next/router";

const QuestionPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const questionId = Array.isArray(id)
    ? id[0]
    : id;

  if (!router.isReady || !questionId) {
    return (
      <Mainlayout>
        {/* Loading state */}
        <div>Loading...</div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      {/* Question details */}
      <QuestionDetail
        questionId={questionId}
        key={questionId}
      />
    </Mainlayout>
  );
};

export default QuestionPage;