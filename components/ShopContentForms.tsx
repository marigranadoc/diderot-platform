'use client';
import {useState} from 'react';
import ShopImageUpload from './ShopImageUpload';
import {layouts,reorder,blankShopSection,normalizeShop,type ShopCollection,type ShopDocument,type ShopItem,type ShopPost,type ShopSection} from '../lib/creator-shop';

export type ItemFormValue=ShopItem&{price:string;collection_ids:string[]};
type Common={userId:string;disabled:boolean;onCancel:()=>void};
export function ShopItemForm({value,onChange,onSubmit,document:doc,...props}:Common&{value:ItemFormValue;document:ShopDocument;onChange:(value:ItemFormValue)=>void;onSubmit:()=>void}){
 const [imageBusy,setImageBusy]=useState(false);const blocked=props.disabled||imageBusy;
 return <form className="shop-edit-form" onSubmit={event=>{event.preventDefault();if(!blocked)onSubmit();}}><h2>{value.source_slug?'Editar recomendação do catálogo':'Cadastrar produto na minha loja'}</h2><fieldset disabled={blocked}>
  {value.source_slug?<p>Item do catálogo. Nome, marca e preço são preservados. Você pode usar sua própria foto nesta loja e personalizar a recomendação.</p>:<>
   <label>Nome do produto<input required minLength={2} maxLength={120} value={value.name} onChange={e=>onChange({...value,name:e.target.value})}/></label>
   <label>Marca ou loja<input maxLength={2000} value={value.brand} onChange={e=>onChange({...value,brand:e.target.value})}/></label>
   <label>Categoria<input maxLength={2000} value={value.category} onChange={e=>onChange({...value,category:e.target.value})}/></label>
   <label>Preço informado (R$, opcional)<input inputMode="decimal" value={value.price} placeholder="Ex.: 150,50" onChange={e=>onChange({...value,price:e.target.value})}/></label>
   <label>Link do produto ou link de afiliado<input type="url" placeholder="https://" maxLength={2000} value={value.url} onChange={e=>onChange({...value,url:e.target.value})}/></label>
   <label className="shop-check"><input type="checkbox" checked={value.is_affiliate} onChange={e=>onChange({...value,is_affiliate:e.target.checked})}/>Este é um link de afiliado informado por mim</label>
  </>}
  <ShopImageUpload userId={props.userId} kind="shop" value={value.image_path} onChange={path=>onChange({...value,image_path:path})} label="Escolher foto do produto" disabled={props.disabled} onBusyChange={setImageBusy}/>
  <label>Sua recomendação<textarea aria-label="Sua recomendação" maxLength={2000} value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></label>
  <SelectedContents title="Salvar nas coleções" options={doc.collections.map(x=>({id:x.id,name:x.title+(x.archived?' · arquivada':'')}))} selected={value.collection_ids} onChange={collection_ids=>onChange({...value,collection_ids})}/><small>Sem coleção, o produto fica em Todas as escolhas. Marque mais de uma para reutilizá-lo; desmarque a anterior para movê-lo.</small>
  <label className="shop-check"><input type="checkbox" checked={value.visible} onChange={e=>onChange({...value,visible:e.target.checked})}/>Exibir este produto na loja publicada</label>
 </fieldset><p>O cadastro fica no rascunho. Publique as alterações para atualizar a loja pública. Link informado não comprova comissão ou venda.</p><div className="campaign-actions"><button className="dark-button" disabled={blocked}>Salvar produto</button><button type="button" disabled={blocked} onClick={props.onCancel}>Cancelar produto</button></div></form>;
}

function SelectedContents({title,options,selected,onChange}:{title:string;options:{id:string;name:string}[];selected:string[];onChange:(ids:string[])=>void}){
 return <fieldset className="shop-content-selection"><legend>{title}</legend>{options.length===0?<p>Nenhum item cadastrado.</p>:options.map(option=><label className="shop-check" key={option.id}><input type="checkbox" checked={selected.includes(option.id)} onChange={e=>onChange(e.target.checked?[...selected,option.id]:selected.filter(id=>id!==option.id))}/>{option.name}</label>)}
  {selected.length>1&&<ol>{selected.map((id,index)=><li key={id}>{options.find(x=>x.id===id)?.name}<button type="button" disabled={index===0} onClick={()=>onChange(reorder(selected,index,-1))}>Subir {index+1}</button><button type="button" disabled={index===selected.length-1} onClick={()=>onChange(reorder(selected,index,1))}>Descer {index+1}</button></li>)}</ol>}
 </fieldset>;
}

