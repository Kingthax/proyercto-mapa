const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña', // Asegúrate de colocar aquí la contraseña correcta de tu usuario MySQL
  database: 'hogar_en_apuros'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});
