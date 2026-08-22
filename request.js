document.addEventListener("DOMContentLoaded", function () {
  const requestForm = document.getElementById("requestForm");
  const successBox = document.getElementById("successBox");
  const requestList = document.getElementById("requestList");

  async function renderRequests() {
    if (!requestList) return;
    try {
      const res = await fetch("http://localhost:3000/api/requests");
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
        const res = await fetch("http://localhost:3000/api/requests", {
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
});