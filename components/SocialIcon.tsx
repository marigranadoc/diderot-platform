export default function SocialIcon({label,url}:{label:string;url:string}){
 const key=`${label} ${url}`.toLowerCase();
 const base={viewBox:'0 0 24 24',width:22,height:22,'aria-hidden':true as const,focusable:'false' as const};
 if(key.includes('instagram'))return <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
 if(key.includes('tiktok'))return <svg {...base} fill="currentColor"><path d="M14 2h3c.2 2.5 1.6 4.1 4 4.5v3a9 9 0 0 1-4-1.3v8.1A5.7 5.7 0 1 1 12 10.7v3.1a2.7 2.7 0 1 0 2 2.6V2Z"/></svg>;
 if(key.includes('youtube')||key.includes('youtu.be'))return <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3Z" fill="currentColor" stroke="none"/></svg>;
 if(key.includes('facebook'))return <svg {...base} fill="currentColor"><path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 1.9-5 5.3V9H7v4h3v9Z"/></svg>;
 if(key.includes('linkedin'))return <svg {...base} fill="currentColor"><circle cx="4.5" cy="4.5" r="2"/><path d="M3 8h3v13H3zm6 0h3v1.8c.9-1.4 2-2 3.7-2 3.5 0 4.3 2.3 4.3 5.4V21h-3v-7c0-1.8-.2-3.4-2.3-3.4S12 12.3 12 14v7H9Z"/></svg>;
 if(key.includes('pinterest'))return <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="11" r="8"/><path d="m9 22 3-14m-2 7c4 3 7-1 6-5-1-4-7-3-7 1"/></svg>;
 if(key.includes('twitter')||key.includes('x.com')||label.toLowerCase()==='x')return <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 3h4l12 18h-4ZM20 3 4 21"/></svg>;
 return <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>;
}
