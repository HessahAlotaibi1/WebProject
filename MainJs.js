function updateCart() {
    let total = 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-item').forEach(item => {
        const itemName = item.querySelector('.item-info h4').textContent;
        const price = parseFloat(item.querySelector('.item-info p').textContent.replace('Price: ', '').replace(' SAR', ''));
        const quantity = parseInt(item.querySelector('.item-quantity input').value);

        // Update the total
        total += price * quantity;

        // Sync the updated quantity with localStorage
        const cartItem = cart.find(cartItem => cartItem.name === itemName);
        if (cartItem) {
            cartItem.quantity = quantity;
        }
    });
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
    document.getElementById('total').textContent = `${total} SAR`;
    document.getElementById('subtotal').textContent = `${total} SAR`;
}

function removeItem(element) {
    const itemName = element.parentElement.querySelector('.item-info h4').textContent;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    element.parentElement.remove();
    updateCart();
}

function emptyCart() {
    localStorage.removeItem('cart');
    document.getElementById('cartItems').innerHTML = '';
    updateCart();
}

function checkout() {
    const total = parseFloat(document.getElementById('total').textContent.replace(' SAR', ''));
    if (total === 0) {
        alert("Your cart is empty! Please add items to your cart before checking out.");
    } else {
        alert(`Thank you for your purchase! Total: ${total} SAR`);
        window.location.href = "evaluatee.html";
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark-theme');
    const isDarkMode = document.documentElement.classList.contains('dark-theme');
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.src = isDarkMode ? 'images/sunny-outline.svg' : 'images/moon-outline.svg';
    themeIcon.alt = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
}


function updateQuantity(itemName, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Fetch current cart
    const item = cart.find(cartItem => cartItem.name === itemName); // Locate the item
    if (item) {
        item.quantity = parseInt(newQuantity); // Update the quantity
        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart back to localStorage
    }
    loadCartItems(); // Re-render the cart with updated totals
}


function addToCart(button) {
    const itemName = button.getAttribute('data-name');
    const itemPrice = button.getAttribute('data-price');
    const itemImage = button.getAttribute('data-image');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: itemName,
            price: parseFloat(itemPrice),
            image: itemImage,
            quantity: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${itemName} has been added to your cart.`);

    // Only call loadCartItems if on the cart page
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        loadCartItems();
    }
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems'); // Get the container
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Fetch cart data from localStorage

    // Debugging: Check if the container and cart data exist
    console.log('Cart container:', cartItemsContainer);
    console.log('Cart data from localStorage:', cart);

    // If the container doesn't exist, exit the function
    if (!cartItemsContainer) {
        console.warn('Cart items container not found!');
        return;
    }

    // Clear the container
    cartItemsContainer.innerHTML = '';

    // Display "empty cart" message if no items are found
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        updateCart(); // Reset totals
        return;
    }

    // Iterate through each cart item and dynamically create elements
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" width="80">
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Price: ${item.price} SAR</p>
            </div>
            <div class="item-quantity">
                <label for="quantity_${item.name}">Quantity</label>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)">
            </div>
            <div class="item-total">${(item.price * item.quantity).toFixed(2)} SAR</div>
            <button class="remove-item" onclick="removeItem(this)">X</button>
        `;

        // Append the dynamically created item to the cart container
        cartItemsContainer.appendChild(cartItem);
    });

    // Update totals after rendering items
    updateCart();
}




// DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme(); // Apply the theme globally
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        loadCartItems();
    }
});

function sortProducts(event) {
    const sortingValue = event.target.value; // Get selected value from the dropdown
    const container = event.target.closest('section').querySelector('.items'); // Find the closest .items container in the same section

    if (!container) return; // Exit if no container is found

    const items = Array.from(container.children); // Get all items in the container

    items.sort((a, b) => {
        if (sortingValue === 'Price Low to High') {
            return (
                extractPrice(a.querySelector('.p3').textContent) -
                extractPrice(b.querySelector('.p3').textContent)
            );
        } else if (sortingValue === 'Price High to Low') {
            return (
                extractPrice(b.querySelector('.p3').textContent) -
                extractPrice(a.querySelector('.p3').textContent)
            );
        } else if (sortingValue === 'By Name(A to Z)') {
            return a.querySelector('.p1').textContent.localeCompare(b.querySelector('.p1').textContent);
        } else if (sortingValue === 'By Name(Z to A)') {
            return b.querySelector('.p1').textContent.localeCompare(a.querySelector('.p1').textContent);
        }
    });

    // Append sorted items back to the container
    items.forEach(item => container.appendChild(item));
}

// Helper function to extract numeric price from text
function extractPrice(priceText) {
    return parseFloat(priceText.replace(/[^\d.]/g, '')); // Remove non-numeric characters and convert to a float
}

document.addEventListener('DOMContentLoaded', applySavedTheme);


document.querySelector("input[type='submit']").addEventListener("click", function(event) {
    event.preventDefault(); 

    let orderNo = document.getElementById("orderno").value;
    let product = document.getElementById("Product").value;
    let rating = document.querySelector("input[name='rating']:checked");

    
    if (!orderNo) {
        alert("Please select an order.");
        return;
    }

    if (!product) {
        alert("Please select a product.");
        return;
    }

    if (!rating) {
        alert("Please select a rating score.");
        return;
    }

    
    alert(`Thank you for your feedback!\nYour rating for product#${product} is ${rating.value}`);

   
    window.location.href = "home.html"; 
});


const productOptions = {
    "order no 1": ["Knife Set", "Duck Toy"],
    "order no 2": ["Blender", "Headphones"],
    "order no 3": ["Speaker", "Mixer"],
    "order no 4": ["Pot", "Batman logo"]
};


document.getElementById("orderno").addEventListener("change", function() {
    const selectedOrder = this.value; 
    const productSelect = document.getElementById("Product");

   
    productSelect.innerHTML = '<option value="" disabled selected>Product</option>';

   
    if (selectedOrder && productOptions[selectedOrder]) {
        productOptions[selectedOrder].forEach(product => {
            const option = document.createElement("option");
            option.value = product;
            option.textContent = product;
            productSelect.appendChild(option);
        });

        
        productSelect.disabled = false;
    } else {
        
        productSelect.disabled = true;
    }
});




//START OF THE MANAGE OFFERS AND SELLER'S DASHBOARD CODES

