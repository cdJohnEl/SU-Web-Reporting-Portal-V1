import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Check if user is authenticated
onAuthStateChanged(auth, async (user) => {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['login.html', 'sign-up.html', 'otp.html'];

    if (!user) {
        if (!publicPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    } else {
        // If logged in, check if user has approved status
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.status === 'pending') {
                if (!publicPages.includes(currentPage)) {
                    window.location.href = 'login.html';
                }
            }
            
            // Admin Security: If on admin page and not admin, redirect to dashboard
            if (currentPage === 'admin-dashboard.html' && !userData.isAdmin) {
                window.location.href = 'dashboard.html';
            }

            // Inject Admin Panel link if user is admin and not already on admin page
            if (userData.isAdmin) {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && !document.getElementById('adminNavLink')) {
                    const adminLi = document.createElement('li');
                    adminLi.className = 'nav-item';
                    adminLi.id = 'adminNavLink';
                    adminLi.innerHTML = `<a href="admin-dashboard.html" style="color: #d32f2f; font-weight: bold;">Admin Panel</a>`;
                    navMenu.appendChild(adminLi);
                }
                
                // For admin-dashboard specifically
                const adminNameEl = document.getElementById('adminName');
                if (adminNameEl) adminNameEl.textContent = userData.fullName;
                const adminInitialsEl = document.getElementById('adminInitials');
                if (adminInitialsEl) {
                    const names = userData.fullName.split(' ');
                    adminInitialsEl.textContent = names.map(n => n[0]).join('').toUpperCase();
                }
            }
            
            // Populate user UI elements if they exist
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.textContent = userData.fullName;

            const userInitialsEl = document.getElementById('userInitials');
            if (userInitialsEl) {
                const names = userData.fullName.split(' ');
                userInitialsEl.textContent = names.map(n => n[0]).join('').toUpperCase();
            }

            const userRoleEl = document.getElementById('userRole');
            if (userRoleEl) userRoleEl.textContent = userData.role;

            const userZoneEl = document.getElementById('userZone');
            if (userZoneEl) userZoneEl.textContent = userData.zone;
        }
    }
});

export async function getCurrentUserData() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                resolve(userDoc.exists() ? userDoc.data() : null);
            } else {
                resolve(null);
            }
        });
    });
}
