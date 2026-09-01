import { useTranslation } from "react-i18next";

interface DeleteReplyModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const DeleteReplyModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteReplyModalProps) => {
  const { t } = useTranslation("community");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        {/* Modal content */}

        <h2 className="text-lg font-semibold">
          {t("delete_reply.title")}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t("delete_reply.confirmation")}
        </p>

        {/* Modal actions */}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            {t("actions.cancel")}
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            {t("actions.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReplyModal;