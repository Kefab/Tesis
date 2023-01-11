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

function movoToIndex(){
  window.location = '/'
}
