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
        // Validate item data
        if (!item || typeof item.price !== 'number') {
            console.error('Invalid cart item:', item);
            return; // Skip invalid item
        }

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

        // Safely set text content
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

// Save cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Retrieves the cart and displays it on other pages
document.addEventListener('DOMContentLoaded', function () {
    let savedCart = [];
    try {
        savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Failed to parse cart data from localStorage:', error);
    }
    if (savedCart.length > 0) {
        cart = savedCart; // Restore cart
        updateCartDisplay();
    }
});

/*---- Afternoon Tea Section ----*/
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('teaBookingForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const totalGuestsInput = document.getElementById('total-guests');
    const packageSelect = document.getElementById('package');
    const nameLabel = document.getElementById('name-label');
    const nameInput = document.getElementById('name');
    const allergyContainer = document.getElementById('allergy-container');
    const addAllergyButton = document.getElementById('add-allergy');
    const dateInput = document.getElementById('date');
    
    let totalAllergicGuests = 0;

    // Validation Functions
    const validateDateInput = () => {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            dateInput.classList.add('is-invalid');
            alert("Please select a valid date. Dates in the past are not allowed.");
            return false;
        }
        dateInput.classList.remove('is-invalid');
        return true;
    };

    const validateGuestsWithAllergies = () => {
        const totalGuests = parseInt(totalGuestsInput.value) || 0;
        totalAllergicGuests = Array.from(allergyContainer.querySelectorAll('.guest-count'))
            .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
        if (totalAllergicGuests > totalGuests) {
            alert("The number of guests with allergies cannot exceed the total number of guests.");
            return false;
        }
        return true;
    };

    const validateUniqueAllergens = () => {
        const allergenSelects = Array.from(allergyContainer.querySelectorAll('.allergen-select'));
        const selectedValues = allergenSelects.map(select => select.value);
        const uniqueValues = new Set(selectedValues);

        // If duplicates exist, highlight invalid fields
        allergenSelects.forEach(select => select.classList.remove('is-invalid'));
        if (selectedValues.length !== uniqueValues.size) {
            alert("Allergy already selected!");
            allergenSelects.forEach(select => {
                if (selectedValues.filter(value => value === select.value).length > 1) {
                    select.classList.add('is-invalid');
                }
            });
            return false;
        }
        return true;
    };

    // Add allergies dynamically
    const addAllergyGroup = () => {
        const newGroup = document.createElement('div');
        newGroup.className = 'd-flex align-items-center mb-2';
        newGroup.innerHTML = `
            <select class="form-select me-2 allergen-select" name="allergens[]" required>
                <option value="">Select an allergen</option>
                <option value="coeliac">Coeliac (Gluten Free)</option>
                <option value="vegan">Vegan</option>
                <option value="dairy">Dairy Free</option>
            </select>
            <input type="number" class="form-control me-2 guest-count" name="guest-number[]" min="1" placeholder="Number of Guests" required>
            <button type="button" class="btn btn-danger remove-allergy">Remove</button>
        `;
        allergyContainer.appendChild(newGroup);

        const allergenSelect = newGroup.querySelector('.allergen-select');
        allergenSelect.addEventListener('change', validateUniqueAllergens);

        newGroup.querySelector('.guest-count').addEventListener('input', validateGuestsWithAllergies);
        newGroup.querySelector('.remove-allergy').addEventListener('click', () => {
            allergyContainer.removeChild(newGroup);
            validateGuestsWithAllergies();
            validateUniqueAllergens();
        });
    };

    // Corporate Package
    const updatePackage = () => {
        const isCorporate = packageSelect.value === 'corporate';
        totalGuestsInput.value = isCorporate ? 10 : '';
        totalGuestsInput.setAttribute('min', isCorporate ? 10 : '');
        nameLabel.textContent = isCorporate ? 'Company Name' : 'Name';
        nameInput.placeholder = isCorporate ? 'Enter company name' : 'Enter name';
    };

    // Event Listeners
    if (form && confirmationModal) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateDateInput() || !validateGuestsWithAllergies() || !validateUniqueAllergens()) {
                return; 
            }

            if (this.checkValidity()) {
                new bootstrap.Modal(confirmationModal).show();
                this.reset();
                totalAllergicGuests = 0;
            } else {
                this.classList.add('was-validated');
            }
        });
    }

    dateInput?.addEventListener('input', validateDateInput);
    totalGuestsInput?.addEventListener('input', validateGuestsWithAllergies);
    packageSelect?.addEventListener('change', () => {
        updatePackage();
        validateGuestsWithAllergies();
    });
    addAllergyButton?.addEventListener('click', addAllergyGroup);
});