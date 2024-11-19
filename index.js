const express = require('express');
const bodyParser = require('body-parser');
const initRouter = require('./routers/web');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname, 'public')));

initRouter(app);


app.listen(PORT,() => {
    console.log("Server listening on port : " + PORT);
});