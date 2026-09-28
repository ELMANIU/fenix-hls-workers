export default {

async fetch(request, env) {

const url = new URL(request.url);


// PLAYLIST HLS
if (url.pathname === "/" || url.pathname === "/index.m3u8") {

  let lista = await env.SEGMENTOS.get("playlist", "json");

  if (!lista) {
    return new Response(
      "Sin segmentos todavía",
      {status:404}
    );
  }


  let m3u8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:25
#EXT-X-MEDIA-SEQUENCE:0
`;


  for (let seg of lista.segmentos) {

    m3u8 += `#EXTINF:25,
segmento/${seg}
`;

  }


  return new Response(
    m3u8,
    {
      headers:{
        "content-type":"application/vnd.apple.mpegurl",
        "cache-control":"no-store"
      }
    }
  );

}



// SEGMENTOS TS DESDE TELEGRAM
if (url.pathname.startsWith("/segmento/")) {


 const nombre = url.pathname.split("/").pop();


 const dato = await env.SEGMENTOS.get(nombre,"json");


 if(!dato){

   return new Response(
    "Segmento no encontrado",
    {status:404}
   );

 }



 // obtener ruta real de Telegram

 const info = await fetch(
 `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/getFile?file_id=${dato.file_id}`
 );


 const json = await info.json();


 const file_path = json.result.file_path;



 const archivo = await fetch(
 `https://api.telegram.org/file/bot${env.TELEGRAM_TOKEN}/${file_path}`
 );


 return new Response(
   archivo.body,
   {
    headers:{
     "content-type":"video/mp2t",
     "cache-control":"no-store"
    }
   }
 );


}



return new Response("Fenix HLS Worker OK");


}

};
