create or replace function public.get_household_members(p_household_id uuid)
returns table (user_id uuid, email text)
language sql
security definer
set search_path = public
as $$
  select hm.user_id, u.email::text
  from household_members hm
  join auth.users u on u.id = hm.user_id
  where hm.household_id = p_household_id
    and public.is_member_of(p_household_id);
$$;
grant execute on function public.get_household_members(uuid) to authenticated;