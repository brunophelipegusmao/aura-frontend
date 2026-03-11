import type { MockProduct } from "../../../mock/catalog";

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type DeliveryAddress = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  zip: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  reference: string;
  isDefault: boolean;
};

export type AddressFormState = Omit<DeliveryAddress, "id">;

export type ProfileState = {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  birthDate: string;
};

export type OrderStatus = "processing" | "paid" | "shipped" | "delivered" | "canceled";

export type OrderItem = {
  productId: string;
  quantity: number;
  size: string;
};

export type OrderHistoryEntry = {
  id: string;
  code: string;
  placedAt: string;
  status: OrderStatus;
  total: number;
  shippingAddressLabel: string;
  paymentLabel: string;
  items: OrderItem[];
};

export type ClientLocalStore = {
  cartItems: CartItem[];
  favoriteProductIds: string[];
  profile: ProfileState;
  addresses: DeliveryAddress[];
  orderHistory: OrderHistoryEntry[];
};

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const CLIENT_LOCAL_STORAGE_KEY = "aura-client-state-v1";

export const initialCartItems: CartItem[] = [
  { productId: "product-2", size: "M", quantity: 1 },
  { productId: "product-8", size: "G", quantity: 2 },
];

export const initialFavoriteIds = ["product-1", "product-6", "product-10"];

export const initialProfile: ProfileState = {
  fullName: "Bruna Carvalho",
  email: "bruna@auraactivewear.com.br",
  phone: "(22) 99895-9800",
  document: "123.456.789-00",
  birthDate: "1993-06-14",
};

export const initialAddresses: DeliveryAddress[] = [
  {
    id: "address-1",
    label: "Casa",
    recipient: "Bruna Carvalho",
    phone: "(22) 99895-9800",
    zip: "28950-000",
    street: "Rua das Palmeiras",
    number: "124",
    neighborhood: "Centro",
    city: "Cabo Frio",
    state: "RJ",
    complement: "Apto 202",
    reference: "Próximo à praça principal",
    isDefault: true,
  },
  {
    id: "address-2",
    label: "Trabalho",
    recipient: "Bruna Carvalho",
    phone: "(22) 99895-9800",
    zip: "28930-000",
    street: "Avenida Atlântica",
    number: "980",
    neighborhood: "Passagem",
    city: "Cabo Frio",
    state: "RJ",
    complement: "Sala 14",
    reference: "Edifício Wave, recepção",
    isDefault: false,
  },
];

export const initialOrderHistory: OrderHistoryEntry[] = [
  {
    id: "order-2026-0003",
    code: "#AURA-2026-0003",
    placedAt: "2026-02-18T14:20:00.000Z",
    status: "delivered",
    total: 389.7,
    shippingAddressLabel: "Casa",
    paymentLabel: "Cartao de credito",
    items: [
      { productId: "product-4", quantity: 1, size: "M" },
      { productId: "product-7", quantity: 1, size: "P" },
      { productId: "product-10", quantity: 1, size: "M" },
    ],
  },
  {
    id: "order-2026-0002",
    code: "#AURA-2026-0002",
    placedAt: "2026-02-11T10:10:00.000Z",
    status: "shipped",
    total: 279.8,
    shippingAddressLabel: "Trabalho",
    paymentLabel: "PIX",
    items: [
      { productId: "product-3", quantity: 1, size: "M" },
      { productId: "product-6", quantity: 1, size: "P" },
    ],
  },
  {
    id: "order-2026-0001",
    code: "#AURA-2026-0001",
    placedAt: "2026-01-29T09:35:00.000Z",
    status: "paid",
    total: 169.9,
    shippingAddressLabel: "Casa",
    paymentLabel: "Boleto",
    items: [{ productId: "product-1", quantity: 1, size: "M" }],
  },
];

export const orderStatusMeta: Record<OrderStatus, { label: string; className: string }> = {
  processing: {
    label: "Processando",
    className: "bg-primary-soft/45 text-secondary",
  },
  paid: {
    label: "Pago",
    className: "bg-secondary/20 text-secondary",
  },
  shipped: {
    label: "Enviado",
    className: "bg-blue-100 text-blue-700",
  },
  delivered: {
    label: "Entregue",
    className: "bg-emerald-100 text-emerald-700",
  },
  canceled: {
    label: "Cancelado",
    className: "bg-rose-100 text-rose-700",
  },
};

export const emptyAddressForm: AddressFormState = {
  label: "",
  recipient: "",
  phone: "",
  zip: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
  reference: "",
  isDefault: false,
};

export const buildAddressForm = (address: DeliveryAddress): AddressFormState => {
  return {
    label: address.label,
    recipient: address.recipient,
    phone: address.phone,
    zip: address.zip,
    street: address.street,
    number: address.number,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    complement: address.complement,
    reference: address.reference,
    isDefault: address.isDefault,
  };
};

export const normalizeDefaultAddress = (addresses: DeliveryAddress[]) => {
  if (addresses.length === 0) {
    return addresses;
  }

  if (!addresses.some((address) => address.isDefault)) {
    return [{ ...addresses[0], isDefault: true }, ...addresses.slice(1)];
  }

  const defaultId = addresses.find((address) => address.isDefault)?.id;
  return addresses.map((address) => ({
    ...address,
    isDefault: address.id === defaultId,
  }));
};

export const getAddressPreview = (address: DeliveryAddress) => {
  return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
};

