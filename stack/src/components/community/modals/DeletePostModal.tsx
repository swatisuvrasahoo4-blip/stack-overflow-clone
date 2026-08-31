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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        {/* Modal content */}

        <h2 className="text-lg font-semibold">
          Delete Post
        </h2>

        <p className="mt-2 text-gray-600">
          Are you sure you want to delete this post?
        </p>

        {/* Modal actions */}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            No
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;