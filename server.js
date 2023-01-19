const express = require("express");
const path = require("path");
const { get } = require("request");
var mysql = require("mysql");
const {
  getUser,
  insertUser,
  increment_attempt,
  getUserById,
  uploadImage,
  uploadAcces,
  increment_recognition,
} = require("./scripts/dbOperations.js");
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
  const username = req.body.username;
  const password = req.body.password;
  getUser(con, { username, password }, (result) => {
    if (result.length <= 0) {
      res.status(201).send({ isUser: false, id: -2 });
    } else if (result[0].password === password) {
      res.status(200).send({ id: result[0].id_user, isUser: true });
    } else if (Number(result[0].login_attempts) >= 3) {
      res.status(202).send({ isUser: false, id: -1 });
    } else {
      increment_attempt(
        con,
        {
          id: result[0].id_user,
          attempt: Number(result[0].login_attempts) + 1,
        },
        (result) => {
          console.log("incremento");
        }
      );
      res.status(201).send({ isUser: false, id: -2 });
    }
  });
});

app.post("/uploadImage", upload.single("image"), (req, res) => {
  id = req.body.id;
  uploadImage(con, { id }, (result) => {
    console.log("updated");
  });
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
  const phoneNumber = req.body.phoneNumber;
  insertUser(con, { username, password, phoneNumber }, (result) => {
    console.log(result.insertId);
    res.status(200).send({ id: result.insertId });
  });
});

app.post("/uploaded", (req, res) => {
  const id = req.body.id;
  getUserById(con, { id }, (result) => {
    res.send({ uploaded: result[0].img_uploaded });
  });
});

app.post("/loged", (req, res) => {
  const id = req.body.id;
  console.log(id);
  getUserById(con, { id }, (result) => {
    res.send({ uploaded: result[0].have_acces });
  });
});

app.post("/acces", (req, res) => {
  acces = req.body.acces;
  id = req.body.id;
  if (acces == 1) {
    uploadAcces(con, [id], (result) => {
      console.log("updated");
    });
    res.status(200).send({ message: "OK" });
  } else {
    getUserById(con, { id }, (result) => {
      if (result[0].recognition_attempts >= 3) {
        res.status(201).send({ message: "UP" });
      } else {
        increment_recognition(
          con,
          {
            id: result[0].id_user,
            attempt: Number(result[0].recognition_attempts) + 1,
          },
          (result) => {
            console.log("incremento");
          }
        );
        res.status(202).send({ message: "Fallo" });
      }
    });
  }
});

app.listen(3000, () => console.log("Listening on port 3000!"));
