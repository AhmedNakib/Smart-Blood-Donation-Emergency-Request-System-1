document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginWrap = document.getElementById("loginWrap");
  const dashboard = document.getElementById("dashboard");
  const loginError = document.getElementById("loginError");
  const adminEmailLabel = document.getElementById("adminEmailLabel");
  const logoutBtn = document.getElementById("logoutBtn");
  const tableWrap = document.getElementById("tableWrap");
  
  const tabBtns = document.querySelectorAll(".tab-btn");
  const chipBtns = document.querySelectorAll(".chip");

  let currentTab = "donors";
  let currentFilter = "all";
  let dataset = [];

  if (localStorage.getItem("adminEmail")) {
    showDashboard(localStorage.getItem("adminEmail"));
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:3000/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          localStorage.setItem("adminEmail", data.email);
          showDashboard(data.email);
        } else {
          loginError.textContent = data.message;
        }
      } catch (err) {
        loginError.textContent = "Server connection error.";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("adminEmail");
      loginWrap.style.display = "block";
      dashboard.style.display = "none";
    });
  }

  function showDashboard(email) {
    loginWrap.style.display = "none";
    dashboard.style.display = "block";
    adminEmailLabel.textContent = email;
    loadData();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      tabBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentTab = e.target.dataset.tab;
      loadData();
    });
  });

  chipBtns.forEach(chip => {
    chip.addEventListener("click", (e) => {
      chipBtns.forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      renderTable();
    });
  });

  async function loadData() {
    tableWrap.innerHTML = `<div class="admin-empty">Loading…</div>`;
    const endpoint = currentTab === "donors" ? "http://localhost:3000/api/donors" : "http://localhost:3000/api/requests";
    try {
      const res = await fetch(endpoint);
      dataset = await res.json();
      renderTable();
    } catch (err) {
      tableWrap.innerHTML = `<div class="admin-empty" style="color:var(--crimson);">Failed to load data.</div>`;
    }
  }

  function renderTable() {
    let filtered = dataset;
    if (currentFilter !== "all") {
      filtered = dataset.filter(item => item.status === currentFilter);
    }

    if (filtered.length === 0) {
      tableWrap.innerHTML = `<div class="admin-empty">No ${currentTab} found for this filter.</div>`;
      return;
    }

    let html = `<table><thead><tr>`;
    if (currentTab === "donors") {
      html += `<th>Name</th><th>Blood Group</th><th>District</th><th>Status</th><th>Actions</th>`;
    } else {
      html += `<th>Patient</th><th>Blood Group</th><th>Urgency</th><th>Status</th><th>Actions</th>`;
    }
    html += `</tr></thead><tbody>`;

    filtered.forEach(item => {
      html += `<tr>`;
      if (currentTab === "donors") {
        html += `
          <td><strong>${item.name}</strong><br><small>${item.phone}</small></td>
          <td>${item.bg}</td>
          <td>${item.district}</td>
        `;
      } else {
        html += `
          <td><strong>${item.patient}</strong><br><small>${item.hospital}</small></td>
          <td>${item.bg}</td>
          <td><span class="badge badge-${item.urgency}">${item.urgency}</span></td>
        `;
      }
      
      html += `<td><span class="status-pill status-${item.status}">${item.status}</span></td>
               <td>
                 <div class="row-actions">
                   ${item.status !== 'approved' ? `<button class="icon-btn approve" onclick="updateStatus('${item.id}', 'approved')">Approve</button>` : ''}
                   ${item.status !== 'rejected' ? `<button class="icon-btn reject" onclick="updateStatus('${item.id}', 'rejected')">Reject</button>` : ''}
                   <button class="icon-btn delete" onclick="deleteItem('${item.id}')">Delete</button>
                 </div>
               </td></tr>`;
    });
    
    html += `</tbody></table>`;
    tableWrap.innerHTML = html;
  }

  window.updateStatus = async function(id, status) {
    await fetch("http://localhost:3000/api/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: currentTab, id, status })
    });
    loadData();
  };

  window.deleteItem = async function(id) {
    if(confirm("Are you sure you want to delete this?")) {
      await fetch("http://localhost:3000/api/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: currentTab, id })
      });
      loadData();
    }
  };
});