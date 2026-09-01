import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getSubscription,
  getPaymentHistory,
} from "@/components/services/subscriptionService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import InvoiceModal from "./InvoiceModal";

interface Subscription {
  _id?: string;
  userid: string;
  plan: "Free" | "Bronze" | "Silver" | "Gold";
  status: "Active" | "Expired" | "Cancelled";
  amount: number;
  paymentid: string;
  orderid: string;
  startdate: string;
  renewaldate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface Payment {
  _id: string;
  userid: string;
  invoiceNumber: string;
  plan: "Bronze" | "Silver" | "Gold";
  amount: number;
  paymentid: string;
  orderid: string;
  status: string;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const PaymentHistory = () => {
  const { t } = useTranslation("subscription");

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const subscriptionResponse =
          await getSubscription();

        setSubscription(
          subscriptionResponse.data
        );

        const paymentResponse =
          await getPaymentHistory();

        setPayments(
          paymentResponse.data
        );
      } catch (error: unknown) {
        console.error(
          "Failed to load payment history:",
          error
        );
      }
    };

    void loadHistory();
  }, []);

  const handleViewInvoice = (
    payment: Payment
  ) => {
    setSelectedPayment(payment);
    setOpen(true);
  };

  const handleCloseInvoice = () => {
    setOpen(false);
    setSelectedPayment(null);
  };

  if (!subscription) {
    return null;
  }

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            {t(
              "payment_history.title"
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">
                  {t(
                    "payment_history.invoice"
                  )}
                </th>

                <th className="py-2 text-left">
                  {t(
                    "payment_history.plan"
                  )}
                </th>

                <th className="py-2 text-left">
                  {t(
                    "payment_history.amount"
                  )}
                </th>

                <th className="py-2 text-left">
                  {t(
                    "payment_history.status"
                  )}
                </th>

                <th className="py-2 text-left">
                  {t(
                    "payment_history.date"
                  )}
                </th>

                <th className="py-2 text-left">
                  {t(
                    "payment_history.action"
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map(
                (payment) => (
                  <tr
                    key={
                      payment._id
                    }
                    className="border-b"
                  >
                    <td className="py-3">
                      {
                        payment.invoiceNumber
                      }
                    </td>

                    <td>
                      {
                        payment.plan
                      }
                    </td>

                    <td>
                      ₹
                      {
                        payment.amount
                      }
                    </td>

                    <td>
                      {
                        payment.status
                      }
                    </td>

                    <td>
                      {new Date(
                        payment.paymentDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleViewInvoice(
                            payment
                          )
                        }
                        className="text-blue-600 hover:underline"
                      >
                        {t(
                          "actions.view_invoice"
                        )}
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <InvoiceModal
        open={open}
        onClose={
          handleCloseInvoice
        }
        payment={
          selectedPayment
        }
      />
    </>
  );
};

export default PaymentHistory;