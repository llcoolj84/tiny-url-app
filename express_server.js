const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

function generateRandomString() {
    randomString = Math.random().toString(36).substring(2, 8);
    return randomString;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
    "5b4xy8": "http://www.facebook.com"
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
app.get("/urls/new", (req, result) => {
    // let templateVars = { longURL: urlDatabase[req.params.shorturl] }
    result.render("urls_new");
});
// route to urlshortenedlinks page
app.post("/urls/:shorturl", (req, result) => {
    let templateVars = { shortURL: req.params.shorturl, targetURL: urlDatabase[req.params.shorturl] };
    result.render("urls_show", templateVars);
});
app.post("/u/:shortURL", (req, result) => {
    let longURL = urlDatabase[req.params.shorturl]
    result.redirect(longURL);
});
//new generated link
app.post("/urls", (req, result) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl] }
    rString = generateRandomString(); // generate random string
    urlDatabase[rString] = req.body.longURL; // redefine string
    var linkName = "Here's your link!"; // new link generated
    result.send(rString + ' ' + linkName.link(urlDatabase[rString])); // redirect to new linked page and insert string and new link
});
//   delete object.property
app.post("/urls/:id/delete", (req, result) => {
    delete(urlDatabase[req.params.id]); // delete my object id from the html form
    result.redirect("http://localhost:8080/urls/") // redirect to main page
});
//re-assign the value of the long url to the new input
app.post("/urls/:id/update", (req, result) => {
    urlDatabase[req.params.id] = req.body.longURL;
    result.redirect("http://localhost:8080/urls/") // redirect to main page
});
//port message on the console
app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});