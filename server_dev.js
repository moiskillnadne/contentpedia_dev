const express = require('express');
const app = express();

app.use(express.static(__dirname + "/public"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html", {
        root: __dirname
    })
})

app.listen(80, () => {
    console.log('Server was launched succesfully')
})