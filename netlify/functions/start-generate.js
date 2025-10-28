// netlify/functions/start-generate.js
export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt é obrigatório' }),
      };
    }

    // Gera um ID único para esta geração
    const generationId = Math.floor(Math.random() * 1000000).toString();

    // Simula armazenamento do prompt e status (para fins de teste)
    // No Netlify Functions, você pode usar DB ou armazenamento real
    // Aqui vamos usar memória temporária simulada
    globalThis._generations = globalThis._generations || {};
    globalThis._generations[generationId] = {
      prompt,
      status: 'pendente',
      imageUrl: `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(prompt)}`
    };

    // Simula conclusão da geração em 5 segundos
    setTimeout(() => {
      if (globalThis._generations[generationId]) {
        globalThis._generations[generationId].status = 'concluída';
      }
    }, 5000);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Geração iniciada com sucesso!',
        generationId,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
