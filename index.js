export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // Playlist HLS
    if (url.pathname === "/" || url.pathname === "/index.m3u8") {

      const data = await env.SEGMENTOS.get("playlist", "json");

      if (!data || !data.segmentos) {
        return new Response(
          "Sin playlist",
          {status:404}
        );
      }

      let m3u8 = 
`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
`;

      for (const seg of data.segmentos.slice(-10)) {

        m3u8 +=
`#EXTINF:6,
/segmento/${seg}
`;

      }


      return new Response(m3u8,{
        headers:{
          "content-type":"application/vnd.apple.mpegurl",
          "cache-control":"no-cache",
          "Access-Control-Allow-Origin":"*"
        }
      });
    }


    // Segmentos TS
    if (url.pathname.startsWith("/segmento/")) {

      const nombre =
        url.pathname.split("/").pop();


      const registro =
        await env.SEGMENTOS.get(nombre,"json");


      if (!registro || !registro.file_id){

        return new Response(
          "Segmento no encontrado",
          {status:404}
        );

      }


      const token =
        env.TELEGRAM_TOKEN;


      const info =
        await fetch(
`https://api.telegram.org/bot${token}/getFile?file_id=${registro.file_id}`
        );


      const json =
        await info.json();


      if(!json.ok){

        return new Response(
          "Telegram error",
          {status:500}
        );

      }


      const archivo =
        json.result.file_path;


      const ts =
        await fetch(
`https://api.telegram.org/file/bot${token}/${archivo}`
        );


      return new Response(
        ts.body,
        {
          headers:{
            "content-type":"video/mp2t",
            "cache-control":"no-store",
            "Access-Control-Allow-Origin":"*"
          }
        }
      );

    }


    return new Response("OK");

  }
}
