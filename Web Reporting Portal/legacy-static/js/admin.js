import { auth, db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    updateDoc,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

async function loadUsers() {
    const pendingBody = document.getElementById('pendingUsersBody');
    const approvedBody = document.getElementById('approvedUsersBody');
    
    if (!pendingBody || !approvedBody) return;

    pendingBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    approvedBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        pendingBody.innerHTML = '';
        approvedBody.innerHTML = '';

        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const userId = docSnap.id;

            if (userData.status === 'pending') {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${userData.fullName}</td>
                    <td>${userData.zone}</td>
                    <td>${userData.role}</td>
                    <td>${userData.email}</td>
                    <td>
                        <button class="btn-sm-green approve-btn" data-id="${userId}">Approve</button>
                    </td>
                `;
                pendingBody.appendChild(tr);
            } else {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${userData.fullName}</td>
                    <td>${userData.zone}</td>
                    <td>${userData.role}</td>
                    <td><span class="badge badge-green">${userData.status}</span></td>
                `;
                approvedBody.appendChild(tr);
            }
        });

        // Add event listeners to approve buttons
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const uid = e.target.getAttribute('data-id');
                btn.disabled = true;
                btn.textContent = 'Updating...';
                try {
                    await updateDoc(doc(db, "users", uid), {
                        status: 'approved'
                    });
                    alert('User approved successfully!');
                    loadUsers();
                } catch (error) {
                    console.error("Approval failed:", error);
                    alert('Failed to approve user: ' + error.message);
                }
            };
        });

    } catch (error) {
        console.error("Error loading users:", error);
        pendingBody.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Verify Admin status here if needed
        loadUsers();
    }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        });
    };
}
