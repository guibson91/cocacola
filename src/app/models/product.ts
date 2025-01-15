export interface Product {
  id?: string;
  sku: string;
  label?: string;
  image?: string;
  images?: { url?: string }[];
  categories?: ProductAttribute[]; //index 0 = Categoria; index 1 = Marca, index 2 = Sabor
  attributes?: {
    scalable?: boolean;
    returnable?: boolean; //produto retornável
    kit?: boolean; //deve ser boolean 'S' true e 'N' false
    combo?: boolean; //deve ser boolean 'S' true e 'N' false
    expressDelivery?: boolean; //habilitar ou não develivery expresso
    package?: ProductAttribute;
    weight?: number;
    mandatory?: number; //0 1 2 3 (deve ser um código pros kits e combos)
    quantityPerPackage?: string; //algo do tipo: "6/1" ou "24/1"
    capacityLabel?: string; //algo do tipo "310ml"
    returnableMessage?: string;
  };
  points?: number; //Quando tiver no carrinho
  is_redeemable?: boolean;
  is_only_redeemable?: boolean;
  redeemPoints?: number;
  redeemOriginalPoints?: number;
  description?: string; //descrição longa do produto
  name?: string; //nome do produto
  category?: ProductAttribute;
  brand?: ProductAttribute;
  flavor?: ProductAttribute;
  unitLabel?: string; //algo do tipo "fardo" | "caixa" | "pacote" | "grade"
  originalPrice?: number; //preço original sem encargos
  scalablePrices?: ScalablePrice[]; //array de preços escolanáveis (com active no elemento atual)
  paymentConditionDescription?: string;
  paymentCondition?: string;

  //frontend
  promotional?: boolean;
  rejectionMessage?: string; //Mensagem de item cancelado pra exibir nos detalhes do pedido
  currentScalable?: ScalablePrice;
  nextScalable?: ScalablePrice;
  inputQuantity: number; //quantidade do input podendo ser alterada com algum delay
  quantity: number; //quantidade real representando unidades no carrinho
}

export interface ProductAttribute {
  id: any; //string or number
  categoryId?: string;
  label: string;
  images?: {
    url: string;
  }[];
  //front
  image?: string;
}

export interface ScalablePrice {
  originalPrice?: number;
  unitPrice?: number;
  price: number;
  maximumQuantity: number;
  minimumQuantity?: number;
  points?: number;
  active?: boolean;
  description?: string;
}

export type TypeProduct = "recommended" | "products" | "cart" | "summary";
