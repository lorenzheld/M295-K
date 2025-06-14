import express from 'express';
import {randomUUID} from 'node:crypto';
import session from 'express-session';

const app = express();
const port = 3000;
app.use(express.json());

app.use(session({
	secret: '030708',
	resave: false,
	saveUninitialized: true,
}));

let books = [
	{
		isbn: '978-3-16-148410-0',
		title: 'Der Prozess',
		year: 1925,
		author: 'Franz Kafka',
	},
	{
		isbn: '978-0-7432-7356-5',
		title: '1984',
		year: 1949,
		author: 'George Orwell',
	},
	{
		isbn: '978-0-7432-7356-6',
		title: 'Brave New World',
		year: 1932,
		author: 'Aldous Huxley',
	},
	{
		isbn: '978-1-4516-7321-5',
		title: 'The Great Gatsby',
		year: 1925,
		author: 'F. Scott Fitzgerald',
	},
	{
		isbn: '978-3-462-03976-6',
		title: 'Moby-Dick',
		year: 1851,
		author: 'Herman Melville',
	},
];
let lends = [];

app.post('/lends', (req, res) => {
	const id = randomUUID();
	const {customer_id: customerId} = req.body;
	const {isbn} = req.body;
	const borrowedAt = Date.now();

	const booLend = lends.find(l => l.isbn === isbn);
	const customerLends = lends.filter(l => l.customerId === customerId).length + 1;

	if (customerLends > 3) {
		return res.status(400).send('Ein Kunde kann nur maximal 3 Ausleihen haben');
	}

	if (booLend) {
		return res.status(400).send('Buch schon ausgeliehen');
	}

	const isValid = customerId && isbn;

	if (isValid) {
		lends = [...lends, {
			id, customerId, isbn, borrowedAt,
		}];

		res.status(201);
	} else {
		return res.status(422).send('Alle Parameter müssen angegeben werden');
	}
});

app.get('/lends', (req, res) => {
	res.send(lends);
});

app.get('/lends/:id', (req, res) => {
	const {id} = req.params;
	const lend = lends.find(l => l.id === id);

	if (lend) {
		res.json(lend);
	} else {
		res.status(400).send('Ausleihe wurde nicht gefunden');
	}
});

app.delete('/lends/:id', (req, res) => {
	const {id} = req.params;
	const lend = lends.find(l => l.id === id);
	const returnDate = Date.now();

	if (!lend) {
		return res.status(400).send('Keine oder nicht valide id angegebenen');
	}

	lend.returnedAt = returnDate;

	res.send(lend);
});

app.get('/lends', (req, res) => {
	res.send(lends);
});

app.get('/books', (req, res) => {
	res.json(books);
});

app.get('/books/:isbn', (req, res) => {
	const {isbn} = req.params;
	res.json(books.find(b => b.isbn === isbn));
});

app.post('/books', (req, res) => {
	const {isbn, title, year, author} = req.body;

	if (!isbn || !title || !year || !author) {
		return res.status(400).send('Alle Parameter müssen angegeben werden');
	}

	if (books.find(b => b.isbn === isbn)) {
		return res.status(422).send('Angegebene ISBN ist vergeben');
	}

	books = [...books, {
		isbn, title, year, author,
	}];

	res.status(201).send('Buch hinzugefügt: \n' + isbn + '\n' + title + '\n' + year + '\n' + author);
});

app.put('/books/:isbn', (req, res) => {
	let {isbn, title, year, author} = req.body;
	const changingIsbn = req.params.isbn;

	isbn ||= changingIsbn;

	if (!isbn || !title || !year || !author) {
		return res.status(400).send('Alle Parameter müssen angegeben werden');
	}

	if (!(changingIsbn === isbn)) {
		return res.status(400).send('Die angegebenen ISBN\'s stimmen nicht überein');
	}

	if (books.find(b => b.isbn === isbn)) {
		books = books.filter(b => b.isbn !== changingIsbn);

		books = [...books, {
			isbn, title, year, author,
		}];

		res.status(201).send('Buch aktualisiert: \n' + isbn + '\n' + title + '\n' + year + '\n' + author);

		return res.status(422).send('Angegebene ISBN ist vergeben');
	}

	return res.status(400).send('Die angegebenen ISBN ist den System nicht bekannt');
});

app.delete('/books/:isbn', (req, res) => {
	const {isbn} = req.params;
	if (books.find(b => b.isbn === isbn)) {
		books.filter(b => b.isbn !== isbn);

		res.status(201).send('Buch mit der ISBN ' + isbn + ' gelöscht');
	} else {
		return res.status(400).send('Die angegebenen ISBN ist den System nicht bekannt');
	}
});

app.patch('/books/:isbn', (req, res) => {
	const {isbn} = req.params;
	const {title, year, author} = req.body;

	// Suche nach dem Buch mit der angegebenen ISBN
	const book = books.find(b => b.isbn === isbn);

	if (!book) {
		return res.status(404).send('Buch nicht gefunden');
	}

	// Nur die Felder aktualisieren, die im Body übergeben wurden
	if (title) {
		book.title = title;
	}

	if (year) {
		book.year = year;
	}

	if (author) {
		book.author = author;
	}

	res.status(200).send(`Buch aktualisiert: \nISBN: ${isbn}\nTitel: ${book.title}\nJahr: ${book.year}\nAutor: ${book.author}`);
});

app.post('/login', (req, res) => {
	const {username} = req.body;
	const {password} = req.body;

	if (!(username && password)) {
		return res.status(400).json({error: 'Name parameter is required'});
	}

	if (!((username === 'lorenz') && (password === '1234'))) {
		return res.status(401).send('Falscher Username oder Password');
	}

	req.session.username = username;
	console.log(username + ' gespeichert');

	res.sendStatus(201);
});

app.get('/verify', (req, res) => {
	if (req.session.username) {
		res.sendStatus(200);
	} else {
		res.sendStatus(401);
	}
});

app.delete('/logout', (req, res) => {
	if (req.session.username) {
		delete req.session.username;
		res.sendStatus(204);
	} else {
		res.status(404).send('No session found');
	}
});

console.log(`Server running at http://localhost:${port}`);
app.listen(port, () => {
});
