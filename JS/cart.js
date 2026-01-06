// cart.js
const CART_KEY = "flora_cart";

/* ======================
   工具：修正圖片路徑（顯示層用）
   將 ../../images/xxx.png → ../images/xxx.png
   不動原始商品資料
====================== */
function fixImagePath(path) {
  if (!path) return "";
  return path.replace("../../images/", "../images/");
}

// 讀取購物車
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// 儲存購物車
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// 商品頁會呼叫 addToCart(cartItem)
function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(x => x.id === item.id);

  if (idx >= 0) {
    cart[idx].quantity += (item.quantity || 1);
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      image: item.image || "",
      spec: item.spec || "",
      quantity: item.quantity || 1,
      selected: true
    });
  }
  saveCart(cart);
}

// ===== cart.html 顯示商品 =====
function renderCart() {
  const container = document.getElementById("dynamic-cart-items");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p style="padding:20px; color:#666;">購物車目前是空的</p>`;
    updateSummary();
    syncSelectAllCheckbox();
    return;
  }

  cart.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.style.cssText =
      "display:flex; gap:12px; align-items:center; padding:12px; border-bottom:1px solid #eee;";

    row.innerHTML = `
      <input type="checkbox" class="item-checkbox"
        ${item.selected ? "checked" : ""}
        onchange="toggleItem(${i}, this.checked)">

      <div style="width:72px; height:72px; background:#f3f3f3; border-radius:10px;
                  display:flex; align-items:center; justify-content:center; overflow:hidden;">
        ${item.image
          ? `<img src="${fixImagePath(item.image)}"
                 alt="${item.name}"
                 style="width:100%; height:100%; object-fit:cover;">`
          : "🪴"}
      </div>

      <div style="flex:1;">
        <div style="font-weight:600;">${item.name}</div>
        <div style="font-size:12px; color:#777;">${item.spec || ""}</div>
      </div>

      <div style="width:110px;">NT$ ${item.price}</div>

      <div style="display:flex; align-items:center; gap:6px;">
        <button onclick="changeQty(${i}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${i}, 1)">+</button>
      </div>

      <div style="width:130px; text-align:right;">
        NT$ ${item.price * item.quantity}
      </div>

      <button onclick="removeItem(${i})"
        style="border:none; background:transparent; font-size:18px; cursor:pointer;">
        ×
      </button>
    `;

    container.appendChild(row);
  });

  syncSelectAllCheckbox();
  updateSummary();
}

function toggleItem(i, checked) {
  const cart = getCart();
  cart[i].selected = checked;
  saveCart(cart);
  syncSelectAllCheckbox();
  updateSummary();
}

function changeQty(i, delta) {
  const cart = getCart();
  cart[i].quantity = Math.max(1, cart[i].quantity + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

// 全選
function toggleSelectAll() {
  const cart = getCart();
  const checked = document.getElementById("select-all")?.checked ?? false;
  cart.forEach(x => x.selected = checked);
  saveCart(cart);
  renderCart();
}

function syncSelectAllCheckbox() {
  const cart = getCart();
  const el = document.getElementById("select-all");
  if (!el) return;
  el.checked = cart.length > 0 && cart.every(x => x.selected);
}

// 刪除所選
function deleteSelected() {
  const cart = getCart().filter(x => !x.selected);
  saveCart(cart);
  renderCart();
}

// 訂單摘要
function updateSummary() {
  const cart = getCart();
  const selected = cart.filter(x => x.selected);
  const subtotal = selected.reduce((s, x) => s + x.price * x.quantity, 0);
  const shipping = (subtotal >= 1500 || subtotal === 0) ? 0 : 120;
  const discount = 0;
  const total = Math.max(0, subtotal + shipping - discount);

  document.getElementById("subtotal").textContent = `NT$ ${subtotal}`;
  document.getElementById("shipping").textContent = `NT$ ${shipping}`;
  document.getElementById("discount").textContent = `- NT$ ${discount}`;
  document.getElementById("total").textContent = `NT$ ${total}`;
}

// 頁面載入時渲染
document.addEventListener("DOMContentLoaded", renderCart);
