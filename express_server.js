// required api's and modules
const express = require("express");
const cookieSession = require('cookie-session');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// dummy databases our app references
let urlDatabase = {

    "b2xVn2": {
        fullURL: "http://www.lighthouselabs.ca",
        userPoster: "asX4l2"
    },
    "9sm5xK": {
        fullURL: "http://www.google.com",
        userPoster: "asX4l2"
    },
    "5b4xy8": {
        fullURL: "http://www.facebook.com",
        userPoster: "asdf452"
    }
};

let users = {
    "asX4l2": {
        id: "joeMomma",
        email: "joe@momma.com",
        password: bcrypt.hashSync('mommy', 10)
    },
    "asdf452": {
        id: "joeDaddy",
        email: "joe@daddy.com",
        password: bcrypt.hashSync('daddy', 10)
    }
};

// generate random string function
function generateRandomString() {
    randomString = Math.random().toString(36).substring(2, 8);
    return randomString;
}
// encrypted cooke functions
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.get('/', function(req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1

    // Write response
    res.end(req.session.views + ' views')
})
app.listen(3000);

// route to urlDatabase (main page)
app.get("/urls", (req, res, user_id) => {
    let filteredDatabase = {}; //filter session to show only user data when logged in

    for (i in urlDatabase) {
        if (req.session.user_id === urlDatabase[i].userPoster) {
            filteredDatabase[i] = urlDatabase[i];
        } else if (req.session.user_id === undefined) {
            filteredDatabase = urlDatabase;
            break;
        }
    }
    let templateVars = { urls: filteredDatabase, user_id: req.session.user_id };
    res.render("urls_index", templateVars);
});

// new tiny URL page
app.get("/urls/new", (req, res, user_id) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl], user_id: req.session.user_id }
    if (req.session.user_id !== undefined) {
        res.render("urls_new", templateVars);
    } else {
        res.send("404 Error. Enter valid user_id & password");
    }
});

// short URL page to update
app.get("/urls/:shortURL", (req, res, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL].fullURL, user_id: req.session.user_id }
    if (req.session.user_id !== undefined) {
        res.render("urls_show", templateVars);
    }
    res.redirect('/login');
});
//  register page
app.get("/register", (req, res, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], user_id: req.session.user_id }
    res.render("urls_register", templateVars);
});
//  login page
app.get("/login", (req, res, user_id) => {
    let templateVars = {};
    res.render("urls_login", templateVars);
});
//  register page
app.post("/register", (req, res, user_id) => {
    let uEu = req.body.email;
    let uEp = req.body.password;
    let rString = generateRandomString(); // generate random userid
    if (uEu == false || uEp == false) {
        res.send("404 Error. Enter valid user_id & password");
    }
    users[rString] = {
        id: rString,
        email: uEu,
        password: bcrypt.hashSync(uEp, 10)
    };
    req.session.user_id = users[rString].id;

    // res.cookie('email', users[rString].email);
    res.redirect('/urls');
});

// create new Link page
app.post("/newLink", (req, res) => {
    let templateVars = { longURL: urlDatabase[req.params.longUrl] }
    rString = generateRandomString(); // generate random string
    urlDatabase[rString] = {
        fullURL: req.body.longURL,
        userPoster: req.session.user_id
    };
    res.redirect("/urls");
});
//   delete object.property
app.post("/urls/:id/delete", (req, res) => {
    delete(urlDatabase[req.params.id]); // delete my object id from the html form
    res.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//   edit the value of the long url to the new input
app.post("/urls/:id/update", (req, res) => {

    urlDatabase[req.params.id].fullURL = req.body.longURL;
    res.redirect("http://localhost:8080/urls/"); // redirect to main page
});

// login user_id and password create a user cookie
app.post("/login", (req, res) => { //recieves cookie and redirects
    let uEu = req.body.email;
    let uEp = req.body.password;

    let founduser = undefined;

    for (id in users) {
        if (uEu === users[id].email && bcrypt.compareSync(uEp, users[id].password) === true) {
            founduser = id;
        }
    }

    if (founduser) {
        req.session.user_id = id;
        res.redirect("/urls");
    } else {
        res.send("user does not exist");
    }


});
// logout user_id and create a user cookie
app.post("/logout", (req, res) => { //recieves cooking and redirects
    req.session = null;
    res.redirect("/urls");
});
// for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes user_id cookie to server
    let templateVars = {
        user_id: req.session.user_id
    }
    res.render("urls_index", templateVars);
});
//port message on the console
app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});