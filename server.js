const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); //Libreria para id y fechas 

const app = express();
const PORT = 3000; //Puerto por donde escucha
const PUBLIC = path.join(__dirname, 'public');
const CONFIG = path.join(__dirname, 'config', 'notas.json');

app.use(express.static(PUBLIC));
app.use(express.json());

let notas = []; //Arreglo que almacena las notas en la memoria.

// Leer el archivo de notas.
if (fs.existsSync(CONFIG)) {
    notas = JSON.parse(fs.readFileSync(CONFIG, 'utf-8'));
}

// Guardar notas en memoria
const saveNotes = () => {
    fs.writeFileSync(CONFIG, JSON.stringify(notas, null, 2), 'utf-8');
};

// Mapeo
//Ruta a la pagina de inicio.
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'home.html'));
    console.log("Loading...")
});

//Ruta a la pagina de edicion/creacion.
app.get('/edit', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'edit.html'));
});

//Ruta para obtener las notas
app.get('/notas', (req, res) => {
    res.json(notas);
});

//Metodo para obtener las notas por su id
app.get('/notas/:id', (req, res) => {
    const nota = notas.find(n => n.id === req.params.id);
    if (nota) {
        res.json(nota);
    } else {
        res.status(404).send('Nota no encontrada'); //Aviso de Error
    }
});


//Endpoint para crear una nota nueva.
app.post('/notas', (req, res) => {
    const { titulo, contenido, etiquetas } = req.body;
    if (!titulo || !contenido) {
        return res.status(400).send('Título y contenido son obligatorios'); //Validacion de datos
    }

    const nuevaNota = {
        id: uuidv4(), //Uso de la libreria uuid para generar el id
        titulo,
        contenido,
        etiquetas: etiquetas || [],
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
    };

    notas.push(nuevaNota); //Agrega la nota
    saveNotes(); //Agrega en memoria
    res.status(201).json(nuevaNota);
});

//Endpoint para actualizar la nota
app.put('/notas/:id', (req, res) => {
    const { titulo, contenido, etiquetas } = req.body;
    const nota = notas.find(n => n.id === req.params.id);

    if (nota) {
        nota.titulo = titulo || nota.titulo;
        nota.contenido = contenido || nota.contenido;
        nota.etiquetas = etiquetas || nota.etiquetas;
        nota.fechaModificacion = new Date().toISOString();
        saveNotes(); //Actualiza y Guarda 
        res.json(nota);
    } else {
        res.status(404).send('Nota no encontrada'); //Respuesta de error
    }
});

//Endpoint para eliminacion de las notas
app.delete('/notas/:id', (req, res) => {
    notas = notas.filter(n => n.id !== req.params.id); //Filtra por medio del id
    saveNotes(); //Actualiza
    res.status(204).send(); //Respuesta del Servidor
});

//Escucha del puerto :3000
app.listen(PORT, () => {
    console.info(`Server running at port ${PORT}`);
});