const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
    "5b4xy8": "http://www.facebook.com"
};

let users = {
    "joeMomma": {
        id: "joeMomma",
        email: "joe@momma.com",
        password: "mommy"
    },
    "joeDaddy": {
        id: "joeDaddy",
        email: "joe@daddy.com",
        password: "daddy"
    }
};

function generateRandomString() {
    randomString = Math.random().toString(36).substring(2, 8);
    return randomString;
}

// route to urlDatabase (main page)
app.get("/urls", (req, result, username) => {
    console.log(req.cookies.username);
    let templateVars = { urls: urlDatabase, username: req.cookies.username };
    result.render("urls_index", templateVars);
});
// get request renders new tinyURL maker page
app.get("/urls/new", (req, result, username) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl], username: req.cookies.username }
    result.render("urls_new", templateVars);
});
// route to urlshortenedURL page to edit
app.get("/urls/:shortURL", (req, result, username) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], username: req.cookies.username }
    result.render("urls_show", templateVars);
});
//  register page get
app.get("/register", (req, result, username) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], username: req.cookies.username }
    result.render("urls_register", templateVars);
});
app.get("/login", (req, result, username) => {
    let templateVars = {};
    result.render("urls_login", templateVars);
});
//  register page post
app.post("/register", (req, result, username) => {
    let uEu = req.body.email;
    let uEp = req.body.password;
    let rString = generateRandomString(); // generate random userid
    if (uEu == false || uEp == false) {
        result.send("404 Error. Enter valid username & password");
    }
    users[rString] = {
        id: rString,
        email: uEu,
        password: uEp
    };

    result.cookie('username', users[rString].id);
    // result.cookie('email', users[rString].email);
    console.log(users[rString]);
    console.log(users[rString].email);
    result.redirect('/urls');
});
// app.post("/urls/:shortURL", (req, result) => {
//     let longURL = urlDatabase[req.params.shortURL];
//     result.redirect(longURL);
// });
//new generated link page
app.post("/urls", (req, result) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl] }
    rString = generateRandomString(); // generate random string
    urlDatabase[rString] = req.body.longURL; // redefine string
    var linkName = "Here's your link!"; // new link generated
    result.send(rString + ' ' + linkName.link(urlDatabase[rString])); // redirect to new linked page and insert string and new link
    // result.redirect("/urls");
});
//   delete object.property
app.post("/urls/:id/delete", (req, result) => {
    delete(urlDatabase[req.params.id]); // delete my object id from the html form
    result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//   edit the value of the long url to the new input
app.post("/urls/:id/update", (req, result) => {
    urlDatabase[req.params.id] = req.body.longURL;
    result.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//get a login username and password create a user cookie
app.post("/login", (req, res) => { //recieves cookie and redirects

    res.cookie('email', req.body.email);
    res.cookie('email', req.body.email);
    res.redirect("/urls");

});
//get a logout username and create a user cookie
app.post("/logout", (req, res) => { //recieves cooking and redirects
    res.clearCookie('username', '');
    res.clearCookie('email', '');
    res.redirect("/login");
    console.log(Object.keys(req.cookies));

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