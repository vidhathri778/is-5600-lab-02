document.addEventListener('DOMContentLoaded', () => {
    const stocks = JSON.parse(stockContent);
    const users = JSON.parse(userContent);

    renderUserList(users, stocks);

    document.querySelector('#btnDelete').addEventListener('click', (e) => {
        e.preventDefault();
        handleDeleteUser(users, stocks);
    });

    document.querySelector('#btnSave').addEventListener('click', (e) => {
        e.preventDefault();
        handleSaveUser(users, stocks);
    });
});

/**
 * Renders the list of users and assigns click event listeners
 */
function renderUserList(users, stocks) {
    const userListContainer = document.querySelector('.user-list');
    userListContainer.innerHTML = '';

    users.forEach(({ user, id }) => {
        const userItem = document.createElement('li');
        userItem.textContent = `${user.lastname}, ${user.firstname}`;
        userItem.dataset.userId = id;
        userListContainer.appendChild(userItem);
    });

    userListContainer.removeEventListener('click', handleUserClick);
    userListContainer.addEventListener('click', (event) => handleUserClick(event, users, stocks));
}

/**
 * Handles user list item click events
 */
function handleUserClick(event, users, stocks) {
    const selectedUserId = event.target.dataset.userId;
    const selectedUser = users.find(user => user.id == selectedUserId);

    if (selectedUser) {
        clearStockInfo();
        fillUserDetails(selectedUser);
        displayPortfolio(selectedUser, stocks);
    }
}

/**
 * Deletes the selected user and updates the list
 */
function handleDeleteUser(users, stocks) {
    const userIdToDelete = document.querySelector('#userID').value;
    const userIndex = users.findIndex(user => user.id == userIdToDelete);

    if (userIndex > -1) {
        users.splice(userIndex, 1);
        clearUserDetails();
        clearStockInfo();
        renderUserList(users, stocks);
    }
}

/**
 * Saves the updated user details
 */
function handleSaveUser(users) {
    const userIdToSave = document.querySelector('#userID').value;
    const userToSave = users.find(user => user.id == userIdToSave);

    if (userToSave) {
        Object.assign(userToSave.user, {
            firstname: document.querySelector('#firstname').value,
            lastname: document.querySelector('#lastname').value,
            address: document.querySelector('#address').value,
            city: document.querySelector('#city').value,
            email: document.querySelector('#email').value,
        });

        renderUserList(users);
    }
}

/**
 * Fills the user form with the selected user's details
 */
function fillUserDetails(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

/**
 * Displays the portfolio of the selected user
 */
function displayPortfolio(user, stocks) {
    const portfolioContainer = document.querySelector('.portfolio-list');
    portfolioContainer.innerHTML = '';

    user.portfolio.forEach(({ symbol, owned }) => {
        const symbolElement = document.createElement('p');
        const sharesElement = document.createElement('p');
        const actionButton = document.createElement('button');

        symbolElement.textContent = symbol;
        sharesElement.textContent = owned;
        actionButton.textContent = 'View';
        actionButton.dataset.symbol = symbol;

        portfolioContainer.appendChild(symbolElement);
        portfolioContainer.appendChild(sharesElement);
        portfolioContainer.appendChild(actionButton);
    });

    portfolioContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            showStockDetails(event.target.dataset.symbol, stocks);
        }
    });
}

/**
 * Shows the stock details for a selected symbol
 */
function showStockDetails(symbol, stocks) {
    const stockInfoContainer = document.querySelector('.stock-form');
    const stockDetails = stocks.find(stock => stock.symbol == symbol);

    if (stockDetails) {
        document.querySelector('#stockName').textContent = stockDetails.name;
        document.querySelector('#stockSector').textContent = stockDetails.sector;
        document.querySelector('#stockIndustry').textContent = stockDetails.subIndustry;
        document.querySelector('#stockAddress').textContent = stockDetails.address;
        document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
}

/**
 * Clears the user form
 */
function clearUserDetails() {
    document.querySelectorAll('#userID, #firstname, #lastname, #address, #city, #email').forEach(input => input.value = '');
}

/**
 * Clears the stock details section
 */
function clearStockInfo() {
    document.querySelectorAll('#stockName, #stockSector, #stockIndustry, #stockAddress').forEach(el => el.textContent = '');
    document.querySelector('#logo').src = '';
}
