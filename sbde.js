document.addEventListener("DOMContentLoaded", async function () {
const statDonors = document.getElementById("statDonors");
const statAvailable = document.getElementById("statAvailable");
const statRequests = document.getElementById("statRequests");
const bgGrid = document.getElementById("bgGrid");
const emgList = document.getElementById("emgList");

let donors = [];
let requests = [];

try {
const [donorsRes, requestsRes] = await Promise.all([
fetch("/api/donors"),
fetch("/api/requests")
]);
donors = await donorsRes.json();
requests = await requestsRes.json();
} catch (error) {
console.error("Error loading JSON data from server:", error);
}

const approvedDonors = donors.filter(d => d.status === "approved");
const availableDonors = approvedDonors.filter(d => d.available);
const activeRequests = requests.filter(r => r.status === "approved");

if (statDonors) statDonors.textContent = approvedDonors.length;
if (statAvailable) statAvailable.textContent = availableDonors.length;
if (statRequests) statRequests.textContent = activeRequests.length;

if (bgGrid) {
const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
bgGrid.innerHTML = groups.map(grp => {
const count = availableDonors.filter(d => d.bg === grp).length;
return `         <div class="bg-card">           <div class="grp">${grp}</div>           <div class="cnt">${count} available</div>         </div>
      `;
}).join("");
}

if (emgList) {
if (activeRequests.length === 0) {
emgList.innerHTML = `<div class="empty">No emergency requests active at this moment.</div>`;
} else {
emgList.innerHTML = activeRequests.slice(0, 5).map(req => `         <div class="emg-card">           <div>             <div class="who">${req.patient} (${req.bg} - ${req.units} Unit${req.units > 1 ? 's' : ''})</div>             <div class="meta">${req.hospital}, ${req.district} | Phone: <a href="tel:${req.phone}" style="color:var(--crimson); text-decoration:none; font-weight:600;">${req.phone}</a></div>           </div>           <span class="badge badge-${req.urgency}">${req.urgency}</span>         </div>
      `).join("");
}
}
});
