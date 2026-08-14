import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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
    <Button variant="outline" 
    onClick={() => setIsTransferOpen(true)}
    className="
  flex items-center justify-center gap-2
  px-5 py-2
  bg-white
  text-gray-700
  border border-gray-300
  rounded-md
  hover:bg-gray-50
  hover:border-gray-400
  transition-colors
  font-medium
">
        <Send className="w-4 h-4" />
      <span>Transfer Reputation</span>
    </Button>
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