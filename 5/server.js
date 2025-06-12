import express from 'express';
import { randomUUID } from 'node:crypto';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
app.use(express.json());

// Swagger-JSDoc Optionen
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // OpenAPI Version
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'API Documentation for the Library Management System'
        }
    },
    // Der Pfad zu den Dateien mit den Swagger-Kommentaren
    apis: ['./server.js'], // Hier wird `server.js` angegeben, um die Kommentare zu lesen
};

// Swagger Spec generieren
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger-Dokumentation aus der Datei laden
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('swagger.json'), 'utf-8'));

// Swagger UI an einer Route verfügbar machen
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let books = [
    {
        "isbn": "978-3-16-148410-0",
        "title": "Der Prozess",
        "year": 1925,
        "author": "Franz Kafka"
    },
    {
        "isbn": "978-0-7432-7356-5",
        "title": "1984",
        "year": 1949,
        "author": "George Orwell"
    },
    {
        "isbn": "978-0-7432-7356-6",
        "title": "Brave New World",
        "year": 1932,
        "author": "Aldous Huxley"
    },
    {
        "isbn": "978-1-4516-7321-5",
        "title": "The Great Gatsby",
        "year": 1925,
        "author": "F. Scott Fitzgerald"
    },
    {
        "isbn": "978-3-462-03976-6",
        "title": "Moby-Dick",
        "year": 1851,
        "author": "Herman Melville"
    }
]
let lends = []

/**
 * @swagger
 * /lends:
 *   post:
 *     description: Ein Buch ausleihen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: string
 *               isbn:
 *                 type: string
 *     responses:
 *       201:
 *         description: Erfolgreich, Buch wurde ausgeliehen
 *       400:
 *         description:
 *           - Kunde hat die maximale Anzahl von 3 ausgeliehenen Büchern erreicht
 *           - Buch ist bereits ausgeliehen
 *       422:
 *         description: Alle Parameter müssen angegeben werden
 */
app.post("/lends", (req, res) => {
    const id = randomUUID();
    const customer_id = req.body.customer_id;
    const isbn = req.body.isbn;
    const borrowed_at = Date.now();

    const book_lend = lends.find(l => l.isbn === isbn);
    const customerLends = lends.filter(l => l.customer_id === customer_id).length + 1;

    if (customerLends > 3) {
        return res.status(400).send("Ein Kunde kann nur maximal 3 Ausleihen haben")
    }

    if (book_lend) {
        return res.status(400).send("Buch schon ausgeliehen")
    }

    const isValid = customer_id && isbn;

    if(isValid) {
        lends = [...lends, {id: id, customer_id, isbn, borrowed_at}];
        res.status(201);
    } else {
        return res.status(422).send("Alle Parameter müssen angegeben werden");
    }
});

/**
 * @swagger
 * /lends:
 *   get:
 *     description: Gibt alle ausgeliehenen Bücher zurück
 *     responses:
 *       200:
 *         description: Erfolgreich, alle ausgeliehenen Bücher
 */
app.get("/lends", (req, res) => {
    res.send(lends);
});

/**
 * @swagger
 * /lends/{id}:
 *   get:
 *     description: Gibt eine bestimmte Ausleihe basierend auf der ID zurück
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Die ID der Ausleihe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Erfolgreich, eine bestimmte Ausleihe
 *       400:
 *         description: Ausleihe nicht gefunden
 */
app.get("/lends/:id", (req, res) => {
    const id = req.params.id;
    const lend = lends.find(l => l.id === id);

    if (lend) {
        res.json(lend);
    } else {
        res.status(400).send("Ausleihe wurde nicht gefunden");
    }
});

/**
 * @swagger
 * /lends/{id}:
 *   delete:
 *     description: Löscht eine Ausleihe und setzt das Rückgabedatum
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Die ID der Ausleihe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Erfolgreich, Ausleihe zurückgegeben
 *       400:
 *         description: Ausleihe nicht gefunden
 */
app.delete("/lends/:id", (req, res) => {
    const id = req.params.id;
    const lend = lends.find(l => l.id === id);
    const return_date = Date.now();

    if (!lend){
        return res.status(400).send("Keine oder nicht valide id angegebenen")
    }

    lend.returned_at = return_date;

    res.send(lend);
});

/**
 * @swagger
 * /books:
 *   get:
 *     description: Gibt alle Bücher zurück
 *     responses:
 *       200:
 *         description: Erfolgreich, alle Bücher
 */
