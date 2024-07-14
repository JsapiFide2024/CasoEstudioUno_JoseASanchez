const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); //Libreria para id y fechas 

const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');
const CONFIG = path.join(__dirname, 'config', 'notas.json');

app.use(express.static(PUBLIC));
app.use(express.json());

let notas = [];

// Leer el archivo de notas.
if (fs.existsSync(CONFIG)) {
    notas = JSON.parse(fs.readFileSync(CONFIG, 'utf-8'));
}

// Guardar notas en memoria
const saveNotes = () => {
    fs.writeFileSync(CONFIG, JSON.stringify(notas, null, 2), 'utf-8');
};

// Mapeo
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'home.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'edit.html'));
});

app.get('/notas', (req, res) => {
    res.json(notas);
});

app.get('/notas/:id', (req, res) => {
    const nota = notas.find(n => n.id === req.params.id);
    if (nota) {
        res.json(nota);
    } else {
        res.status(404).send('Nota no encontrada');
    }
});

app.post('/notas', (req, res) => {
    const { titulo, contenido, etiquetas } = req.body;
    if (!titulo || !contenido) {
        return res.status(400).send('Título y contenido son obligatorios');
    }

    const nuevaNota = {
        id: uuidv4(),
        titulo,
        contenido,
        etiquetas: etiquetas || [],
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
    };

    notas.push(nuevaNota);
    saveNotes();
    res.status(201).json(nuevaNota);
});

app.put('/notas/:id', (req, res) => {
    const { titulo, contenido, etiquetas } = req.body;
    const nota = notas.find(n => n.id === req.params.id);

    if (nota) {
        nota.titulo = titulo || nota.titulo;
        nota.contenido = contenido || nota.contenido;
        nota.etiquetas = etiquetas || nota.etiquetas;
        nota.fechaModificacion = new Date().toISOString();
        saveNotes();
        res.json(nota);
    } else {
        res.status(404).send('Nota no encontrada');
    }
});

app.delete('/notas/:id', (req, res) => {
    notas = notas.filter(n => n.id !== req.params.id);
    saveNotes();
    res.status(204).send();
});

app.listen(PORT, () => {
    console.info(`Server running at port ${PORT}`);
});