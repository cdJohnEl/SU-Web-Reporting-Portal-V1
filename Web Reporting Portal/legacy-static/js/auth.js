import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Handle Sign Up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullName = document.getElementById('fullName').value;
        const gender = document.getElementById('gender').value;
        const zone = document.getElementById('zone').value;
        const role = document.getElementById('role').value;
        const phone = document.getElementById('phoneNumber').value;
        const securityQuestion = document.getElementById('securityQuestion').value;
        const securityAnswer = document.getElementById('securityAnswer').value;
        const securityHint = document.getElementById('securityHint').value;
        const reason = document.getElementById('reason').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName,
                gender,
                zone,
                role,
                phone,
                email,
                securityQuestion,
                securityAnswer, // In a real app, hash this
                securityHint,
                reason,
                status: 'pending', // Registration is subject to Admin approval
                createdAt: serverTimestamp()
            });

            alert('Registration successful! Please wait for Admin approval.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Error during registration:", error);
            alert('Registration failed: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
        }
    });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Verifying...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user status from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.status === 'pending') {
                    // Sign out and alert
                    await signOut(auth);
                    alert('Your account is still pending approval by an Admin.');
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Login to Portal';
                    return;
                }
                
                // If the user objective mentions OTP, we should send it here or redirect to OTP
                // Since I don't have a real SMS service, I'll simulate by redirecting to otp.html
                // and maybe logging the code to console or saving to Firestore for demo.
                
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                // Store OTP temporarily for verification (In a real app, use a safer method)
                await setDoc(doc(db, "temp_otp", user.uid), {
                    otp: otp,
                    timestamp: serverTimestamp()
                });
                
                console.log("DEMO OTP for testing:", otp);
                alert('OTP sent to your phone number: ' + userData.phone + '\n(Check console for demo OTP)');
                window.location.href = 'otp.html';
            } else {
                alert('User data not found.');
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert('Login failed: ' + error.message);
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login to Portal';
        }
    });
}

// Handle OTP Verification
const otpBoxes = document.querySelectorAll('.otp-box');
const otpForm = document.getElementById('otpForm');
if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const verifyBtn = document.getElementById('verifyBtn');
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Verifying...';

        let enteredOtp = '';
        otpBoxes.forEach(box => enteredOtp += box.value);

        if (enteredOtp.length !== 6) {
            alert('Please enter a 6-digit OTP');
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify & Proceed';
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const otpDoc = await getDoc(doc(db, "temp_otp", user.uid));
                if (otpDoc.exists()) {
                    const storedOtp = otpDoc.data().otp;
                    if (enteredOtp === storedOtp) {
                        alert('OTP Verified!');
                        window.location.href = 'dashboard.html';
                    } else {
                        alert('Invalid OTP. Please try again.');
                    }
                } else {
                    alert('OTP expired or not found. Please log in again.');
                    window.location.href = 'login.html';
                }
            } else {
                window.location.href = 'login.html';
            }
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify & Proceed';
        });
    });
}

// OTP Auto-focus logic
if (otpBoxes.length > 0) {
    otpBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpBoxes[index - 1].focus();
            }
        });
    });
}
