// Función para cargar gasfíteres en el desplegable
async function loadGasfiters() {
  try {
    const response = await fetch('/api/gasfiters'); // Ajusta la ruta según tu backend
    const gasfiters = await response.json();

    const select = document.getElementById('gasfiterSelect');
    select.innerHTML = ''; // Limpiar opciones previas

    gasfiters.forEach(gasfiter => {
      const option = document.createElement('option');
      option.value = gasfiter.idgasfiter; // Usa el ID del gasfíter como valor
      option.text = gasfiter.Nombre_completo; // Muestra el nombre del gasfíter
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar gasfíteres:', error);
  }
}

// Cargar información del gasfíter seleccionado
async function loadGasfiterInfo() {
  const gasfiterId = document.getElementById('gasfiterSelect').value;
  if (!gasfiterId) return;

  try {
    const response = await fetch(`/api/gasfiters/${gasfiterId}`); // Ajusta la ruta según tu backend
    const gasfiter = await response.json();

    document.getElementById('scheduleTitle').innerText = `Horarios de ${gasfiter.Nombre_completo}`;
    openScheduleModal();
  } catch (error) {
    console.error('Error al cargar información del gasfíter:', error);
  }
}

// Abrir el modal del calendario
function openScheduleModal() {
  document.getElementById('scheduleModal').style.display = 'block';
  generateScheduleTable(); // Llamar la función para generar el calendario
}

// Cerrar el modal del calendario
function closeScheduleModal() {
  document.getElementById('scheduleModal').style.display = 'none';
}

// Generar la tabla de horarios
function generateScheduleTable() {
  // Código de la tabla ya proporcionado en respuestas anteriores
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadGasfiters(); // Cargar los gasfíteres disponibles en el desplegable
  
});

