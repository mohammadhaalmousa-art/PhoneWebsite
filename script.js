// Load the price data
async function loadPriceData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading price data:', error);
        return null;
    }
}

// Update the display based on selected model
function updatePrices(data, model) {
    const modelData = data.prices[model];
    if (!modelData) return;

    // Update average price
    document.getElementById('averagePrice').textContent = `$${modelData.average}`;

    // Update condition prices
    document.getElementById('likeNewPrice').textContent = `$${modelData.conditions.likeNew}`;
    document.getElementById('goodPrice').textContent = `$${modelData.conditions.good}`;
    document.getElementById('usedPrice').textContent = `$${modelData.conditions.used}`;
    document.getElementById('fairPrice').textContent = `$${modelData.conditions.fair}`;
}

// Set the last updated date
function setLastUpdated(data) {
    const dateElement = document.getElementById('updateDate');
    if (data && data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        dateElement.textContent = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize the page
async function init() {
    const data = await loadPriceData();
    if (!data) return;

    // Set last updated date
    setLastUpdated(data);

    // Get initial model
    const select = document.getElementById('modelSelect');
    const initialModel = select.value;

    // Update prices for initial model
    updatePrices(data, initialModel);

    // Listen for changes to the dropdown
    select.addEventListener('change', function() {
        updatePrices(data, this.value);
    });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', init);
