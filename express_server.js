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
app.set('trust proxy', 0) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: ['user_id']
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
    return res.render("urls_index", templateVars);
});

// new tiny URL page
app.get("/urls/new", (req, res, user_id) => {
    let templateVars = { longURL: urlDatabase[req.params.shorturl], user_id: req.session.user_id }
    if (req.session.user_id !== undefined) {
        return res.render("urls_new", templateVars);
    } else {
        res.send("404 Error. Please login to create a Tiny URL");
    }
});

// short URL page to update
app.get("/urls/:shortURL", (req, res, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL].fullURL, user_id: req.session.user_id }
    if (req.session.user_id !== undefined) {
        return res.render("urls_show", templateVars);
    }
    res.redirect('/login');
});
//  register page
app.get("/register", (req, res, user_id) => {
    let templateVars = { shortURL: req.params.shortURL, targetURL: urlDatabase[req.params.shortURL], user_id: req.session.user_id }
    return res.render("urls_register", templateVars);
});
//  login page
app.get("/login", (req, res, user_id) => {
    let templateVars = {};
    return res.render("urls_login", templateVars);
});
//  register page
app.post("/register", (req, res, user_id) => {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let rString = generateRandomString(); // generate random userid
    if (userEmail == false || userPassword == false) {
        res.send("404 Error. Enter valid user_id & password");
    }
    users[rString] = {
        id: rString,
        email: userEmail,
        password: bcrypt.hashSync(userPassword, 10)
    };
    req.session.user_id = users[rString].id;

    // res.cookie('email', users[rString].email);
    return res.redirect('/urls');
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
    if (req.session.user_id === urlDatabase[i].userPoster) {
        delete(urlDatabase[req.params.id]); // delete my object id from the html form
        return res.redirect("http://localhost:8080/urls/"); // redirect to main page
    } else {
        res.status(403).send('Incorrect User');
    }

});

//   edit the value of the long url to the new input
app.post("/urls/:id/update", (req, res) => {


    if (req.session.user_id === urlDatabase[i].userPoster) {
        urlDatabase[req.params.id].fullURL = req.body.longURL;
        return res.redirect("http://localhost:8080/urls/"); // redirect to main page
    } else {
        res.status(403).send('Incorrect User');
    }

});

// login user_id and password create a user cookie
app.post("/login", (req, res) => { //recieves cookie and redirects
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let founduser = undefined;

    for (id in users) {
        if (userEmail === users[id].email && bcrypt.compareSync(userPassword, users[id].password) === true) {
            founduser = id;
        }
    }

    if (founduser) {
        req.session.user_id = founduser;
        return res.redirect("/urls");
    } else {
        res.send("user does not exist");
    }


});
// logout user_id and create a user cookie
app.post("/logout", (req, res) => { //recieves cooking and redirects
    req.session = null;
    return res.redirect("/urls");
});
// for returning the cookie to display back to user
app.post("/urls", (req, res) => { //writes user_id cookie to server
    let templateVars = {
        user_id: req.session.user_id
    }
    return res.render("urls_index", templateVars);
});
//port message on the console
app.listen(PORT, () => {
    console.log(`tiny url app listening on port ${PORT}!`);
});