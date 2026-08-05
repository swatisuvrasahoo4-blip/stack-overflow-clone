import { useEffect, useState } from "react";
import { getSubscription, getPaymentHistory } from "@/components/services/subscriptionService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import InvoiceModal from "./InvoiceModal";
export default function PaymentHistory() {
  const [subscription, setSubscription] = useState<any>(null);
 const [payments, setPayments] = useState<any[]>([]);
 const [selectedPayment, setSelectedPayment] = useState<any>(null);
const [open, setOpen] = useState(false);
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
    <CardTitle>Payment History</CardTitle>
  </CardHeader>

  <CardContent>
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Invoice</th>
          <th className="text-left py-2">Plan</th>
          <th className="text-left py-2">Amount</th>
          <th className="text-left py-2">Status</th>
          <th className="text-left py-2">Date</th>
          <th className="text-left py-2">Action</th>
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
    View
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