const mysql = require("mysql");

function getUser(connection, user, callback) {
  let partial_query = "SELECT * FROM login_face.user WHERE username = ?;";
  let query = mysql.format(partial_query, [user.username]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function getUserById(connection, user, callback) {
  let partial_query = "SELECT * FROM login_face.user WHERE id_user = ?;";
  let query = mysql.format(partial_query, [user.id]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function insertUser(connection, user, callback) {
  let partial_query =
    "INSERT INTO login_face.user (username, password,phone_number) VALUES (?, ?, ?);";
  let query = mysql.format(partial_query, [
    user.username,
    user.password,
    user.phoneNumber,
  ]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function increment_attempt(connection, user, callback) {
  let partial_query =
    "UPDATE login_face.user SET login_attempts = ? WHERE id_user = ?;";
  let query = mysql.format(partial_query, [user.attempt, user.id]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function uploadImage(connection, user, callback) {
  let partial_query =
    "UPDATE login_face.user SET img_uploaded = 1 WHERE id_user = ?;";
  let query = mysql.format(partial_query, [user.id]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function uploadAcces(connection, user, callback) {
  let partial_query =
    "UPDATE login_face.user SET have_acces = 1 WHERE id_user = ?;";
  let query = mysql.format(partial_query, [user.id]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function increment_recognition(connection, user, callback) {
  let partial_query =
    "UPDATE login_face.user SET recognition_attempts = ? WHERE id_user = ?;";
  let query = mysql.format(partial_query, [user.attempt, user.id]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

module.exports = {
  getUser,
  insertUser,
  increment_attempt,
  getUserById,
  uploadImage,
  uploadAcces,
  increment_recognition,
};
