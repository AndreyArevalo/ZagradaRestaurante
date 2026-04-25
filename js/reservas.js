// ============================================================
//  ZAGRADA — Lógica de Reservas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const fechaInput    = document.getElementById('fecha');
  const horaSelect    = document.getElementById('hora');
  const ubicacionSelect = document.getElementById('ubicacion');
  const mesaSelect    = document.getElementById('mesa');

  if (!fechaInput) return; // Solo corre en reservas.html

  // Fecha mínima = hoy
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.min = hoy;

  // ── Actualizar mesas según ubicación ──────────────────────
  function actualizarMesas() {
    const ubicacion  = ubicacionSelect.value;
    mesaSelect.innerHTML = '';
    const totalMesas = ubicacion === 'salon' ? 27 : 14;
    for (let i = 1; i <= totalMesas; i++) {
      const option = document.createElement('option');
      option.value = `Mesa ${i}`;
      option.textContent = `Mesa ${i}`;
      mesaSelect.appendChild(option);
    }
  }

  // ── Generar horas disponibles ─────────────────────────────
  function generarHoras() {
    horaSelect.innerHTML = '<option value="" disabled selected>Seleccionar hora</option>';
    if (!fechaInput.value) return;

    const fechaSeleccionada = new Date(fechaInput.value + 'T00:00:00');

    if (fechaSeleccionada.getDay() === 1) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No trabajamos los lunes';
      opt.disabled = true;
      horaSelect.appendChild(opt);
      return;
    }

    const ahora  = new Date();
    const esHoy  = fechaSeleccionada.toDateString() === ahora.toDateString();
    let hour = 11, minute = 30;

    while (hour < 20 || (hour === 20 && minute <= 30)) {
      let pasada = false;
      if (esHoy) {
        if (hour < ahora.getHours() || (hour === ahora.getHours() && minute <= ahora.getMinutes())) {
          pasada = true;
        }
      }

      const ampm        = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour > 12 ? hour - 12 : hour;
      const displayMin  = minute.toString().padStart(2, '0');
      const label       = `${displayHour}:${displayMin} ${ampm}`;

      const opt = document.createElement('option');
      opt.value = label;
      opt.textContent = label + (pasada ? ' (No disponible)' : '');
      if (pasada) { opt.disabled = true; opt.style.color = '#666'; }
      horaSelect.appendChild(opt);

      minute += 30;
      if (minute >= 60) { minute = 0; hour++; }
    }
  }

  // ── Validar que no sea lunes ──────────────────────────────
  function validarLunes() {
    const fecha = new Date(fechaInput.value + 'T00:00:00');
    if (fecha.getDay() === 1) {
      Swal.fire({
        title: '¡Reserva no disponible!',
        text: 'No trabajamos los lunes. Por favor selecciona otro día.',
        icon: 'warning',
        confirmButtonText: 'Elegir otro día',
        background: '#181818',
        color: '#ffffff',
        customClass: { popup: 'zagrada-popup', confirmButton: 'zagrada-btn' }
      }).then(() => {
        fechaInput.value = '';
        horaSelect.innerHTML = '<option value="" disabled selected>Seleccionar hora</option>';
      });
    } else {
      generarHoras();
    }
  }

  fechaInput.addEventListener('change', validarLunes);
  ubicacionSelect.addEventListener('change', actualizarMesas);
  actualizarMesas();
});


// ── Botón confirmar reserva ───────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const btnReservar = document.getElementById('btn-reservar');
  if (!btnReservar) return;

  btnReservar.addEventListener('click', function () {
    const fecha         = document.getElementById('fecha').value;
    const hora          = document.getElementById('hora').value;
    const ubicacion     = document.getElementById('ubicacion').value;
    const mesa          = document.getElementById('mesa').value;
    const personas      = document.getElementById('personas').value;
    const decoracion    = document.getElementById('decoracion').value;
    const observaciones = document.getElementById('observaciones').value;
    const nombre        = document.getElementById('nombre').value;
    const telefono      = document.getElementById('telefono').value;

    if (!fecha || !hora || !mesa || !personas || !nombre || !telefono) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Por favor completa todos los campos antes de confirmar.',
        background: '#181818',
        color: '#ffffff',
        customClass: { popup: 'zagrada-popup', confirmButton: 'zagrada-btn' }
      });
      return;
    }

    const ubicLabel = ubicacion === 'salon' ? 'Salón principal' : 'Terraza';
    let mensaje = `Hola, quiero reservar en Zagrada.\n\nDATOS PARA RESERVA:\n`;
    mensaje += `- FECHA: ${fecha}\n`;
    mensaje += `- HORA: ${hora}\n`;
    mensaje += `- N° ASISTENTES: ${personas}\n`;
    mensaje += `- UBICACIÓN: ${ubicLabel}\n`;
    mensaje += `- NOMBRE: ${nombre}\n`;
    mensaje += `- CELULAR: ${telefono}\n`;

    if (decoracion && decoracion !== 'ninguno') {
      const planes = { plata: 'Plan Plata', oro: 'Plan Oro', diamante: 'Plan Diamante' };
      mensaje += `- DECORACIÓN: ${planes[decoracion] || decoracion}\n`;
    }

    if (observaciones.trim() !== '') {
      mensaje += `- OBSERVACIONES: ${observaciones.trim()}\n`;
    }

    const numero = '573156191389';
    location.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  });
});


// ── Navegación entre pasos ────────────────────────────────
function activarDot(num) {
  document.querySelectorAll('.paso-dot').forEach((dot, i) => {
    dot.classList.toggle('activo', i < num);
  });
}

function siguientePaso(id) {
  document.querySelectorAll('.paso').forEach(p => p.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
}

function anteriorPaso(id) {
  document.querySelectorAll('.paso').forEach(p => p.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
}

function siguientePasoValidado(id, dotNum) {
  siguientePaso(id);
  activarDot(dotNum);
}

function anteriorPasoNav(id, dotNum) {
  anteriorPaso(id);
  activarDot(dotNum);
}

// Exponer actualizarMesas globalmente (llamada desde HTML)
function actualizarMesas() {
  const ubicacionSelect = document.getElementById('ubicacion');
  const mesaSelect      = document.getElementById('mesa');
  if (!ubicacionSelect || !mesaSelect) return;
  const totalMesas = ubicacionSelect.value === 'salon' ? 27 : 14;
  mesaSelect.innerHTML = '';
  for (let i = 1; i <= totalMesas; i++) {
    const option = document.createElement('option');
    option.value = `Mesa ${i}`;
    option.textContent = `Mesa ${i}`;
    mesaSelect.appendChild(option);
  }
}
