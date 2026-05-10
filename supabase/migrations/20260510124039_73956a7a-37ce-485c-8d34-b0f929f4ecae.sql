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

  if requested = 'admin' then
    final_role := 'admin'::public.app_role;
  elsif requested = 'teacher' then
    final_role := 'teacher'::public.app_role;
  else
    final_role := 'student'::public.app_role;
  end if;

  insert into public.user_roles (user_id, role) values (new.id, final_role);
  return new;
end;
$function$;