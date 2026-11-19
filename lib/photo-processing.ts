export function validatePhoto(file:File){
 const supported=['image/jpeg','image/png','image/webp','image/heic','image/heif'];
 if(!(supported.includes(file.type)||!file.type&&/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)))throw Error('Escolha uma foto JPEG, PNG ou WebP. Fotos HEIC dependem do suporte do navegador.');
 if(!file.size||file.size>20*1024*1024)throw Error('Escolha uma foto de até 20 MB.');
}
export async function decodePhoto(file:File){
 validatePhoto(file);
 if(typeof createImageBitmap==='function'){try{const bitmap=await createImageBitmap(file);if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>60000000){bitmap.close();throw Error('A foto excede o limite de 60 megapixels.');}return {source:bitmap as CanvasImageSource,width:bitmap.width,height:bitmap.height,close:()=>bitmap.close()};}catch(error){if(error instanceof Error&&error.message.includes('megapixels'))throw error;}}
 const url=URL.createObjectURL(file),photo=new Image();
 try{photo.src=url;await photo.decode();if(!photo.naturalWidth||!photo.naturalHeight||photo.naturalWidth*photo.naturalHeight>60000000)throw Error('A foto excede o limite de 60 megapixels.');return {source:photo as CanvasImageSource,width:photo.naturalWidth,height:photo.naturalHeight,close:()=>URL.revokeObjectURL(url)};}catch(error){URL.revokeObjectURL(url);if(error instanceof Error&&error.message.includes('megapixels'))throw error;throw Error('Não foi possível abrir esta foto. Exporte como JPEG, PNG ou WebP e tente novamente.');}
}
const maxBytes=4*1024*1024;
export async function encodePhoto(canvas:HTMLCanvasElement){
 const encode=(target:HTMLCanvasElement,type:string,quality:number)=>new Promise<Blob|null>(resolve=>target.toBlob(resolve,type,quality));
 // Unsupported encoders return PNG (not necessarily the requested MIME).
 const preferred=await encode(canvas,'image/webp',.86);
 if(preferred&&['image/webp','image/png','image/jpeg'].includes(preferred.type)&&preferred.size<=maxBytes)return preferred;
 const flat=document.createElement('canvas');flat.width=canvas.width;flat.height=canvas.height;
 const context=flat.getContext('2d');if(!context)throw Error('Não foi possível preparar a foto.');
 context.fillStyle='#fff';context.fillRect(0,0,flat.width,flat.height);context.drawImage(canvas,0,0);
 for(const quality of [.86,.7,.5]){const blob=await encode(flat,'image/jpeg',quality);if(blob&&['image/jpeg','image/png'].includes(blob.type)&&blob.size<=maxBytes)return blob;}
 throw Error('Não foi possível reduzir esta foto para envio. Escolha uma imagem menor.');
}
export async function preparePhoto(file:File){
 const photo=await decodePhoto(file);
 try{const canvas=document.createElement('canvas'),scale=Math.min(1,1600/Math.max(photo.width,photo.height));canvas.width=Math.max(1,Math.round(photo.width*scale));canvas.height=Math.max(1,Math.round(photo.height*scale));const context=canvas.getContext('2d');if(!context)throw Error('Não foi possível preparar a foto.');context.drawImage(photo.source,0,0,canvas.width,canvas.height);return await encodePhoto(canvas);}finally{photo.close();}
}
export function photoExtension(blob:Blob){if(blob.type==='image/webp')return 'webp';if(blob.type==='image/png')return 'png';if(blob.type==='image/jpeg')return 'jpg';throw Error('Formato de foto não suportado.');}
export function cropBounds(width:number,height:number,zoom:number,x:number,y:number){const side=Math.min(width,height)/zoom;return {side,left:(width-side)*(x+1)/2,top:(height-side)*(y+1)/2};}
