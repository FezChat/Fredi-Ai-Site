// LIVE TIME
const liveTime = document.getElementById("live-time");
setInterval(() => {
  liveTime.textContent = new Date().toLocaleString();
}, 1000);

// THEME SWITCHER
const toggleDark = document.getElementById("toggle-dark");
toggleDark.onclick = () => {
  document.body.classList.toggle("dark");
};

// LANGUAGE SWITCHER
const lang = document.getElementById("lang");
lang.onchange = () => {
  alert(`Language switched to: ${lang.value}`);
};

// SPLASH SCREEN

// CART SYSTEM
const cart = [];
function addToCart(item) {
  cart.push(item);
  updateCartUI();
}

function updateCartUI() {
  const cartContainer = document.getElementById("cart");
  cartContainer.innerHTML = cart.map(c => `<li>${c}</li>`).join("");
}

// AI CHATBOT TOGGLE
const aiHelpBtn = document.getElementById("ai-help");
const aiBox = document.getElementById("ai-box");
aiHelpBtn.onclick = () => aiBox.classList.toggle("show");

// AUTH DUMMY
function loginAdmin() {
  const pass = prompt("Enter admin password:");
  if (pass === "frediAi") alert("Welcome Admin");
  else alert("Invalid password");
}
