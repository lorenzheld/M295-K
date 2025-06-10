import { readFile } from "node:fs"

function leseDateiInhalt(dateipfad) {
    return new Promise((resolve, reject) => {
        readFile(dateipfad, "utf8", (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data)
        })
    })
}

leseDateiInhalt('test')
    .then(inhalt => { console.log('Die Länge des Dateiinhalts beträgt:', inhalt.length);
})
    .catch(err => { console.error('Fehler beim Lesen der Datei:', err);
});

