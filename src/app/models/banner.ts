export interface Banner {
  image?: string;
  type?: "url" | "link" | "pdf" | "youtube" | "product";
  categoryId?: any;
  brandId?: string;
  link?: string | null;
  pdf?: string | null;
  flag?: "web" | "app";
  id?: number;
  ordering?: number;
  is_redeem?: boolean;
  isFixed?: boolean;
}
