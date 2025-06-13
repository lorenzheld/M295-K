import express from 'express';

const app = express();
const PORT = 3000;

function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Zugriff verweigert');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === 'zli' && password === 'zli1234') {
        next(); // Authentifizierung erfolgreich
    } else {
        res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Ungültige Zugangsdaten');
    }
}

app.get('/public', (req, res) => {
    res.send('öffentlich');
});

app.get('/private', authenticateUser, (req, res) => {
    res.send('privat');
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});