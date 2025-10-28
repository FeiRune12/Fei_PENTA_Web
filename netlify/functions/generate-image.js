// netlify/functions/generate-image.js

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido, use POST' }),
      };
    }

    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt é obrigatório' }),
      };
    }

    const hfToken = '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'; // seu token Hugging Face
    const modelUrl = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4-original';

    // Faz a requisição à API Hugging Face
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    // Se houver erro do modelo
    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro do modelo Hugging Face', details: data.error }),
      };
    }

    // Pegando a imagem em base64
    const base64Image = data[0]?.image || null;
    if (!base64Image) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Não foi possível gerar a imagem' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image: `data:image/png;base64,${base64Image}` }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno na função', details: err.message }),
    };
  }
};
