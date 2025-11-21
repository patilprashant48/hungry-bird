// app.js
// Pure JS frontend that connects to your existing API

// API base
const API = "/api/contacts";

// UI refs
const navBtns = document.querySelectorAll(".nav-btn");
const viewContacts = document.getElementById("view-contacts");
const viewDashboard = document.getElementById("view-dashboard");
const contactsTbody = document.getElementById("contactsTbody");
const globalSearch = document.getElementById("globalSearch");
const newContactBtn = document.getElementById("newContactBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const cancelContact = document.getElementById("cancelContact");
const saveContact = document.getElementById("saveContact");
const modalTitle = document.getElementById("modalTitle");
const m_name = document.getElementById("m_name");
const m_phone = document.getElementById("m_phone");
const m_email = document.getElementById("m_email");
const m_company = document.getElementById("m_company");
const m_groups = document.getElementById("m_groups");
const totalContactsEl = document.getElementById("totalContacts");
const totalGroupsEl = document.getElementById("totalGroups");
const avgGroupsEl = document.getElementById("avgGroups");
const topGroupEl = document.getElementById("topGroup");
const groupFilter = document.getElementById("groupFilter");
const populateBtn = document.getElementById("populateBtn");
const contactsCount = document.getElementById("contactsCount");

// charts
let barChart = null;
let donutChart = null;

// app state
let contacts = [];
let editingId = null;

// navigation
navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    if (view === "contacts") {
      viewContacts.classList.remove("hidden");
      viewDashboard.classList.add("hidden");
    } else {
      viewContacts.classList.add("hidden");
      viewDashboard.classList.remove("hidden");
      buildDashboard();
    }
  });
});

// load initial
loadContacts();

// search filter
globalSearch.addEventListener("input", () => renderContactsTable());

// New contact
newContactBtn.addEventListener("click", () => {
  editingId = null;
  modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Add Contact';
  m_name.value = "";
  m_phone.value = "";
  m_email.value = "";
  m_company.value = "";
  m_groups.value = "";
  modal.classList.remove("hidden");
});

// close modal
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));

// cancel modal
cancelContact.addEventListener("click", () => modal.classList.add("hidden"));

// save contact
saveContact.addEventListener("click", async () => {
  const payload = {
    name: m_name.value.trim(),
    phone: m_phone.value.trim(),
    email: m_email.value.trim(),
    company: m_company.value.trim()
  };
  
  // groups string -> array
  const groups = m_groups.value.split(",").map(s => s.trim()).filter(Boolean);
  payload.groups = groups;

  try {
    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    modal.classList.add("hidden");
    await loadContacts();
  } catch (e) {
    alert("Error saving contact");
    console.error(e);
  }
});

// auto-populate dummy data
populateBtn.addEventListener("click", async () => {
  const sample = [
    { name: "Alice Johnson", phone: "555-123-4567", email: "alice.j@innovate.com", company: "InnovateTech Solutions", groups: ["Work", "VIP"] },
    { name: "Bob Williams", phone: "555-987-6543", email: "bob.w@pixel.com", company: "Pixel Perfect Designs", groups: ["Work", "Contractors"] },
    { name: "Carol Davis", phone: "555-111-2222", email: "carol.d@greenleaf.com", company: "Green Leaf Marketing", groups: ["Family", "Friends"] },
    { name: "David Miller", phone: "555-333-4444", email: "david.m@innovate.com", company: "InnovateTech Solutions", groups: ["Work"] },
    { name: "Eve Brown", phone: "555-777-8888", email: "eve.b@example.com", company: "Self-Employed Advisor", groups: ["Family", "Friends", "VIP"] }
  ];
  
  for (const c of sample) {
    await fetch(API, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(c) 
    });
  }
  
  await loadContacts();
  alert("Sample contacts added successfully!");
});

// fetch contacts from API
async function loadContacts() {
  try {
    const res = await fetch(API);
    contacts = await res.json();
    renderContactsTable();
    populateGroupFilter();
    
    // if dashboard visible, refresh charts
    if (!viewDashboard.classList.contains("hidden")) buildDashboard();
  } catch (err) {
    console.error("Failed to load contacts", err);
  }
}

// render contacts into table
function renderContactsTable() {
  const q = globalSearch.value.trim().toLowerCase();
  const filterGroup = groupFilter.value;
  const rows = [];

  contacts.forEach(contact => {
    // normalize groups into array
    let groups = contact.groups || [];
    if (typeof groups === "string") groups = groups.split(",").map(s => s.trim()).filter(Boolean);

    // filter logic
    if (filterGroup && !groups.includes(filterGroup)) return;
    if (q && !(contact.name.toLowerCase().includes(q) || 
               (contact.phone || "").includes(q) || 
               (contact.email || "").toLowerCase().includes(q) ||
               (contact.company || "").toLowerCase().includes(q))) {
      return;
    }

    rows.push(contactToRow(contact, groups));
  });

  // Update contacts count
  const visibleCount = rows.length;
  const totalCount = contacts.length;
  contactsCount.textContent = `${visibleCount} of ${totalCount} contacts`;
  
  contactsTbody.innerHTML = rows.join("") || `
    <tr>
      <td colspan="5">
        <div class="empty-state">
          <i class="fas fa-users"></i>
          <h3>No contacts found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </td>
    </tr>
  `;
}

