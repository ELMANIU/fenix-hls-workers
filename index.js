export default {

async fetch(request, env) {

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
/segmento/${seg}
`;

  }

  return new Response(
    m3u8,
    {
      headers:{
        "content-type":"application/vnd.apple.mpegurl",
        "cache-control":"no-cache"
      }
    }
  );

}

}
