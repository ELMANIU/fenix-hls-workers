export default {

async fetch(request, env) {

const url = new URL(request.url);


// =====================
// PLAYLIST
// =====================

if(url.pathname === "/index.m3u8") {


let data = await env.SEGMENTOS.get(
"playlist",
"json"
);


if(!data){

return new Response(
"Sin segmentos",
{status:404}
);

}


let m3u8 =
`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
`;


for(let seg of data.segmentos.slice(-10)){


m3u8 +=
`#EXTINF:6,
${url.origin}/segmento/${seg}
`;

}


return new Response(
m3u8,
{
headers:{
"content-type":
"application/vnd.apple.mpegurl",
"cache-control":
"no-store"
}
}
);

}



// =====================
// SEGMENTOS TELEGRAM
// =====================

if(url.pathname.startsWith("/segmento/")){


let nombre =
url.pathname.split("/").pop();



let lista =
await env.SEGMENTOS.get(
"segmentos",
"json"
);



if(!lista[nombre]){

return new Response(
"No existe",
{status:404}
);

}



let file_id =
lista[nombre].file_id;



let tg =
await fetch(
`https://api.telegram.org/bot${env.TOKEN}/getFile?file_id=${file_id}`
);



let info =
await tg.json();



if(!info.ok){

return new Response(
"Telegram error",
{status:500}
);

}



let archivo =
await fetch(
`https://api.telegram.org/file/bot${env.TOKEN}/${info.result.file_path}`
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


return new Response(
"Fenix HLS Worker"
);

}

}
