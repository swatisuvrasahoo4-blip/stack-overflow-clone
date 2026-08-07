"use client";

import { useState, useEffect } from "react";
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

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportModal = ({
  open,
  onOpenChange,
}: SupportModalProps) => {
    const router = useRouter();
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
      alert("Please enter subject and message.");
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

      alert("Support request submitted successfully.");

      onOpenChange(false);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to submit support request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
        </DialogHeader>

        {planLoading ? (
  <div className="py-8 text-center text-gray-500">
    Checking your plan...
  </div>
) : !hasPrioritySupport ? (
  <div className="space-y-4 py-3">
    <div className="rounded-lg bg-orange-50 p-4">
      <p className="font-medium text-gray-900">
        Priority Support
      </p>

      <p className="mt-2 text-sm text-gray-600">
        Priority Support is available for Silver and Gold members.
        Upgrade your plan to contact our priority support team.
      </p>
    </div>

    <Button
      className="w-full bg-orange-500 text-white hover:bg-orange-600"
      onClick={() => {
        onOpenChange(false);
        router.push("/subscription");
      }}
    >
      Upgrade Plan
    </Button>
  </div>
) : (
  <div className="space-y-4">
    <p className="text-sm text-gray-500">
      {currentPlan === "Gold"
        ? "Gold member — Highest Priority Support"
        : "Silver member — Priority Support"}
    </p>

    <Input
      placeholder="Subject"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    />

    <Textarea
      placeholder="Describe your issue..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={5}
    />

    <Button
      onClick={handleSubmit}
      disabled={loading}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
    >
      {loading ? "Submitting..." : "Submit Request"}
    </Button>
  </div>
)}
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;