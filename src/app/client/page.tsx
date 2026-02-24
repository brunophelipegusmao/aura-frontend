"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";
import { mockProducts, type MockProduct } from "../../../mock/catalog";

type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

type DeliveryAddress = {
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

type AddressFormState = Omit<DeliveryAddress, "id">;

type ProfileState = {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  birthDate: string;
};

type OrderStatus = "processing" | "paid" | "shipped" | "delivered" | "canceled";

type OrderItem = {
  productId: string;
  quantity: number;
  size: string;
};

type OrderHistoryEntry = {
  id: string;
  code: string;
  placedAt: string;
  status: OrderStatus;
  total: number;
  shippingAddressLabel: string;
  paymentLabel: string;
  items: OrderItem[];
};

type ClientLocalStore = {
  cartItems: CartItem[];
  favoriteProductIds: string[];
  profile: ProfileState;
  addresses: DeliveryAddress[];
  orderHistory: OrderHistoryEntry[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CLIENT_LOCAL_STORAGE_KEY = "aura-client-state-v1";

const initialCartItems: CartItem[] = [
  { productId: "product-2", size: "M", quantity: 1 },
  { productId: "product-8", size: "G", quantity: 2 },
];

const initialFavoriteIds = ["product-1", "product-6", "product-10"];

const initialProfile: ProfileState = {
  fullName: "Bruna Carvalho",
  email: "bruna@auraactivewear.com.br",
  phone: "(22) 99895-9800",
  document: "123.456.789-00",
  birthDate: "1993-06-14",
};

const initialAddresses: DeliveryAddress[] = [
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

const initialOrderHistory: OrderHistoryEntry[] = [
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

const orderStatusMeta: Record<OrderStatus, { label: string; className: string }> = {
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

const emptyAddressForm: AddressFormState = {
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

const buildAddressForm = (address: DeliveryAddress): AddressFormState => {
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

const normalizeDefaultAddress = (addresses: DeliveryAddress[]) => {
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

const getAddressPreview = (address: DeliveryAddress) => {
  return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
};

const getDiscountAmount = (product: MockProduct, quantity: number) => {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return 0;
  }

  return (product.compareAtPrice - product.price) * quantity;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getString = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};

const getBoolean = (value: unknown, fallback = false) => {
  return typeof value === "boolean" ? value : fallback;
};

const sanitizeCartItems = (value: unknown): CartItem[] => {
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

const sanitizeFavoriteProductIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const ids = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return [...new Set(ids)];
};

const sanitizeProfile = (value: unknown): ProfileState => {
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

const sanitizeAddresses = (value: unknown): DeliveryAddress[] => {
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

const sanitizeOrderHistory = (value: unknown): OrderHistoryEntry[] => {
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

const formatOrderDate = (dateInput: string) => {
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

const loadClientLocalStore = (): Partial<ClientLocalStore> => {
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

const saveClientLocalStore = (payload: ClientLocalStore) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CLIENT_LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore write failures (private mode/quota); UI stays functional.
  }
};

export default function ClientPage() {
  const initialLocalStore = useMemo(() => loadClientLocalStore(), []);
  const initialStoredAddresses = useMemo(() => {
    if (!initialLocalStore.addresses) {
      return initialAddresses;
    }

    return normalizeDefaultAddress(initialLocalStore.addresses);
  }, [initialLocalStore.addresses]);
  const initialEditingAddress = useMemo(() => {
    return (
      initialStoredAddresses.find((address) => address.isDefault) ??
      initialStoredAddresses[0] ??
      null
    );
  }, [initialStoredAddresses]);

  const [cartItems, setCartItems] = useState<CartItem[]>(
    () => initialLocalStore.cartItems ?? initialCartItems,
  );
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>(
    () => initialLocalStore.favoriteProductIds ?? initialFavoriteIds,
  );
  const [profile, setProfile] = useState<ProfileState>(
    () => initialLocalStore.profile ?? initialProfile,
  );
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(
    () => initialStoredAddresses,
  );
  const [orderHistory] = useState<OrderHistoryEntry[]>(
    () => initialLocalStore.orderHistory ?? initialOrderHistory,
  );
  const [editingAddressId, setEditingAddressId] = useState<string | null>(
    () => initialEditingAddress?.id ?? null,
  );
  const [addressForm, setAddressForm] = useState<AddressFormState>(() =>
    initialEditingAddress
      ? buildAddressForm(initialEditingAddress)
      : emptyAddressForm,
  );
  const [profileNotice, setProfileNotice] = useState("");
  const [addressNotice, setAddressNotice] = useState("");

  useEffect(() => {
    saveClientLocalStore({
      cartItems,
      favoriteProductIds,
      profile,
      addresses,
      orderHistory,
    });
  }, [cartItems, favoriteProductIds, profile, addresses, orderHistory]);

  const productMap = useMemo(() => {
    return new Map(mockProducts.map((product) => [product.id, product]));
  }, []);

  const cartLines = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) {
          return null;
        }

        return {
          product,
          size: item.size,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
          lineDiscount: getDiscountAmount(product, item.quantity),
        };
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);
  }, [cartItems, productMap]);

  const favoriteProducts = useMemo(() => {
    return favoriteProductIds
      .map((productId) => productMap.get(productId))
      .filter((product): product is MockProduct => Boolean(product));
  }, [favoriteProductIds, productMap]);

  const cartSubtotal = cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const cartDiscount = cartLines.reduce(
    (sum, line) => sum + line.lineDiscount,
    0,
  );
  const shippingFee = cartSubtotal >= 299 || cartSubtotal === 0 ? 0 : 19.9;
  const cartTotal = cartSubtotal + shippingFee;
  const activeOrderCount = orderHistory.filter(
    (order) => order.status !== "delivered" && order.status !== "canceled",
  ).length;

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          const nextQuantity = Math.min(8, Math.max(0, item.quantity + delta));
          return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const updateSize = (productId: string, size: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, size } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const removeFromFavorites = (productId: string) => {
    setFavoriteProductIds((currentItems) =>
      currentItems.filter((itemId) => itemId !== productId),
    );
  };

  const moveFavoriteToCart = (productId: string) => {
    const favoriteProduct = productMap.get(productId);
    if (!favoriteProduct) {
      return;
    }

    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.productId === productId);
      if (existing) {
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(8, item.quantity + 1) }
            : item,
        );
      }

      return [
        {
          productId: favoriteProduct.id,
          size: favoriteProduct.sizes[0] ?? "U",
          quantity: 1,
        },
        ...currentItems,
      ];
    });

    removeFromFavorites(productId);
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses((currentAddresses) =>
      currentAddresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    );

    if (editingAddressId === addressId) {
      setAddressForm((currentAddress) => ({ ...currentAddress, isDefault: true }));
    }

    setAddressNotice("Endereço padrão atualizado.");
  };

  const handleEditAddress = (addressId: string) => {
    const selected = addresses.find((address) => address.id === addressId);
    if (!selected) {
      return;
    }

    setEditingAddressId(selected.id);
    setAddressForm(buildAddressForm(selected));
    setAddressNotice("");
  };

  const handleNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
    setAddressNotice("");
  };

  const handleDeleteAddress = (addressId: string) => {
    if (addresses.length === 1) {
      setAddressNotice("Mantenha pelo menos um endereço cadastrado.");
      return;
    }

    const filtered = addresses.filter((address) => address.id !== addressId);
    const normalized = normalizeDefaultAddress(filtered);
    setAddresses(normalized);

    if (editingAddressId === addressId) {
      const fallback = normalized[0];
      if (fallback) {
        setEditingAddressId(fallback.id);
        setAddressForm(buildAddressForm(fallback));
      }
    }

    setAddressNotice("Endereço removido.");
  };

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileNotice("Dados pessoais atualizados.");
  };

  const handleSaveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddressNotice("");

    if (
      !addressForm.label.trim() ||
      !addressForm.recipient.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.zip.trim() ||
      !addressForm.street.trim() ||
      !addressForm.number.trim() ||
      !addressForm.neighborhood.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim()
    ) {
      setAddressNotice("Preencha os campos obrigatórios do endereço.");
      return;
    }

    if (editingAddressId) {
      const updated = addresses.map((address) =>
        address.id === editingAddressId
          ? { id: editingAddressId, ...addressForm }
          : { ...address, isDefault: addressForm.isDefault ? false : address.isDefault },
      );

      const normalized = normalizeDefaultAddress(updated);
      setAddresses(normalized);
      setAddressNotice("Endereço atualizado com sucesso.");
      return;
    }

    const newAddress: DeliveryAddress = {
      id: `address-${Date.now()}`,
      ...addressForm,
    };
    const nextAddresses = normalizeDefaultAddress([newAddress, ...addresses]);
    setAddresses(nextAddresses);
    setEditingAddressId(newAddress.id);

    const savedAddress = nextAddresses.find((address) => address.id === newAddress.id);
    if (savedAddress) {
      setAddressForm(buildAddressForm(savedAddress));
    }

    setAddressNotice("Novo endereço adicionado.");
  };

  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/50 to-primary-soft/55 py-8 sm:py-10">
        <MotionReveal className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
            AREA DO CLIENTE
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl md:text-5xl">
            Minha Conta Aura
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            Acompanhe seu carrinho, favoritos e mantenha seus dados de entrega
            sempre atualizados.
          </p>
          <p className="mt-2 text-xs font-semibold text-secondary/90">
            Dados salvos localmente neste navegador (pronto para integrar com
            Nest depois).
          </p>
          <Link
            href="/products"
            prefetch={false}
            className="mt-5 inline-flex items-center rounded-xl bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary sm:text-sm"
          >
            Continuar comprando
          </Link>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-10">
        <MotionStagger
          className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          staggerChildren={0.06}
        >
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Carrinho
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {cartItems.length}
              </p>
            </article>
          </MotionStaggerItem>
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Favoritos
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {favoriteProducts.length}
              </p>
            </article>
          </MotionStaggerItem>
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Enderecos
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {addresses.length}
              </p>
            </article>
          </MotionStaggerItem>
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Pedidos
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {orderHistory.length}
              </p>
              <p className="mt-1 text-[11px] text-muted">
                {activeOrderCount} em andamento
              </p>
            </article>
          </MotionStaggerItem>
        </MotionStagger>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.18fr_minmax(0,0.82fr)]">
          <div className="space-y-4">
            <MotionReveal>
              <article className="overflow-hidden rounded-3xl border border-secondary/20 bg-paper shadow-[0_14px_34px_rgba(11,11,15,0.1)]">
                <header className="flex items-center justify-between border-b border-secondary/15 bg-primary-soft/30 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <ShoppingBagRoundedIcon fontSize="small" className="text-secondary" />
                    <h2 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary sm:text-base">
                      Carrinho de compras
                    </h2>
                  </div>
                </header>

                <div className="space-y-3 p-4 sm:p-5">
                  {cartLines.length > 0 ? (
                    cartLines.map((line) => (
                      <article
                        key={line.product.id}
                        className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3"
                      >
                        <div className="flex gap-3">
                          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-primary-soft/40">
                            <Image
                              src={line.product.image.url}
                              alt={line.product.image.alt}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                              {line.product.collection}
                            </p>
                            <h3 className="mt-1 text-sm font-bold leading-snug text-ink">
                              {line.product.name}
                            </h3>
                            <p className="mt-1 text-xs text-muted">{line.product.reference}</p>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                          <label className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary">
                              Tamanho
                            </span>
                            <select
                              value={line.size}
                              onChange={(event) =>
                                updateSize(line.product.id, event.target.value)
                              }
                              className="h-10 w-full rounded-xl border border-secondary/20 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                            >
                              {line.product.sizes.map((size) => (
                                <option key={`${line.product.id}-${size}`} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary">
                              Quantidade
                            </p>
                            <div className="flex h-10 items-center rounded-xl border border-secondary/20 bg-paper">
                              <button
                                type="button"
                                onClick={() => updateQuantity(line.product.id, -1)}
                                className="flex h-full w-9 items-center justify-center text-secondary transition-colors hover:bg-primary-soft/30"
                                aria-label={`Diminuir ${line.product.name}`}
                              >
                                <RemoveRoundedIcon fontSize="small" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-ink">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(line.product.id, 1)}
                                className="flex h-full w-9 items-center justify-center text-secondary transition-colors hover:bg-primary-soft/30"
                                aria-label={`Aumentar ${line.product.name}`}
                              >
                                <AddRoundedIcon fontSize="small" />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(line.product.id)}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-secondary/25 px-3 text-xs font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/35"
                          >
                            Remover
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <article className="rounded-2xl border border-dashed border-secondary/25 bg-primary-soft/15 p-4 text-center">
                      <p className="text-sm font-semibold text-ink">
                        Seu carrinho está vazio.
                      </p>
                      <Link
                        href="/products"
                        prefetch={false}
                        className="mt-3 inline-flex rounded-lg bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-paper"
                      >
                        Ver produtos
                      </Link>
                    </article>
                  )}
                </div>
              </article>
            </MotionReveal>

            <MotionReveal>
              <article className="overflow-hidden rounded-3xl border border-secondary/20 bg-paper shadow-[0_14px_34px_rgba(11,11,15,0.1)]">
                <header className="flex items-center justify-between border-b border-secondary/15 bg-primary-soft/30 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <FavoriteRoundedIcon fontSize="small" className="text-secondary" />
                    <h2 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary sm:text-base">
                      Produtos favoritados
                    </h2>
                  </div>
                </header>

                <div className="space-y-3 p-4 sm:p-5">
                  {favoriteProducts.length > 0 ? (
                    favoriteProducts.map((product) => (
                      <article
                        key={product.id}
                        className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-primary-soft/40">
                            <Image
                              src={product.image.url}
                              alt={product.image.alt}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold leading-snug text-ink">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-xs text-muted">{product.reference}</p>
                            <p className="mt-1 text-sm font-black text-secondary">
                              {currencyFormatter.format(product.price)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => moveFavoriteToCart(product.id)}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-ink px-4 text-xs font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary"
                          >
                            Mover para carrinho
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromFavorites(product.id)}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-secondary/25 px-4 text-xs font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/35"
                          >
                            Remover
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <article className="rounded-2xl border border-dashed border-secondary/25 bg-primary-soft/15 p-4 text-center">
                      <p className="text-sm font-semibold text-ink">
                        Nenhum favorito no momento.
                      </p>
                      <Link
                        href="/products"
                        prefetch={false}
                        className="mt-3 inline-flex rounded-lg bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-paper"
                      >
                        Explorar produtos
                      </Link>
                    </article>
                  )}
                </div>
              </article>
            </MotionReveal>
          </div>

          <div className="space-y-4">
            <MotionReveal>
              <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_14px_34px_rgba(11,11,15,0.1)] sm:p-5">
                <div className="flex items-center gap-2">
                  <HistoryRoundedIcon fontSize="small" className="text-secondary" />
                  <h2 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary sm:text-base">
                    Historico de pedidos
                  </h2>
                </div>

                <div className="mt-4 space-y-2.5">
                  {orderHistory.length > 0 ? (
                    orderHistory.map((order) => {
                      const firstItem = order.items[0];
                      const firstProductName = firstItem
                        ? (productMap.get(firstItem.productId)?.name ?? "Produto Aura")
                        : "Produto Aura";
                      const totalItems = order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      );

                      return (
                        <article
                          key={order.id}
                          className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-[0.08em] text-ink">
                                {order.code}
                              </p>
                              <p className="mt-1 text-[11px] text-muted">
                                {formatOrderDate(order.placedAt)}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${orderStatusMeta[order.status].className}`}
                            >
                              {orderStatusMeta[order.status].label}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-muted">
                            {firstProductName}
                            {totalItems > 1 ? ` +${totalItems - 1} item(ns)` : ""}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Pagamento: {order.paymentLabel}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Entrega: {order.shippingAddressLabel}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <p className="text-sm font-black text-secondary">
                              {currencyFormatter.format(order.total)}
                            </p>
                            <button
                              type="button"
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-secondary/25 px-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/35"
                            >
                              Ver pedido
                            </button>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <article className="rounded-2xl border border-dashed border-secondary/25 bg-primary-soft/15 p-4 text-center">
                      <p className="text-sm font-semibold text-ink">
                        Nenhum pedido realizado ainda.
                      </p>
                    </article>
                  )}
                </div>
              </article>
            </MotionReveal>

            <MotionReveal>
              <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_14px_34px_rgba(11,11,15,0.1)] sm:p-5">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary sm:text-base">
                  Resumo do pedido
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ink">
                      {currencyFormatter.format(cartSubtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Desconto</span>
                    <span className="font-semibold text-secondary">
                      -{currencyFormatter.format(cartDiscount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Frete</span>
                    <span className="font-semibold text-ink">
                      {shippingFee === 0
                        ? "Gratis"
                        : currencyFormatter.format(shippingFee)}
                    </span>
                  </div>
                  <div className="mt-3 border-t border-secondary/20 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-[0.08em] text-ink">
                        Total
                      </span>
                      <span className="text-lg font-black text-secondary">
                        {currencyFormatter.format(cartTotal)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-secondary px-4 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary"
                >
                  Finalizar compra
                </button>
              </article>
            </MotionReveal>

            <MotionReveal>
              <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_14px_34px_rgba(11,11,15,0.1)] sm:p-5">
                <div className="flex items-center gap-2">
                  <PersonRoundedIcon fontSize="small" className="text-secondary" />
                  <h2 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary sm:text-base">
                    Dados pessoais
                  </h2>
                </div>

                <form className="mt-4 space-y-3" onSubmit={handleSaveProfile}>
                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      Nome completo
                    </span>
                    <input
                      value={profile.fullName}
                      onChange={(event) =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          fullName: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      E-mail
                    </span>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(event) =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          email: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Telefone
                      </span>
                      <input
                        value={profile.phone}
                        onChange={(event) =>
                          setProfile((currentProfile) => ({
                            ...currentProfile,
                            phone: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        CPF
                      </span>
                      <input
                        value={profile.document}
                        onChange={(event) =>
                          setProfile((currentProfile) => ({
                            ...currentProfile,
                            document: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>
                  </div>

                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      Data de nascimento
                    </span>
                    <input
                      type="date"
                      value={profile.birthDate}
                      onChange={(event) =>
                        setProfile((currentProfile) => ({
                          ...currentProfile,
                          birthDate: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ink px-4 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary"
                  >
                    Salvar dados
                  </button>

                  {profileNotice ? (
                    <p className="text-xs font-semibold text-secondary">{profileNotice}</p>
                  ) : null}
                </form>
              </article>
            </MotionReveal>

            <MotionReveal>
              <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_14px_34px_rgba(11,11,15,0.1)] sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <LocationOnRoundedIcon
                      fontSize="small"
                      className="text-secondary"
                    />
                    <h2 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary sm:text-base">
                      Enderecos de entrega
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleNewAddress}
                    className="inline-flex h-9 items-center justify-center rounded-xl border border-secondary/25 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/35"
                  >
                    Novo
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {addresses.map((address) => (
                    <article
                      key={address.id}
                      className={`rounded-2xl border p-3 ${
                        address.isDefault
                          ? "border-secondary/45 bg-primary-soft/25"
                          : "border-secondary/15 bg-paper"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-black text-ink">{address.label}</p>
                          <p className="mt-1 text-xs text-muted">
                            {getAddressPreview(address)}
                          </p>
                        </div>
                        {address.isDefault ? (
                          <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-paper">
                            Padrão
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditAddress(address.id)}
                          className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-secondary/25 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/30"
                        >
                          <EditRoundedIcon style={{ fontSize: 16 }} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => setDefaultAddress(address.id)}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-secondary/25 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/30"
                        >
                          Padrão
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-secondary/25 text-[11px] font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/30"
                        >
                          <DeleteOutlineRoundedIcon style={{ fontSize: 16 }} />
                          Remover
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <form className="mt-4 space-y-3" onSubmit={handleSaveAddress}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Nome do endereco
                      </span>
                      <input
                        required
                        value={addressForm.label}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            label: event.target.value,
                          }))
                        }
                        placeholder="Casa, Trabalho..."
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Destinatario
                      </span>
                      <input
                        required
                        value={addressForm.recipient}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            recipient: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Telefone
                      </span>
                      <input
                        required
                        value={addressForm.phone}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            phone: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        CEP
                      </span>
                      <input
                        required
                        value={addressForm.zip}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            zip: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Rua
                      </span>
                      <input
                        required
                        value={addressForm.street}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            street: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Numero
                      </span>
                      <input
                        required
                        value={addressForm.number}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            number: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 sm:w-24"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Bairro
                      </span>
                      <input
                        required
                        value={addressForm.neighborhood}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            neighborhood: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Complemento
                      </span>
                      <input
                        value={addressForm.complement}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            complement: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        Cidade
                      </span>
                      <input
                        required
                        value={addressForm.city}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            city: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                        UF
                      </span>
                      <input
                        required
                        maxLength={2}
                        value={addressForm.state}
                        onChange={(event) =>
                          setAddressForm((currentAddress) => ({
                            ...currentAddress,
                            state: event.target.value.toUpperCase(),
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 sm:w-24"
                      />
                    </label>
                  </div>

                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      Referencia
                    </span>
                    <input
                      value={addressForm.reference}
                      onChange={(event) =>
                        setAddressForm((currentAddress) => ({
                          ...currentAddress,
                          reference: event.target.value,
                        }))
                      }
                      placeholder="Ex: portaria azul"
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(event) =>
                        setAddressForm((currentAddress) => ({
                          ...currentAddress,
                          isDefault: event.target.checked,
                        }))
                      }
                      className="accent-secondary"
                    />
                    Definir como endereço padrão
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ink px-4 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary"
                  >
                    {editingAddressId ? "Salvar endereco" : "Adicionar endereco"}
                  </button>

                  {addressNotice ? (
                    <p className="text-xs font-semibold text-secondary">{addressNotice}</p>
                  ) : null}
                </form>
              </article>
            </MotionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
