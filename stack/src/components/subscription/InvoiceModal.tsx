import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";

interface Payment {
  _id?: string;
  userid: string;
  invoiceNumber: string;
  plan: "Bronze" | "Silver" | "Gold";
  amount: number;
  paymentid: string;
  orderid: string;
  status: string;
  paymentDate: string;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const InvoiceModal = ({
  open,
  onClose,
  payment,
}: InvoiceModalProps) => {
  const { t } =
    useTranslation("subscription");

  if (!payment) {
    return null;
  }

  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.text(
      "CODEQUEST",
      20,
      18
    );

    doc.setFontSize(12);
    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.text(
      t("invoice.pdf_title"),
      20,
      27
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      t(
        "invoice.invoice_number"
      ),
      20,
      50
    );

    doc.text(
      t("invoice.date"),
      20,
      58
    );

    doc.text(
      t("invoice.status"),
      20,
      66
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      payment.invoiceNumber,
      65,
      50
    );

    doc.text(
      new Date(
        payment.paymentDate
      ).toLocaleDateString(),
      65,
      58
    );

    doc.setFillColor(34, 197, 94);
    doc.roundedRect(
      62,
      61,
      24,
      8,
      2,
      2,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );
    doc.setFontSize(10);

    doc.text(
      payment.status.toUpperCase(),
      74,
      66.8,
      {
        align: "center",
      }
    );

    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(220);
    doc.roundedRect(
      16,
      78,
      178,
      68,
      3,
      3
    );

    doc.setFontSize(14);
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      t(
        "invoice.payment_details"
      ),
      20,
      85
    );

    doc.setFontSize(12);

    doc.text(
      t("invoice.plan"),
      20,
      100
    );

    doc.text(
      t("invoice.amount"),
      20,
      110
    );

    doc.text(
      t("invoice.payment_id"),
      20,
      120
    );

    doc.text(
      t("invoice.order_id"),
      20,
      130
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      payment.plan,
      65,
      100
    );

    doc.text(
      `INR ${payment.amount}`,
      65,
      110
    );

    doc.text(
      payment.paymentid,
      65,
      120
    );

    doc.text(
      payment.orderid,
      65,
      130
    );

    doc.setDrawColor(220);
    doc.line(
      20,
      142,
      160,
      142
    );

    doc.setFontSize(11);
    doc.setTextColor(
      120,
      120,
      120
    );

    doc.setFont(
      "helvetica",
      "italic"
    );

    doc.text(
      t("invoice.thank_you"),
      105,
      150,
      {
        align: "center",
      }
    );

    doc.save(
      `${payment.invoiceNumber}.pdf`
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onClose
      }
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t(
              "invoice.title"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              {t(
                "invoice.invoice"
              )}
            </span>

            <span>
              {
                payment.invoiceNumber
              }
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              {t(
                "invoice.plan"
              )}
            </span>

            <span>
              {payment.plan}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              {t(
                "invoice.amount"
              )}
            </span>

            <span>
              ₹{payment.amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              {t(
                "invoice.status"
              )}
            </span>

            <span>
              {payment.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              {t(
                "invoice.payment_id"
              )}
            </span>

            <span>
              {payment.paymentid}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              {t(
                "invoice.order_id"
              )}
            </span>

            <span>
              {payment.orderid}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              {t(
                "invoice.date"
              )}
            </span>

            <span>
              {new Date(
                payment.paymentDate
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={
                downloadInvoice
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              {t(
                "actions.download_invoice"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;