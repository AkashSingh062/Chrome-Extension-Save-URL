let myLeads = JSON.parse(localStorage.getItem("myLeads")) || [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tabBtn");
const outputEl = document.querySelector("#ul-el");

function renderLeads() {
    let HTML = '';
    myLeads.forEach((leads) => {
        HTML += `<li><a href="${leads}" target="_blank">${leads}</a> <button class="del del-js">Delete</button></li>`;
    });
    outputEl.innerHTML = HTML;
    
    // Delete button logic
    const delBtn = document.querySelectorAll(".del-js");
    delBtn.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            myLeads.splice(idx, 1);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            renderLeads();
        });
    });
}

function clearErrorMessage() {
    if (inputEl.value === 'Please enter a valid URL') {
        inputEl.value = '';
    }
}

function addLead(value) {
    if (!value.trim() || value === 'Please enter a valid URL') return;
    
    try {
        new URL(value);
        myLeads.push(value);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        inputEl.value = '';
        renderLeads();
    } catch {
        inputEl.value = 'Please enter a valid URL';
    }
}

// Tab save functionality
tabBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (!tabs?.[0]?.url || tabs[0].url.startsWith('chrome://')) {
            inputEl.value = 'Cannot save this type of tab';
            return;
        }
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        renderLeads();
    });
});


// Input field event listeners
['click', 'focus', 'input'].forEach(event => {
    inputEl.addEventListener(event, clearErrorMessage);
});

// Button click handler
inputBtn.addEventListener('click', () => {
    addLead(inputEl.value);
});

// Enter key handler
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        clearErrorMessage();
        addLead(inputEl.value);
    }
});

// Initial render
renderLeads();