export const getDiscountAmount = (product: MockProduct, quantity: number) => {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return 0;
  }

  return (product.compareAtPrice - product.price) * quantity;
};

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const getString = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};

export const getBoolean = (value: unknown, fallback = false) => {
  return typeof value === "boolean" ? value : fallback;
};

export const sanitizeCartItems = (value: unknown): CartItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((item) => {
      const rawQuantity =
        typeof item.quantity === "number" ? item.quantity : Number.NaN;

      return {
        productId: getString(item.productId).trim(),
        size: getString(item.size, "U").trim(),
        quantity: Number.isFinite(rawQuantity)
          ? Math.min(8, Math.max(1, Math.trunc(rawQuantity)))
          : 1,
      };
    })
    .filter((item) => item.productId.length > 0 && item.size.length > 0);
};

export const sanitizeFavoriteProductIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const ids = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return [...new Set(ids)];
};

export const sanitizeProfile = (value: unknown): ProfileState => {
  if (!isRecord(value)) {
    return initialProfile;
  }

  return {
    fullName: getString(value.fullName, initialProfile.fullName),
    email: getString(value.email, initialProfile.email),
    phone: getString(value.phone, initialProfile.phone),
    document: getString(value.document, initialProfile.document),
    birthDate: getString(value.birthDate, initialProfile.birthDate),
  };
};

export const sanitizeAddresses = (value: unknown): DeliveryAddress[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((address, index) => {
      const generatedId = `address-local-${Date.now()}-${index}`;
      return {
        id: getString(address.id, generatedId),
        label: getString(address.label),
        recipient: getString(address.recipient),
        phone: getString(address.phone),
        zip: getString(address.zip),
        street: getString(address.street),
        number: getString(address.number),
        neighborhood: getString(address.neighborhood),
        city: getString(address.city),
        state: getString(address.state),
        complement: getString(address.complement),
        reference: getString(address.reference),
        isDefault: getBoolean(address.isDefault),
      };
    })
    .filter(
      (address) =>
        address.id.trim().length > 0 &&
        address.label.trim().length > 0 &&
        address.recipient.trim().length > 0 &&
        address.phone.trim().length > 0 &&
        address.zip.trim().length > 0 &&
        address.street.trim().length > 0 &&
        address.number.trim().length > 0 &&
        address.neighborhood.trim().length > 0 &&
        address.city.trim().length > 0 &&
        address.state.trim().length > 0,
    );
};

export const sanitizeOrderHistory = (value: unknown): OrderHistoryEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((order, orderIndex) => {
      const statusValue = getString(order.status, "processing").toLowerCase();
      const status: OrderStatus =
        statusValue === "processing" ||
        statusValue === "paid" ||
        statusValue === "shipped" ||
        statusValue === "delivered" ||
        statusValue === "canceled"
          ? statusValue
          : "processing";
      const totalValue =
        typeof order.total === "number" ? order.total : Number.NaN;

      const items = Array.isArray(order.items)
        ? order.items
            .filter(isRecord)
            .map((item) => {
              const rawQuantity =
                typeof item.quantity === "number" ? item.quantity : Number.NaN;
              return {
                productId: getString(item.productId),
                size: getString(item.size, "U"),
                quantity: Number.isFinite(rawQuantity)
                  ? Math.max(1, Math.trunc(rawQuantity))
                  : 1,
              };
            })
            .filter(
              (item) =>
                item.productId.trim().length > 0 && item.size.trim().length > 0,
            )
        : [];

      return {
        id: getString(order.id, `order-local-${Date.now()}-${orderIndex}`),
        code: getString(order.code, `#AURA-LOCAL-${orderIndex + 1}`),
        placedAt: getString(order.placedAt, new Date().toISOString()),
        status,
        total: Number.isFinite(totalValue) ? totalValue : 0,
        shippingAddressLabel: getString(order.shippingAddressLabel, "Endereco"),
        paymentLabel: getString(order.paymentLabel, "Pagamento"),
        items,
      };
    })
    .filter(
      (order) =>
        order.id.trim().length > 0 &&
        order.code.trim().length > 0 &&
        order.items.length > 0 &&
        order.total >= 0,
    );
};

export const formatOrderDate = (dateInput: string) => {
  const parsedDate = new Date(dateInput);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateInput;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
};

export const loadClientLocalStore = (): Partial<ClientLocalStore> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawData = window.localStorage.getItem(CLIENT_LOCAL_STORAGE_KEY);
    if (!rawData) {
      return {};
    }

    const parsedData: unknown = JSON.parse(rawData);
    if (!isRecord(parsedData)) {
      return {};
    }

    const payload: Partial<ClientLocalStore> = {};

    if ("cartItems" in parsedData) {
      payload.cartItems = sanitizeCartItems(parsedData.cartItems);
    }

    if ("favoriteProductIds" in parsedData) {
      payload.favoriteProductIds = sanitizeFavoriteProductIds(
        parsedData.favoriteProductIds,
      );
    }

    if ("profile" in parsedData) {
      payload.profile = sanitizeProfile(parsedData.profile);
    }

    if ("addresses" in parsedData) {
      payload.addresses = sanitizeAddresses(parsedData.addresses);
    }

    if ("orderHistory" in parsedData) {
      payload.orderHistory = sanitizeOrderHistory(parsedData.orderHistory);
    }

    return payload;
  } catch {
    return {};
  }
};

export const saveClientLocalStore = (payload: ClientLocalStore) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CLIENT_LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore write failures (private mode/quota); UI stays functional.
  }
};
