export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // MANIFEST HLS
    if (url.pathname === "/" || url.pathname === "/index.m3u8") {

      const data = await env.SEGMENTOS.get("playlist");

      if (!data) {
        return new Response(
          "#EXTM3U\n#EXT-X-ENDLIST",
          {
            headers:{
              "content-type":"application/vnd.apple.mpegurl",
              "cache-control":"no-cache"
            }
          }
        );
      }


      return new Response(data,{
        headers:{
          "content-type":"application/vnd.apple.mpegurl",
          "cache-control":"no-cache, no-store"
        }
      });

    }


    // SEGMENTOS TS
    if(url.pathname.startsWith("/segmento/")){

      const nombre = url.pathname.split("/").pop();


      const file_id = await env.SEGMENTOS.get(nombre);


      if(!file_id){
        return new Response("segmento no encontrado",
        {status:404});
      }


      const telegram = 
      `https://api.telegram.org/file/bot${env.TELEGRAM_TOKEN}/${file_id}`;


      const respuesta = await fetch(telegram);


      return new Response(respuesta.body,{
        headers:{
          "content-type":"video/mp2t",
          "cache-control":"public,max-age=86400"
        }
      });

    }


    return new Response("FENIX HLS OK");

  }
}
