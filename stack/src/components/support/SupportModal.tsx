"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createSupportRequest } from "@/components/services/supportService";
import { getSubscription } from "../services/subscriptionService";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportModal = ({
  open,
  onOpenChange,
}: SupportModalProps) => {
  const router = useRouter();

  const { t } =
    useTranslation("support");

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [currentPlan, setCurrentPlan] =
    useState("Free");

  const [planLoading, setPlanLoading] =
    useState(true);

  const hasPrioritySupport =
    currentPlan === "Silver" ||
    currentPlan === "Gold";

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadSubscription = async () => {
      try {
        setPlanLoading(true);

        const response =
          await getSubscription();

        setCurrentPlan(
          response.data.plan || "Free"
        );
      } catch (error: unknown) {
        console.error(
          "Failed to load subscription:",
          error
        );

        setCurrentPlan("Free");
      } finally {
        setPlanLoading(false);
      }
    };

    void loadSubscription();
  }, [open]);

  const handleSubmit = async () => {
    if (
      !subject.trim() ||
      !message.trim()
    ) {
      alert(
        t(
          "messages.please_enter_subject_and_message"
        )
      );

      return;
    }

    try {
      setLoading(true);

      await createSupportRequest({
        subject,
        message,
      });

      setSubject("");
      setMessage("");

      alert(
        t(
          "messages.support_request_submitted_successfully"
        )
      );

      onOpenChange(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to submit support request:",
          error.response?.data?.message
        );
      } else {
        console.error(
          "Failed to submit support request:",
          error
        );
      }

      alert(
        t(
          "messages.failed_to_submit_support_request"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = () => {
    onOpenChange(false);
    void router.push("/subscription");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="bg-white text-gray-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("title.help_and_support")}
          </DialogTitle>
        </DialogHeader>

        {planLoading ? (
          <div className="py-8 text-center text-gray-500">
            {t(
              "status.checking_your_plan"
            )}
          </div>
        ) : !hasPrioritySupport ? (
          <div className="space-y-4 py-3">
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="font-medium text-gray-900">
                {t(
                  "priority.priority_support"
                )}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {t(
                  "priority.available_for_silver_and_gold"
                )}{" "}
                {t(
                  "priority.upgrade_to_contact_team"
                )}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleUpgradePlan}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {t(
                "actions.upgrade_plan"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {currentPlan === "Gold"
                ? `${t(
                    "members.gold_member"
                  )} — ${t(
                    "priority.highest_priority_support"
                  )}`
                : `${t(
                    "members.silver_member"
                  )} — ${t(
                    "priority.priority_support"
                  )}`}
            </p>

            <Input
              placeholder={t(
                "placeholders.subject"
              )}
              value={subject}
              onChange={(event) =>
                setSubject(
                  event.target.value
                )
              }
            />

            <Textarea
              placeholder={t(
                "placeholders.describe_your_issue"
              )}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              rows={5}
            />

            <Button
              type="button"
              onClick={() =>
                void handleSubmit()
              }
              disabled={loading}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading
                ? t(
                    "status.submitting"
                  )
                : t(
                    "actions.submit_request"
                  )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;