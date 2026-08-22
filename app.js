document.addEventListener("DOMContentLoaded", async function () {
  const fBg = document.getElementById("fBg");
  const fDistrict = document.getElementById("fDistrict");
  const fAvailable = document.getElementById("fAvailable");
  const donorGrid = document.getElementById("donorGrid");

  let allDonors = [];

  async function fetchDonors() {
    try {
      const res = await fetch("http://localhost:3000/api/donors");
      const data = await res.json();
      allDonors = data.filter(d => d.status === "approved");
      renderDonors(allDonors);
    } catch (err) {
      console.error("Failed to load donors", err);
    }
  }

  function renderDonors(donors) {
    if (donors.length === 0) {
      donorGrid.innerHTML = `<div class="empty" style="grid-column:1/-1;">No donors found matching your search.</div>`;
      return;
    }

    donorGrid.innerHTML = donors.map(d => `
      <div class="donor-card">
        <div class="donor-top">
          <div class="donor-bg">${d.bg}</div>
          <span class="avail-tag ${d.available ? 'avail-yes' : 'avail-no'}">${d.available ? 'Available' : 'Unavailable'}</span>
        </div>
        <div>
          <div class="name">${d.name}</div>
          <div class="loc">${d.district}</div>
        </div>
        <div class="donor-actions">
          <a href="tel:${d.phone}" class="btn btn-primary btn-sm btn-block">Call</a>
        </div>
      </div>
    `).join("");
  }

  function applyFilters() {
    const bgFilter = fBg.value;
    const districtFilter = fDistrict.value.toLowerCase().trim();
    const availableFilter = fAvailable.checked;

    const filtered = allDonors.filter(d => {
      const matchBg = bgFilter === "" || d.bg === bgFilter;
      const matchDist = districtFilter === "" || d.district.toLowerCase().includes(districtFilter);
      const matchAvail = !availableFilter || d.available;
      return matchBg && matchDist && matchAvail;
    });
    
    renderDonors(filtered);
  }

  if(fBg) fBg.addEventListener("change", applyFilters);
  if(fDistrict) fDistrict.addEventListener("input", applyFilters);
  if(fAvailable) fAvailable.addEventListener("change", applyFilters);

  fetchDonors();
});