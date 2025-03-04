const bg = document.getElementById("pageBackground");

// Genera un valor aleatorio en el rango
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

// Actualiza las propiedades del fondo
function updateBackground() {
  const xPos = getRandomValue(45, 55); // Rango horizontal
  const yPos = getRandomValue(45, 55); // Rango vertical
  const scale = getRandomValue(1, 1.4); // Variación en escala

  // Actualiza cada capa del fondo
  setTimeout(function () {
    Array.from(bg.children).forEach((layer) => {
      layer.style.backgroundPosition = `${xPos}% ${yPos}%`;
      layer.style.backgroundSize = `${scale * 15}dvh`;
    });
  }, 4000);

  // Configura la próxima actualización aleatoria
  setTimeout(updateBackground, getRandomValue(10000, 20000));
}

// Inicia la animación
updateBackground();
