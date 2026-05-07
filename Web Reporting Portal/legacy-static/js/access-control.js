import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Get the report type from URL params (e.g., form-access-control.html?report=missionary)
const urlParams = new URLSearchParams(window.location.search);
const reportType = urlParams.get('report');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Populate UI
            document.getElementById('userRoleDisplay').textContent = userData.role;
            document.getElementById('userZoneDisplay').textContent = userData.zone;
            document.getElementById('displayQuestion').textContent = userData.securityQuestion;
            document.getElementById('securityHintDisplay').textContent = userData.securityHint || 'No hint provided';

            // Verify logic
            const verifyBtn = document.getElementById('verifyAccessBtn');
            verifyBtn.addEventListener('click', () => {
                const answer = document.getElementById('securityAnswer').value;
                if (answer.toLowerCase() === userData.securityAnswer.toLowerCase()) {
                    alert('Verification Successful!');
                    // Redirect to the appropriate report page
                    const reportPages = {
                        'missionary': 'missionary-report.html',
                        'camping': 'camping-report.html',
                        'children': 'children-report.html',
                        'pilgrims': 'pilgrims-report.html',
                        'schools-youth': 'schools-youth.html'
                    };
                    
                    const destination = reportPages[reportType] || 'dashboard.html';
                    window.location.href = destination;
                } else {
                    alert('Incorrect answer. Please try again.');
                }
            });
        }
    }
});
