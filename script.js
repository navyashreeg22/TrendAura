
   //ACCESSORY STORE - script.js


/* State */
let cart = JSON.parse(localStorage.getItem("cart_temp")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

updateWishlistCount();
updateCartCount();

/* 
   QUICK VIEW (Product Modal)
*/
function openQuickView(name, imgSrc, price, desc) {
    document.getElementById("qName").innerText = name;
    document.getElementById("qImg").src = imgSrc;
    document.getElementById("qPrice").innerText = price;
    document.getElementById("qDesc").innerText = desc;

    document.getElementById("qCartBtn").dataset.name = name;
    document.getElementById("qCartBtn").dataset.price = price;
    document.getElementById("qCartBtn").dataset.img = imgSrc;

    document.getElementById("quickView").classList.remove("hidden");
}

function closeQuickView() {
    document.getElementById("quickView").classList.add("hidden");
}

/* 
   CART (Core logic)
    */
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCount();
}

function updateCartCount() {
    const el = document.getElementById("cart-count");
    if (el) el.innerText = cart.length;
}

document.getElementById("cart-btn").onclick = showCart;

function showCart() {
    document.getElementById("cart-popup").classList.remove("hidden");

    let html = "";
    let total = 0;

    if (cart.length === 0) {
        html = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <span>${item.name} - ₹${item.price}</span>
                    <button class="remove-btn" onclick="removeItemFromCart(${index})">Remove</button>
                </div>
            `;
            total += parseInt(item.price);
        });
    }

    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("total").innerText = total;
}

function closeCart() {
    document.getElementById("cart-popup").classList.add("hidden");
}

function removeItemFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    showCart();
}

function goToCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("cart_temp");
    window.location.href = "checkout.html";
}

/* 
   WISHLIST (localStorage)
   */
function toggleWishlist(iconEl, name, price) {
    iconEl.classList.toggle("active");

    if (iconEl.classList.contains("active")) {
        if (!wishlist.some(i => i.name === name)) wishlist.push({ name, price });
    } else {
        wishlist = wishlist.filter(i => i.name !== name);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const el = document.getElementById("wishlist-count");
    if (el) el.innerText = wishlist.length;
}

/* ⭐ UPDATED WISHLIST POPUP WITH MOVE + REMOVE BUTTONS */
document.getElementById("wishlist-btn").onclick = () => {
    document.getElementById("wishlist-popup").classList.remove("hidden");

    let html = "";

    if (wishlist.length === 0) {
        html = "<p>Your wishlist is empty.</p>";
    } else {
        wishlist.forEach((item, index) => {
            html += `
                <div class="wishlist-item">
                    <span>❤️ ${item.name} - ₹${item.price}</span>

                    <div class="wish-actions">
                        <button class="move-btn" onclick="moveWishlistToCart(${index})">Move to Cart</button>
                        <button class="remove-wish-btn" onclick="removeFromWishlist(${index})">Remove</button>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById("wishlist-items").innerHTML = html;
};

function closeWishlist() {
    document.getElementById("wishlist-popup").classList.add("hidden");
}

/* ⭐ REMOVE FROM WISHLIST */
function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    updateWishlistCount();
    markWishlistHearts();

    document.getElementById("wishlist-btn").click();
}

/* ⭐ MOVE TO CART */
function moveWishlistToCart(index) {
    const item = wishlist[index];

    cart.push(item);
    updateCartCount();

    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    updateWishlistCount();
    markWishlistHearts();

    document.getElementById("wishlist-btn").click();
}

/* Update heart icons on load */
window.addEventListener("load", () => {
    markWishlistHearts();
    applyLoginState();
});

function markWishlistHearts() {
    const hearts = document.querySelectorAll(".wishlist-icon");

    hearts.forEach(icon => {
        const parent = icon.closest(".product");
        const name = parent.querySelector("h3").innerText;

        if (wishlist.some(i => i.name === name)) {
            icon.classList.add("active");
        } else {
            icon.classList.remove("active");
        }
    });
}

/* 
   SEARCH / FILTER / SORT
    */
function updateFilters() {
    const search = document.getElementById("searchBar").value.toLowerCase();
    const cat = document.getElementById("categoryFilter").value;

    const products = document.querySelectorAll(".product");

    products.forEach(p => {
        const name = p.querySelector("h3").innerText.toLowerCase();
        const c = p.dataset.category;

        const matchSearch = name.includes(search);
        const matchCat = (cat === "all" || cat === c);

        p.style.display = matchSearch && matchCat ? "block" : "none";
    });
}

