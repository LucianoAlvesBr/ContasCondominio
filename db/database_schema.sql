-- Create Expenses Table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  obs text,
  value numeric,
  periodicity text,
  maintenance_date date,
  description text,
  law text,
  month int,
  year int,
  status boolean default false,
  created_at timestamptz default now()
);

-- Create Contracts Table
create table public.contracts (
  id uuid default gen_random_uuid() primary key,
  item text not null,
  company text,
  contract_date date,
  validity date,
  value numeric,
  cnpj text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.expenses enable row level security;
alter table public.contracts enable row level security;

-- Create Policy to allow all operations for now (since it's a private internal tool)
-- In a real production app with multiple users, you'd want stricter policies.
create policy "Enable all access for all users" on public.expenses
for all using (true) with check (true);

create policy "Enable all access for all users" on public.contracts
for all using (true) with check (true);
