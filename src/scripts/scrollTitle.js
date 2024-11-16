document.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const titleElement = document.querySelector("title");

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Comprobar si la sección está visible en el viewport
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      titleElement.innerText = section.dataset.title;
    }
  });
});
