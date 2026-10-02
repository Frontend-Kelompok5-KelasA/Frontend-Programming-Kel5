const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'web')))
app.use(express.static(path.join(__dirname, 'web', 'html'), {extensions: ['html']}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'html', 'index.html'));
});

app.listen(8080, () => {
    console.log('Silahkan buka http://localhost:8080 untuk mengakses website')
});