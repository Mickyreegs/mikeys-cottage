/*----Review Section Modals----*/
//review form
document.addEventListener('DOMContentLoaded', function () {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value;
            const reviewText = document.getElementById('reviewText').value;
            const stars = [...document.querySelectorAll('#starRating .star')]
                          .filter(star => star.style.color === 'gold').length;

            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            document.getElementById('confirmationMessage').textContent = `Thank you, ${name}, for your review! You rated us ${stars} stars.`;
            confirmationModal.show();

            this.reset();
        });
    }
});

//star reviews
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach((star, index) => {
        star.addEventListener('click', function () {
            stars.forEach((s, i) => {
                s.style.color = i <= index ? 'gold' : 'gray'; 
            });
        });

        star.addEventListener('mouseover', function () {
            stars.forEach((s, i) => {
                s.style.color = i <= index ? 'gold' : 'gray';
            });
        });

        star.addEventListener('mouseout', function () {
            const selectedStars = [...stars].filter(s => s.style.color === 'gold').length;
            stars.forEach((s, i) => {
                s.style.color = i < selectedStars ? 'gold' : 'gray';
            });
        });
    });
});




/*----Shop and Cart sections----*/
const cartItemsList = document.getElementById('cartItems');
const totalElement = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal'); 
const modal = new bootstrap.Modal(document.getElementById('cartModal'));
let cart = []; 

// Add event listener to all "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const name = this.getAttribute('data-name'); 
        const price = parseFloat(this.getAttribute('data-price'));

        // Check if the item already exists in the cart
        const itemExists = cart.find(item => item.name === name);
        if (itemExists) {
            itemExists.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        // Show the toast notification
        const toastElement = document.getElementById('cartToast');
        const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        toast.show();

        // Update the toast message
        document.querySelector('#cartToast .toast-body').textContent = `${name} has been added to your cart!`;

        updateCartDisplay();
        saveCart(); 
    });
});

function updateCartDisplay() {
    // Clear the cart display
    cartItemsList.innerHTML = '';

    let total = 0;

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
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        // Create quantity input field
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.value = item.quantity;
        input.className = 'form-control d-inline-block w-25 mx-2';

        // Update quantity when input changes
        input.addEventListener('change', function () {
            const newQuantity = parseInt(input.value, 10);
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                updateCartDisplay();
                saveCart();
            } else {
                alert('Quantity must be at least 1.');
                input.value = item.quantity;
            }
        });

        // Create Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'btn btn-danger btn-sm mx-2';
        removeButton.addEventListener('click', function () {
            cart.splice(index, 1);
            updateCartDisplay();
            saveCart();
        });

        li.textContent = `${item.name} - €${item.price.toFixed(2)} x `;
        li.appendChild(input);
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);

        total += item.price * item.quantity;
    });

    // Update the total price in the modal
    totalElement.textContent = `Total: €${total.toFixed(2)}`;
}

// Reset toast message when modal is closed
cartModal.addEventListener('hidden.bs.modal', function () {
    document.querySelector('#cartToast .toast-body').textContent = ''; 
});

//Save cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

//retrieves the cart and displays it on other pages
document.addEventListener('DOMContentLoaded', function () {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart; // Restore cart
        updateCartDisplay();
    }
});

/*----Afternoon Tea Section----*/
document.addEventListener('DOMContentLoaded', function () {
    const teaBookingForm = document.getElementById('teaBookingForm');
    const confirmationModalElement = document.getElementById('confirmationModal');

    if (teaBookingForm && confirmationModalElement) {
        teaBookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = this;

            if (form.checkValidity()) {
                const modal = new bootstrap.Modal(confirmationModalElement);
                modal.show();
                form.reset();
            } else {
                form.classList.add('was-validated');
            }
        });
    }
});

//Date validation
document.getElementById('date').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert("You cannot select a date in the past.");
        this.value = '';
    }
});

//Guests and allergen validation
document.getElementById('allergens').addEventListener('change', function () {
    const guestNumberContainer = document.getElementById('guest-number-container');
    const guestNumberInput = document.getElementById('guest-number');
    
    if (this.value) {
        guestNumberContainer.style.display = 'block';
    } else {
        guestNumberContainer.style.display = 'none';
        guestNumberInput.value = '';
    }
});

document.getElementById('guest-number').addEventListener('input', function () {
    const totalGuests = document.getElementById('total-guests').value;

    if (this.value <= 0) {
        alert("The number of guests with the allergy cannot be 0.");
        this.value = '';
    } else if (this.value > totalGuests) {
        alert("The number of guests with the allergy cannot exceed the total number of guests.");
        this.value = '';
    }
});

document.getElementById('total-guests').addEventListener('input', function () {
    const guestNumberInput = document.getElementById('guest-number');
    
    // Revalidate the allergy guest count if total guests change
    if (guestNumberInput.value > this.value) {
        alert("The number of guests with the allergy cannot exceed the total number of guests.");
        guestNumberInput.value = ''; 
    }
});

//corporate rules
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('package').addEventListener('change', function () {
        const guestInput = document.getElementById('total-guests');
        const nameLabel = document.getElementById('name-label');
        const nameInput = document.getElementById('name');

        if (this.value === 'corporate') {
            guestInput.value = 10; 
            guestInput.setAttribute('min', 10); 
            nameLabel.textContent = 'Company Name';
            nameInput.setAttribute('placeholder', 'Enter company name');
        } else {
            guestInput.value = ''; 
            guestInput.removeAttribute('min'); 
            nameLabel.textContent = 'Name';
            nameInput.setAttribute('placeholder', 'Enter name');
        }
    });
});
