"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportModal = ({
  open,
  onOpenChange,
}: SupportModalProps) => {
    const router = useRouter();
    const {t} = useTranslation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");
const [planLoading, setPlanLoading] = useState(true);
const hasPrioritySupport =
  currentPlan === "Silver" || currentPlan === "Gold";
useEffect(() => {
  if (!open) return;

  const loadSubscription = async () => {
    try {
      setPlanLoading(true);

      const response = await getSubscription();

      setCurrentPlan(response.data.plan || "Free");
    } catch (error) {
      console.log(error);
      setCurrentPlan("Free");
    } finally {
      setPlanLoading(false);
    }
  };

  loadSubscription();
}, [open]);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      alert(t("alert.please_enter_subject_and_message"));
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

      alert(t("alert.support_request_submitted_successfully"));

      onOpenChange(false);
    }catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    alert(
      error.response?.data?.message ||
        t("alert.failed_to_submit_support_request")
    );
  } else {
    alert(t("alert.failed_to_submit_support_request"));
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>{t("support.help_&_support")}</DialogTitle>
        </DialogHeader>

        {planLoading ? (
  <div className="py-8 text-center text-gray-500">
    {t("support.checking_your_plan")}
  </div>
) : !hasPrioritySupport ? (
  <div className="space-y-4 py-3">
    <div className="rounded-lg bg-orange-50 p-4">
      <p className="font-medium text-gray-900">
        {t("supportpriority_support")}
      </p>

      <p className="mt-2 text-sm text-gray-600">
       {t("support.priority_support_is_available_for_silver_and_gold_members")}
        {t("support.upgrade_your_plan_to_contact_our_priority_support_team")}
      </p>
    </div>

    <Button
      className="w-full bg-orange-500 text-white hover:bg-orange-600"
      onClick={() => {
        onOpenChange(false);
        router.push("/subscription");
      }}
    >
      {t("support.upgrade_plan")}
    </Button>
  </div>
) : (
  <div className="space-y-4">
    <p className="text-sm text-gray-500">
      {currentPlan === "Gold"
        ? `${t("support.gold_member")} — ${t("support.highest_priority_support")}`
        : `${t("support.silver_member")} — ${t("support.priority_support")}`}
    </p>

    <Input
      placeholder={t("support.subject")}
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    />

    <Textarea
      placeholder={t("support.describe_your_issue")}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={5}
    />

    <Button
      onClick={handleSubmit}
      disabled={loading}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
    >
      {loading ? t("support.submitting") :  t("support.submit_request")}
    </Button>
  </div>
)}
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;