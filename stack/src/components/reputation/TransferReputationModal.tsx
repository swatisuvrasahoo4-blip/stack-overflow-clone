import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { transferReputation } from "../services/reputationTransferService";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface TransferReputationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
}

const TransferReputationModal = ({
  open,
  onOpenChange,
  receiverId,
  receiverName,
}: TransferReputationModalProps) => {
  const {t} = useTranslation();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleTransfer = async () => {
    
  try {
    const points = Number(amount);

    if (!points || points <= 0) {
      alert(t("alert.please_enter_a_valid_reputation_amount"));
      return;
    }

    if (points > 50) {
      alert(t("alert.maximum_50_reputation_points_per_transaction"));
      return;
    }

    if (!reason.trim()) {
      alert(t("alert.please_enter_a_reason_for_the_transfer"));
      return;
    }

    const response = await transferReputation({
      receiverId,
      points,
      reason: reason.trim(),
    });

    alert(response.message || t("alert.reputation_transferred_successfully"));

    setAmount("");
    setReason("");
    onOpenChange(false);

  } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    alert(
      error.response?.data?.message ||
        t("alert.failed_to_transfer_reputation")
    );
  } else {
    alert(
      t("alert.failed_to_transfer_reputation")
    );
  }
}
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Transfer Reputation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">

          {/* Receiver */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Transfer to
            </label>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="font-medium text-gray-800">
                {receiverName}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label
              htmlFor="transferAmount"
              className="text-sm font-medium text-gray-700"
            >
              Reputation points
            </label>

            <Input
              id="transferAmount"
              type="number"
              min="1"
              max="50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter points (max 50)"
            />

            <p className="text-xs text-gray-500">
              Maximum 50 points per transaction.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label
              htmlFor="transferReason"
              className="text-sm font-medium text-gray-700"
            >
              Reason
            </label>

            <textarea
              id="transferReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you transferring reputation?"
              rows={3}
              maxLength={200}
              className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            />

            <div className="text-right text-xs text-gray-400">
              {reason.length}/200
            </div>
          </div>

          {/* Transfer button */}
          <Button
            type="button"
            onClick={handleTransfer}
            disabled={!amount || !reason.trim()}
            className="w-full flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Transfer Reputation
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferReputationModal;