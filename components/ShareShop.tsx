'use client';
import {useState} from 'react';
import AppIcon from './AppIcon';
export default function ShareShop({slug}:{slug:string}){const [message,setMessage]=useState('');async function share(){setMessage('');const url=new URL('/loja/'+encodeURIComponent(slug),window.location.origin).href;try{if(navigator.share)await navigator.share({title:'Minha curadoria na Diderot',url});else{await navigator.clipboard.writeText(url);setMessage('Link da loja copiado.');}}catch(e){if(!(e instanceof DOMException&&e.name==='AbortError'))setMessage('Não foi possível compartilhar. Abra a loja e copie o endereço.');}}return <span className="ux-share"><button type="button" onClick={()=>void share()}><AppIcon name="share"/> Compartilhar loja</button>{message&&<small role="status">{message}</small>}</span>;}
