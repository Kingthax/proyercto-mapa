let map, directionsService, directionsRenderer;
const gasfiterLocations = [];
const fallbackLocation = { lat: -32.796517, lng: -71.208456 };  // Ubicación fija de respaldo (casa)
let userLocation = null;  // Para almacenar la ubicación del usuario
let reservasGen;
function initMap() {
  // Usar la ubicación de respaldo inicialmente para centrar el mapa
  const centerLocation = fallbackLocation;

  // Crear un nuevo mapa centrado en la ubicación de respaldo
  map = new google.maps.Map(document.getElementById('map'));

  navigator.geolocation.getCurrentPosition(function (position) {
    var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(initialLocation);
    map.setZoom(13);
  }, function (positionError) {
    map.setCenter(new google.maps.LatLng(39.8097343, -98.5556199));
    map.setZoom(5);
  });
  // map = new google.maps.Map(document.getElementById("map"), {
  //   zoom: 14,
  //   center: centerLocation,
  // });

  // Inicializar DirectionsService y DirectionsRenderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,  // Evitar que la API agregue sus propios marcadores
    polylineOptions: {
      strokeColor: '#0000FF',  // Color azul para la ruta
      strokeOpacity: 0.6,
      strokeWeight: 5
    }
  });
  directionsRenderer.setMap(map);

  // Intentar obtener la ubicación real del usuario
  getUserLocation();
}

// Función para obtener la ubicación del usuario
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('Ubicación actual del usuario obtenida:', userLocation);

      // Centrar el mapa en la ubicación real del usuario
      map.setCenter(userLocation);

      // Colocar un marcador en la ubicación del usuario
      new google.maps.Marker({
        position: userLocation,
        map: map,
        label: 'U',  // Marcador para la ubicación del usuario
      });

      // Generar los gasfíteres alrededor de la ubicación real
      generateGasfiterMarkers(userLocation);
    }, function () {
      console.warn('No se pudo obtener la ubicación del usuario, usando la ubicación de respaldo.');
      userLocation = fallbackLocation;  // Usar la ubicación de respaldo si falla la geolocalización

      // Generar los gasfíteres alrededor de la ubicación de respaldo
      generateGasfiterMarkers(userLocation);
    });
  } else {
    console.warn('Geolocalización no es compatible con este navegador, usando la ubicación de respaldo.');
    userLocation = fallbackLocation;  // Usar la ubicación de respaldo si la geolocalización no es compatible

    // Generar los gasfíteres alrededor de la ubicación de respaldo
    generateGasfiterMarkers(userLocation);
  }
}

// Función para generar nombres aleatorios
function generateRandomName() {
  const firstNames = ['Juan', 'Pedro', 'Sofía', 'Ana', 'Luis', 'María'];
  const lastNames = ['Pérez', 'González', 'Rodríguez', 'López', 'Martínez'];
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirstName} ${randomLastName}`;
}

// Función para generar una dirección aleatoria
function generateRandomAddress() {
  const streets = ['Calle Principal', 'Avenida del Sol', 'Paseo de la Luz', 'Callejón del Río'];
  const randomStreet = streets[Math.floor(Math.random() * streets.length)];
  const randomNumber = Math.floor(Math.random() * 1000) + 1;  // Generar número aleatorio entre 1 y 1000
  return `${randomStreet} ${randomNumber}`;
}

// Función para generar un correo aleatorio
function generateRandomEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const emailName = name.split(' ').join('.').toLowerCase();
  return `${emailName}@${domain}`;
}

// Función para generar un número de celular aleatorio
function generateRandomPhoneNumber() {
  return '+56 9 ' + Math.floor(10000000 + Math.random() * 90000000);  // Número chileno aleatorio
}

// Función para generar los marcadores de gasfíteres alrededor de una ubicación
function generateGasfiterMarkers(center) {
  // Generar 5 marcadores aleatorios dentro de un radio de 500 metros
  for (let i = 0; i < 5; i++) {
    const randomLocation = getRandomLocation(center, 5000);  // Generar una ubicación aleatoria a 500 metros
    const name = generateRandomName();
    const address = generateRandomAddress();
    const email = generateRandomEmail(name);
    const phoneNumber = generateRandomPhoneNumber();


    // Crear marcador para cada gasfíter con una ventana de información
    const marker = new google.maps.Marker({
      position: randomLocation,
      map: map,
      label: 'G'  // Marcador de gasfíter
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <h3>${name}</h3>
          <p><strong>Dirección:</strong> ${address}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phoneNumber}</p>
          <a href="#" onclick="openScheduleModal('${name}')">Ver horarios</a>
        </div>
      `
    });


    // Mostrar la ventana de información al hacer clic en el marcador
    marker.addListener('click', function () {
      infoWindow.open(map, marker);
    });

    // Añadir la dirección al select para que el usuario pueda elegir
    const select = document.getElementById('gasfiterSelect');
    const option = document.createElement('option');
    option.value = JSON.stringify(randomLocation);
    option.text = `${name} - (${randomLocation.lat.toFixed(5)}, ${randomLocation.lng.toFixed(5)})`;
    select.appendChild(option);
  }
}

