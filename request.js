document.addEventListener("DOMContentLoaded", function () {
  const requestForm = document.getElementById("requestForm");
  const successBox = document.getElementById("successBox");
  const requestList = document.getElementById("requestList");

<<<<<<< HEAD
  async function renderRequests() {
    if (!requestList) return;
    try {
      const res = await fetch("/api/requests");
      const requests = await res.json();
      const approved = requests.filter(r => r.status === "approved");

      if (approved.length === 0) {
        requestList.innerHTML = `<div class="empty">No active emergency requests posted yet.</div>`;
        return;
      }

      requestList.innerHTML = approved.map(req => `
        <div class="emg-card">
          <div>
            <div class="who">${req.patient} (${req.bg} - ${req.units} Unit${req.units > 1 ? 's' : ''})</div>
            <div class="meta">${req.hospital}, ${req.district} | Contact: <a href="tel:${req.phone}" style="color:var(--crimson); text-decoration:none; font-weight:600;">${req.phone}</a></div>
            ${req.notes ? `<div class="meta" style="font-style:italic; margin-top:4px;">Note: ${req.notes}</div>` : ''}
          </div>
          <span class="badge badge-${req.urgency}">${req.urgency}</span>
        </div>
      `).join("");
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  }

  if (requestForm) {
    requestForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const newRequest = {
        patient: document.getElementById("patient").value.trim(),
        bg: document.getElementById("bg").value,
        units: document.getElementById("units").value,
        hospital: document.getElementById("hospital").value.trim(),
        district: document.getElementById("district").value.trim(),
        urgency: document.getElementById("urgency").value,
        phone: document.getElementById("phone").value.trim(),
        notes: document.getElementById("notes").value.trim()
      };

      try {
        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRequest)
        });

        if (res.ok) {
          if (successBox) {
            successBox.textContent = "Emergency request posted successfully for patient: " + newRequest.patient;
            successBox.classList.add("show");
          }
          renderRequests();
          requestForm.reset();
        }
      } catch (err) {
        console.error("Error submitting request:", err);
      }
    });
  }

  renderRequests();
=======
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
>>>>>>> 60c49f7d427c0913dc3d21bbd82c176efa90036f
});