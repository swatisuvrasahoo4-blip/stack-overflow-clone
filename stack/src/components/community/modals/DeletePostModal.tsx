import { useTranslation } from "react-i18next";

interface DeletePostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const DeletePostModal = ({
  open,
  onClose,
  onConfirm,
}: DeletePostModalProps) => {
  const { t } =
    useTranslation("community");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          {t(
            "delete_post.title"
          )}
        </h2>

        <p className="mt-2 text-gray-600">
          {t(
            "delete_post.confirmation"
          )}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            {t(
              "actions.no"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            {t(
              "actions.yes_delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;