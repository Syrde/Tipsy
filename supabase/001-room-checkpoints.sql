-- Run once in this project's Supabase SQL Editor.
-- The API table and function are accessible only with the server's secret key.
create table if not exists public.tipzy_rooms (
 code text primary key check (code ~ '^[0-9A-F]{6}$'),
 revision bigint not null default 1,
 payload jsonb not null,
 updated_at timestamptz not null default now(),
 expires_at timestamptz not null
);
alter table public.tipzy_rooms enable row level security;
revoke all on public.tipzy_rooms from anon, authenticated;
grant select, insert, update, delete on public.tipzy_rooms to service_role;

create or replace function public.tipzy_save_room(
 p_code text, p_payload jsonb, p_expected_revision bigint, p_expires_at timestamptz
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare
 current_revision bigint;
 current_checkpoint text;
 new_revision bigint;
begin
 select revision, payload->>'checkpointId' into current_revision, current_checkpoint
 from public.tipzy_rooms where code = p_code for update;
 -- A network timeout can happen after the write committed. The same request is safe to retry.
 if current_checkpoint = p_payload->>'checkpointId' then return current_revision; end if;
 if current_revision is null and p_expected_revision = 0 then
  insert into public.tipzy_rooms(code, payload, revision, expires_at)
  values(p_code, p_payload, 1, p_expires_at) returning revision into new_revision;
 elsif current_revision = p_expected_revision then
  update public.tipzy_rooms set payload=p_payload, revision=revision+1,
   updated_at=now(), expires_at=p_expires_at where code=p_code
   returning revision into new_revision;
 else
  raise exception 'Room revision conflict';
 end if;
 return new_revision;
end;
$$;
revoke all on function public.tipzy_save_room(text,jsonb,bigint,timestamptz) from public, anon, authenticated;
grant execute on function public.tipzy_save_room(text,jsonb,bigint,timestamptz) to service_role;
