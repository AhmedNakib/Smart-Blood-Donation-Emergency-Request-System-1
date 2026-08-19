document.addEventListener("DOMContentLoaded", function () {
  const requestForm = document.getElementById("requestForm");
  const successBox = document.getElementById("successBox");
  const requestList = document.getElementById("requestList");

  if (requestForm) {
    requestForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const patient = document.getElementById("patient").value;
      const bg = document.getElementById("bg").value;
      const units = document.getElementById("units").value;
      const hospital = document.getElementById("hospital").value;
      const district = document.getElementById("district").value;
      const urgency = document.getElementById("urgency").value;
      const phone = document.getElementById("phone").value;
      const notes = document.getElementById("notes").value;

      if (successBox) {
        successBox.textContent = "Emergency request posted successfully for patient: " + patient;
        successBox.classList.add("show");
      }

      if (requestList) {
        const newCard = document.createElement("div");
        newCard.className = "emg-card";
        newCard.innerHTML = `
          <div>
            <div class="who">${patient} (${bg} - ${units} Unit)</div>
            <div class="meta">${hospital}, ${district} | Phone: ${phone}</div>
          </div>
          <span class="badge badge-${urgency}">${urgency}</span>
        `;
        requestList.prepend(newCard);
      }

      requestForm.reset();
    });
  }
});