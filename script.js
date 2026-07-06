let products = [];
let cart = [];

const productsContainer = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch("/products");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        console.error(error);
    }
}

// Display Products
function displayProducts(productList) {

    productsContainer.innerHTML = "";

    productList.forEach(product => {

        productsContainer.innerHTML += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>

            <button onclick="addToCart('${product._id}')">
                Add To Cart
            </button>
        </div>
        `;

    });

}

// Add To Cart
function addToCart(id) {

    const product = products.find(p => p._id === id);

    if (!product) return;

    cart.push(product);

    cartCount.innerText = cart.length;

    displayCart();

}

// Display Cart
function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        cartItems.innerHTML += `
        <p>
            ${item.name} - ₹${item.price}

            <button onclick="removeItem(${index})">
                Remove
            </button>
        </p>
        `;

    });

    cartItems.innerHTML += `
        <h3>Total : ₹${total}</h3>

        <button id="checkout-btn" onclick="placeOrder()">
            Checkout
        </button>
    `;

}

// Remove Item
function removeItem(index) {

    cart.splice(index, 1);

    cartCount.innerText = cart.length;

    displayCart();

}

// Search
function searchProduct() {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value)
    );

    displayProducts(filtered);

}

// Dark Mode
function toggleDarkMode() {

    document.body.classList.toggle("dark");

}

// Place Order
async function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    const order = {

        items: cart,

        total: cart.reduce((sum, item) => sum + item.price, 0),

        date: new Date()

    };

    try {

        const response = await fetch("/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(order)

        });

        const data = await response.json();

        alert(data.message);

        cart = [];

        cartCount.innerText = 0;

        displayCart();

    } catch (error) {

        console.log(error);

        alert("Order Failed");

    }

}

// Start
fetchProducts();