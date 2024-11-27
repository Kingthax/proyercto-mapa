function getGasfiterIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('gasfiterId');
  }
  const gasfiterId = getGasfiterIdFromURL();

  // Verifica que el gasfiterId sea válido antes de continuar
  if (gasfiterId) {
    loadGasfiterInfo();
    loadPendingAppointments();
    loadUserReviews();
  } else {
    alert('Gasfíter no encontrado');
    window.location.href = 'index.html'; // Redirige al inicio si no hay ID válido
  }
async function loadGasfiterInfo() {
  try {
    const response = await fetch(`http://localhost:5000/api/gasfiters/${gasfiterId}`);
    const gasfiter = await response.json();

    document.getElementById('gasfiter-name').innerText = gasfiter.name;
    document.getElementById('gasfiter-service').innerText = gasfiter.service;

    const ratingResponse = await fetch(`http://localhost:5000/api/ratings/${gasfiterId}`);
    const { averageRating } = await ratingResponse.json();
    document.getElementById('gasfiter-rating').innerText = `${averageRating.toFixed(1)}/5`;
  } catch (error) {
    console.error('Error al cargar la información del gasfíter:', error);
  }
}

function getGasfiterIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
  