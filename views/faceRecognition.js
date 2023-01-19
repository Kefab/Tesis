let faceMatcher = null;
let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let fot = document.getElementById("prueba");

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
  console.log(image_data_url);
});

async function hacerTodo(e) {
  console.log("entro");
  var data = { name: "algo" };
  fetch("http://localhost:3000/getImage", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.blob())
    .then(async (blob) => {
      const img = URL.createObjectURL(blob);
      await updateReferenceImageResults(img);
      canvas.toBlob(async function (blob) {
        const imgSrc = URL.createObjectURL(blob);
        await updateQueryImageResults(imgSrc);
      });
    });
}

async function uploadRefImage(e) {
  const imgFile = $("#refImgUploadInput").get(0).files[0];
  const img = await faceapi.bufferToImage(imgFile);
  $("#refImg").get(0).src = img.src;
  updateReferenceImageResults();
}

async function loadRefImageFromUrl(url) {
  const img = await requestExternalImage($("#refImgUrlInput").val());
  $("#refImg").get(0).src = img.src;
  updateReferenceImageResults();
}

async function uploadQueryImage(e) {
  const imgFile = $("#queryImgUploadInput").get(0).files[0];
  const img = await faceapi.bufferToImage(imgFile);
  $("#queryImg").get(0).src = img.src;
  updateQueryImageResults();
}

async function loadQueryImageFromUrl(url) {
  const img = await requestExternalImage($("#queryImgUrlInput").val());
  $("#queryImg").get(0).src = img.src;
  updateQueryImageResults();
}

async function updateReferenceImageResults(src) {
  const inputImgEl = new Image();
  inputImgEl.src = src;

  const fullFaceDescriptions = await faceapi
    .detectAllFaces(inputImgEl, getFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();
  console.log(fullFaceDescriptions.length);
  if (!fullFaceDescriptions.length || fullFaceDescriptions.length <= 0) {
    console.log("Ninguna cara encontrada");
    return;
  } else if (fullFaceDescriptions.length > 1) {
    console.log(
      `Solo puede haber una cara pero hay ${fullFaceDescriptions.length}`
    );
  } else {
    faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions);
  }
}

async function updateQueryImageResults(src) {
  var isPerson = false;
  console.log("entrando...");
  if (!faceMatcher) {
    console.log("no hay imagen de referencia");
    return;
  }

  var inputImgEl = new Image();
  inputImgEl.src = src;

  const results = await faceapi
    .detectAllFaces(inputImgEl, getFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();

  const resizedResults = faceapi.resizeResults(results, inputImgEl);

  resizedResults.forEach(({ detection, descriptor }) => {
    const label = faceMatcher.findBestMatch(descriptor).toString();
    const options = { label };
    const drawBox = new faceapi.draw.DrawBox(detection.box, options);
    console.log(label);
    if (label.includes("unknown")) {
      isPerson = false;
    } else {
      isPerson = true;
    }
  });

  if (isPerson) {
    alert("Paso");
    window.location = "/home";
  } else {
    alert("No paso");
    window.location = "/";
  }

  console.log("saliendo..");
}

async function updateResults() {
  await updateReferenceImageResults();
  await updateQueryImageResults();
}

async function run() {
  // load face detection, face landmark model and face recognition models
  await changeFaceDetector(selectedFaceDetector);
  await faceapi.loadFaceLandmarkModel("/");
  await faceapi.loadFaceRecognitionModel("/");
}

$(document).ready(function () {
  initFaceDetectionControls();
  run();
});
