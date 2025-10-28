// netlify/functions/start-generate.js
import fetch from 'node-fetch';

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

    // Chamada à sua API de geração de imagens
    const response = await fetch('https://fei-penta-web.netlify.app/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API de geração: ${response.statusText}`);
    }

    const data = await response.json();

    // Supondo que a API retorne um ID da geração
    const generationId = data.generationId || Math.floor(Math.random() * 1000000).toString();

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
