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
app.get("/urls", (req, result, user_id) => {
    console.log(req.cookies.user_id);
    let templateVars = { urls: urlDatabase, user_id: req.cookies.user_id };
    result.render("urls_index", templateVars);
});
// get request renders new tinyURL maker page
app.get("/urls/new", (req, result, user_id) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl], user_id: req.cookies.user_id }
    result.render("urls_new", templateVars);
});
// route to urlshortenedURL page to edit
app.get("/urls/:shortURL", (req, result, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], user_id: req.cookies.user_id }
    result.render("urls_show", templateVars);
});
//  register page get
app.get("/register", (req, result, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], user_id: req.cookies.user_id }
    result.render("urls_register", templateVars);
});
app.get("/login", (req, result, user_id) => {
    let templateVars = {};
    result.render("urls_login", templateVars);
});
//  register page post
app.post("/register", (req, result, user_id) => {
    let uEu = req.body.email;
    let uEp = req.body.password;
    let rString = generateRandomString(); // generate random userid
    if (uEu == false || uEp == false) {
        result.send("404 Error. Enter valid user_id & password");
    }
    users[rString] = {
        id: rString,
        email: uEu,
        password: uEp
    };
    result.cookie('user_id', users[rString].id);
    // result.cookie('email', users[rString].email);
    console.log(users);
    console.log(users[rString].email + 'gregregueriguerhugheriugherguheurhgireuhgerhug');
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
//get a login user_id and password create a user cookie
app.post("/login", (req, res) => { //recieves cookie and redirects
    let uEu = req.body.email;
    let uEp = req.body.password;
    for (id in users) {
        if (uEu === users[id].email && uEp === users[id].password) {
            res.cookie('user_id', id);
            res.redirect("/urls");
        }
    }
    res.send("no user exists");
});
//get a logout user_id and create a user cookie
app.post("/logout", (req, res) => { //recieves cooking and redirects

    res.clearCookie('user_id');
    res.redirect("/urls");
    console.log(Object.keys(req.cookies));

});
//for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes user_id cookie to server
    let templateVars = {
        user_id: req.cookies.user_id
    }
    res.cookie("user_id", req.body.user_id);
    res.render("urls_index", templateVars);
});
//port message on the console
app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});