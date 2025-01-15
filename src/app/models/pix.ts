export interface Pix {
  _id: string;
  status: "WAITING" | "DENIED" | "EXPIRED" | "APPROVED";
  amount: number;
  order: string; //orderId
  paymentId: string;
  customer: {
    document: string;
    firstName: string;
  };
  copyAndPaste: string; //pix code
  qrCode: string; //base64
  expireAt: string;
  updated_at: string;
  created_at: string;
}
