// Renders list pages (result, admit, answer) dynamically based on data.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine the current page type
    const path = window.location.pathname.toLowerCase();
    let currentType = "";
    
    if (path.includes("result.html")) currentType = "result";
    else if (path.includes("admit.html")) currentType = "admit";
    else if (path.includes("answer.html")) currentType = "answer";
    else {
        // Fallback or read from body data attribute if configured
        const typeAttr = document.body.getAttribute('data-page-type');
        if (typeAttr) currentType = typeAttr;
    }

    // 2. Filter data
    let filteredData = [];
    if (currentType && updatesData) {
        filteredData = updatesData.filter(item => item.type === currentType);
    } else if (updatesData) {
        filteredData = updatesData; // show all if not specific
    }

    // 3. Render List
    const listContainer = document.getElementById('updatesList');
    if (!listContainer) return;

    listContainer.innerHTML = ''; // clear

    if (filteredData.length === 0) {
        listContainer.innerHTML = '<p class="no-data">No latest updates found at the moment.</p>';
        return;
    }

    filteredData.forEach(item => {
        // Determine button text
        let btnText = "View Details";
        if(item.type === "result") btnText = "Check Result";
        if(item.type === "admit") btnText = "Download Admit Card";
        if(item.type === "answer") btnText = "View Answer Key";

        const card = document.createElement('div');
        card.className = 'update-card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p class="status-date"><span class="badge ${item.date.includes('Available') ? 'badge-warning' : 'badge-success'}">${item.date}</span></p>
            <div class="card-actions">
                <button onclick="goToDetail(${item.id})" class="btn btn-primary">${btnText}</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
});

// Function to handle click, save ID to URL and redirect
window.goToDetail = function(id) {
    window.location.href = `detail.html?id=${id}`;
};
