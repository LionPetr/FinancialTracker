-- 1. Fix existing personal rows
update transactions
set paid_by_user_id = user_id
where scope = 'personal' and paid_by_user_id is null;
-- 2. Replace scope check (drop both possible names)
alter table transactions drop constraint if exists transactions_check;
alter table transactions drop constraint if exists transactions_scope_check;
alter table transactions add constraint transactions_scope_check check (
  (scope = 'personal' and household_id is null and paid_by_user_id is not null)
  or
  (scope = 'joint' and household_id is not null and paid_by_user_id is not null)
);
-- 3. Replace personal insert policy
drop policy if exists "Insert personal transactions" on transactions;
create policy "Insert personal transactions"
  on transactions for insert
  to authenticated
  with check (
    scope = 'personal'
    and user_id = auth.uid()
    and household_id is null
    and paid_by_user_id = auth.uid()
  );