create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'user_status'
  ) then
    create type public.user_status as enum (
      'active',
      'inactive',
      'invited',
      'suspended'
    );
  end if;

  if not exists (
    select 1 from pg_type where typname = 'user_role'
  ) then
    create type public.user_role as enum (
      'superadmin',
      'admin',
      'cashier',
      'manager'
    );
  end if;
end
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  first_name text not null,
  last_name text not null,
  username text not null unique,
  email text not null unique,
  phone_number text,
  status public.user_status not null default 'invited',
  role public.user_role not null default 'cashier',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users
  add column if not exists auth_user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_auth_user_id_fkey'
  ) then
    alter table public.users
      add constraint users_auth_user_id_fkey
      foreign key (auth_user_id)
      references auth.users (id)
      on delete set null;
  end if;
end
$$;

create unique index if not exists idx_users_auth_user_id
  on public.users (auth_user_id)
  where auth_user_id is not null;

create index if not exists idx_users_status on public.users (status);
create index if not exists idx_users_role on public.users (role);
create index if not exists idx_users_created_at on public.users (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_users_updated_at'
  ) then
    create trigger trg_users_updated_at
    before update on public.users
    for each row
    execute function public.set_updated_at();
  end if;
end
$$;

create or replace function public.sync_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  local_part text;
  first_name_value text;
  last_name_value text;
  base_username text;
begin
  local_part := split_part(new.email, '@', 1);
  first_name_value := initcap(split_part(regexp_replace(local_part, '[_\.-]+', ' ', 'g'), ' ', 1));
  last_name_value := nullif(trim(regexp_replace(regexp_replace(local_part, '[_\.-]+', ' ', 'g'), '^\S+\s*', '')), '');
  base_username := lower(regexp_replace(local_part, '[^a-zA-Z0-9_]+', '_', 'g'));

  insert into public.users (
    auth_user_id,
    first_name,
    last_name,
    username,
    email,
    phone_number,
    status,
    role
  )
  values (
    new.id,
    coalesce(first_name_value, 'New'),
    coalesce(last_name_value, 'User'),
    left(base_username || '_' || substring(new.id::text from 1 for 8), 60),
    lower(new.email),
    null,
    'active',
    'cashier'
  )
  on conflict (email) do update
  set auth_user_id = excluded.auth_user_id,
      email = excluded.email,
      updated_at = now();

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.sync_auth_user_profile();
  end if;
end
$$;

update public.users u
set auth_user_id = au.id
from auth.users au
where lower(au.email) = lower(u.email)
  and u.auth_user_id is distinct from au.id;

alter table public.users enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_read'
  ) then
    create policy users_read
    on public.users
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_insert'
  ) then
    create policy users_insert
    on public.users
    for insert
    to anon, authenticated
    with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_update'
  ) then
    create policy users_update
    on public.users
    for update
    to anon, authenticated
    using (true)
    with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_delete'
  ) then
    create policy users_delete
    on public.users
    for delete
    to anon, authenticated
    using (true);
  end if;
end
$$;

insert into public.users (
  first_name,
  last_name,
  username,
  email,
  phone_number,
  status,
  role
)
select
  initcap(first_names[(g % array_length(first_names, 1)) + 1]),
  initcap(last_names[(g % array_length(last_names, 1)) + 1]),
  lower(
    first_names[(g % array_length(first_names, 1)) + 1] ||
    '.' ||
    last_names[(g % array_length(last_names, 1)) + 1] ||
    g
  ),
  lower(
    first_names[(g % array_length(first_names, 1)) + 1] ||
    '.' ||
    last_names[(g % array_length(last_names, 1)) + 1] ||
    g ||
    '@example.com'
  ),
  '+55 65 9' || lpad(((10000000 + g) % 100000000)::text, 8, '0'),
  statuses[(g % array_length(statuses, 1)) + 1]::public.user_status,
  roles[(g % array_length(roles, 1)) + 1]::public.user_role
from generate_series(1, 120) as g
cross join (
  select
    array[
      'ana', 'bruno', 'carla', 'daniel', 'eduarda', 'felipe', 'gabriela',
      'henrique', 'isabela', 'joao', 'karina', 'lucas', 'mariana', 'nicolas',
      'olivia', 'paulo', 'quezia', 'rafael', 'sabrina', 'thiago'
    ] as first_names,
    array[
      'silva', 'souza', 'oliveira', 'santos', 'pereira', 'rodrigues', 'almeida',
      'nascimento', 'lima', 'araujo', 'fernandes', 'costa'
    ] as last_names,
    array['active', 'inactive', 'invited', 'suspended'] as statuses,
    array['superadmin', 'admin', 'cashier', 'manager'] as roles
) as seed
on conflict (email) do nothing;
