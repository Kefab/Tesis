const { response } = require("express");

function doLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log(password);
  console.log(username);
  var data = { username, password };
  fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((response) => {
    if (response.status === 201) {
      alert("No es usuario");
      window.location = "/";
    } else {
      alert("Si es usuario");
      window.location = "/face_recognition";
    }
  });
}

function regist() {
  window.location = "regist";
}
