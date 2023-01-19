const mysql = require("mysql");

function getUser(connection, user, callback) {
  let partial_query =
    "SELECT * FROM login_face.user WHERE username = ? AND password = ?;";
  let query = mysql.format(partial_query, [user.username, user.password]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

function insertUser(connection, user, callback) {
  let partial_query =
    "INSERT INTO login_face.user (username, password) VALUES (?, ?);";
  let query = mysql.format(partial_query, [user.username, user.password]);
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
}

module.exports = { getUser,insertUser };
