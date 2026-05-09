-- Update handle_new_user to honor a chosen role from signup metadata (student or teacher only).
-- Admin role can never be self-assigned; it must be granted by an existing admin or via claim_admin_if_none.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  requested text := coalesce(new.raw_user_meta_data->>'role', 'student');
  final_role public.app_role;
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  if requested = 'teacher' then
    final_role := 'teacher'::public.app_role;
  else
    final_role := 'student'::public.app_role;
  end if;

  insert into public.user_roles (user_id, role) values (new.id, final_role);
  return new;
end;
$function$;

-- Ensure trigger exists (in case it was missing)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bootstrap function: lets the currently authenticated user claim admin
-- ONLY if no admin exists yet. Safe to expose.
CREATE OR REPLACE FUNCTION public.claim_admin_if_none()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  uid uuid := auth.uid();
  has_any_admin boolean;
begin
  if uid is null then
    return false;
  end if;
  select exists(select 1 from public.user_roles where role = 'admin') into has_any_admin;
  if has_any_admin then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin')
    on conflict do nothing;
  return true;
end;
$function$;

-- Helper for admins to list profiles + their roles via a single RPC (avoids client joins)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(id uuid, email text, display_name text, created_at timestamptz, roles public.app_role[])
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select p.id, p.email, p.display_name, p.created_at,
         coalesce(array_agg(ur.role) filter (where ur.role is not null), '{}') as roles
  from public.profiles p
  left join public.user_roles ur on ur.user_id = p.id
  where public.has_role(auth.uid(), 'admin')
  group by p.id
  order by p.created_at desc;
$function$;

-- Allow admins to check if any admin exists (used by UI to show claim button)
CREATE OR REPLACE FUNCTION public.any_admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists(select 1 from public.user_roles where role = 'admin');
$function$;