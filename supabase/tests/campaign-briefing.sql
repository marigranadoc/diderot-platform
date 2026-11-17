begin;
select set_config('test.campaign_a',gen_random_uuid()::text,true),set_config('test.campaign_b',gen_random_uuid()::text,true),set_config('test.campaign_c',gen_random_uuid()::text,true),set_config('test.campaign_id',gen_random_uuid()::text,true),set_config('test.campaign_request',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
select current_setting(key)::uuid,'authenticated','authenticated',current_setting(key)||'@example.invalid',now(),now(),now() from unnest(array['test.campaign_a','test.campaign_b','test.campaign_c']) key;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.campaign_a'),true);
insert into public.organizations(name) values('Campaign fixture organization');
select set_config('test.campaign_org',(select id::text from public.organizations where owner_user_id=auth.uid()),true);
select set_config('test.campaign_payload','{"title":"Hybrid fixture","campaign_type":"hybrid","description":"Briefing","objective":"Awareness","category":"Moda","starts_on":"2027-01-10","ends_on":"2027-01-20","application_deadline":"2027-01-12","briefing":{"tone":"Editorial","messages":"Conteúdo demonstrativo","restrictions":"Sem alegações comerciais","references":["https://example.invalid/reference"],"products":[{"name":"Produto fictício","url":"https://example.invalid/product"}]},"slots":[{"modality":"ugc","quantity":2,"budget_per_creator_cents":15000,"briefing":{"requirements":{"languages":"Português","min_followers":null},"deliverables":{"videos":2,"posting_required":false,"deadline":"2027-01-18","revision_rounds":2},"rights":{"organic":true,"paid":false,"duration_months":3,"territory":"Brasil"},"compensation":{"production_fee_cents":15000,"publication_fee_cents":0,"commission_basis_points":null}}},{"modality":"influencer","quantity":1,"budget_per_creator_cents":null,"briefing":{"requirements":{"min_followers":500},"compensation":{"commission_basis_points":1250,"commission_terms":"Condição planejada, sem rastreamento ativo"}}}]}',true);
do $$ declare data jsonb; previous_request uuid; begin
 data:=public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,0,current_setting('test.campaign_request')::uuid,current_setting('test.campaign_payload')::jsonb);
 if (data->>'revision')::int<>1 or data->>'status'<>'draft' then raise exception 'Draft creation failed'; end if;
 perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,0,current_setting('test.campaign_request')::uuid,current_setting('test.campaign_payload')::jsonb);
 if (select count(*) from public.campaign_drafts)<>1 or (select count(*) from public.campaign_draft_slots)<>2 then raise exception 'Retry duplicated draft or slots'; end if;
 begin
  perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,1,current_setting('test.campaign_request')::uuid,current_setting('test.campaign_payload')::jsonb||'{"title":"Different content"}');raise exception 'Reused request mutated content';
 exception when invalid_parameter_value then null; end;
 data:=public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,1,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb||'{"title":"Edited fixture"}');
 if (data->>'revision')::int<>2 then raise exception 'Revision did not advance'; end if;
 begin
  perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,1,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb);raise exception 'Stale writer overwrote draft';
 exception when serialization_failure then null; end;
 begin
  perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb||'{"status":"published"}');raise exception 'Publication accepted';
 exception when invalid_parameter_value then null; end;
 begin
  perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb||'{"campaign_type":"ugc"}');raise exception 'Incompatible slots accepted';
 exception when invalid_parameter_value then null; end;
 begin
  perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb||'{"ends_on":"2027-01-01"}');raise exception 'Invalid dates accepted';
 exception when invalid_parameter_value then null; end;
 begin
  perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb||'{"slots":[{"modality":"ugc","quantity":0,"budget_per_creator_cents":10}]}');raise exception 'Invalid quantity accepted';
 exception when invalid_parameter_value then null; end;
 if (select title from public.campaign_drafts where id=current_setting('test.campaign_id')::uuid)<>'Edited fixture' or (select count(*) from public.campaign_draft_slots)<>2 then raise exception 'Failed mutation left partial changes'; end if;
 begin update public.campaign_drafts set status='draft';raise exception 'Direct write allowed';exception when insufficient_privilege then null;end;
 begin insert into public.campaign_draft_slots(campaign_id,modality,quantity) values(current_setting('test.campaign_id')::uuid,'hybrid',1);raise exception 'Direct slot write allowed';exception when insufficient_privilege then null;end;
end $$;

