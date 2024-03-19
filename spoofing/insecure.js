const express = require("express")
const session = require("express-session")

const app = express();
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: "SOMESECRET",
    cookie: {httpOnly: false},
    resave: false,
    saveUninitialized: false
  })
)
// generated and stored in server memory
// sent as a cookie to client

app.post("/sensitive", (req, res) => {
  if (req.session.user === 'Admin') {
    req.session.sensitive = 'supersecret';
    res.send({message: 'Operation successful'});
  }
  else {
    res.send({message: 'Unauthorized Access'});
  }
})

app.get("/", (req, res) => {
  let name = "Guest"

  if (req.session.user) name = req.session.user

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/register" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <button>Submit</button>
  </form>
  <form action="/forget" method="POST">
    <button>Logout</button>
  </form>
  `)
})

app.post("/register", (req, res) => {
  // name = req.body.name.trim()
  // res.redirect("/")
  req.session.user = req.body.name.trim()
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
})

app.post("/forget", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  })
})

app.listen(8000)


// weakness - if someone copies the cookie (session id) they can just become an authorized user
// clicking on malicious link, they can get access to session ids

// /sensitive - If there is a script between Admin and the server, then malicious user can gain access to it as they might have
// access to session. mal-csrf html can directly get access. See that code for more info.