create or replace function public.create_household(p_name text default 'Our household')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  insert into households (name)
  values (p_name)
  returning id into new_household_id;
  insert into household_members (household_id, user_id, role)
  values (new_household_id, auth.uid(), 'owner');
  return new_household_id;
end;
$$;
-- Allow logged-in users to call it
grant execute on function public.create_household(text) to authenticated;