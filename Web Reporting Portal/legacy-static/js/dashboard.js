import { auth, db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    limit, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await loadDashboardStats(user);
        await loadRecentSubmissions(user);
        setupSearch();
        setupLogout();
    }
});

function setupLogout() {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'action-btn outline';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.marginTop = '10px';
    logoutBtn.onclick = () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        });
    };
    document.querySelector('.action-panel').appendChild(logoutBtn);
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.classic-table tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    });
}

async function loadDashboardStats(user) {
    // In a real app, you'd aggregate these. For now, placeholders for stats that would come from DB
    // e.g., count reports in 'reports' collection for this user or zone
}

async function loadRecentSubmissions(user) {
    const submissionsTable = document.querySelector('.classic-table tbody');
    if (!submissionsTable) return;

    try {
        const q = query(
            collection(db, "reports"), 
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            submissionsTable.innerHTML = '<tr><td colspan="4" style="text-align:center;">No recent submissions found.</td></tr>';
            return;
        }

        submissionsTable.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Pending...';
            const row = `
                <tr>
                    <td>${data.reportType}</td>
                    <td>${data.zone}</td>
                    <td>${date}</td>
                    <td><span class="badge badge-${data.status === 'Approved' ? 'green' : 'yellow'}">${data.status}</span></td>
                </tr>
            `;
            submissionsTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading submissions:", error);
    }
}
