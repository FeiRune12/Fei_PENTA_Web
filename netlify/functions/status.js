// netlify/functions/status.js
export async function handler(event, context) {
  try {
    const { generationId } = event.queryStringParameters || {};

    if (!generationId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'generationId é obrigatório' }),
      };
    }

    const generations = globalThis._generations || {};
    const gen = generations[generationId];

    if (!gen) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Geração não encontrada' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        generationId,
        status: gen.status,
        imageUrl: gen.status === 'concluída' ? gen.imageUrl : null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
