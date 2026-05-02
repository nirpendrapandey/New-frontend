// detail.js - Handles the dynamic rendering of the detail page

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        showError("Invalid or missing Item ID.");
        return;
    }

    const itemId = parseInt(idParam, 10);
    
    // 2. Find Item in data.js
    if (typeof updatesData === 'undefined') {
        showError("Database connection failed (data.js missing).");
        return;
    }

    const item = updatesData.find(i => i.id === itemId);

    if (!item) {
        showError("Item not found. It may have been removed or updated.");
        return;
    }

    // 3. Extract info dynamically
    const isAdmit = item.type === "admit";
    const isResult = item.type === "result";
    const isAnswer = item.type === "answer";

    // Infer organization from title (naive split)
    let org = "Government Examination Board";
    if (item.title.includes("UPSC")) org = "Union Public Service Commission (UPSC)";
    else if (item.title.includes("SSC")) org = "Staff Selection Commission (SSC)";
    else if (item.title.includes("RRB")) org = "Railway Recruitment Board (RRB)";
    else if (item.title.includes("IBPS")) org = "Institute of Banking Personnel Selection (IBPS)";
    else if (item.title.includes("SBI")) org = "State Bank of India (SBI)";
    else if (item.title.includes("UP Board")) org = "Uttar Pradesh Madhyamik Shiksha Parishad";

    let state = "All India";
    if (item.title.includes("UP ") || item.title.includes("UPSSSC")) state = "Uttar Pradesh";
    else if (item.title.includes("Bihar") || item.title.includes("BPSC")) state = "Bihar";
    else if (item.title.includes("MP") || item.title.includes("MPESB")) state = "Madhya Pradesh";
    else if (item.title.includes("Rajasthan") || item.title.includes("RPSC")) state = "Rajasthan";

    // Auto generate description
    let description = `The latest update for ${item.title} has been officially announced. `;
    if (isAdmit) description += `Candidates can now download their Admit Cards using their registration number and password. Please ensure to print a hard copy and read all instructions mentioned on the admit card before visiting the exam center.`;
    else if (isResult) description += `Candidates who appeared for the examination can now check their results and cut-off marks on the official portal. Congratulations to all successful candidates.`;
    else if (isAnswer) description += `The official answer key has been released. Candidates can cross-check their responses and estimate their scores. If any discrepancies are found, objections can generally be raised within the stipulated time frame on the official website.`;

    let pageTypeLabel = "Updates";
    let btnText = "Visit Official Website";
    if (isAdmit) { pageTypeLabel = "Admit Card"; btnText = "Download Admit Card"; }
    if (isResult) { pageTypeLabel = "Result"; btnText = "Check Result"; }
    if (isAnswer) { pageTypeLabel = "Answer Key"; btnText = "View Answer Key"; }

    // 4. Update DOM Elements
    document.title = `${item.title} - Sarkari Updates`;
    
    document.getElementById('breadcrumbType').textContent = pageTypeLabel;
    document.getElementById('breadcrumbType').href = `${item.type}.html`;
    document.getElementById('breadcrumbTitle').textContent = item.title;

    document.getElementById('pageTitle').textContent = item.title;
    document.getElementById('orgName').textContent = org;
    document.getElementById('stateName').textContent = state;
    document.getElementById('examDate').textContent = item.date; // reusing date field for status
    document.getElementById('descriptionText').textContent = description;

    // Status Badge
    const badge = document.getElementById('statusBadge');
    badge.textContent = item.date;
    if (item.date.toLowerCase().includes("released") || item.date.toLowerCase().includes("declared")) {
        badge.className = "status-badge status-success";
    } else {
        badge.className = "status-badge status-warning";
    }

    // Buttons
    const actionBtn = document.getElementById('mainActionBtn');
    actionBtn.textContent = btnText;
    actionBtn.href = item.link;

    document.getElementById('officialLink').href = item.link;
});

function showError(msg) {
    document.getElementById('pageTitle').textContent = "Error";
    document.getElementById('descriptionText').textContent = msg;
    document.getElementById('statusBadge').style.display = 'none';
    document.querySelector('.info-grid').style.display = 'none';
    document.querySelector('.actions').style.display = 'none';
    document.querySelector('.important-links').style.display = 'none';
}

async function sharePage() {
    const title = document.getElementById('pageTitle').textContent;
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: `Check out ${title} update on SarkariNext!`,
                url: window.location.href,
            });
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    }
}
