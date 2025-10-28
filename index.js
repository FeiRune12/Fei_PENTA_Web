const btn = document.getElementById('generateBtn');
const promptInput = document.getElementById('prompt');
const loader = document.getElementById('loader');
const imagesContainer = document.getElementById('imagesContainer');

btn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert("Digite algo no prompt!");

  loader.style.display = 'block';

  try {
    const resp = await fetch('https://fei-penta-web.netlify.app/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Erro: ${resp.status} - ${text}`);
    }

    const data = await resp.json();
    let imageSrc = "";

    if (data.image_url) {
      imageSrc = data.image_url;
    } else if (data.image_base64) {
      imageSrc = `data:image/png;base64,${data.image_base64}`;
    } else {
      throw new Error("Resposta sem image_url nem image_base64");
    }

    // Cria uma nova div com a imagem e adiciona ao container
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('generated-img');
    const imgEl = document.createElement('img');
    imgEl.src = imageSrc;
    imgDiv.appendChild(imgEl);
    imagesContainer.prepend(imgDiv); // adiciona no topo

    promptInput.value = ""; // limpa input

  } catch (err) {
    alert(err.message);
  } finally {
    loader.style.display = 'none';
  }
});
