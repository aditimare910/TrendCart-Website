const PRODUCTS = [
    { id: 1, name: "Running Shoes", price: 2499, img: "Images/shoes.jpg", desc: "Comfortable and stylish running shoes for daily use and sports." },
    { id: 2, name: "Smart Watch", price: 3999, img: "Images/watch.jpg", desc: "Track your steps, heart rate and notifications on your wrist." },
    { id: 3, name: "Wireless Headphones", price: 1899, img: "Images/headphoness.jpg", desc: "Clear sound and long battery life without the wires." },
    { id: 4, name: "Backpack", price: 1299, img: "Images/bag.jpg", desc: "Spacious, durable backpack for school, work and travel." },
    { id: 5, name: "Smart Phone", price: 18999, img: "Images/phones.jpg", desc: "Fast, reliable smartphone with a bright display." }];

const $ = s => document.querySelector(s);
const inr = n => "₹" + n.toLocaleString("en-IN");
const getCart = () => { try { return JSON.parse(localStorage.getItem("cart")) || [] } catch { return [] } };
const saveCart = c => { localStorage.setItem("cart", JSON.stringify(c)); updateBadge() };
function addToCart(id, qty = 1) { qty = Math.max(1, parseInt(qty) || 1); const c = getCart(), i = c.find(x => x.id === id); i ? i.qty += qty : c.push({ id, qty }); saveCart(c); alert("Added to cart!") }

function updateBadge() { const b = $("#cartCount"); if (b) { const n = getCart().reduce((s, x) => s + x.qty, 0); b.textContent = n; b.hidden = !n } }


// shared header + footer
const page = location.pathname.split("/").pop() || "trendcart.html";
const LINKS = [["trendcart.html", "Home"], ["shop.html", "Shop"], ["about.html", "About"], ["contact.html", "Contact"], ["login.html", "Login"], ["signup.html", "Sign Up"], ["cart.html", "Cart"]];
$("#site-header").outerHTML = `<header><a class="logo" href="trendcart.html">🛒 TrendCart</a>
<button class="menu-btn" aria-label="Menu" aria-expanded="false">☰</button>
<ul class="nav-links">${LINKS.map(([h, t]) => `<li><a href="${h}"${h === page ? ' class="active"' : ""}>${t}${h === "cart.html" ? '<span class="badge" id="cartCount" hidden></span>' : ""}</a></li>`).join("")}</ul></header>`;
$("#site-footer").outerHTML = `<footer><div class="footer-container">
<div><h3>TrendCart</h3><p>Your one-stop shop for fashion, electronics and accessories.</p></div>
<div><h3>Quick Links</h3><a href="trendcart.html">Home</a><a href="shop.html">Shop</a><a href="about.html">About</a><a href="contact.html">Contact</a></div>
<div><h3>Customer Care</h3><a href="contact.html">Help</a><a href="cart.html">Your Cart</a><a href="login.html">Login</a></div>
<div><h3>Follow Us</h3><a href="#">Facebook</a><a href="#">Instagram</a><a href="#">Twitter</a></div></div>
<p class="copyright">© 2026 TrendCart. All rights reserved.</p></footer>`;
const mb = $(".menu-btn"), nl = $(".nav-links");
mb.onclick = () => { const o = nl.classList.toggle("open"); mb.setAttribute("aria-expanded", o) };
updateBadge();


// products grid (home + shop) with search
const grid = $("#productGrid");
if (grid) {
    const lim = +grid.dataset.limit || 99;
    const draw = q => {
        const l = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, lim);
        grid.innerHTML = l.length ? l.map(p => `<div class="product-card"><a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}"><h3>${p.name}</h3></a><p>${inr(p.price)}</p><button onclick="addToCart(${p.id})">Add to Cart</button></div>`).join("") : '<p class="empty">No products found.</p>'
    };
    draw(""); const s = $("#searchInput"); if (s) s.oninput = () => draw(s.value.trim().toLowerCase())
}


// product page
const pv = $("#productView");
if (pv) {
    const p = PRODUCTS.find(x => x.id == new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
    pv.innerHTML = `<img src="${p.img}" alt="${p.name}"><div class="info"><h1>${p.name}</h1><h2>${inr(p.price)}</h2><p>${p.desc}</p><div class="stars">★★★★★</div>
<label for="qty">Quantity:</label><input id="qty" type="number" value="1" min="1"><br>
<button class="btn" id="add">Add to Cart</button><button class="buy-btn" id="buy">Buy Now</button></div>`;
    document.title = "TrendCart | " + p.name;
    $("#add").onclick = () => addToCart(p.id, $("#qty").value);
    $("#buy").onclick = () => { const c = getCart(), q = Math.max(1, parseInt($("#qty").value) || 1), i = c.find(x => x.id === p.id); i ? i.qty += q : c.push({ id: p.id, qty: q }); saveCart(c); location.href = "cart.html" }
}


// cart page
const ci = $("#cartItems");
function drawCart() {
    const c = getCart(); let t = 0;
    ci.innerHTML = c.map(x => {
        const p = PRODUCTS.find(y => y.id === x.id); if (!p) return ""; t += p.price * x.qty;
        return `<tr><td>${p.name}</td><td>${inr(p.price)}</td><td><input type="number" min="1" value="${x.qty}" onchange="setQty(${x.id},this.value)" aria-label="Quantity"></td><td>${inr(p.price * x.qty)}</td><td><button class="rm" onclick="removeItem(${x.id})">Remove</button></td></tr>`
    }).join("");
    $("#totalPrice").textContent = "Total: " + inr(t); $("#emptyCart").hidden = c.length > 0
}
function setQty(id, v) { const c = getCart(), i = c.find(x => x.id === id); i.qty = Math.max(1, parseInt(v) || 1); saveCart(c); drawCart() }
function removeItem(id) { saveCart(getCart().filter(x => x.id !== id)); drawCart() }
if (ci) { drawCart(); $("#checkout").onclick = () => { if (!getCart().length) return alert("Your cart is empty."); alert("Thank you! Your order is placed (demo)."); saveCart([]); drawCart() } }


// demo forms
document.querySelectorAll("form[data-msg]").forEach(f => f.onsubmit = e => {
    e.preventDefault();
    const pw = f.querySelectorAll("input[type=password]");
    if (pw.length === 2 && pw[0].value !== pw[1].value) return alert("Passwords do not match.");
    if (pw.length === 2 && pw[0].value.length < 6) return alert("Password must be at least 6 characters.");
    alert(f.dataset.msg); f.reset()
});


// back to top
const tb = document.createElement("button"); tb.id = "topBtn"; tb.textContent = "↑"; tb.setAttribute("aria-label", "Back to top");
tb.onclick = () => scrollTo({ top: 0, behavior: "smooth" }); document.body.append(tb);
addEventListener("scroll", () => tb.style.display = scrollY > 200 ? "block" : "none");
