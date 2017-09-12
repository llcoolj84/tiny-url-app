const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
//print out a string "Hello!" in html
app.get("/hello", (req, result) => {
    result.end("<html><body>Hello <b>World</b></body></html>\n");
});
// route to urlDatabase
app.get("/urls", (req, result) => {
    let templateVars = { urls: urlDatabase };
    result.render("urls_index", templateVars);
});
// route to urlshortenedlinks page
app.get("/urls/:shorturl", (req, result) => {
    let templateVars = { shortURL: req.params.shorturl, targetURL: urlDatabase[req.params.shorturl] };
    // let templateVars = { shortURL: urlDatabase };
    result.render("urls_show", templateVars);
});

app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});