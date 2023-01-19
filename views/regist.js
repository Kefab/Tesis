var camera_button = document.querySelector("#start-camera");
var click_button = document.querySelector("#click-photo");
var canvas = document.querySelector("#canvas");
var video = document.querySelector("#video");

camera_button.addEventListener("click", async function () {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  video.srcObject = stream;
});

click_button.addEventListener("click", function () {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL("image/jpeg");
});

function movoToIndex() {
  window.location = "/";
}

function saveImage() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = { username, password };

  fetch("http://localhost:3000/registUser", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((response) => {
    console.log(response);
  });

  var formData = new FormData();
  canvas.toBlob(function (blob) {
    formData.append("image", blob, `${username}.jpeg`);
    fetch("http://localhost:3000/uploadImage", {
      method: "POST",
      body: formData,
    }).then((res) => console.log(res));
  });
}
