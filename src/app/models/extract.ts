export interface Extract {
  id: number;
  isProcessed: boolean;
  isApproved: boolean;
  isAvailable: boolean;
  isCancel: boolean;
  isRedeem: boolean;
  balance: number;
  IdClient: number;
  cpfCnpj: string;
  points: number;
  dateCreate: string;
  sumId: string;
  // statusType: string;
  description?: string;
  typeBalance: {
    id: number;
    name: string;
  };
}
