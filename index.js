export default {
 async fetch(request, env) {

  return new Response(
   JSON.stringify({
    ok:true,
    kv: !!env.SEGMENTOS,
    telegram: !!env.TELEGRAM_TOKEN
   }),
   {
    headers:{
     "content-type":"application/json"
    }
   }
  );

 }
}
