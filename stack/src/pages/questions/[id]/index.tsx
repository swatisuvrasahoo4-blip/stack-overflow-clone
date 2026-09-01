import QuestionDetail from "@/components/QuestionDetail";

import Mainlayout from "@/layout/Mainlayout";

import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

const QuestionPage = () => {
  const router = useRouter();

  const { t } =
    useTranslation("questions");

  const { id } =
    router.query;

  const questionId = Array.isArray(id)
    ? id[0]
    : id;

  if (!router.isReady || !questionId) {
    return (
      <Mainlayout>
        {/* Loading state */}
        <div>
          {t(
            "status.loading_question"
          )}
        </div>
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