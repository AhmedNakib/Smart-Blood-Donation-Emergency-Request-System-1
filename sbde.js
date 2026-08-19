document.addEventListener("DOMContentLoaded", function () {
  const statDonors = document.getElementById("statDonors");
  const statAvailable = document.getElementById("statAvailable");
  const statRequests = document.getElementById("statRequests");

  if (statDonors) {
    statDonors.textContent = "120";
  }

  if (statAvailable) {
    statAvailable.textContent = "85";
  }

  if (statRequests) {
    statRequests.textContent = "12";
  }
});