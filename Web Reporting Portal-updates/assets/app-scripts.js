/* =========================================================================
   SCRIPTURE UNION NIGERIA (ELEME AREA) - ENTERPRISE WORKSPACE PORTAL CORE
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    checkSecurityGuard();
    initLoginForm();
    initLoginChallengeForm();
    initContextSelection();
    initAccessControl();
    initDynamicTables();
    initSmartMemory();
});

/* -------------------------------------------------------------------------
   SMART ROUTING HELPER (Detects Folder Depth Automatically)
------------------------------------------------------------------------- */
function getRootPath() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/ministry/')) {
        return "../../"; // Two folders deep
    } else if (path.includes('/operational/')) {
        return "../"; // One folder deep
    }
    return ""; // Already in root
}

/* -------------------------------------------------------------------------
   1. GLOBAL UI LAYOUT CONTROL
------------------------------------------------------------------------- */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.querySelector('body');
    if (sidebar) {
        sidebar.classList.toggle('active');
        body.classList.toggle('sidebar-open');
    }
}

/* -------------------------------------------------------------------------
   2. TWO-PHASE SECURITY VALIDATION SUBSYSTEM
------------------------------------------------------------------------- */
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const emailInput = document.getElementById('login-email').value;
        let assignedRole = "Zonal Rep";
        let assignedZone = "Gokana";
        let defaultName = "Bro. Amenya";

        if (emailInput.includes('coordinator') || emailInput.includes('schools')) {
            assignedRole = "Zonal Schools Coordinator";
            assignedZone = "Nchia";
            defaultName = "Bro. Samuel Okoro";
        } else if (emailInput.includes('missionary') || emailInput.includes('psv')) {
            assignedRole = "Missionary";
            assignedZone = "Nchia";
            defaultName = "Richard";
        } else if (emailInput.includes('secretary')) {
            assignedRole = "Travelling Secretary";
            assignedZone = "Area Headquarters";
            defaultName = "God-First";
        }

        const preAuthUser = {
            name: defaultName,
            office: assignedRole,
            zone: assignedZone,
            email: emailInput,
            isAuthenticatedStep1: true,
            isAuthenticatedStep2: false
        };

        sessionStorage.setItem('preAuthUserData', JSON.stringify(preAuthUser));
        window.location.href = getRootPath() + "security-login-verify.html";
    });
}

function initLoginChallengeForm() {
    const challengeForm = document.getElementById('login-challenge-form');
    if (!challengeForm) return;

    const preAuthData = JSON.parse(sessionStorage.getItem('preAuthUserData'));
    if (!preAuthData) {
        window.location.href = getRootPath() + "index.html";
        return;
    }

    const displayTag = document.getElementById('verify-user-display');
    if (displayTag) displayTag.innerText = `${preAuthData.name} (${preAuthData.office})`;

    challengeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const answerField = document.getElementById('loginSecretAnswer');
        const answer = answerField.value.trim().toLowerCase();

        if (answer === 'mercy') {
            preAuthData.isAuthenticatedStep2 = true;
            sessionStorage.setItem('activeUser', JSON.stringify(preAuthData));
            sessionStorage.removeItem('preAuthUserData');
            window.location.href = getRootPath() + "dashboard.html";
        } else {
            answerField.style.borderColor = '#d32f2f';
            alert("Security verification failed.");
            answerField.value = '';
        }
    });
}

/* -------------------------------------------------------------------------
   3. DESKTOP/MOBILE ACCESS CONTROL GUARD
------------------------------------------------------------------------- */
function checkSecurityGuard() {
    const path = window.location.pathname.toLowerCase();
    
    const isProtectedRoute = path.includes('dashboard.html') || 
                             path.includes('report-context-selection.html') || 
                             path.includes('form-access-control.html') || 
                             path.includes('-report.html') || 
                             path.includes('schools-youth.html') || 
                             path.includes('-meetings.html') || 
                             path.includes('-outreaches.html');

    if (isProtectedRoute) {
        const currentUser = sessionStorage.getItem('activeUser');
        if (!currentUser) {
            window.location.href = getRootPath() + "index.html";
        }
    }
}

