-- First enable Firebase Auth under Supabase Authentication > Third-Party Auth
-- using Firebase project ID healthypet-62dd9.
-- Policies include the anon role because Firebase ID tokens may not have a
-- custom role claim; they still require this exact Firebase issuer and audience.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'medical-record-attachments',
  'medical-record-attachments',
  false,
  10485760,
  array[
    'image/avif',
    'image/bmp',
    'image/gif',
    'image/heic',
    'image/heif',
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/webp',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.medical_record_vets (
  firebase_uid text primary key,
  created_at timestamptz not null default now()
);

alter table public.medical_record_vets enable row level security;
revoke all on table public.medical_record_vets from anon, authenticated;

create or replace function public.is_medical_record_vet()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.medical_record_vets
    where firebase_uid = (select auth.jwt() ->> 'sub')
  );
$$;

revoke all on function public.is_medical_record_vet() from public;
grant execute on function public.is_medical_record_vet() to anon, authenticated;

drop policy if exists "Medical record owners and vets can read attachments"
  on storage.objects;
create policy "Medical record owners and vets can read attachments"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'medical-record-attachments'
  and (select auth.jwt() ->> 'iss') = 'https://securetoken.google.com/healthypet-62dd9'
  and (select auth.jwt() ->> 'aud') = 'healthypet-62dd9'
  and (storage.foldername(name))[1] = 'medicalRecords'
  and (
    (storage.foldername(name))[3] = (select auth.jwt() ->> 'sub')
    or (
      (storage.foldername(name))[4] = (select auth.jwt() ->> 'sub')
      and (select public.is_medical_record_vet())
    )
  )
);

drop policy if exists "Vets can upload medical record attachments"
  on storage.objects;
create policy "Vets can upload medical record attachments"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'medical-record-attachments'
  and (select auth.jwt() ->> 'iss') = 'https://securetoken.google.com/healthypet-62dd9'
  and (select auth.jwt() ->> 'aud') = 'healthypet-62dd9'
  and (storage.foldername(name))[1] = 'medicalRecords'
  and (storage.foldername(name))[4] = (select auth.jwt() ->> 'sub')
  and (select public.is_medical_record_vet())
);

drop policy if exists "Vets can delete medical record attachments"
  on storage.objects;
create policy "Vets can delete medical record attachments"
on storage.objects
for delete
to anon, authenticated
using (
  bucket_id = 'medical-record-attachments'
  and (select auth.jwt() ->> 'iss') = 'https://securetoken.google.com/healthypet-62dd9'
  and (select auth.jwt() ->> 'aud') = 'healthypet-62dd9'
  and (storage.foldername(name))[1] = 'medicalRecords'
  and (storage.foldername(name))[4] = (select auth.jwt() ->> 'sub')
  and (select public.is_medical_record_vet())
);

-- Add each authorized Firebase doctor UID from Firebase Console > Authentication > Users:
-- insert into public.medical_record_vets (firebase_uid) values ('FIREBASE_DOCTOR_UID');
