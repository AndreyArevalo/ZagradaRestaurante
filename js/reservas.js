function actualizarMesas() {
  const ubicacion = document.getElementById('ubicacion').value;
  const mesaSelect = document.getElementById('mesa');
  mesaSelect.innerHTML = '';
  const totalMesas = ubicacion === 'salon' ? 27 : 14;
  for (let i = 1; i <= totalMesas; i++) {
    const option = document.createElement('option');
    option.value = `Mesa ${i}`;
    option.textContent = `Mesa ${i}`;
    mesaSelect.appendChild(option);
  }
}

document.addEventListener('DOMContentLoaded', actualizarMesas);

function generarHoras() {
  const horaSelect = document.getElementById('hora');
  const startHour = 11;
  const startMinute = 30;
  const endHour = 20;
  const endMinute = 30;

  let hour = startHour;
  let minute = startMinute;

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    const timeLabel = `${displayHour}:${displayMinute}${ampm}`;

    const option = document.createElement('option');
    option.value = timeLabel;
    option.textContent = timeLabel;
    horaSelect.appendChild(option);

    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarMesas();
  generarHoras();
});