const express = require("express");
const path = require("path");
const { get } = require("request");
var mysql = require("mysql");
const { getUser, insertUser } = require("./scripts/dbOperations.js");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewsDir = path.join(__dirname, "views");
app.use(express.static(viewsDir));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./weights")));
app.use(express.static(path.join(__dirname, "./dist")));

app.get("/", (req, res) => res.redirect("/index"));

app.get("/index", (req, res) =>
  res.sendFile(path.join(viewsDir, "prueba2.html"))
);

app.get("/face_recognition", (req, res) =>
  res.sendFile(path.join(viewsDir, "faceRecognition.html"))
);

app.get("/fake_recognition", (req, res) =>
  res.sendFile(path.join(viewsDir, "fake_recognition.html"))
);

app.get("/home", (req, res) =>
  res.sendFile(path.join(viewsDir, "mainPage.html"))
);

app.get("/regist", (req, res) =>
  res.sendFile(path.join(viewsDir, "regist.html"))
);

app.post("/login", (req, res) => {
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

app.post("/fetch_external_image", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).send("imageUrl param required");
  }
  try {
    const externalResponse = await request(imageUrl);
    res.set("content-type", externalResponse.headers["content-type"]);
    return res.status(202).send(Buffer.from(externalResponse.body));
  } catch (err) {
    return res.status(404).send(err.toString());
  }
});

app.post("/registUser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  insertUser(con, { username, password }, (result) => {
    res.status(200).end("ok");
  });
});

app.listen(3000, () => console.log("Listening on port 3000!"));
