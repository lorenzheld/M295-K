function duplicate(zahl, callback){
    const ergebnis = zahl*2
    callback(ergebnis)
}

duplicate(5, function (ergebnis){
    console.log("Das Ergebnis ist " + ergebnis)
})