// Función para generar una ubicación aleatoria dentro de un radio
function getRandomLocation(center, radius) {
  const earthRadius = 6371e3;  // Radio de la Tierra en metros
  const lat = center.lat * Math.PI / 180;  // Convertir a radianes
  const lng = center.lng * Math.PI / 180;

  // Calcular un ángulo y distancia aleatoria dentro del radio
  const randomDistance = Math.random() * radius;  // Distancia aleatoria dentro del radio
  const randomAngle = Math.random() * 2 * Math.PI;  // Ángulo aleatorio en radianes

  // Calcular nueva ubicación
  const deltaLat = randomDistance * Math.cos(randomAngle) / earthRadius;
  const deltaLng = randomDistance * Math.sin(randomAngle) / (earthRadius * Math.cos(lat));

  // Convertir de nuevo a grados
  const newLat = lat + deltaLat;
  const newLng = lng + deltaLng;

  return { lat: newLat * 180 / Math.PI, lng: newLng * 180 / Math.PI };
}

// Función para calcular la ruta desde la ubicación (real o de respaldo) hasta el gasfíter seleccionado
// Modo de viaje se pasa como parámetro (por ejemplo, 'WALKING', 'DRIVING')
function calculateRoute(travelMode = 'DRIVING') {
  const select = document.getElementById('gasfiterSelect');
  const selectedLocation = JSON.parse(select.value);  // Obtener la ubicación seleccionada

  // Usar la ubicación de respaldo si la ubicación del usuario no está disponible
  const origin = userLocation || fallbackLocation;

  // Mostrar la ruta desde la ubicación real (o de respaldo) hasta el gasfíter seleccionado
  const request = {
    origin: origin,  // Ubicación del usuario (o de respaldo)
    destination: selectedLocation,  // Ubicación seleccionada del gasfíter
    travelMode: travelMode  // Modo de viaje (por defecto 'DRIVING')
  };

  // Hacer la solicitud de ruta
  directionsService.route(request, function (result, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);  // Mostrar la ruta en el mapa
    } else {
      alert('No se pudo calcular la ruta: ' + status);
    }
  });
}

// Función para abrir el modal de horarios
function openScheduleModal(name) {


  const modal = document.getElementById('scheduleModal');
  document.getElementById('scheduleTitle').innerText = `Horarios de ${name}`;
  generateScheduleTable();
  modal.style.display = 'block';
}

