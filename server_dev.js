const express = require("express");
const app = express();

const PORT = 5555;
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html", {
        root: __dirname,
    });
});

app.listen(PORT, () => {
    console.log("Server was launched succesfully");
});