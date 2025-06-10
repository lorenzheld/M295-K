function simuliereVerzögerung(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addiereNachVerzögerung(zahl1, zahl2, verzögerung) {
    await simuliereVerzögerung(verzögerung).then(() => console.log(zahl1 + zahl2));
}
addiereNachVerzögerung(5, 10, 2000);