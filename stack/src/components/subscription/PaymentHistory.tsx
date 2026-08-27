import { useEffect, useState } from "react";
import { getSubscription, getPaymentHistory } from "@/components/services/subscriptionService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import InvoiceModal from "./InvoiceModal";
import { useTranslation } from "react-i18next";
export default function PaymentHistory() {
  const [subscription, setSubscription] = useState<any>(null);
 const [payments, setPayments] = useState<any[]>([]);
 const [selectedPayment, setSelectedPayment] = useState<any>(null);
const [open, setOpen] = useState(false);
const {t} = useTranslation();
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getSubscription();
        setSubscription(response.data);
        const paymentResponse = await getPaymentHistory();
setPayments(paymentResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadHistory();
  }, []);

  if (!subscription) return null;

  return (
    <>
   <Card className="mt-8">
  <CardHeader>
    <CardTitle>{t("subscription.payment_history")}</CardTitle>
  </CardHeader>

  <CardContent>
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">{t("subscription.invoice")}</th>
          <th className="text-left py-2">{t("subscription.plan")}</th>
          <th className="text-left py-2">{t("subscription.amount")}</th>
          <th className="text-left py-2">{t("subscription.status")}</th>
          <th className="text-left py-2">{t("subscription.date")}</th>
          <th className="text-left py-2">{t("subscription.action")}</th>
        </tr>
      </thead>

      <tbody>
        {payments.map((payment: any) => (
          <tr key={payment._id} className="border-b">
            <td className="py-3">{payment.invoiceNumber}</td>
            <td>{payment.plan}</td>
            <td>₹{payment.amount}</td>
            <td>{payment.status}</td>
            <td>
              {new Date(payment.paymentDate).toLocaleDateString()}
            </td>
            <td className="py-3">
  <button
    onClick={() => {
      setSelectedPayment(payment);
      setOpen(true);
    }}
    className="text-blue-600 hover:underline"
  >
    {t("subscription.view")}
  </button>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </CardContent>
</Card>
<InvoiceModal
  open={open}
  onClose={() => setOpen(false)}
  payment={selectedPayment}
/>
</>
  );
}