// Función para generar la tabla de horarios
function generateScheduleTable() {
  const container = document.getElementById('scheduleContainer');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'schedule-table';

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Crear encabezado de la tabla
  const headerRow = document.createElement('tr');
  const emptyCell = document.createElement('th');
  headerRow.appendChild(emptyCell);

  days.forEach(day => {
    const th = document.createElement('th');
    th.innerText = day;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Crear filas de horas
  hours.forEach((hour) => {
    const row = document.createElement('tr');
    const hourCell = document.createElement('td');
    hourCell.innerText = hour;
    row.appendChild(hourCell);

    days.forEach((day, index) => {
      const cell = document.createElement('td');
      // Verificar si la celda está reservada
      const isReserved = reservasGen.some((reserva) => {
        console.log("reserva", reserva);
        console.log("reserva.dayIndex", reserva.dayIndex);
        console.log("index", index);
        console.log("reserva.hour", reserva.hour);
        console.log("hour", hour);
        // Verificar si coinciden el día de la semana (dayIndex) y la hora (hour)
        return reserva.dayIndex == index + 1 && reserva.hour == hour;
      });

      if (isReserved) {
        cell.className = 'unavailable';
        cell.innerText = 'No Disponible';
      } else {
        cell.className = 'available';
        cell.innerText = 'Disponible';
        cell.onclick = () => toggleCell(cell);
      }

      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  container.appendChild(table);
}



// Función para alternar la selección de celdas de la tabla
function toggleCell(cell) {
  if (cell.classList.contains('available')) {
    cell.classList.remove('available');
    cell.classList.add('confirmed');
    cell.innerText = 'Confirmado';
  } else if (cell.classList.contains('confirmed')) {
    cell.classList.remove('confirmed');
    cell.classList.add('available');
    cell.innerText = 'Disponible';
  }
}

// Función para cerrar el modal de horarios
function closeScheduleModal() {
  document.getElementById('scheduleModal').style.display = 'none';
}
let selectedCell = null;  // Almacenar la celda seleccionada

// Función para alternar la selección de celdas de la tabla
function toggleCell(cell) {
  if (cell.classList.contains('available')) {
    // Deseleccionar cualquier celda previamente seleccionada
    if (selectedCell) {
      selectedCell.classList.remove('selected');
      selectedCell.classList.add('available');
      selectedCell.innerText = 'Disponible';
    }

    // Seleccionar la nueva celda
    cell.classList.remove('available');
    cell.classList.add('selected');
    cell.innerText = 'Seleccionado';
    selectedCell = cell;  // Guardar la celda seleccionada
  }
}

// Función para confirmar y guardar el horario seleccionado
function confirmSchedule() {
  if (selectedCell) {
    // Cambiar la clase a 'confirmed' para indicar que el horario está reservado
    selectedCell.classList.remove('selected');
    selectedCell.classList.add('confirmed');
    selectedCell.innerText = 'Confirmado';

    // Guardar la información del horario en el backend o localmente
    saveSchedule(selectedCell);  // Llama a una función para guardar el horario

    // Resetear la selección
    selectedCell = null;
    alert('Horario confirmado exitosamente.');
  } else {
    alert('Por favor, selecciona un horario antes de confirmar.');
  }
}

// Función para cerrar el modal de horarios
function closeScheduleModal() {
  document.getElementById('scheduleModal').style.display = 'none';
}
// Función para transformar citas en formato reservas
const transformCitasToReservas = (citas) => {
  return citas.map(cita => {
    const fecha = new Date(cita.Fecha);
    return {
      dayIndex: fecha.getDay(), // Devuelve el índice del día (0 = Domingo, 6 = Sábado)
      hour: cita.Fecha.split(' ')[1].slice(0, 5) // Extrae HH:mm de la fecha
    };
  });
};

async function fetchReservas() {
  try {
    var settings = {
      "url": "http://localhost:5000/api/citas",
      "method": "GET",
      "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
      console.log(response);

      // Transformar citas
      const reservas = transformCitasToReservas(response);
      reservasGen = reservas;
      console.log(reservas);

    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
  }
}

// Llamar a la función
fetchReservas();

function scheduleAppointment() {
  console.log("entro")
  var settings = {
    "url": "http://localhost:5000/api/citas",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
      "idUsuario": 2,
      "idgasfiter": 3,
      "Fecha": "2024/12/04 15:00:00",
      "Estado": 5,
      "calificacion": 8
    }),
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

$(document).ready(function () {
  $(document).ready(function () {
    $('#login-button').click(function) () 
      const username = $('#username').val();
      const password = $('#password').val();
      const userType = $('#user_type').val();

      if (
        (username === 'usuario_1' || username === 'usuario_2' || username === 'usuario_3') &&
        userType === 'usuario_cliente' &&
        password === '1234'
      ) {
        $('.login-container').css('display', 'none');
        $('#map').css('display', 'block');
      } 
      else if((username === 'gasfiter_1' || username === 'gasfiter_2' || username === 'gasfiter_3') &&
      userType === 'usuario_gasfiter' &&
      password === 'qwer'){
        $('.login-container').css('display', 'none');
        $('#map').css('display', 'block');
      }
      else {
        alert('Credenciales incorrectas o tipo de usuario no válido.');
      }
      
       // Mostrar pantalla principal
       $('#mainScreen').css('display', 'block');

       // Opcional: mostrar mensaje de bienvenida
       $('#userWelcome').text(`Bienvenido, ${username}`);
     } 
    
      // Manejar botones de la pantalla principal
      $('#btnNotifications').click(function () {
        alert('Notificaciones: Aquí podrás ver información de reuniones agendadas.');
      });
    
      $('#btnQuickSearch').click(function () {
        alert('Búsqueda Rápida: Mostrará los próximos horarios disponibles.');
      });
    
      $('#btnMap').click(function () {
        $('#mainScreen').css('display', 'none'); // Ocultar pantalla principal
        $('#map').css('display', 'block'); // Mostrar mapa
        $('#panelUbicación').css('display', 'block'); // Mostrar panel de ubicación
      });
    });
 
 