const btn = document.getElementById('generateBtn');
const promptInput = document.getElementById('prompt');
const loader = document.getElementById('loader');
const imagesContainer = document.getElementById('imagesContainer');

// --- NEW CONFIGURATION ---
const POLLING_INTERVAL = 3000; // Check every 3 seconds (3000ms)
const START_ENDPOINT = 'https://fei-penta-web.netlify.app/.netlify/functions/start-generate'; // New function to START
const STATUS_ENDPOINT = 'https://fei-penta-web.netlify.app/.netlify/functions/status'; // New function to CHECK STATUS
// -------------------------

btn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Digite algo no prompt!");

    loader.style.display = 'block';

    try {
        // 1. START THE GENERATION JOB
        const startResp = await fetch(START_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!startResp.ok) {
            const text = await startResp.text();
            throw new Error(`Erro ao iniciar: ${startResp.status} - ${text}`);
        }

        const startData = await startResp.json();
        const jobId = startData.job_id; // Your backend should return a job_id

        if (!jobId) {
            throw new Error("Backend não retornou um ID de trabalho (Job ID).");
        }

        // 2. POLL FOR THE RESULT
        let imageSrc = null;

        while (imageSrc === null) {
            await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL)); // Wait 3 seconds

            const statusResp = await fetch(`${STATUS_ENDPOINT}?job_id=${jobId}`);

            if (!statusResp.ok) {
                // If status check fails, exit the loop and throw error
                const text = await statusResp.text();
                throw new Error(`Erro ao verificar status: ${statusResp.status} - ${text}`);
            }

            const statusData = await statusResp.json();

            if (statusData.status === 'completed') {
                // Image is ready!
                if (statusData.image_url) {
                    imageSrc = statusData.image_url;
                } else if (statusData.image_base64) {
                    imageSrc = `data:image/png;base64,${statusData.image_base64}`;
                } else {
                    throw new Error("Status 'completed', mas sem URL ou Base64 da imagem.");
                }
            } else if (statusData.status === 'failed') {
                // Generation failed
                throw new Error(`Geração falhou: ${statusData.error_message || "Erro desconhecido."}`);
            }
            // If status is 'pending' or 'processing', the loop continues.
        }
        
        // 3. DISPLAY THE IMAGE (Once imageSrc is not null)
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('generated-img');
        const imgEl = document.createElement('img');
        imgEl.src = imageSrc;
        imgDiv.appendChild(imgEl);
        imagesContainer.prepend(imgDiv);

        promptInput.value = ""; 

    } catch (err) {
        alert(err.message);
    } finally {
        loader.style.display = 'none';
    }
});