const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DONORS_FILE = path.join(__dirname, "donors.json");
const REQUESTS_FILE = path.join(__dirname, "requests.json");
const ADMIN_FILE = path.join(__dirname, "admin.json");

// হেল্পার ফাংশন: JSON ফাইল পড়া
function readData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf-8");
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error("Error reading " + filePath, err);
    return [];
  }
}

// হেল্পার ফাংশন: JSON ফাইলে লেখা
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing " + filePath, err);
  }
}

// ---------- API Routes ---------- //

// ১. ডোনারদের তালিকা পাওয়া
app.get("/api/donors", (req, res) => {
  const donors = readData(DONORS_FILE);
  res.json(donors);
});

// ২. নতুন ডোনার যুক্ত করা
app.post("/api/donors", (req, res) => {
  const donors = readData(DONORS_FILE);
  const newDonor = {
    id: "donor_" + Date.now(),
    name: req.body.name,
    bg: req.body.bg,
    phone: req.body.phone,
    district: req.body.district,
    available: req.body.available !== undefined ? req.body.available : true,
    status: req.body.status || "approved",
    createdAt: new Date().toLocaleString()
  };
  donors.unshift(newDonor);
  writeData(DONORS_FILE, donors);
  res.status(201).json({ success: true, donor: newDonor });
});

// ৩. জরুরি রিকোয়েস্টের তালিকা পাওয়া
app.get("/api/requests", (req, res) => {
  const requests = readData(REQUESTS_FILE);
  res.json(requests);
});

// ৪. নতুন জরুরি রিকোয়েস্ট তৈরি করা
app.post("/api/requests", (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const newRequest = {
    id: "req_" + Date.now(),
    patient: req.body.patient,
    bg: req.body.bg,
    units: req.body.units,
    hospital: req.body.hospital,
    district: req.body.district,
    urgency: req.body.urgency,
    phone: req.body.phone,
    notes: req.body.notes || "",
    status: "approved",
    postedAt: new Date().toLocaleString()
  };
  requests.unshift(newRequest);
  writeData(REQUESTS_FILE, requests);
  res.status(201).json({ success: true, request: newRequest });
});

// ৫. এডমিন লগইন ভেরিফিকেশন
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  try {
    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8"));
    if (adminData.admin.email === email && adminData.admin.password === password) {
      return res.json({ success: true, email });
    }
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Admin config missing" });
  }
});

// ৬. স্ট্যাটাস আপডেট (Approve / Reject)
app.patch("/api/status", (req, res) => {
  const { type, id, status } = req.body;
  const filePath = type === "donors" ? DONORS_FILE : REQUESTS_FILE;
  let items = readData(filePath);
  
  items = items.map(item => {
    if (item.id === id) {
      return { ...item, status };
    }
    return item;
  });

  writeData(filePath, items);
  res.json({ success: true });
});

// ৭. ডাটা ডিলিট করা
app.delete("/api/item", (req, res) => {
  const { type, id } = req.body;
  const filePath = type === "donors" ? DONORS_FILE : REQUESTS_FILE;
  let items = readData(filePath);
  items = items.filter(item => item.id !== id);
  writeData(filePath, items);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});