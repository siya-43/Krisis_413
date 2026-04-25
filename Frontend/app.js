window.onload = () => {
  const video = document.getElementById("cam1");

  if (!video) {
    console.error("❌ Video element with id 'cam1' not found");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Alert box (optional UI)
  const alertBox = document.getElementById("alert");

  // Wait until video is fully ready
  video.addEventListener("loadeddata", () => {
    console.log("✅ Video loaded and ready");

    setInterval(() => {
      // Use original video resolution (IMPORTANT for detection)
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // If video not ready yet, skip
      if (canvas.width === 0 || canvas.height === 0) {
        console.warn("⚠️ Video not ready yet");
        return;
      }

      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert frame to image
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("❌ Failed to capture frame");
          return;
        }

        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          console.log("📡 Sending frame to backend...");

          const res = await fetch("http://127.0.0.1:8000/detect", {
            method: "POST",
            body: formData
          });

          const data = await res.json();

          console.log("🧠 Detection result:", data);

          // Show alert if detected
          if (data.fire || data.smoke) {
            console.log("🚨 ALERT DETECTED!");

            if (alertBox) {
              alertBox.style.display = "block";
              alertBox.innerText = data.fire
                ? "🔥 FIRE DETECTED"
                : "💨 SMOKE DETECTED";
            }
          } else {
            if (alertBox) {
              alertBox.style.display = "none";
            }
          }

        } catch (err) {
          console.error("❌ Error calling backend:", err);
        }
      }, "image/jpeg");

    }, 2000); // every 2 seconds (good balance)
  });
};
