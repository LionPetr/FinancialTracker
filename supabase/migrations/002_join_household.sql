-- 1. Add invite codes
alter table households
  add column if not exists invite_code text;
update households
set invite_code = upper(substr(md5(random()::text || id::text), 1, 8))
where invite_code is null;
alter table households
  alter column invite_code set not null;
create unique index if not exists households_invite_code_key
  on households (invite_code);
-- 2. Update create so new households get a code
create or replace function public.create_household(p_name text default 'Our household')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
  new_code text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
  insert into households (name, invite_code)
  values (p_name, new_code)
  returning id into new_household_id;
  insert into household_members (household_id, user_id, role)
  values (new_household_id, auth.uid(), 'owner');
  return new_household_id;
end;
$$;
-- 3. Join by invite code
create or replace function public.join_household(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_household_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  select id into target_household_id
  from households
  where invite_code = upper(trim(p_invite_code));
  if target_household_id is null then
    raise exception 'Invalid invite code';
  end if;
  if exists (
    select 1 from household_members
    where household_id = target_household_id and user_id = auth.uid()
  ) then
    return target_household_id; -- already a member
  end if;
  insert into household_members (household_id, user_id, role)
  values (target_household_id, auth.uid(), 'member');
  return target_household_id;
end;
$$;
grant execute on function public.join_household(text) to authenticated;