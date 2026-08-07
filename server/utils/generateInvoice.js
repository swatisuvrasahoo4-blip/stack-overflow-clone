import PDFDocument from "pdfkit";

const generateInvoice = (payment, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      // Header
      doc
        .fontSize(22)
        .fillColor("#2563eb")
        .text("CODEQUEST", { align: "center" });

      doc
        .fontSize(14)
        .fillColor("#000000")
        .text("PAYMENT INVOICE", { align: "center" });

      doc.moveDown(2);

      // Invoice information
      doc.fontSize(11);

      doc.text(`Invoice Number: ${payment.invoiceNumber}`);
      doc.moveDown(0.5);

      doc.text(`Customer: ${user.name}`);
      doc.moveDown(0.5);

      doc.text(`Email: ${user.email}`);
      doc.moveDown(0.5);

      doc.text(`Plan: ${payment.plan}`);
      doc.moveDown(0.5);

      // Use Rs. to avoid PDF font issues with ₹
      doc.text(`Amount Paid: Rs. ${payment.amount}`);
      doc.moveDown(0.5);

      doc.text(`Payment ID: ${payment.paymentId}`);
      doc.moveDown(0.5);

      doc.text(`Status: Paid`);
      doc.moveDown(0.5);

      doc.text(
        `Renewal Date: ${payment.renewalDate.toLocaleDateString("en-IN")}`
      );

      doc.moveDown(3);

      doc
        .fontSize(10)
        .fillColor("#555555")
        .text("Thank you for choosing CodeQuest!", {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoice;