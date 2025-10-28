// netlify/functions/status.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const { generationId } = event.queryStringParameters || {};

    if (!generationId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'generationId é obrigatório' }),
      };
    }

    // Chamada à sua API para verificar status da geração
    const response = await fetch(`https://fei-penta-web.netlify.app/status/${generationId}`);

    if (!response.ok) {
      throw new Error(`Erro ao consultar status: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        generationId,
        status: data.status || 'desconhecido',
        result: data.result || null, // caso a API retorne a imagem ou link
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
