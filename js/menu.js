function openModal(img) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "flex";
  modalImg.src = img.src;
}

function closeModal() {
  document.getElementById("imgModal").style.display = "none";
}

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
}

function cerrarSeccion(id) {
  document.getElementById(id).classList.add('oculto');
}
function toggleSeccion(id) {
  const seccion = document.getElementById(id);
  seccion.classList.toggle('oculto');
}

function ampliarImagen(img) {
  const src = img.src;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const imagenAmpliada = document.createElement('img');
  imagenAmpliada.src = src;
  imagenAmpliada.className = 'zoomed';

  overlay.appendChild(imagenAmpliada);
  document.body.appendChild(overlay);

  // Cerrar al hacer clic fuera
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}