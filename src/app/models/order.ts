import { CartItem, Checkout } from "./cart";
import { Delivery } from "./delivery";
import { Payment } from "./payment";
import { Product } from "./product";
import { User } from "./user";

export type OrderStatus =
  | "pending" //Pedido pendente
  | "received" //Pedido recebido
  | "review" //Em analise de credito
  | "approved" //Faturado
  | "shipped" //Saiu para entrega
  | "delivered" //Entregue
  | "returned"; //Devolvido

export interface Order extends Checkout {
  id: number;
  orderId?: string; //Id do pedido do cliente
  effectiveDate?: Date; //Data que o pedido foi efetivamente entregue / devolvido / cancelado
  code: string;
  description: string;
  cancelIsAllowed: boolean;
  amount: number;
  status: OrderStatus;
  subtotal: number;
  total: number;
  totalPoints: number;
  discount: number | null;
  shipping: number;
  remainingMinimumOrder: number;
  remainingBalance: number;
  cartItems: CartItem[];
  delivery: Delivery;
  payment: Payment;
  info: any;
  order: string;
  user: Client;
  cartProducts: Product[];
  rating?: number;
  canceled?: boolean;
  editableUntil?: string; //"2024-12-16T22:22:52.377760Z"
  editable?: boolean;
}

interface Client {
  address: string;
  cpfCnpj: string;
  clientId: string;
  finished: boolean;
  userStatus: "active" | "inactive";
  fantasyName: string;
  responsible: Responsible;
  businessName: string;
  getnetOrgId: string;
  balanceAvailablePoints: string;
}

interface Responsible {
  name: string;
  email: string;
  birthday: string;
  lastName: string;
  cellphone: string;
  firstName: string;
  cpfPartner: string;
  comercialPhone: string;
}
