// Select elements
const cartItemsList = document.getElementById('cartItems'); // List in the modal
const totalElement = document.getElementById('cartTotal'); // Total price display
const cartModal = document.getElementById('cartModal'); // Cart modal element
let cart = []; // Array to store cart items

// Add event listener to all "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const name = this.getAttribute('data-name'); // Item name from button
        const price = parseFloat(this.getAttribute('data-price')); // Item price from button

        // Prevent duplicate items in the cart
        const itemExists = cart.find(item => item.name === name);
        if (!itemExists) {
            cart.push({ name, price }); // Add item to cart if it doesn't exist
        } else {
            alert(`${name} is already in your cart!`); // Notify user if item is already added
            return;
        }

        // Show the toast notification
        const toastElement = document.getElementById('cartToast');
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        toast.show();

        // Update the toast message
        document.querySelector('#cartToast .toast-body').textContent = `${name} has been added to your cart!`;

        // Update the cart display in the modal
        updateCartDisplay();
    });
});

// Function to update the cart modal
function updateCartDisplay() {
    // Clear the cart display
    cartItemsList.innerHTML = '';

    let total = 0; // Initialize total price

    if (cart.length === 0) {
        // Handle empty cart case
        const li = document.createElement('li');
        li.className = 'list-group-item text-center';
        li.textContent = 'Your cart is empty.';
        cartItemsList.appendChild(li);
        totalElement.textContent = `Total: €0.00`;
        return;
    }

    // Add each cart item to the modal and calculate the total
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${item.name} - €${item.price.toFixed(2)}`;
        cartItemsList.appendChild(li);
        total += item.price; // Accumulate total price
    });

    // Update the total price in the modal
    totalElement.textContent = `Total: €${total.toFixed(2)}`;
}

// Reset toast message when modal is closed
cartModal.addEventListener('hidden.bs.modal', function () {
    document.querySelector('#cartToast .toast-body').textContent = ''; // Clear toast message
});