export function ShopPostForm({value,onChange,onSubmit,document:doc,...props}:Common&{value:ShopPost;document:ShopDocument;onChange:(value:ShopPost)=>void;onSubmit:()=>void}){
 const [imageBusy,setImageBusy]=useState(false);const blocked=props.disabled||imageBusy;
 return <form className="shop-edit-form" onSubmit={e=>{e.preventDefault();if(!blocked)onSubmit();}}><h2>Editar post</h2><fieldset disabled={blocked}>
  <label>Título do post<input required minLength={2} maxLength={120} value={value.title} onChange={e=>onChange({...value,title:e.target.value})}/></label>
  <label>Legenda do post<textarea aria-label="Legenda do post" maxLength={2000} value={value.caption} onChange={e=>onChange({...value,caption:e.target.value})}/></label>
  <ShopImageUpload userId={props.userId} kind="shop" value={value.image_path} onChange={path=>onChange({...value,image_path:path})} label="Escolher foto do post" disabled={props.disabled} onBusyChange={setImageBusy}/>
  <SelectedContents title="Produtos associados ao post" options={doc.items.map(x=>({id:x.id,name:x.name}))} selected={value.item_ids} onChange={item_ids=>onChange({...value,item_ids})}/>
  <label className="shop-check"><input type="checkbox" checked={value.visible} onChange={e=>onChange({...value,visible:e.target.checked})}/>Exibir este post na loja publicada</label>
 </fieldset><div className="campaign-actions"><button className="dark-button" disabled={blocked}>Salvar post</button><button type="button" disabled={blocked} onClick={props.onCancel}>Cancelar post</button></div></form>;
}

export function ShopCollectionForm({value,onChange,onSubmit,document:doc,...props}:Common&{value:ShopCollection;document:ShopDocument;onChange:(value:ShopCollection)=>void;onSubmit:(section?:ShopSection)=>void}){
 const [newSection,setNewSection]=useState<ShopSection|null>(null);
 return <form className="shop-edit-form" onSubmit={e=>{e.preventDefault();onSubmit(newSection??undefined);}}><h2>Editar coleção</h2><fieldset disabled={props.disabled}>
  <label>Seção da coleção<select required value={newSection?'__new__':value.section_id??normalizeShop(doc).sections[0]?.id} onChange={e=>{if(e.target.value==='__new__'){const section=blankShopSection();setNewSection(section);onChange({...value,section_id:section.id});}else{setNewSection(null);onChange({...value,section_id:e.target.value});}}}>{normalizeShop(doc).sections.map(x=><option key={x.id} value={x.id}>{x.title}{x.visible?'':' · oculta'}</option>)}{normalizeShop(doc).sections.length<20&&<option value="__new__">+ Criar nova seção</option>}</select></label>{newSection&&<label>Nome da nova seção<input required minLength={2} maxLength={100} value={newSection.title} onChange={e=>setNewSection({...newSection,title:e.target.value})}/></label>}<label>Nome da coleção<input required minLength={2} maxLength={100} value={value.title} onChange={e=>onChange({...value,title:e.target.value})}/></label>
  <label>Descrição da coleção<textarea aria-label="Descrição da coleção" maxLength={2000} value={value.description} onChange={e=>onChange({...value,description:e.target.value})}/></label>
  <fieldset className="shop-layout-options"><legend>Visual da coleção</legend>{layouts.map(layout=><label key={layout.value}><input type="radio" name="section-layout" checked={value.layout===layout.value} onChange={()=>onChange({...value,layout:layout.value})}/><strong>{layout.name}</strong><small>{layout.description}</small><span className={`layout-mini mini-${layout.value}`} aria-hidden="true"><i/><i/><i/></span></label>)}</fieldset>
  <SelectedContents title="Produtos desta coleção" options={doc.items.map(x=>({id:x.id,name:x.name}))} selected={value.item_ids} onChange={item_ids=>onChange({...value,item_ids})}/>
  <SelectedContents title="Posts desta coleção" options={doc.posts.map(x=>({id:x.id,name:x.title}))} selected={value.post_ids} onChange={post_ids=>onChange({...value,post_ids})}/>
  <label className="shop-check"><input type="checkbox" checked={value.visible} onChange={e=>onChange({...value,visible:e.target.checked})}/>Coleção visível na loja publicada</label>
 </fieldset><div className="campaign-actions"><button className="dark-button" disabled={props.disabled}>Salvar coleção</button><button type="button" disabled={props.disabled} onClick={props.onCancel}>Cancelar coleção</button></div></form>;
}

export function ShopSectionForm({value,onChange,onSubmit,disabled,onCancel}:{value:ShopSection;onChange:(value:ShopSection)=>void;onSubmit:()=>void;disabled:boolean;onCancel:()=>void}){return <form className="shop-edit-form" onSubmit={e=>{e.preventDefault();onSubmit();}}><h2>Editar seção da loja</h2><fieldset disabled={disabled}><label>Nome da seção<input required minLength={2} maxLength={100} value={value.title} onChange={e=>onChange({...value,title:e.target.value})}/></label><label className="shop-check"><input type="checkbox" checked={value.visible} onChange={e=>onChange({...value,visible:e.target.checked})}/>Seção visível na loja publicada</label></fieldset><div className="campaign-actions"><button className="dark-button" disabled={disabled}>Salvar seção</button><button type="button" disabled={disabled} onClick={onCancel}>Cancelar seção</button></div></form>;}
