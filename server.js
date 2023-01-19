const express = require("express");
const path = require("path");
const { get } = require("request");
var mysql = require("mysql");
const { getUser, insertUser } = require("./scripts/dbOperations.js");
var cors = require("cors");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsDir = path.join(__dirname, "views");
app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./weights")));
app.use(express.static(path.join(__dirname, "./dist")));

app.post("/login", (req, res) => {
  console.log("Entro");
  const username = req.body.username;
  const password = req.body.password;
  getUser(con, { username, password }, (result) => {
    if (result.length == 1) {
      res.status(200).json({ isUser: true });
    } else {
      res.status(201).json({ isUser: false });
    }
  });
});

app.post("/uploadImage", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok");
});

app.post("/getImage", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  res.sendFile(`D:\\Repositorios\\Tesis\\Tesis\\uploads\\${name}.jpeg`);
});

app.post("/registUser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  insertUser(con, { username, password }, (result) => {
    res.status(200).end("ok");
  });
});

app.listen(3000, () => console.log("Listening on port 3000!"));
