let priceData = null;
let selectedModel = null;
let selectedCapacity = null;
let selectedCondition = null;

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

// Step 1: Show Models
function renderModels(data) {
    const container = document.getElementById('modelOptions');
    const models = Object.keys(data.prices);
    
    container.innerHTML = models.map(model => `
        <div class="option-card" data-model="${model}">
            <div class="option-label">${model}</div>
        </div>
    `).join('');

    container.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedModel = this.dataset.model;
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            renderCapacities(priceData, selectedModel);
        });
    });
}

// Step 2: Show Capacities
function renderCapacities(data, model) {
    const container = document.getElementById('capacityOptions');
    const capacities = Object.keys(data.prices[model].capacities);
    
    container.innerHTML = capacities.map(capacity => `
        <div class="option-card" data-capacity="${capacity}">
            <div class="option-label">${capacity}</div>
        </div>
    `).join('');

    container.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedCapacity = this.dataset.capacity;
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
            renderConditions();
        });
    });
}

// Step 3: Show Conditions
function renderConditions() {
    const container = document.getElementById('conditionOptions');
    
    const conditions = [
        {
            id: 'likeNew',
            name: '✨ Like New',
            desc: [
                'Looks like new cosmetically.',
                'Fully functional.',
                'Compatible on Canadian cellular networks.',
                'No liquid damage.',
                'Battery holds a charge (Battery health is 85% or higher).',
                'Not iCloud locked or a blacklisted device.'
            ]
        },
        {
            id: 'good',
            name: '👍 Good',
            desc: [
                'Has normal signs of wear.',
                'Fully Functional.',
                'Compatible on Canadian cellular networks.',
                'Battery holds a charge (Battery health is 84% or higher).',
                'No heavy scratches, cracks or damaged parts.',
                'No liquid damage.',
                'Not iCloud locked or a blacklisted device.'
            ]
        },
        {
            id: 'fair',
            name: '📱 Fair',
            desc: [
                'Has significant signs of wear such as numerous scratches, scuffs, nicks and/or minor dents.',
                'Fully Functional.',
                'Compatible on Canadian cellular networks.',
                'May have a weak battery (83% or below), but is otherwise in good shape.',
                'No serious damage or cracks.',
                'No liquid damage.',
                'Not iCloud locked or a blacklisted device.'
            ]
        },
        {
            id: 'cracked',
            name: '🔧 Cracked or Minor Issue',
            desc: [
                'May have a cracked screen that still turns on (with touchscreen also fully working).',
                'May have a minor defect. (i.e. one defective button).',
                "Doesn't have numerous defects.",
                'No liquid damage.',
                'Not iCloud locked'
            ]
        },
        {
            id: 'defective',
            name: '⚠️ Defective',
            desc: [
                'Phone may have some defective features or may not power on.',
                'May have cracks, damaged parts on the LCD screen or housing.',
                'May have liquid damage.',
                'Still intact (no parts missing or taken out).',
                "If it doesn't power on or the screen is defective, it can't be tied to an iCloud account."
            ]
        }
    ];

    container.innerHTML = conditions.map(condition => `
        <div class="condition-option" data-condition="${condition.id}">
            <div class="condition-name">${condition.name}</div>
            <ul class="condition-desc">
                ${condition.desc.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    container.querySelectorAll('.condition-option').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.condition-option').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedCondition = this.dataset.condition;
            document.getElementById('step3').style.display = 'none';
            document.getElementById('step4').style.display = 'block';
            showOffer();
        });
    });
}

// Step 4: Show Offer
function showOffer() {
    const price = priceData.prices[selectedModel].capacities[selectedCapacity][selectedCondition];
    
    const conditionNames = {
        'likeNew': 'Like New',
        'good': 'Good',
        'fair': 'Fair',
        'cracked': 'Cracked or Minor Issue',
        'defective': 'Defective'
    };

    document.getElementById('deviceSummary').innerHTML = `
        <strong>${selectedModel}</strong> · ${selectedCapacity} · ${conditionNames[selectedCondition]}
    `;

    document.getElementById('offerPrice').textContent = `$${price}`;
}

// Back buttons
document.getElementById('backToModel').addEventListener('click', function() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    selectedCapacity = null;
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
});

document.getElementById('backToCapacity').addEventListener('click', function() {
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    selectedCondition = null;
    document.querySelectorAll('.condition-option').forEach(c => c.classList.remove('selected'));
});

document.getElementById('backToCondition').addEventListener('click', function() {
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
});

// Action buttons
document.getElementById('getPaid').addEventListener('click', function() {
    alert('🎉 Great! We\'ll be in touch shortly to complete your sale.');
});

document.getElementById('getPaid').addEventListener('click', function() {
    alert('📱 Ready to sell! We\'ll send you instructions to complete your sale.');
});

document.querySelector('.btn-accept').addEventListener('click', function() {
    // Reset to step 1
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    selectedModel = null;
    selectedCapacity = null;
    selectedCondition = null;
    document.querySelectorAll('.option-card, .condition-option').forEach(c => c.classList.remove('selected'));
});

// Initialize the page
async function init() {
    priceData = await loadPriceData();
    if (!priceData) return;

    setLastUpdated(priceData);
    renderModels(priceData);
}

// Run when page loads
document.addEventListener('DOMContentLoaded', init);
