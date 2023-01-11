function doLogin() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  if (username.value == "kefab") {
    window.location = "face_recognition";
  } else {
    window.location = "fake_recognition";
  }
}

function regist() {
  window.location = "regist";
}
