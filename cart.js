document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

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
        title.textContent = item.title;
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