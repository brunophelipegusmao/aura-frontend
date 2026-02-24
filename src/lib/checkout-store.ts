import { getCartSubtotal, type CartItem, type CartState } from "@/lib/cart-store";

export const CHECKOUT_ORDERS_STORAGE_KEY = "aura-checkout-orders-v1";

type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  document: string;
};

type CheckoutAddress = {
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
};

export type CheckoutPaymentMethod = "pix" | "card" | "boleto";
export type CheckoutShippingMethod = "sedex" | "pac";

export type CheckoutOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  paymentMethod: CheckoutPaymentMethod;
  shippingMethod: CheckoutShippingMethod;
  shippingAmount: number;
  subtotalAmount: number;
  totalAmount: number;
  notes: string;
  items: CartItem[];
};

type CreateCheckoutOrderInput = {
  cart: CartState;
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  paymentMethod: CheckoutPaymentMethod;
  shippingMethod: CheckoutShippingMethod;
  shippingAmount: number;
  notes: string;
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseOrders = (rawValue: string): CheckoutOrder[] => {
  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((order) => isObjectRecord(order)) as CheckoutOrder[];
  } catch {
    return [];
  }
};

const readOrders = (): CheckoutOrder[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(CHECKOUT_ORDERS_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  return parseOrders(rawValue);
};

const writeOrders = (orders: CheckoutOrder[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHECKOUT_ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const getShippingLabel = (shippingMethod: CheckoutShippingMethod) => {
  return shippingMethod === "sedex" ? "SEDEX" : "PAC";
};

const mapCheckoutPaymentToAdminPayment = (
  paymentMethod: CheckoutPaymentMethod,
): "pending" | "paid" | "failed" | "refunded" => {
  if (paymentMethod === "card") {
    return "paid";
  }

  return "pending";
};

const syncCheckoutOrderToAdminStore = (order: CheckoutOrder) => {
  if (typeof window === "undefined") {
    return;
  }

  const adminRaw = window.localStorage.getItem("aura-admin-store-v1");
  if (!adminRaw) {
    return;
  }

  try {
    const adminStore = JSON.parse(adminRaw) as Record<string, unknown>;

    const currentOrders = Array.isArray(adminStore.orders)
      ? (adminStore.orders as Record<string, unknown>[])
      : [];

    const alreadyExists = currentOrders.some(
      (adminOrder) => adminOrder.number === order.orderNumber,
    );

    if (alreadyExists) {
      return;
    }

    const adminOrder = {
      id: `order-${order.orderNumber}`,
      number: order.orderNumber,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      status: "pending",
      paymentStatus: mapCheckoutPaymentToAdminPayment(order.paymentMethod),
      createdAt: order.createdAt,
      updatedAt: order.createdAt,
      shippingMethod: getShippingLabel(order.shippingMethod),
      shippingAmount: order.shippingAmount,
      discountAmount: 0,
      notes: order.notes,
      items: order.items.map((item, index) => ({
        id: `${order.orderNumber}-item-${index + 1}`,
        productId: item.productId,
        productName: item.productName,
        variantId: `${item.productId}-${item.size}-${item.colorName}`,
        sku: `${item.productId}-${item.size}-${item.colorName}`,
        size: item.size,
        colorName: item.colorName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    const nextStore = {
      ...adminStore,
      orders: [adminOrder, ...currentOrders],
    };

    window.localStorage.setItem("aura-admin-store-v1", JSON.stringify(nextStore));
    window.dispatchEvent(new Event("aura-admin-store-updated"));
  } catch {
    // no-op: checkout segue mesmo sem sincronizar com admin local
  }
};

export const createCheckoutOrder = ({
  cart,
  customer,
  address,
  paymentMethod,
  shippingMethod,
  shippingAmount,
  notes,
}: CreateCheckoutOrderInput): CheckoutOrder => {
  const createdAt = new Date().toISOString();
  const subtotalAmount = getCartSubtotal(cart);
  const totalAmount = subtotalAmount + shippingAmount;
  const randomCode = Math.floor(Math.random() * 9000) + 1000;
  const orderNumber = `${new Date().getFullYear()}${randomCode}`;

  return {
    id: `checkout-${orderNumber}`,
    orderNumber,
    createdAt,
    customer,
    address,
    paymentMethod,
    shippingMethod,
    shippingAmount,
    subtotalAmount,
    totalAmount,
    notes,
    items: cart.items,
  };
};

export const persistCheckoutOrder = (order: CheckoutOrder) => {
  const currentOrders = readOrders();
  writeOrders([order, ...currentOrders]);
  syncCheckoutOrderToAdminStore(order);
};

export const getCheckoutOrderByNumber = (orderNumber: string): CheckoutOrder | null => {
  const orders = readOrders();
  return orders.find((order) => order.orderNumber === orderNumber) ?? null;
};
