import { useState } from "react";

import axios from "axios";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { transferReputation } from "../services/reputationTransferService";

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
  const { t } =
    useTranslation("reputation");

  const [amount, setAmount] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleTransfer =
    async () => {
      const points =
        Number(amount);

      if (
        !points ||
        points <= 0
      ) {
        alert(
          t(
            "messages.enter_valid_amount"
          )
        );

        return;
      }

      if (points > 50) {
        alert(
          t(
            "messages.maximum_50_points"
          )
        );

        return;
      }

      if (!reason.trim()) {
        alert(
          t(
            "messages.enter_transfer_reason"
          )
        );

        return;
      }

      try {
        setLoading(true);

        await transferReputation({
          receiverId,
          points,
          reason:
            reason.trim(),
        });

        alert(
          t(
            "messages.transfer_success"
          )
        );

        setAmount("");
        setReason("");
        onOpenChange(false);
      } catch (error: unknown) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Failed to transfer reputation:",
            error.response?.data
              ?.message
          );
        } else {
          console.error(
            "Failed to transfer reputation:",
            error
          );
        }

        alert(
          t(
            "messages.transfer_failed"
          )
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t(
              "transfer.title"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t(
                "transfer.transfer_to"
              )}
            </label>

            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="font-medium text-gray-800">
                {
                  receiverName
                }
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="transferAmount"
              className="text-sm font-medium text-gray-700"
            >
              {t(
                "transfer.reputation_points"
              )}
            </label>

            <Input
              id="transferAmount"
              type="number"
              min="1"
              max="50"
              value={amount}
              onChange={(
                event
              ) =>
                setAmount(
                  event.target
                    .value
                )
              }
              placeholder={t(
                "transfer.points_placeholder"
              )}
            />

            <p className="text-xs text-gray-500">
              {t(
                "transfer.maximum_points"
              )}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="transferReason"
              className="text-sm font-medium text-gray-700"
            >
              {t(
                "labels.reason"
              )}
            </label>

            <textarea
              id="transferReason"
              value={reason}
              onChange={(
                event
              ) =>
                setReason(
                  event.target
                    .value
                )
              }
              placeholder={t(
                "transfer.reason_placeholder"
              )}
              rows={3}
              maxLength={200}
              className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
            />

            <div className="text-right text-xs text-gray-400">
              {reason.length}
              /200
            </div>
          </div>

          <Button
            type="button"
            onClick={() =>
              void handleTransfer()
            }
            disabled={
              loading ||
              !amount ||
              !reason.trim()
            }
            className="flex w-full items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />

            {loading
              ? t(
                  "status.transferring"
                )
              : t(
                  "actions.transfer_reputation"
                )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferReputationModal;