const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body);

    const SPACE_API = 'https://hf.space/embed/Miragic-AI/Miragic-AI-Image-Generator/api/predict/';

    const response = await fetch(SPACE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [prompt] }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Erro do Space', details: text }),
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ image: result.data[0] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno na função', details: err.message }),
    };
  }
};
