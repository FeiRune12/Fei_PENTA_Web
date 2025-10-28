// netlify/functions/generate.js
export async function handler(event) {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Sem body" }) };
    }
    const body = JSON.parse(event.body);
    const prompt = body.prompt;
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Prompt ausente" }) };
    }

    // Se você já tem um backend de geração (Render ou local), chame-o aqui.
    // Como você pediu usar apenas Netlify, suponho que você tenha lógica
    // que retorne base64. Caso contrário, substitua pela sua integração real.
    const GENERATE_BACKEND = "https://fei-penta-web.netlify.app/.netlify/functions/generate"; // se tiver outro, substitua

    // Se você realmente NÃO quer Render e já gera a imagem dentro do Netlify,
    // substitua a chamada abaixo pela sua implementação.
    const fetchResp = await fetch(GENERATE_BACKEND, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!fetchResp.ok) {
      const text = await fetchResp.text();
      throw new Error(`Erro backend: ${fetchResp.status} - ${text}`);
    }

    const data = await fetchResp.json();

    // Esperamos data.image_base64 ou data.image_url
    if (data.image_base64) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          image_url: `data:image/png;base64,${data.image_base64}`
        })
      };
    } else if (data.image_url) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ image_url: data.image_url })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Resposta sem image_base64 nem image_url" })
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) })
    };
  }
}