function handleLogout() {
    sessionStorage.clear();
    window.location.href = getRootPath() + "index.html";
}

/* -------------------------------------------------------------------------
   4. DATA DESTINATION MAPPING
------------------------------------------------------------------------- */
function initContextSelection() {
    const contextForm = document.getElementById('context-selection-form');
    if (!contextForm) return;

    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('report') || 'zonal-progress';

    const reportNames = {
        'primary-visitation': 'Children Ministry: Primary School Visitation',
        'children-rally': 'Children Ministry: Zonal Rally',
        'children-camp': 'Children Ministry: Long Vacation Camp',
        'children-day': 'Children Ministry: National Children\'s Day',
        'christmas-party': 'Children Ministry: Christmas Party Outreach',
        'neighbourhood-bible-club': 'Children Ministry: Neighbourhood Bible Club',
        'children-week-emphasis': 'Children Ministry: Week of Emphasis',
        'missionary-monthly': 'Permanent Schools\' Visitors & Missionary Monthly Form',
        'zonal-progress': 'Zonal Progress General Summary Report',
        'schools-termly': 'Zonal Termly Report: Schools Department',
        'family-week': 'Pilgrims Ministry: National Family Week Report',
        'week-sacrifice': 'Pilgrims Ministry: National Week of Sacrifice Report',
        'easter-conference': 'Pilgrims Ministry: Easter Pilgrims Conference Report',
        'prayer-gift-day': 'Pilgrims Ministry: Prayer and Gift Day Registry Log',
        'mission-week-outreach': 'Pilgrims Ministry: Mission Week and Outreaches Report',
        'ltd-training': 'Schools & Youth: Student Leadership Training Day (LTD)',
        'ltc-camp': 'Schools & Youth: Student Leadership Training Camp (LTC)',
        'student-slvc': 'Schools & Youth: Student Long Vacation Camp Portfolio',
        'student-rally-info': 'Schools & Youth: Zonal Student Rally Statistics',
        'valentines-prog': 'Schools & Youth: Valentine Program Outreach',
        'aids-for-life': 'Schools & Youth: Aids for Life Week of Emphasis',
        'youth-summit': 'Schools & Youth: Youth Empowerment Summit Camp'
    };

    const currentUser = JSON.parse(sessionStorage.getItem('activeUser')) || { name: "Guest User", office: "Unassigned", zone: "Nchia" };

    const reportField = document.getElementById('context-report-type');
    const reporterField = document.getElementById('context-reporter');

    if (reportField) reportField.value = reportNames[reportId] || reportNames['zonal-progress'];
    if (reporterField) reporterField.value = `${currentUser.name} (${currentUser.office})`;

    if (currentUser.zone && currentUser.zone !== "Area Headquarters") {
        const zoneSelect = document.getElementById('zoneSelect');
        if (zoneSelect) zoneSelect.value = currentUser.zone;
    }

    contextForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sessionStorage.setItem('activeReportContext', JSON.stringify({
            reportName: document.getElementById('context-report-type').value,
            zone: document.getElementById('zoneSelect').value,
            group: document.getElementById('groupSelect').value,
            year: document.getElementById('context-year').value,
            period: document.getElementById('context-period').value,
            targetId: reportId
        }));
        window.location.href = "form-access-control.html";
    });
}

/* -------------------------------------------------------------------------
   5. ACCESS CHALLENGE ROUTER (Updated with all subfolder paths)
------------------------------------------------------------------------- */
function initAccessControl() {
    const reportNameSpan = document.getElementById('dynamic-report-name');
    if (!reportNameSpan) return;

    const currentUser = JSON.parse(sessionStorage.getItem('activeUser'));
    const reportContext = JSON.parse(sessionStorage.getItem('activeReportContext'));

    if (!currentUser || !reportContext) {
        window.location.href = 'dashboard.html';
        return;
    }

    reportNameSpan.innerText = reportContext.reportName;
    const roleField = document.getElementById('dynamic-role');
    const zoneField = document.getElementById('dynamic-zone');
    
    if (roleField) roleField.innerText = currentUser.office;
    if (zoneField) zoneField.innerText = `${reportContext.zone} (Group: ${reportContext.group})`;
}