app.get("/books", (req, res) => {
    res.json(books);
});

/**
 * @swagger
 * /books/{isbn}:
 *   get:
 *     description: Gibt ein Buch basierend auf der ISBN zurück
 *     parameters:
 *       - name: isbn
 *         in: path
 *         required: true
 *         description: Die ISBN des Buches
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Erfolgreich, Buch gefunden
 */
app.get("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    res.json(books.find(b => b.isbn === isbn));
});

/**
 * @swagger
 * /books:
 *   post:
 *     description: Ein neues Buch hinzufügen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Erfolgreich, Buch hinzugefügt
 *       400:
 *         description: Alle Parameter müssen angegeben werden
 *       422:
 *         description: Die ISBN ist bereits vergeben
 */
app.post("/books", (req, res) => {
    const {isbn, title, year, author } = req.body;

    if (!isbn || !title || !year || !author) {
        return res.status(400).send("Alle Parameter müssen angegeben werden");
    }

    if (books.find(b => b.isbn === isbn)){
        return res.status(422).send("Angegebene ISBN ist vergeben");
    }

    books = [...books, {isbn, title, year, author}];

    res.status(201).send("Buch hinzugefügt: \n" + isbn + "\n" + title + "\n" +  year + "\n" + author);
});

/**
 * @swagger
 * /books/{isbn}:
 *   put:
 *     description: Ein Buch aktualisieren
 *     parameters:
 *       - name: isbn
 *         in: path
 *         required: true
 *         description: Die ISBN des zu aktualisierenden Buches
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Erfolgreich, Buch aktualisiert
 *       400:
 *         description: Alle Parameter müssen angegeben werden
 *       422:
 *         description: Die ISBN ist bereits vergeben
 */
app.put("/books/:isbn", (req, res) => {
    let {isbn, title, year, author } = req.body;
    const changingIsbn = req.params.isbn;

    if (!isbn){
        isbn = changingIsbn;
    }

    if (!isbn || !title || !year || !author) {
        return res.status(400).send("Alle Parameter müssen angegeben werden");
    }

    if (!(changingIsbn === isbn)){
        return res.status(400).send("Die angegebenen ISBN's stimmen nicht überein")
    }

    if (books.find(b => b.isbn === isbn)){
        books = books.filter(b => b.isbn !== changingIsbn);

        books = [...books, {isbn, title, year, author}];

        res.status(201).send("Buch aktualisiert: \n" + isbn + "\n" + title + "\n" +  year + "\n" + author);

        return res.status(422).send("Angegebene ISBN ist vergeben");
    } else {
        return res.status(400).send("Die angegebenen ISBN ist den System nicht bekannt")
    }
});

/**
 * @swagger
 * /books/{isbn}:
 *   delete:
 *     description: Löscht ein Buch basierend auf der ISBN
 *     parameters:
 *       - name: isbn
 *         in: path
 *         required: true
 *         description: Die ISBN des zu löschenden Buches
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Erfolgreich, Buch gelöscht
 *       400:
 *         description: Die ISBN ist nicht bekannt
 */
app.delete("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn
    if (books.find(b => b.isbn === isbn)){

        books.filter(b => b.isbn !== isbn);

        res.status(201).send("Buch mit der ISBN " + isbn + " gelöscht");
    } else {
        return res.status(400).send("Die angegebenen ISBN ist den System nicht bekannt")
    }
});

/**
 * @swagger
 * /books/{isbn}:
 *   patch:
 *     description: Aktualisiert Teile eines Buches basierend auf der ISBN
 *     parameters:
 *       - name: isbn
 *         in: path
 *         required: true
 *         description: Die ISBN des Buches
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Erfolgreich, Buch aktualisiert
 *       404:
 *         description: Buch nicht gefunden
 */
app.patch("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { title, year, author } = req.body;

    // Suche nach dem Buch mit der angegebenen ISBN
    const book = books.find(b => b.isbn === isbn);

    if (!book) {
        return res.status(404).send("Buch nicht gefunden");
    }

    // Nur die Felder aktualisieren, die im Body übergeben wurden
    if (title) book.title = title;
    if (year) book.year = year;
    if (author) book.author = author;

    res.status(200).send(`Buch aktualisiert: \nISBN: ${isbn}\nTitel: ${book.title}\nJahr: ${book.year}\nAutor: ${book.author}`);
});

console.log(`Server running at http://localhost:${port}`);
app.listen(port, () => {});
