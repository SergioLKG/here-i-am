// Scroll smooth
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth", // Desplazamiento suave
      });
    }
  });
});
const header = document.querySelector("header");
header.style.translate = `0 -4rem`
document.addEventListener("scroll", scrollScetionListener);

function scrollScetionListener() {
  const sections = document.querySelectorAll("section");
  const titleElement = document.querySelector("title");

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Comprobar si la sección está visible en el viewport
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      section.dataset.title === "Here I Am" ? header.style.translate = `0 -4rem` : header.style.translate = null;
      titleElement.innerText = `${section.dataset.title} - Sergio Domínguez Pérez`;
    }
  });
}
scrollScetionListener();
