export default {
async fetch(request, env) {

const url = new URL(request.url);

if(url.pathname.startsWith("/segment/")){

const nombre = url.pathname.split("/").pop();

const registro = await env.SEGMENTOS.get("telegram_segments.json");

if(!registro){
return new Response("No existe registro",{status:404});
}

const data = await registro.json();

const file_id = data[nombre];

if(!file_id){
return new Response("Segmento no encontrado "+nombre,{status:404});
}


// Telegram API

const info = await fetch(
`https://api.telegram.org/bot${env.BOT_TOKEN}/getFile?file_id=${file_id}`
);

const json = await info.json();

const ruta=json.result.file_path;


const video = await fetch(
`https://api.telegram.org/file/bot${env.BOT_TOKEN}/${ruta}`
);


return new Response(video.body,{
headers:{
"Content-Type":"video/mp2t",
"Cache-Control":"public,max-age=86400"
}
});


}


return new Response("Fenix HLS Worker OK");

}
}
