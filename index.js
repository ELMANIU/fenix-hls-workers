export default {
  async fetch(request, env) {

    return new Response(
      "Fenix HLS Worker funcionando",
      {
        headers:{
          "content-type":"text/plain"
        }
      }
    );

  }
}
