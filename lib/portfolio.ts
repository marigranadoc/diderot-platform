export const portfolioTypes=[['ugc_video','Vídeo UGC'],['photo','Fotografia'],['case','Case'],['demo','Conteúdo demonstrativo'],['project','Projeto realizado'],['external','Outro trabalho']] as const;
export function portfolioLink(value:string):string|null {
 try{const url=new URL(value.trim());return url.protocol==='https:'&&!url.username&&!url.password&&url.hostname?url.href:null;}catch{return null;}
}
