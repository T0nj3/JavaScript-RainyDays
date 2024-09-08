document.addEventListener('DOMContentLoaded', () => {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (productId) {
        fetchProductDetails(productId);
    }

    const cartIconContainer = document.getElementById('cart-icon-container');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeDropdownButton = document.getElementById('close-dropdown');

    cartIconContainer.addEventListener('click', () => {
        cartDropdown.classList.toggle('hidden');
        updateDropdown();
    });

    closeDropdownButton.addEventListener('click', () => {
        cartDropdown.classList.add('hidden');
    });

    updateCartCount();
});

const API_RAINYDAYS_URL = "https://v2.api.noroff.dev/rainy-days";

async function fetchProductDetails(id) {
    try {
        const response = await fetch(`${API_RAINYDAYS_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const product = data.data;
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

function displayProductDetails(product) {
    const productDetailsContainer = document.getElementById('product-details');
    productDetailsContainer.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = product.title;
    productDetailsContainer.appendChild(title);

    const image = document.createElement('img');
    image.src = product.image.url;
    image.alt = product.image.alt || 'Product Image';
    productDetailsContainer.appendChild(image);

    const description = document.createElement('p');
    description.textContent = product.description;
    productDetailsContainer.appendChild(description);

    const price = document.createElement('p');
    if (product.discountedPrice && product.discountedPrice < product.price) {
        price.innerHTML = `Discounted Price: <strong>$${product.discountedPrice.toFixed(2)}</strong>`;
    } else {
        price.textContent = `Price: $${product.price.toFixed(2)}`;
    }
    productDetailsContainer.appendChild(price);

    // Legg til valg for størrelse
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = "Select Size:";
    productDetailsContainer.appendChild(sizeLabel);

    const sizeSelect = document.createElement('select');
    sizeSelect.id = 'size-select';
    product.sizes.forEach(size => {
        const sizeOption = document.createElement('option');
        sizeOption.value = size;
        sizeOption.textContent = size;
        sizeSelect.appendChild(sizeOption);
    });
    productDetailsContainer.appendChild(sizeSelect);

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.onclick = () => {
        const selectedSize = sizeSelect.value;
        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }
        addToCart(product, selectedSize);
    };
    productDetailsContainer.appendChild(addToCartButton);
}

function addToCart(product, selectedSize) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, size: selectedSize, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
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
        title.textContent = `${item.title} (Size: ${item.size})`;
        itemDetails.appendChild(title);

        const quantityControls = document.createElement('div');
        quantityControls.classList.add('quantity-controls');

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = "-";
        decreaseButton.onclick = () => changeQuantity(index, -1);
        quantityControls.appendChild(decreaseButton);

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = `Quantity: ${item.quantity}`;
        quantityControls.appendChild(quantityDisplay);

        const increaseButton = document.createElement('button');
        increaseButton.textContent = "+";
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
