import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransferReputationModal from "./TransferReputationModal";

interface TransferReputationButtonProps {
  receiverId: string;
  receiverName: string;
}

const TransferReputationButton = ({
  receiverId,
  receiverName,
}: TransferReputationButtonProps) => {
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  return (
    <>
      {/* Transfer reputation button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsTransferOpen(true)}
        className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        <Send className="h-4 w-4" />
        <span>Transfer Reputation</span>
      </Button>

      {/* Transfer reputation modal */}
      <TransferReputationModal
        open={isTransferOpen}
        onOpenChange={setIsTransferOpen}
        receiverId={receiverId}
        receiverName={receiverName}
      />
    </>
  );
};

export default TransferReputationButton;