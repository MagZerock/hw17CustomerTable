//const API_URL = 'http://localhost:3002/computerstore/customers';
const API_URL = '/computerstore/customers';

function switchTab(tabId, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event) {
        event.target.classList.add('active');
    } else {
        document.querySelector(`.tab-btn[onclick*="${tabId}"]`).classList.add('active');
    }

    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(tabId + '-section').classList.add('active');
    if (tabId === 'view') {
        fetchCustomers();
    }
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
};

async function fetchTotalMoney() {
    try {
        const response = await fetch('http://localhost:3002/computerstore/customers/totalMoneySpent');
        if (!response.ok) throw new Error('Failed to fetch total');
        
        const data = await response.json();
        
        const formattedTotal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(data.totalEarned);
        
        document.getElementById('total-display').textContent = formattedTotal;
    } catch (error) {
        console.error('Error fetching total money spent:', error);
    }
}

async function fetchCustomers() {
    const tableBody = document.getElementById('tableBody');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="empty-state">No customers found. Add some!</td></tr>`;
        } else {
            data.forEach(customer => {
                const tr = document.createElement('tr');
                const spent = parseFloat(customer.moneySpent) || 0;

                tr.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.age}</td>
                    <td>${formatCurrency(spent)}</td>
                `;
                tableBody.appendChild(tr);
            });
        }

    } catch (error) {
        console.error('Error fetching customers:', error);
        tableBody.innerHTML = `<tr><td colspan="4" class="empty-state" style="color: var(--error-color);">Error loading data. Is the backend running?</td></tr>`;
    }
}

function showAlert(message, isError = false) {
    const alertBox = document.getElementById('formAlert');
    alertBox.textContent = message;
    alertBox.className = 'alert show ' + (isError ? 'alert-error' : 'alert-success');

    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;

    const customerData = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        moneySpent: document.getElementById('money').value
    };

    try {
        const response = await fetch('http://localhost:3002/computerstore/customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            throw new Error('Failed to register customer');
        }

        showAlert('Customer registered successfully!');
        document.getElementById('addForm').reset();
        fetchTotalMoney();

    } catch (error) {
        console.error('Error adding customer:', error);
        showAlert('Error adding customer. Please try again.', true);
    } finally {
        submitBtn.textContent = 'Register Customer';
        submitBtn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCustomers();
    fetchTotalMoney();
});
