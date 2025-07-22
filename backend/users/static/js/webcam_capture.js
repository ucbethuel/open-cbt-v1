document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("webcam-stream");
  const captureBtn = document.getElementById("capture-photo");
  const fileInput = document.getElementById("photo-upload");

  if (!video || !captureBtn || !fileInput) return;

  // Request webcam access
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    video.srcObject = stream;
    video.play();
  }).catch(err => {
    console.warn("Webcam not accessible:", err);
  });

  captureBtn.addEventListener("click", function () {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 225;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function (blob) {
      const file = new File([blob], "webcam_photo.png", { type: "image/png" });

      // Inject into file input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      // Optional: visual confirmation
      alert("Photo captured and added to form.");
    }, "image/png");
  });
});
