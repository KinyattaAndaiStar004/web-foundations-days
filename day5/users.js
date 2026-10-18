
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];
let hasLoadedUsers = false;

async function loadUsers() {
    loadButton.disabled = true;
    hasLoadedUsers = false;
    statusMessage.textContent = "Loading users...";
    usersList.replaceChildren();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        users = data;
        hasLoadedUsers = true;

        renderUsers(users);

        statusMessage.textContent =
            `Successfully loaded ${users.length} users.`;
    } catch (error) {
        console.error("Error loading users:", error);

        users = [];
        hasLoadedUsers = false;
        usersList.replaceChildren();

        statusMessage.textContent =
            "Failed to load users. Please check your connection and try again.";
    } finally {
        loadButton.disabled = false;
    }
}

function renderUsers(userArray) {
    usersList.replaceChildren();

    if (userArray.length === 0) {
        const listItem = document.createElement("li");
        listItem.textContent = "No users match your filter.";
        usersList.appendChild(listItem);
        return;
    }

    userArray.forEach((user) => {
        const listItem = document.createElement("li");

        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        listItem.appendChild(name);
        listItem.appendChild(email);
        listItem.appendChild(city);
        listItem.appendChild(company);

        usersList.appendChild(listItem);
    });
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
    // Do not filter until the API request has succeeded.
    if (!hasLoadedUsers) {
        return;
    }

    const searchTerm = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
    );

    renderUsers(filteredUsers);
});
