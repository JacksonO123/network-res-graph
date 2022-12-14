const { exec } = require('child_process');
const express = require('express');
const { readFileSync } = require('fs');
const path = require('path');
const app = express();
const baseFolder = 'public';
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, baseFolder)));

app.get('/', (req, res) => {
	res.end(readFileSync(`${baseFolder}/index.html`));
});

app.get('/data', (req, res) => {
	res.end(readFileSync('output.json'));
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	exec(`open -a "Google Chrome" http://localhost:${port}`);
});