function contactToRow(contact, groups) {
  const avatarText = initials(contact.name);
  const groupsHtml = (groups || []).map(g => `
    <span class="tag">
      <i class="fas fa-tag"></i>${escapeHtml(g)}
    </span>
  `).join(" ");
  
  return `
    <tr>
      <td>
        <div class="contact-name">
          <div class="avatar">${escapeHtml(avatarText)}</div>
          <div class="contact-details">
            <div class="name">${escapeHtml(contact.name)}</div>
            <div class="company">${escapeHtml(contact.company || 'No company')}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="contact-info">
          <div class="contact-email">
            <i class="fas fa-envelope"></i>${escapeHtml(contact.email || 'No email')}
          </div>
          <div class="contact-phone">
            <i class="fas fa-phone"></i>${escapeHtml(contact.phone || 'No phone')}
          </div>
        </div>
      </td>
      <td>${groupsHtml}</td>
      <td>${escapeHtml(contact.company || '—')}</td>
      <td>
        <button class="action-btn edit" onclick="onEdit(${contact.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="action-btn delete" onclick="onDelete(${contact.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `;
}

// edit
window.onEdit = async function(id) {
  const c = contacts.find(x => x.id === id);
  if (!c) return alert("Contact not found");
  
  editingId = id;
  modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Contact';
  m_name.value = c.name || "";
  m_phone.value = c.phone || "";
  m_email.value = c.email || "";
  m_company.value = c.company || "";
  m_groups.value = Array.isArray(c.groups) ? c.groups.join(", ") : (c.groups || "");
  modal.classList.remove("hidden");
}

// delete
window.onDelete = async function(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return;
  
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    await loadContacts();
  } catch (e) {
    alert("Error deleting contact");
    console.error(e);
  }
}

// helpers
function initials(name = "") {
  return name.split(" ").map(p => p[0] || "").slice(0, 2).join("").toUpperCase();
}

function escapeHtml(s = "") {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// GROUP FILTER population
function populateGroupFilter() {
  const groupSet = new Set();
  contacts.forEach(c => {
    let gs = c.groups || [];
    if (typeof gs === "string") gs = gs.split(",").map(x => x.trim()).filter(Boolean);
    gs.forEach(g => groupSet.add(g));
  });
  
  groupFilter.innerHTML = `<option value="">All Groups</option>` + 
    Array.from(groupSet).map(g => `<option value="${g}">${g}</option>`).join("");
  
  totalGroupsEl.innerText = groupSet.size || 0;
}

// DASHBOARD: build metrics + charts
function buildDashboard() {
  // compute metrics
  const total = contacts.length;
  totalContactsEl.innerText = total;

  // groups frequency map
  const freq = {};
  const companyFreq = {};
  let totalGroups = 0;

  contacts.forEach(c => {
    let gs = c.groups || [];
    if (typeof gs === "string") gs = gs.split(",").map(x => x.trim()).filter(Boolean);
    totalGroups += gs.length;
    gs.forEach(g => freq[g] = (freq[g] || 0) + 1);

    if (c.company) {
      companyFreq[c.company] = (companyFreq[c.company] || 0) + 1;
    }
  });

  avgGroupsEl.innerText = total ? (totalGroups / total).toFixed(1) : "0.0";

  // top group
  const topGroup = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0] || "—";
  topGroupEl.innerText = topGroup;

  // bar chart (contacts per group)
  const groups = Object.keys(freq);
  const counts = groups.map(g => freq[g]);

  // update bar chart
  const barCtx = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();
  
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: groups,
      datasets: [{
        label: 'Contacts',
        data: counts,
        backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#6366f1'],
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        y: { grid: { display: false } }
      }
    }
  });

  // donut chart top companies
  const companies = Object.keys(companyFreq);
  const compCounts = companies.map(c => companyFreq[c]);
  const donutCtx = document.getElementById('donutChart').getContext('2d');
  
  if (donutChart) donutChart.destroy();
  
  donutChart = new Chart(donutCtx, {
    type: 'doughnut',
    data: {
      labels: companies,
      datasets: [{
        data: compCounts,
        backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: { position: 'right' }
      },
      cutout: '60%'
    }
  });
}

// group filter change
groupFilter.addEventListener("change", () => renderContactsTable());