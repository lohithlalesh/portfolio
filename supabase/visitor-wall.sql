create extension if not exists pgcrypto;

create table if not exists public.visitor_marks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null default 'visitor',
  message text not null default 'left a mark',
  image_data text not null,
  approved boolean not null default true,
  constraint visitor_marks_author_length check (char_length(author) between 1 and 34),
  constraint visitor_marks_message_length check (char_length(message) between 1 and 90),
  constraint visitor_marks_image_data_shape check (image_data like 'data:image/png;base64,%')
);

alter table public.visitor_marks enable row level security;

drop policy if exists "Anyone can read approved visitor marks" on public.visitor_marks;
create policy "Anyone can read approved visitor marks"
on public.visitor_marks
for select
to anon
using (approved = true);

drop policy if exists "Anyone can add visitor marks" on public.visitor_marks;
create policy "Anyone can add visitor marks"
on public.visitor_marks
for insert
to anon
with check (
  approved = true
  and char_length(author) between 1 and 34
  and char_length(message) between 1 and 90
  and image_data like 'data:image/png;base64,%'
);

create index if not exists visitor_marks_created_at_idx
on public.visitor_marks (created_at desc);
