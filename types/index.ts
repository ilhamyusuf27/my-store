export type Variant = {
  id: number;
  name: string;
  stock: number;
};

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  variants?: Variant[];
}

export interface CartItem {
  cartId: string;
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  quantity: number;
  selectedVariant: Variant;
}

export type AddToCartPayload = {
  product: Product;
  selectedVariant: Variant;
};

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  variant: string;
  comment: string;
  createdAt: string;
}
