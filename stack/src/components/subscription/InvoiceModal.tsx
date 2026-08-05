import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  payment: any;
}

export default function InvoiceModal({
  open,
  onClose,
  payment,
}: InvoiceModalProps) {
  if (!payment) return null;
  const downloadInvoice = () => {
  const doc = new jsPDF();
// Header Background
doc.setFillColor(37, 99, 235);
doc.rect(0, 0, 210, 35, "F");

// Title
doc.setTextColor(255, 255, 255);
doc.setFontSize(22);
doc.setFont("helvetica", "bold");
doc.text("CODEQUEST", 20, 18);

doc.setFontSize(12);
doc.setFont("helvetica", "normal");
doc.text("PAYMENT INVOICE", 20, 27);


doc.setTextColor(0, 0, 0);

doc.setFontSize(12);
doc.setFont("helvetica", "bold");
doc.text("Invoice Number:", 20, 50);
doc.text("Date:", 20, 58);
doc.text("Status:", 20, 66);

doc.setFont("helvetica", "normal");
doc.text(payment.invoiceNumber, 65, 50);
doc.text(
  new Date(payment.paymentDate).toLocaleDateString(),
  65,
  58
);

// Status badge
doc.setFillColor(34, 197, 94);
doc.roundedRect(62, 61, 24, 8, 2, 2, "F");
doc.setTextColor(255, 255, 255);
doc.setFontSize(10);

doc.text(
  payment.status.toUpperCase(),
  74,
  66.8,
  { align: "center" }
);


doc.setTextColor(0, 0, 0);

// Payment Details
doc.setDrawColor(220);
doc.roundedRect(16, 78, 178, 68, 3, 3);
doc.setFontSize(14);
doc.setFont("helvetica", "bold");
doc.text("Payment Details", 20, 85);

doc.setFontSize(12);

doc.setFont("helvetica", "bold");
doc.text("Plan:", 20, 100);
doc.text("Amount:", 20, 110);
doc.text("Payment ID:", 20, 120);
doc.text("Order ID:", 20, 130);

doc.setFont("helvetica", "normal");
doc.text(payment.plan, 65, 100);
doc.text(`INR ${payment.amount}`, 65, 110);
doc.text(payment.paymentid, 65, 120);
doc.text(payment.orderid, 65, 130);

// Footer
doc.setDrawColor(220);
doc.line(20, 142, 160, 142);

doc.setFontSize(11);
doc.setTextColor(120, 120, 120);
doc.setFont("helvetica", "italic");
doc.text(
  "Thank you for choosing CodeQuest Premium!",
  105,
  150,
  { align: "center" }
);


  doc.save(`${payment.invoiceNumber}.pdf`);
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Invoice</span>
            <span>{payment.invoiceNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Plan</span>
            <span>{payment.plan}</span>
          </div>

          <div className="flex justify-between">
            <span>Amount</span>
            <span>₹{payment.amount}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span>{payment.status}</span>
          </div>

          <div className="flex justify-between">
            <span>Payment ID</span>
            <span>{payment.paymentid}</span>
          </div>

          <div className="flex justify-between">
            <span>Order ID</span>
            <span>{payment.orderid}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
          </div>
          <div className="mt-6 flex justify-end">
  <button
    onClick={downloadInvoice}
    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
  >
    Download Invoice
  </button>
</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}