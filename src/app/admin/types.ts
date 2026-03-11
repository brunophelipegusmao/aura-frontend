export type AdminTab = "dashboard" | "products" | "carousel" | "orders" | "stock";

export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "picking"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type StockMovementType = "in" | "out" | "adjustment";

export type AdminProductVariant = {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  reference: string;
  category: string;
  collection: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  lowStockThreshold: number;
  variants: AdminProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type CarouselPlacement = "home-hero" | "home-products";

export type AdminCarouselSlide = {
  id: string;
  placement: CarouselPlacement;
  title: string;
  subtitle: string;
  imageUrl: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
};

export type AdminOrder = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: AdminOrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  shippingMethod: string;
  shippingAmount: number;
  discountAmount: number;
  notes: string;
  items: AdminOrderItem[];
};

export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  actor: string;
  createdAt: string;
};

export type AdminStore = {
  products: AdminProduct[];
  slides: AdminCarouselSlide[];
  orders: AdminOrder[];
  stockMovements: StockMovement[];
};

export type ProductVariantDraft = {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: string;
};

export type ProductDraft = {
  name: string;
  reference: string;
  category: string;
  collection: string;
  imageUrl: string;
  price: string;
  compareAtPrice: string;
  isActive: boolean;
  isFeatured: boolean;
  lowStockThreshold: string;
  variants: ProductVariantDraft[];
};

export type CarouselDraft = {
  placement: CarouselPlacement;
  title: string;
  subtitle: string;
  imageUrl: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  isActive: boolean;
};

export type StockMovementDraft = {
  variantKey: string;
  type: StockMovementType;
  quantity: string;
  reason: string;
  actor: string;
};

export type Feedback = {
  type: "success" | "error";
  message: string;
};

export type StockRow = {
  key: string;
  productId: string;
  productName: string;
  productReference: string;
  category: string;
  collection: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  lowStockThreshold: number;
  isProductActive: boolean;
};
