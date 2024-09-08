document.addEventListener('DOMContentLoaded', () => {
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
    updateDropdown();

    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        let totalPrice = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            const image = document.createElement('img');
            image.src = item.image.url;
            image.alt = item.image.alt;
            image.style.width = "150px";
            image.style.height = "150px";
            image.style.marginRight = "20px";
            cartItem.appendChild(image);

            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');

            const title = document.createElement('h3');
            title.textContent = `${item.title} (Size: ${item.size})`;
            itemDetails.appendChild(title);

            const quantityControls = document.createElement('div');
            quantityControls.classList.add('quantity-controls');

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = "-";
            decreaseButton.classList.add('quantity-button');
            decreaseButton.addEventListener('click', () => changeQuantity(index, -1));
            quantityControls.appendChild(decreaseButton);

            const quantityDisplay = document.createElement('span');
            quantityDisplay.textContent = item.quantity;
            quantityControls.appendChild(quantityDisplay);

            const increaseButton = document.createElement('button');
            increaseButton.textContent = "+";
            increaseButton.classList.add('quantity-button');
            increaseButton.addEventListener('click', () => changeQuantity(index, 1));
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
            removeButton.addEventListener('click', () => removeFromCart(index));
            cartItem.appendChild(removeButton);

            cartContainer.appendChild(cartItem);
        });

        const cartTotal = document.createElement('div');
        cartTotal.classList.add('cart-total');
        cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
        cartContainer.appendChild(cartTotal);

        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Proceed to Payment';
        checkoutButton.addEventListener('click', () => {
            window.location.href = "payment.html"; 
        });
        cartContainer.appendChild(checkoutButton);
    }
});

function changeQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];
    item.quantity += change;
    if (item.quantity <= 0) {
        cart.splice(index, 1); 
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); 
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function updateDropdown() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const goToCartButton = document.getElementById('go-to-cart');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';
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

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = `Quantity: ${item.quantity}`;
        itemDetails.appendChild(quantityDisplay);

        const price = document.createElement('p');
        const itemPrice = item.discountedPrice ? item.discountedPrice : item.price;
        totalPrice += itemPrice * item.quantity;
        price.textContent = `Price: $${itemPrice.toFixed(2)} each`;
        itemDetails.appendChild(price);

        cartItem.appendChild(itemDetails);
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
