create extension if not exists pgcrypto;

create type order_status as enum (
  'pending', 'paid', 'picking', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create type carousel_placement as enum ('home_hero', 'home_products');

create type stock_movement_type as enum ('in', 'out', 'adjustment', 'reservation', 'release');

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  reference text unique,
  category text,
  collection text,
  description text,
  image_url text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color_name text not null,
  color_hex text,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  reorder_point integer not null default 6 check (reorder_point >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color_name)
);

create table carousel_slides (
  id uuid primary key default gen_random_uuid(),
  placement carousel_placement not null,
  title text,
  subtitle text,
  image_url text not null,
  alt_text text not null,
  cta_label text,
  cta_href text,
  position integer not null check (position > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (placement, position)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  status order_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  shipping_method text,
  shipping_amount numeric(12,2) not null default 0 check (shipping_amount >= 0),
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  subtotal_amount numeric(12,2) not null default 0 check (subtotal_amount >= 0),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name_snapshot text not null,
  sku_snapshot text not null,
  size_snapshot text,
  color_snapshot text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status order_status not null,
  changed_by uuid references admin_users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete cascade,
  movement_type stock_movement_type not null,
  quantity integer not null check (quantity > 0),
  previous_quantity integer not null check (previous_quantity >= 0),
  new_quantity integer not null check (new_quantity >= 0),
  reason text,
  source_document text,
  actor_user_id uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_variants_product on product_variants(product_id);
create index idx_orders_status_created_at on orders(status, created_at desc);
create index idx_stock_movements_variant_created_at on stock_movements(variant_id, created_at desc);
create index idx_carousel_placement_position on carousel_slides(placement, position);