function verifyAndProceed() {
    const answerInput = document.getElementById('securityAnswer');
    if (!answerInput) return;

    if (answerInput.value.trim().toLowerCase() === 'mercy') {
        const reportContext = JSON.parse(sessionStorage.getItem('activeReportContext'));
        
        // Fully updated directory routing map
        const pageRoutes = {
            'missionary-monthly': 'operational/missionary-report.html',
            'zonal-progress': 'operational/zonal-report.html',
            'schools-termly': 'operational/termly-schools-report.html',
            'children-day': 'ministry/children/children-day-report.html',
            'family-week': 'ministry/pilgrims/family-week-report.html',
            'valentines-prog': 'ministry/schools/valentine-report.html',
            'aids-for-life': 'ministry/schools/aids-for-life-report.html',
            'ltd-training': 'ministry/schools/leadership-training-report.html',
            'student-rally-info': 'ministry/schools/student-rally-report.html'
        };

        // Fallbacks back to the main dashboard if a specific form isn't built yet
        const destinationPage = pageRoutes[reportContext.targetId] || 'dashboard.html';
        window.location.href = destinationPage;
    } else {
        answerInput.style.borderColor = '#d32f2f';
        alert("Verification failed.");
        answerInput.value = '';
    }
}

/* -------------------------------------------------------------------------
   6. AUTOCOMPLETE DATASET ENGINE
------------------------------------------------------------------------- */
function initSmartMemory() {
    const memoryInputs = document.querySelectorAll('.memory-input');
    memoryInputs.forEach(input => {
        const category = input.getAttribute('data-category');
        const listId = input.getAttribute('list');
        const datalist = document.getElementById(listId);
        
        if (category && datalist) {
            let savedItems = JSON.parse(localStorage.getItem(`su_memory_${category}`)) || [];
            datalist.innerHTML = '';
            savedItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                datalist.appendChild(option);
            });
        }
    });

    memoryInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const val = this.value.trim();
            const category = this.getAttribute('data-category');
            if (val !== '' && category) {
                let savedItems = JSON.parse(localStorage.getItem(`su_memory_${category}`)) || [];
                if (!savedItems.includes(val)) {
                    savedItems.push(val);
                    localStorage.setItem(`su_memory_${category}`, JSON.stringify(savedItems));
                    const datalist = document.getElementById(this.getAttribute('list'));
                    if (datalist) {
                        const option = document.createElement('option');
                        option.value = val;
                        datalist.appendChild(option);
                    }
                }
            }
        });
    });
}

/* -------------------------------------------------------------------------
   7. DYNAMIC TABLES & CALCULATIONS
------------------------------------------------------------------------- */
function addRow(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const tbody = table.getElementsByTagName('tbody')[0];
    const newRow = tbody.insertRow();
    newRow.innerHTML = tbody.rows[0].innerHTML;
    newRow.querySelectorAll('input, textarea').forEach(input => {
        if (input.type === 'checkbox') input.checked = false;
        else input.value = '';
    });
}

function initDynamicTables() {
    document.querySelectorAll('.btn-add-row:not([onclick])').forEach(button => {
        button.addEventListener('click', function(e) {
            const tableBody = e.target.previousElementSibling.querySelector('tbody');
            if (!tableBody) return;
            const newRow = tableBody.insertRow();
            newRow.innerHTML = tableBody.rows[0].innerHTML;
            newRow.querySelectorAll('input').forEach(input => input.value = '');
        });
    });
}

function calculateGridTotals(inputElement) {
    const targetRow = inputElement.closest('tr');
    if (!targetRow) return;
    const maleCountInput = targetRow.querySelector('.parts-m');
    const femaleCountInput = targetRow.querySelector('.parts-f');
    const displayTotalField = targetRow.querySelector('.row-total');

    if (maleCountInput && femaleCountInput && displayTotalField) {
        displayTotalField.value = (parseInt(maleCountInput.value) || 0) + (parseInt(femaleCountInput.value) || 0);
    }
}