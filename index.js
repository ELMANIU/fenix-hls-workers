export default {

async fetch(request, env) {

  await env.SEGMENTOS.put(
    "prueba",
    "funciona"
  );

  const dato = await env.SEGMENTOS.get("prueba");

  return new Response(
    JSON.stringify({
      ok:true,
      guardado:dato
    }),
    {
      headers:{
        "content-type":"application/json"
      }
    }
  );

}

}