function sortProducts() {
    const type = document.getElementById("sortFilter").value;
    const grid = document.getElementById("productGrid");

    const items = Array.from(grid.children);

    items.sort((a, b) => {
        const pa = parseInt(a.dataset.price);
        const pb = parseInt(b.dataset.price);

        if (type === "low-high") return pa - pb;
        if (type === "high-low") return pb - pa;
        return 0;
    });

    items.forEach(el => grid.appendChild(el));
}

/* 
   LOGIN SYSTEM
    */
function applyLoginState() {
    const loggedUser = localStorage.getItem("loggedIn");

    if (loggedUser) {
        document.getElementById("welcomeUser").innerText = "Hello, " + loggedUser;
        document.getElementById("loginLink").style.display = "none";
    }
}

/* 
   ADD-TO-CART FLY ANIMATION
   */
function animateToCart(imgElement) {
    const cartIcon = document.getElementById("cart-btn");

    const flyingImg = imgElement.cloneNode(true);
    flyingImg.classList.add("flying-img");
    document.body.appendChild(flyingImg);

    const rect = imgElement.getBoundingClientRect();
    flyingImg.style.left = rect.left + "px";
    flyingImg.style.top = rect.top + "px";

    requestAnimationFrame(() => {
        const target = cartIcon.getBoundingClientRect();
        flyingImg.style.left = target.left + "px";
        flyingImg.style.top = target.top + "px";
        flyingImg.style.transform = "scale(0.3)";
        flyingImg.style.opacity = "0.3";
    });

    setTimeout(() => flyingImg.remove(), 800);
}

function addToCartWithAnimation() {
    const btn = document.getElementById("qCartBtn");

    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    const img = document.getElementById("qImg");
    animateToCart(img);

    addToCart(name, price);
}

/* ⭐ NEW — ADD TO CART FROM PRODUCT CARD */
function addToCartFromCard(name, price, imgSrc) {
    event.stopPropagation();

    const productImage = document.querySelector(`img[src="${imgSrc}"]`);
    if (productImage) animateToCart(productImage);

    addToCart(name, price);
}
window.addToCartFromCard = addToCartFromCard;

/* Expose to HTML */
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.toggleWishlist = toggleWishlist;
window.closeCart = closeCart;
window.closeWishlist = closeWishlist;
window.removeItemFromCart = removeItemFromCart;
window.removeFromWishlist = removeFromWishlist;
window.moveWishlistToCart = moveWishlistToCart;
window.addToCartWithAnimation = addToCartWithAnimation;
window.sortProducts = sortProducts;
window.updateFilters = updateFilters;
window.goToCheckout = goToCheckout;
// LOGIN STATE
function applyLoginState() {
    const user = localStorage.getItem("loggedIn");

    if (user) {
        document.getElementById("welcomeUser").innerText = "Hello, " + user;
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
    }
}

function logoutUser() {
    localStorage.removeItem("loggedIn");
    alert("Logged out successfully!");
    location.reload();
}

window.addEventListener("load", applyLoginState);
/* FEEDBACK SYSTEM */
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

/* OPEN FEEDBACK FORM */
function openFeedback() {
    document.getElementById("feedback-popup").classList.remove("hidden");
}

/* CLOSE FEEDBACK FORM */
function closeFeedback() {
    document.getElementById("feedback-popup").classList.add("hidden");
}

// GLOBAL rating value
let selectedRating = 0;

// STAR CLICK
function setRating(rating) {
    selectedRating = rating;
    document.querySelectorAll(".star-rating span").forEach((star, i) => {
        star.classList.toggle("active", i < rating);
    });
}

// SUBMIT FEEDBACK
function submitFeedback() {
    const name = document.getElementById("fbName").value.trim();
    const email = document.getElementById("fbEmail").value.trim();
    const product = document.getElementById("fbProduct").value.trim();
    const message = document.getElementById("fbMessage").value.trim();

    if (!name || !email || !message || selectedRating === 0) {
        alert("Please fill all fields and select rating ⭐");
        return;
    }

    // Load existing feedbacks
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    // Push new feedback
    feedbacks.push({
        name,
        email,
        product,
        rating: selectedRating,
        message,
        date: new Date().toLocaleString()
    });

    // Save to localStorage
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    alert("Thank you for your feedback ❤️");

    // CLEAR FORM
    document.getElementById("fbName").value = "";
    document.getElementById("fbEmail").value = "";
    document.getElementById("fbProduct").value = "";
    document.getElementById("fbMessage").value = "";

    selectedRating = 0;
    document.querySelectorAll(".star-rating span").forEach(star =>
        star.classList.remove("active")
    );
}

function openMenu() {
    document.getElementById("sideMenu").classList.add("show");
    document.getElementById("menuOverlay").classList.add("show");
}

function closeMenu() {
    document.getElementById("sideMenu").classList.remove("show");
    document.getElementById("menuOverlay").classList.remove("show");
}

