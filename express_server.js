const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

function generateRandomString() {
    randomString = Math.random().toString(36).substring(2, 8);
    return randomString;
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
    "5b4xy8": "http://www.facebook.com"
};

// route to urlDatabase (main page **working**)
app.get("/urls", (req, result, username) => {
    let templateVars = { urls: urlDatabase, username: req.cookies.username };
    result.render("urls_index", templateVars);
});

app.get("/urls/new", (req, result, username) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl], username: req.cookies.username }
    result.render("urls_new", templateVars);
});
// route to urlshortenedlinks page to edit **working now**
app.get("/urls/:shortURL", (req, result, username) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], username: req.cookies.username }
    result.render("urls_show", templateVars);
});
app.post("/urls/:shortURL", (req, result) => {
    let longURL = urlDatabase[req.params.shortURL];
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
    result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//re-assign the value of the long url to the new input ** working **
app.post("/urls/:id/update", (req, result) => {
    urlDatabase[req.params.id] = req.body.longURL;
    result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//get a login username and create a user cookie
app.post("/login", (req, res) => { //recieves cooking and redirects
    res.cookie('username', req.body.username);
    console.log(req.cookies.username);
    res.redirect("/urls");
});
//get a logout username and create a user cookie
app.post("/logout", (req, res) => { //recieves cooking and redirects
    res.clearCookie('username');
    res.redirect("/urls");
});
//for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes username cookie to server
    let templateVars = {
        username: req.cookies.username
    }
    res.cookie("username", req.body.username);
    res.render("urls_index", templateVars);
});

//port message on the console
app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});