import { Delivery } from "./delivery";
import { Payment, PaymentCondition } from "./payment";
import { Product, ScalablePrice } from "./product";

export interface Cart {
  cartToken?: string;
  subtotal?: number;
  taxRate?: number;
  tax?: number;
  totalPoints?: number;
  total?: number;
  discount?: number;
  remainingBalance?: number;
  remainingMinimumOrder?: number;
  shipping?: number;
  cartItems?: CartItem[];
  cartProducts?: Product[];
  paymentMethods?: PaymentCondition;
  deliveries?: Delivery[];
  shippingInfo?: {
    neighborhood: string;
    zipCode: string;
    city: string;
    complement: string;
    uf: string;
    document: string;
    fantasyName: string;
    street: string;
    number: string;
  };
  minimumPoints?: number;
  shippingPoints?: number;

  //Points Program feature
  isRedeemable?: boolean;
  subtotalRedeemPoints?: number;
  totalRedeemPoints?: number;

  //Edit order feature
  isEditing?: boolean;
  editStartedAt?: string; //"2024-12-16T13:17:00.0034489"
  editableUntil?: string; //"2024-12-16T13:47:00.0034489"
  availableEditTime?: number; //integer in minutes
}

export interface CartItem {
  cartItemToken?: string;
  price?: number;
  quantity?: number;
  customerNote?: string;
  promotional?: boolean;
  rejectionMessage?: string;
  product: {
    reference?: string;
    code: string;
    name?: string;
    price?: number;
    weight?: number;
    quantityPerPackage?: string;
    capacityLabel?: string;
    unitPrice?: number;
    image?: string;
    scalablePrices: ScalablePrice[];
    points?: number;
    redeemPoints?: number;
    redeemOriginalPoints?: number;
    paymentCondition?: string;
    paymentConditionDescription?: string;
  };
}

export interface Checkout {
  amount: number;
  subtotal?: number | null;
  taxRate?: number | null;
  tax?: number | null;
  totalPoints?: number | null;
  total?: number | null;
  discount?: number | null;
  remainingBalance?: number | null;
  remainingMinimumOrder?: number | null;
  shipping?: number | null;
  cartItems?: CartItem[];
  cartProducts?: Product[] | null;
  payment?: Payment | null;
  delivery?: Delivery | null;
  //Programa de pontos
  subtotal_redeem_points?: number | null;
  shipping_points?: number | null;
  totalRedeemPoints?: number | null;
}

export type SummaryItem = { label?: string; value?: string; price?: number };
