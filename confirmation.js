document.addEventListener('DOMContentLoaded', () => {
    const purchasedProductsContainer = document.getElementById('purchased-products');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        purchasedProductsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
           
            const productDiv = document.createElement('div');
            productDiv.classList.add('purchased-product');

            
            const image = document.createElement('img');
            image.src = item.image.url;
            image.alt = item.image.alt;
            productDiv.appendChild(image);

           
            const detailsDiv = document.createElement('div');

            
            const title = document.createElement('h3');
            title.textContent = item.title;
            detailsDiv.appendChild(title);

           
            const quantity = document.createElement('p');
            quantity.textContent = `Quantity: ${item.quantity}`;
            detailsDiv.appendChild(quantity);

            
            const price = document.createElement('p');
            const totalPrice = (item.discountedPrice || item.price) * item.quantity;
            price.textContent = `Total: $${totalPrice.toFixed(2)}`;
            detailsDiv.appendChild(price);

            productDiv.appendChild(detailsDiv);
            purchasedProductsContainer.appendChild(productDiv);
        });
    }

    
    localStorage.removeItem('cart');
});
