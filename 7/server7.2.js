import express from 'express';
import session from 'express-session';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '030708',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.post('/name', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name parameter is required' });
    }

    // Store name in session
    req.session.name = name;

    res.status(200).json({ message: 'Name stored in session', name });
});

app.get('/name', (req, res) => {

    if (req.session.name) {
        res.status(200).json({ name: req.session.name });
    } else {
        res.status(404).json({ message: 'No name found in session' });
    }

});

app.delete('/name', (req, res) => {

    if (req.session.name) {
        delete req.session.name;
        res.status(200).json({ message: 'Name removed' });
    } else {
        res.status(404).json({ message: 'No name found in session' });
    }

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});