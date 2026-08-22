document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const successBox = document.getElementById("successBox");

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const newDonor = {
        name: document.getElementById("name").value.trim(),
        bg: document.getElementById("bg").value,
        phone: document.getElementById("phone").value.trim(),
        district: document.getElementById("district").value.trim(),
        area: document.getElementById("area").value.trim(),
        available: document.getElementById("available").checked
      };

      try {
        // সার্ভারের সম্পূর্ণ লিঙ্ক দেওয়া হয়েছে
        const res = await fetch("http://localhost:3000/api/donors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDonor)
        });

        if (res.ok) {
          if (successBox) {
            successBox.textContent = "Registration successful! You are now live on the directory.";
            successBox.classList.add("show");
          }
          registerForm.reset();
        }
      } catch (err) {
        console.error("Error submitting registration:", err);
      }
    });
  }
});