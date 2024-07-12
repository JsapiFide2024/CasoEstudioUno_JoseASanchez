const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const PUBLIC = path.join(__dirname, 'public');
const CONFIG = path.join(__dirname, 'config', 'notas.json');

app.use(express.static(PUBLIC));
app.use(express.json());

const notasConfig = JSON.parse(fs.readFileSync(CONFIG));

app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC, 'home.html'));
});

app.get('/config', (req, res) => {
    res.json(notasConfig);
});

app.listen(PORT, () => {
    console.info(`Server running at port ${PORT}`);
});