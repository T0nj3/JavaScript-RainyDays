document.addEventListener('DOMContentLoaded', () => {
    const cartIconContainer = document.getElementById('cart-icon-container');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeDropdownButton = document.getElementById('close-dropdown');
    const loadingIndicator = document.getElementById('loading');

    cartIconContainer.addEventListener('click', () => {
        cartDropdown.classList.toggle('hidden');
        updateDropdown(); 
    });

    closeDropdownButton.addEventListener('click', () => {
        cartDropdown.classList.add('hidden');
    });

    processProducts('Male');
    updateCartCount(); 
});

const API_RAINYDAYS_URL = "https://v2.api.noroff.dev/rainy-days";

async function getDataAsyncAwait() {
    try {
        const loadingIndicator = document.getElementById('loading');
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden'); 
        }

        const response = await fetch(API_RAINYDAYS_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log('API data:', json);  
        return json;
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('products').innerHTML = "<p>Could not load products. Please try again later.</p>";
    } finally {
        const loadingIndicator = document.getElementById('loading');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden'); 
        }
    }
}



async function processProducts(gender) {
    const data = await getDataAsyncAwait();
    if (data && data.data) {
        console.log('Products before filtering:', data.data); 
        const products = data.data.filter(product => product.gender === gender);
        console.log('Filtered products:', products); 
        displayProducts(products);
    } else {
        console.log("No data available");
    }
}


function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const title = document.createElement('h2');
        title.textContent = product.title;
        productDiv.appendChild(title);

        const image = document.createElement('img');
        image.src = product.image.url;
        image.alt = product.image.alt;
        productDiv.appendChild(image);

        const price = document.createElement('p');
        if (product.discountedPrice && product.discountedPrice < product.price) {
            price.innerHTML = `Discounted Price: <strong>$${product.discountedPrice.toFixed(2)}</strong>`;
        } else {
            price.textContent = `Price: $${product.price.toFixed(2)}`;
        }
        productDiv.appendChild(price);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.classList.add('add-to-cart-button');
        addToCartButton.onclick = () => addToCart(product);
        productDiv.appendChild(addToCartButton);

        productsContainer.appendChild(productDiv);
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateDropdown();

    showToast(`${product.title} has been added to the cart`);
}

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;  
    toastContainer.classList.add('show');  

    setTimeout(() => {
        toastContainer.classList.remove('show');
    }, 3000);  
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
}

function updateDropdown() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const goToCartButton = document.getElementById('go-to-cart');

    cartItemsContainer.innerHTML = '';

    let totalPrice = 0;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('dropdown-cart-item');

        const image = document.createElement('img');
        image.src = item.image.url;
        image.alt = item.image.alt;
        image.style.width = "75px";
        image.style.height = "75px";
        image.style.marginRight = "10px";
        cartItem.appendChild(image);

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('item-details');

        const title = document.createElement('h4');
        title.textContent = item.title;
        itemDetails.appendChild(title);

        const quantityControls = document.createElement('div');
        quantityControls.classList.add('quantity-controls');

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.classList.add('quantity-button');
        decreaseButton.onclick = () => changeQuantity(index, -1);
        quantityControls.appendChild(decreaseButton);

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = `Quantity: ${item.quantity}`;
        quantityControls.appendChild(quantityDisplay);

        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
        increaseButton.classList.add('quantity-button');
        increaseButton.onclick = () => changeQuantity(index, 1);
        quantityControls.appendChild(increaseButton);

        itemDetails.appendChild(quantityControls);

        const price = document.createElement('p');
        const itemPrice = item.discountedPrice ? item.discountedPrice : item.price;
        totalPrice += itemPrice * item.quantity;
        price.textContent = `Price: $${itemPrice.toFixed(2)} each`;
        itemDetails.appendChild(price);

        cartItem.appendChild(itemDetails);

        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeFromCart(index);
        cartItem.appendChild(removeButton);

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartTotalContainer.textContent = "Your cart is empty.";
        goToCartButton.classList.add('hidden');
    } else {
        goToCartButton.classList.remove('hidden');
    }
}

function changeQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];
    item.quantity += change;
    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateDropdown();
    updateCartCount();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateDropdown();
    updateCartCount();
}
