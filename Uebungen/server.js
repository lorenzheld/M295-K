

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
    {
        isbn: '978-0-14-118709-8',
        title: 'Das Schloss',
        year: 1926,
        author: 'Franz Kafka',
    },
];



const findBooks = books.filter(b => b.author === "Franz Kafka");  //findet alle Bücher von Franz kafka

const findByIsbn = books.find(b => b.isbn === "978-1-4516-7321-5"); //findet von der ISBN aus

const titles = books.map((book) => {return book.title.toUpperCase()}); //nimmt alle titel von jedem buch und gibt sie uppercase aus

const modifiedBook = {...findByIsbn, year: 2025};

books = [...books, {isbn: '978-0-7432-7356-5', title: "Ajay auf reisen", year: 2029, author:"Sandro Reller"}]

const authors = books.reduce((acc, book) => `${acc}${book.author} \n` , "")

console.log(authors);