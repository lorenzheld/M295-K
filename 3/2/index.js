import express from 'express';

const app = express();
const port = 3000;

app.get('/temperature/:plz', async (req, res) => {
    const plz = req.params.plz;
    const url = `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).send(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        const temperature = data.currentWeather.temperature;

        res.send("Im Dorf mit der PLZ " + plz + " ist es " + temperature.toFixed(1) + "°C.");

    } catch (error) {
        console.error('Error fetching temperature:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});