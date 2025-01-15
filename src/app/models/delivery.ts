export interface Delivery {
  label: string;
  hash: string; //"1c8899cdf365c8363dda131f8de279ce"
  key: "express" | "conventional";
  price: number;
  description: string; //"Em até 24h"
  deliveryDate: string; //"2023-10-05"
  deadline?: string | null; //"15:00:00"
  active?: 1 | 0;
  points?: number;
  minimum_order?: string;
  shippingPoints?: number;
}
