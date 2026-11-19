-- Browsers may return PNG when the WebP encoder is unavailable.
-- Keep private ownership, raster-only MIME types and existing file-size limits.
update storage.buckets set allowed_mime_types=array['image/webp','image/png','image/jpeg']
where id='diderot-media';

alter policy diderot_media_upload on storage.objects with check(
 bucket_id='diderot-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and name ~ '^[a-f0-9-]{36}/(creator|brand|shop)/[a-f0-9-]{36}[.](webp|png|jpg)$'
 and (exists(select 1 from public.creator_profiles where user_id=(select auth.uid()))
      or exists(select 1 from public.organizations where owner_user_id=(select auth.uid())))
);

create or replace function diderot_private.check_shop_media(path text,actor uuid,folder text)
returns void language plpgsql stable security definer set search_path=''
as $$ begin
 if path is null then return; end if;
 if path !~ ('^'||actor::text||'/'||folder||'/[a-f0-9-]{36}[.](webp|png|jpg)$') or not exists(
  select 1 from storage.objects where bucket_id='diderot-media' and name=path and owner_id=actor::text
  and metadata->>'mimetype'=case
   when path like '%.webp' then 'image/webp'
   when path like '%.png' then 'image/png'
   when path like '%.jpg' then 'image/jpeg'
  end
 ) then raise exception 'Upload an image owned by this account' using errcode='22023'; end if;
end; $$;
revoke all on function diderot_private.check_shop_media(text,uuid,text) from public,anon,authenticated;
