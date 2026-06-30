create table if not exists public.entity_records (
  id text primary key,
  entity text not null,
  data jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now(),
  updated_date timestamptz
);

create index if not exists entity_records_entity_idx
  on public.entity_records (entity);

create index if not exists entity_records_data_gin_idx
  on public.entity_records using gin (data);

alter table public.entity_records enable row level security;
