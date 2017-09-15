const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
// let currentUsername = ;
// let urlsForUser = ;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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
        password: "mommy"
    },
    "asdf452": {
        id: "joeDaddy",
        email: "joe@daddy.com",
        password: "daddy"
    }
};

function generateRandomString() {
    randomString = Math.random().toString(36).substring(2, 8);
    return randomString;
}

// function urlsForUser(id) {

//     if (id = urlDatabase[req.params.shorturl]) {
//         return ....what;

//     }

// }

// route to urlDatabase (main page)
app.get("/urls", (req, res, user_id) => {
    //req.cookies.user_id is the current user login id
    let filteredDatabase = {};

    for (i in urlDatabase) {
        if (req.cookies.user_id === urlDatabase[i].userPoster) {
            filteredDatabase[i] = urlDatabase[i];
        } else if (req.cookies.user_id === undefined) {
            console.log('helloooooooooooooooooooooooooooooooooooo');
            filteredDatabase = urlDatabase;
            break;
        }
    }
    console.log(filteredDatabase);

    let templateVars = { urls: filteredDatabase, user_id: req.cookies.user_id };
    res.render("urls_index", templateVars);
});

// get request renders new tinyURL maker page
app.get("/urls/new", (req, res, user_id) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl], user_id: req.cookies.user_id }
    if (req.cookies.user_id !== undefined) {
        res.render("urls_new", templateVars);
    }

    res.redirect('/login');
});
// route to urlshortenedURL page to edit
app.get("/urls/:shortURL", (req, res, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL].fullURL, user_id: req.cookies.user_id }
    if (req.cookies.user_id !== undefined) {
        res.render("urls_new", templateVars);
    }
    res.redirect('/login');
});
//  register page get
app.get("/register", (req, res, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], user_id: req.cookies.user_id }
    res.render("urls_register", templateVars);
});
app.get("/login", (req, res, user_id) => {
    let templateVars = {};
    res.render("urls_login", templateVars);
});
//  register page post
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
        password: uEp
    };
    res.cookie('user_id', users[rString].id);
    // res.cookie('email', users[rString].email);
    res.redirect('/urls');
});
// app.post("/urls/:shortURL", (req, res) => {
//     let longURL = urlDatabase[req.params.shortURL];
//     res.redirect(longURL);
// });
//new generated link page
app.post("/newLink", (req, res) => {
    let templateVars = { longURL: urlDatabase[req.params.longUrl] }
    rString = generateRandomString(); // generate random string
    urlDatabase[rString] = {
        fullURL: req.body.longURL,
        userPoster: req.cookies.user_id
    };
    console.log(urlDatabase);
    //req.body.longURL; // redefine string
    // var linkName = "Here's your link!"; // new link generated
    // res.send(rString + ' ' + linkName.link(urlDatabase[rString])); // redirect to new linked page and insert string and new link
    res.redirect("/urls");
});
//   delete object.property
app.post("/urls/:id/delete", (req, res) => {
    delete(urlDatabase[req.params.id]); // delete my object id from the html form
    res.redirect("http://localhost:8080/urls/"); // redirect to main page
});
//   edit the value of the long url to the new input
app.post("/urls/:id/update", (req, res) => {

    urlDatabase[req.params.id] = req.body.longURL;
    res.redirect("http://localhost:8080/urls/"); // redirect to main page
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
    //console.log(Object.keys(req.cookies));
});
//for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes user_id cookie to server
    let templateVars = {
        user_id: req.cookies.user_id
    }
    console.log(user_id.id);
    console.log(req.cookies.user_id);
    res.cookie("user_id", id);
    res.render("urls_index", templateVars);
});
//port message on the console
app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});