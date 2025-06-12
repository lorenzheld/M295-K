import swaggerAutogen from 'swagger-autogen';

// Der Pfad zu der Datei, in der die Swagger-Dokumentation gespeichert werden soll
const outputFile = './swagger.json';

// Der Pfad zu den API-Endpunkten, die dokumentiert werden sollen (deine `server.js` Datei)
const endpointsFiles = ['./server.js'];

// Swagger-Dokumentation generieren
swaggerAutogen(outputFile, endpointsFiles);
