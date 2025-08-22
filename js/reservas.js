document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fecha');
  const horaSelect = document.getElementById('hora');
  const ubicacionSelect = document.getElementById('ubicacion');
  const mesaSelect = document.getElementById('mesa');

  // Configurar fecha mínima
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.min = hoy;

  // Actualizar mesas según ubicación
  function actualizarMesas() {
    const ubicacion = ubicacionSelect.value;
    mesaSelect.innerHTML = '';
    const totalMesas = ubicacion === 'salon' ? 27 : 14;
    for (let i = 1; i <= totalMesas; i++) {
      const option = document.createElement('option');
      option.value = `Mesa ${i}`;
      option.textContent = `Mesa ${i}`;
      mesaSelect.appendChild(option);
    }
  }

  // Generar horas disponibles
  function generarHoras() {
    horaSelect.innerHTML = '<option value="" disabled selected>Seleccionar hora</option>';

    if (!fechaInput.value) return;

    const fechaSeleccionada = new Date(fechaInput.value + 'T00:00:00');

    if (fechaSeleccionada.getDay() === 1) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No trabajamos los lunes';
      option.disabled = true;
      horaSelect.appendChild(option);
      return;
    }

    const ahora = new Date();
    const esHoy = fechaSeleccionada.toDateString() === ahora.toDateString();

    let hour = 11;
    let minute = 30;

    while (hour < 20 || (hour === 20 && minute <= 30)) {
      let horaYaPaso = false;
      if (esHoy) {
        const horaActual = ahora.getHours();
        const minutoActual = ahora.getMinutes();
        if (hour < horaActual || (hour === horaActual && minute <= minutoActual)) {
          horaYaPaso = true;
        }
      }

      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      const timeLabel = `${displayHour}:${displayMinute}${ampm}`;

      const option = document.createElement('option');
      option.value = timeLabel;
      option.textContent = timeLabel;

      if (horaYaPaso) {
        option.disabled = true;
        option.textContent += ' (No disponible)';
        option.style.color = '#999';
      }

      horaSelect.appendChild(option);

      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }
  }

  // Validar lunes y mostrar alerta
  function validarLunes() {
    const fechaSeleccionada = new Date(fechaInput.value + 'T00:00:00');
    if (fechaSeleccionada.getDay() === 1) {
      fechaInput.value = '';
      horaSelect.innerHTML = '';
Swal.fire({
  title: '¡Reserva no disponible!',
  text: 'No trabajamos los lunes. Por favor selecciona otro día.',
  icon: 'warning',
  confirmButtonText: 'Reservar otro día',
  confirmButtonColor: '#8B0000', // Rojo vino elegante
  background: '#fff8f0', // Fondo cálido
  color: '#333',
  imageUrl: '../img/logozagrada.jpg', // Ruta local del logo
  imageWidth: 80,
  imageHeight: 80,
  imageAlt: 'Logo Zagrada',
  customClass: {
    popup: 'zagrada-popup',
    confirmButton: 'zagrada-btn'
  }
});

    } else {
      generarHoras();
    }
  }

  // Eventos
  fechaInput.addEventListener('input', validarLunes);
  ubicacionSelect.addEventListener('change', actualizarMesas);

  // Inicializar
  actualizarMesas();
});



// Boton Reserva 

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault(); // Evita el envío tradicional

  // Obtener datos del formulario
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const mesa = document.getElementById('mesa').value;
  const personas = document.getElementById('personas').value;
  const decoracion = document.getElementById('decoracion').value;
  const observaciones = document.getElementById('observaciones').value;

  // Validación básica
  if (!fecha || !hora || !mesa || !personas) {
    Swal.fire({
      icon: 'error',
      title: 'Faltan datos',
      text: 'Por favor completa todos los campos antes de reservar.'
    });
    return;
  }

  // Solicitar nombre con SweetAlert
Swal.fire({
  title: '¿Quién hace la reserva?',
  input: 'text',
  inputLabel: 'Nombre completo',
  inputPlaceholder: 'Ej: Ana Rodríguez',
  showCancelButton: true,
  confirmButtonText: 'Enviar por WhatsApp',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#25D366', // Verde WhatsApp
  cancelButtonColor: '#999',
  background: '#fff8f0', // Fondo cálido
  color: '#333',
  imageUrl: '../img/logozagrada.jpg', // Logo del restaurante
  imageWidth: 80,
  imageHeight: 80,
  imageAlt: 'Logo Zagrada',
  customClass: {
    popup: 'zagrada-popup',
    confirmButton: 'zagrada-btn',
    input: 'zagrada-input'
  },
  inputValidator: (value) => {
    if (!value) return 'Por favor ingresa tu nombre';
  }
}).then((result) => {
    if (result.isConfirmed) {
      const nombre = result.value;

      // Construir mensaje
      let mensaje = `Hola, soy ${nombre}. Quiero reservar en Zagrada:\n`;
      mensaje += `📅 Fecha: ${fecha}\n`;
      mensaje += `⏰ Hora: ${hora}\n`;
      mensaje += `📍 Ubicación: ${ubicacion}\n`;
      mensaje += `🪑 Mesa: ${mesa}\n`;
      mensaje += `👥 Personas: ${personas}\n`;

      if (decoracion !== 'plata') {
        mensaje += `🎀 Plan de decoración: ${decoracion}\n`;
      }

      if (observaciones.trim() !== '') {
        mensaje += `📝 Observaciones: ${observaciones}`;
      }

      // Codificar mensaje para URL
      const mensajeCodificado = encodeURIComponent(mensaje);

      // Número de WhatsApp (ajústalo al tuyo)
      const numero = '573156191389'; // ← cámbialo por el número real

      // Abrir WhatsApp
      window.open(`https://wa.me/${numero}?text=${mensajeCodificado}`, '_blank');
    }
  });
});