import { auth, db } from './firebase-config.js';
import { 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp,
    collection,
    addDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Utility to get all field data
function getFormData() {
    const data = {};
    // Month and Zone
    data.month = document.querySelector('input[type="month"]').value;
    data.zone = document.querySelector('.dash-select-sm').value;

    // Table A: Statistics of Schools
    data.tableA = Array.from(document.querySelectorAll('#table-a tbody tr')).map(tr => {
        const inputs = tr.querySelectorAll('input');
        return {
            name: inputs[0].value,
            male: inputs[1].value,
            female: inputs[2].value,
            total: inputs[3].value,
            time: inputs[4].value
        };
    });

    // Table C: Neighbourhood Bible Club
    data.tableC = Array.from(document.querySelectorAll('#table-c tbody tr')).map(tr => {
        const inputs = tr.querySelectorAll('input');
        return {
            date: inputs[0].value,
            location: inputs[1].value,
            activity: inputs[2].value,
            attendance: inputs[3].value,
            achievement: inputs[4].value,
            spent: inputs[5].value
        };
    });

    // Table D: Secondary School Visitation Weekly Analysis
    data.tableD = Array.from(document.querySelectorAll('#table-d tbody tr')).map(tr => {
        const inputs = tr.querySelectorAll('input');
        const checkboxes = tr.querySelectorAll('input[type="checkbox"]');
        return {
            schoolName: inputs[0].value,
            w1: checkboxes[0].checked,
            w2: checkboxes[1].checked,
            w3: checkboxes[2].checked,
            w4: checkboxes[3].checked,
            w5: checkboxes[4].checked,
            total: inputs[1].value,
            remark: inputs[2].value
        };
    });

    // Table E: Primary School Visitation Weekly Analysis
    data.tableE = Array.from(document.querySelectorAll('#table-e tbody tr')).map(tr => {
        const inputs = tr.querySelectorAll('input');
        const checkboxes = tr.querySelectorAll('input[type="checkbox"]');
        return {
            schoolName: inputs[0].value,
            w1: checkboxes[0].checked,
            w2: checkboxes[1].checked,
            w3: checkboxes[2].checked,
            w4: checkboxes[3].checked,
            w5: checkboxes[4].checked,
            remark: inputs[1].value
        };
    });

    // Table G: Major School/Youth Programmes
    data.tableG = Array.from(document.querySelectorAll('#table-g tbody tr')).map(tr => {
        const inputs = tr.querySelectorAll('input');
        return {
            date: inputs[0].value,
            title: inputs[1].value,
            venue: inputs[2].value,
            spent: inputs[3].value,
            pilgrims: inputs[4].value,
            students: inputs[5].value,
            teachers: inputs[6].value
        };
    });

    // Table H: New School Groups
    data.tableH = Array.from(document.querySelectorAll('#table-i tbody tr')).map(tr => {
        const inputs = tr.querySelectorAll('input');
        return {
            schoolName: inputs[0].value,
            location: inputs[1].value,
            contact: inputs[2].value,
            phone: inputs[3].value
        };
    });

    // Summary Analysis
    data.summary = {};
    const summaryInputs = document.querySelectorAll('.stats-input-grid input');
    if (summaryInputs.length >= 7) {
        data.summary.totalSec = summaryInputs[0].value;
        data.summary.totalPri = summaryInputs[1].value;
        data.summary.totalVisits = summaryInputs[2].value;
        data.summary.totalVisitor = summaryInputs[3].value;
        data.summary.totalDevotion = summaryInputs[4].value;
        data.summary.totalBibleClub = summaryInputs[5].value;
        data.summary.grandTotalSchools = summaryInputs[6].value;
    }

    const newGroupsInput = document.querySelector('#table-i').parentElement.querySelector('input[type="number"]');
    if (newGroupsInput) data.summary.totalNewGroups = newGroupsInput.value;

    // Publications
    data.publications = {
        dailyGuide: document.querySelectorAll('.pub-item input')[0]?.value,
        dailyPower: document.querySelectorAll('.pub-item input')[1]?.value,
        search: document.querySelectorAll('.pub-item input')[2]?.value
    };

    // Challenges/Recs
    const textareas = document.querySelectorAll('.dash-textarea');
    if (textareas.length >= 3) {
        data.challenges = textareas[0].value;
        data.recommendations = textareas[1].value;
        data.prayerRequests = textareas[2].value;
    }

    return data;
}

// Populate form from data
function populateForm(data) {
    if (!data) return;
    if (data.month) document.querySelector('input[type="month"]').value = data.month;
    if (data.zone) document.querySelector('.dash-select-sm').value = data.zone;

    // Handle tables (this would require clearing and recreating rows)
    // ...
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const reportId = `missionary_draft_${user.uid}`;
        
        // Load Draft
        const draftDoc = await getDoc(doc(db, "drafts", reportId));
        if (draftDoc.exists()) {
            populateForm(draftDoc.data());
        }

        // Save Draft
        const saveBtn = document.getElementById('saveDraftBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';
                try {
                    const data = getFormData();
                    await setDoc(doc(db, "drafts", reportId), {
                        ...data,
                        userId: user.uid,
                        lastSaved: serverTimestamp()
                    });
                    alert('Draft saved successfully!');
                } catch (error) {
                    console.error("Save failed:", error);
                    alert('Save failed: ' + error.message);
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Save Draft Progress';
                }
            });
        }

        // Submit Report
        const submitBtn = document.getElementById('submitReportBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                if (!confirm('Are you sure you want to submit this report? It will be sent for review.')) return;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
                try {
                    const data = getFormData();
                    await addDoc(collection(db, "reports"), {
                        ...data,
                        userId: user.uid,
                        reportType: 'Missionary Monthly Report',
                        status: 'Pending',
                        createdAt: serverTimestamp()
                    });
                    // Clear draft after successful submission
                    // await deleteDoc(doc(db, "drafts", reportId));
                    alert('Report submitted successfully!');
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    console.error("Submission failed:", error);
                    alert('Submission failed: ' + error.message);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Official Monthly Report';
                }
            });
        }
    }
});
