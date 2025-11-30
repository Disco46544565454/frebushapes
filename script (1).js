const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generate");
const imageContainer = document.getElementById("image-container");
const linkContainer = document.getElementById("link-container");
const errorMessage = document.getElementById("error");

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  // Clear previous results
  imageContainer.innerHTML = "";
  linkContainer.innerHTML = "";
  errorMessage.textContent = "";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.error) {
      errorMessage.textContent = `Error Occurred: ${data.error}`;
      return;
    }

    // Display image
    const img = document.createElement("img");
    img.src = data.images[0]; // first image
    img.alt = "Generated Image";
    img.style.maxWidth = "90%";
    img.style.marginBottom = "10px";
    imageContainer.appendChild(img);

    // Display clickable link
    const link = document.createElement("a");
    link.href = data.images[0];
    link.textContent = "Click to open image";
    link.target = "_blank";
    linkContainer.appendChild(link);

  } catch (err) {
    console.error(err);
    errorMessage.textContent = "Error Occurred: Failed To Catch";
  }
});
