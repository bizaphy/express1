const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para manejar JSON

// Solicitud GET a raiz.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Obtener todas las canciones
// Solicitud GET a /canciones. Aqui se lee el repertorio.json y lo lee con fs. Luego, se parsea a array JS.  Finalmente, se puede mostrar la lista de canciones
app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  res.json(canciones);
});

// Agregar nueva cancion
// Solicitud GET a /canciones. Los datos dee la cancion se reciben en req.body. Se parsea repertorio para obtener canciones. Con push se agrega y luego se sobreescribe la lista.
app.post("/canciones", (req, res) => {
  const nuevaCancion = req.body; //req.body contiene datos que cliente envia para agregar
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  canciones.push(nuevaCancion);
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
  res.send("Canción agregada con éxito"); //Envia resp al cliente
});

// Editar una canción por ID
// Solicitud PUT a /canciones/:id. Se obtiene el ID de los paramtros de la solicitud de la cancion que se quiere editar (req.params).
// Se recibe la canción actualizada en el cuerpo de la solicitud (req.body).
app.put("/canciones/:id", (req, res) => {
  const id = req.params.id; //se buscara el id de la cancion a editar
  const cancionActualizada = req.body; //req.body contiene datos que cliente envia para actualizar la cancion
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  const indice = canciones.findIndex(
    (cancionbuscada) => cancionbuscada.id == id
  );
  //En caso de no encontrar (devolver -1), entonces
  if (indice === -1) return res.status(404).send("Canción no encontrada");
  canciones[indice] = cancionActualizada;
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
  res.send("Canción modificada con éxito");
});

// Eliminar una canción por ID
// Solicitud DELETE a /canciones/:id. Se obtiene el ID con la solicitud (req.params).
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params; // Extraemos el id desde la URL
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8")); // Leemos el archivo JSON
  const indice = canciones.findIndex((cancion) => cancion.id == id);
  if (indice === -1) return res.status(404).send("Canción no encontrada");
  canciones.splice(indice, 1); // Se elimina del array la cancion
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
  res.send("Canción eliminada con éxito");
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
