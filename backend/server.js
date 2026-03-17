const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/infrastructure/webserver/routes');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Main Routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Miboso Backend (Refactored) running on http://localhost:${PORT}`);
});
