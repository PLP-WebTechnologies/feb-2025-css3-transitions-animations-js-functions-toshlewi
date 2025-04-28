document.addEventListener('DOMContentLoaded', function() {
    // Load user preferences
    loadPreferences();
    
    // Set up event listeners
    document.getElementById('save-pref').addEventListener('click', savePreferences);
    document.getElementById('explore-btn').addEventListener('click', triggerExploreAnimation);
    
    // Set up car detail buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function() {
            const carId = this.closest('.car-card').getAttribute('data-car-id');
            viewCarDetails(carId);
        });
    });
    
    // Set up nav link animations
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#f39c12';
        });
        link.addEventListener('mouseleave', function() {
            this.style.color = 'white';
        });
    });
});

// Load and apply user preferences from localStorage
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('toshAutoHubPrefs')) || {};
    const themeSelect = document.getElementById('theme');
    
    if (preferences.theme) {
        themeSelect.value = preferences.theme;
        applyTheme(preferences.theme);
    }
    
    // Show status message if preferences were loaded
    if (Object.keys(preferences).length > 0) {
        showStatusMessage('Your preferences have been loaded.', 'success');
    }
}

// Save user preferences to localStorage
function savePreferences() {
    const theme = document.getElementById('theme').value;
    const preferences = {
        theme: theme,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('toshAutoHubPrefs', JSON.stringify(preferences));
    applyTheme(theme);
    showStatusMessage('Preferences saved successfully!', 'success');
    
    // Trigger save animation
    const saveButton = document.getElementById('save-pref');
    saveButton.classList.add('saved');
    setTimeout(() => {
        saveButton.classList.remove('saved');
    }, 1000);
}

// Apply the selected theme
function applyTheme(theme) {
    document.body.className = ''; // Reset classes
    document.body.classList.add(`${theme}-theme`);
}

// Show status message
function showStatusMessage(message, type) {
    const statusElement = document.getElementById('pref-status');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    
    // Fade out after 3 seconds
    setTimeout(() => {
        statusElement.style.opacity = '0';
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.style.opacity = '1';
        }, 500);
    }, 3000);
}

// Trigger explore animation
function triggerExploreAnimation() {
    const exploreBtn = document.getElementById('explore-btn');
    const carCards = document.querySelectorAll('.car-card');
    
    // Button animation
    exploreBtn.classList.add('exploring');
    setTimeout(() => {
        exploreBtn.classList.remove('exploring');
    }, 1000);
    
    // Animate car cards
    carCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'none';
            void card.offsetWidth; // Trigger reflow
            card.style.animation = 'pulse 0.5s ease';
        }, index * 200);
    });
    
    // Scroll to featured section
    document.querySelector('.featured').scrollIntoView({
        behavior: 'smooth'
    });
}

// View car details with animation
function viewCarDetails(carId) {
    const carCard = document.querySelector(`.car-card[data-car-id="${carId}"]`);
    const carImage = carCard.querySelector('.car-image');

    // Define car details
    const carDetails = {
        1: {
            name: 'Rolls Royce Phantom',
            description: 'The epitome of luxury and craftsmanship, featuring a V12 engine and unparalleled comfort.',
            price: '$450,000'
        },
        2: {
            name: 'Mercedes AMG GT',
            description: 'A high-performance sports car with a handcrafted V8 engine and stunning design.',
            price: '$140,000'
        },
        3: {
            name: 'Range Rover Sport',
            description: 'A luxury SUV with off-road capability, advanced technology, and refined style.',
            price: '$120,000'
        }
    };

    // Get details for the selected car
    const details = carDetails[carId];

    // Add animation class
    carCard.classList.add('viewing-details');
    carImage.style.transform = 'scale(1.1)';

    // Show car details
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'car-details';
    detailsContainer.innerHTML = `
        <h4>${details.name}</h4>
        <p>${details.description}</p>
        <p><strong>Price:</strong> ${details.price}</p>
        <button class="close-details">Close</button>
    `;
    carCard.appendChild(detailsContainer);

    // Close details on button click with animation
    detailsContainer.querySelector('.close-details').addEventListener('click', () => {
        detailsContainer.classList.add('closing');
        carImage.style.transform = 'scale(1)';
        setTimeout(() => {
            carCard.classList.remove('viewing-details');
            carCard.removeChild(detailsContainer);
        }, 500); // Match the duration of the fadeOutScale animation
    });
}