do $$ declare bad jsonb; base jsonb:=current_setting('test.campaign_payload')::jsonb; legacy jsonb; begin
 if (select briefing->>'tone' from public.campaign_drafts where id=current_setting('test.campaign_id')::uuid)<>'Editorial' then raise exception 'General briefing not persisted'; end if;
 if (select briefing#>>'{compensation,publication_fee_cents}' from public.campaign_draft_slots where campaign_id=current_setting('test.campaign_id')::uuid and modality='ugc')<>'0' then raise exception 'Explicit zero lost'; end if;
 if (select briefing#>>'{compensation,commission_basis_points}' from public.campaign_draft_slots where campaign_id=current_setting('test.campaign_id')::uuid and modality='influencer')<>'1250' then raise exception 'Commission precision lost'; end if;
 for bad in select * from jsonb_array_elements(jsonb_build_array(
  jsonb_set(base,'{briefing,tone}','123'),
  jsonb_set(base,'{briefing,role}','"admin"'),
  jsonb_set(base,'{briefing,references}','["javascript:alert(1)"]'),
  jsonb_set(base,'{briefing,references}','["https://user:password@example.invalid/x"]'),
  jsonb_set(base,'{briefing,products}','[{"name":"Missing URL"}]'),
  jsonb_set(base,'{slots,0,briefing,requirements,min_followers}','0'),
  jsonb_set(base,'{slots,0,briefing,deliverables,posting_required}','"false"'),
  jsonb_set(base,'{slots,0,briefing,deliverables,deadline}','"2027-02-30"'),
  jsonb_set(base,'{slots,0,briefing,compensation,production_fee_cents}','1.5'),
  jsonb_set(base,'{slots,0,briefing,compensation,commission_basis_points}','10001'),
  jsonb_set(base,'{slots,0,briefing,rights,paid}','"yes"'),
  jsonb_set(base,'{slots,0,briefing,rights,duration_months}','0'),
  jsonb_set(base,'{slots,0,briefing,publish}','true')
 )) loop
  begin perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),bad);raise exception 'Invalid detailed briefing accepted'; exception when invalid_parameter_value then null;end;
 end loop;
 legacy:=base-'briefing'; legacy:=jsonb_set(legacy,'{slots}',(select jsonb_agg(item-'briefing') from jsonb_array_elements(legacy->'slots') item));
 begin perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),legacy);raise exception 'Legacy client erased extended briefing';exception when invalid_parameter_value then null;end;
 if (select revision from public.campaign_drafts where id=current_setting('test.campaign_id')::uuid)<>2 or (select briefing->>'tone' from public.campaign_drafts where id=current_setting('test.campaign_id')::uuid)<>'Editorial' then raise exception 'Rejected request left partial change'; end if;
 begin perform diderot_private.check_campaign_briefing('{}');raise exception 'Private validator exposed';exception when insufficient_privilege then null;end;
end $$;

reset role;
insert into public.organization_members(organization_id,user_id,role) values(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_b')::uuid,'member');
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.campaign_b'),true);
do $$ begin
 if (select count(*) from public.campaign_drafts)<>1 or (select count(*) from public.campaign_draft_slots)<>2 then raise exception 'Linked member cannot read'; end if;
 begin perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb);raise exception 'Member edited draft';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.campaign_c'),true);
insert into public.organizations(name) values('Unrelated campaign organization');
do $$ declare own_org uuid; begin
 if exists(select 1 from public.campaign_drafts) or exists(select 1 from public.campaign_draft_slots) then raise exception 'Other organization reads drafts'; end if;
 select id into own_org from public.organizations where owner_user_id=auth.uid();
 begin perform public.save_campaign_draft(own_org,current_setting('test.campaign_id')::uuid,2,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb);raise exception 'Draft moved across organizations';exception when insufficient_privilege then null;end;
 begin perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,gen_random_uuid(),0,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb);raise exception 'Created in someone else organization';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.campaign_a'),true);
select public.organization_team('remove',current_setting('test.campaign_org')::uuid,null,null,current_setting('test.campaign_b')::uuid);
select set_config('request.jwt.claim.sub',current_setting('test.campaign_b'),true);
do $$ begin
 if exists(select 1 from public.campaign_drafts) or exists(select 1 from public.campaign_draft_slots) then raise exception 'Revoked member still reads campaign data'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.campaign_drafts;raise exception 'Anonymous read';exception when insufficient_privilege then null;end;
 begin perform public.save_campaign_draft(current_setting('test.campaign_org')::uuid,gen_random_uuid(),0,gen_random_uuid(),current_setting('test.campaign_payload')::jsonb);raise exception 'Anonymous RPC';exception when insufficient_privilege then null;end;
end $$;
reset role;
select 'PASS: detailed briefing, zero/null, precision, invalid types, URLs, UGC audience prohibition, legacy editor guard, atomic draft/slots, reread/edit, idempotent request retry, stale version rejection, invalid data rollback, readonly member, revoked membership denial, cross-organization isolation, no direct writes or publication' as result;
rollback;
