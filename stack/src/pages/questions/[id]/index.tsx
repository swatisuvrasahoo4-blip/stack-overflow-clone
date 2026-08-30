import QuestionDetail from "@/components/QuestionDetail";
import Mainlayout from "@/layout/Mainlayout";
import { useRouter } from "next/router";
import React from "react";

const QuestionPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const questionId = Array.isArray(id)
    ? id[0]
    : id;

  const handleBack = (): void => {
    void router.push(
      "/questions",
      undefined,
      { scroll: false }
    );
  };

  if (!router.isReady || !questionId) {
    return (
      <Mainlayout>
        <div>Loading...</div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div>
        <QuestionDetail
          questionId={questionId}
          key={questionId}
        />
      </div>
    </Mainlayout>
  );
};

export default QuestionPage;