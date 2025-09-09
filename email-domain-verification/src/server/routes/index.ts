import { Hono } from 'hono';
import { emailRoutes } from './emailRoutes';
import { verificationRoutes } from './verificationRoutes';

export const routes = new Hono();

// Mount the API routes
routes.route('/submit-email', emailRoutes);
routes.route('/verify', verificationRoutes);

routes.get('/', (c) =>
  c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EduVerify - .edu Email Verification</title>
        <style>
            :root {
                --primary-color: #764ba2 10%;
                --secondary-color: #966cbfff 20% ;
                --success-color: #49a8d1ff;
                --error-color: #d13179ff;
                --warning-color: #fca311;
                --background-color: #f8f9fa;
                --card-background: #ffffff;
                --text-color: #2b2d42;
                --text-light: #6c757d;
                --border-radius: 12px;
                --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                --transition: all 0.3s ease;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 60%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .container {
                background: var(--card-background);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                padding: 2rem;
                width: 100%;
                max-width: 400px;
                text-align: center;
            }

            .logo {
                width: 80px;
                height: 80px;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: white;
                font-weight: bold;
            }

            h1 {
                color: var(--text-color);
                margin-bottom: 0.5rem;
                font-size: 1.8rem;
            }

            .subtitle {
                color: var(--text-light);
                margin-bottom: 2rem;
                font-size: 0.9rem;
            }

            .button-group {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .btn {
                flex: 1;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: var(--border-radius);
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
                font-size: 0.9rem;
            }

            .btn-primary {
                background: var(--primary-color);
                color: white;
            }

            .btn-primary:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
            }

            .btn-outline {
                background: transparent;
                border: 2px solid var(--primary-color);
                color: var(--primary-color);
            }

            .btn-outline:hover {
                background: var(--primary-color);
                color: white;
                transform: translateY(-2px);
            }

            .form-container {
                text-align: left;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--text-color);
                font-weight: 600;
            }

            input {
                width: 100%;
                padding: 0.8rem;
                border: 2px solid #e9ecef;
                border-radius: var(--border-radius);
                font-size: 1rem;
                transition: var(--transition);
            }

            input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
            }

            .btn-submit {
                width: 100%;
                padding: 1rem;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: var(--border-radius);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
            }

            .btn-submit:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
            }

            .btn-submit:disabled {
                background: var(--text-light);
                cursor: not-allowed;
                transform: none;
            }

            .response {
                margin-top: 1rem;
                padding: 1rem;
                border-radius: var(--border-radius);
                text-align: center;
                font-weight: 500;
                display: none;
            }

            .response.success {
                background: rgba(76, 201, 240, 0.1);
                color: var(--success-color);
                border: 1px solid var(--success-color);
                display: block;
            }

            .response.error {
                background: rgba(247, 37, 133, 0.1);
                color: var(--error-color);
                border: 1px solid var(--error-color);
                display: block;
            }

            .response.warning {
                background: rgba(252, 163, 17, 0.1);
                color: var(--warning-color);
                border: 1px solid var(--warning-color);
                display: block;
            }

            .loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255,255,255,.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
                margin-right: 10px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .back-button {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                font-size: 0.9rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .back-button:hover {
                color: var(--primary-color);
            }

            .resend-link {
                color: var(--primary-color);
                text-decoration: none;
                font-size: 0.9rem;
                cursor: pointer;
                display: inline-block;
                margin-top: 1rem;
            }

            .resend-link:hover {
                text-decoration: underline;
            }

            .timer {
                font-size: 0.8rem;
                color: var(--text-light);
                margin-top: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Edu</div>
            <h1>EduVerify</h1>
            <p class="subtitle">Verify your email address</p>

            <div id="main-buttons" class="button-group">
                <button class="btn btn-primary" onclick="showSignup()">Sign Up</button>
                <button class="btn btn-outline" onclick="showSignin()">Sign In</button>
            </div>

            <div id="form-container" class="form-container"></div>
        </div>

        <script>
            let currentForm = '';
            let resendTimer = null;
            let canResend = true;

            function showSignup() {
                currentForm = 'signup';
                document.getElementById('main-buttons').style.display = 'none';
                document.getElementById('form-container').innerHTML = \`
                    <button class="back-button" onclick="showMainMenu()">← Back</button>
                    <h2 style="margin-bottom: 1.5rem; color: var(--text-color);">Create Account</h2>
                    <div class="form-group">
                        <label for="signup-email"> edu Email Address</label>
                        <input 
                            type="email" 
                            id="signup-email" 
                            placeholder="Enter your edu email" 
                            onkeypress="if(event.key === 'Enter') submitEmail()"
                        />
                    </div>
                    <button class="btn-submit" onclick="submitEmail()" id="signup-submit">
                        Send Verification Code
                    </button>
                    <div id="signup-response" class="response"></div>
                \`;
                document.getElementById('form-container').classList.add('fade-in');
            }

            function showSignin() {
                currentForm = 'signin';
                document.getElementById('main-buttons').style.display = 'none';
                document.getElementById('form-container').innerHTML = \`
                    <button class="back-button" onclick="showMainMenu()">← Back</button>
                    <h2 style="margin-bottom: 1.5rem; color: var(--text-color);">Sign In</h2>
                    <div class="form-group">
                        <label for="signin-email">.edu Email Address</label>
                        <input 
                            type="email" 
                            id="signin-email" 
                            placeholder="Enter your edu email"
                            onkeypress="if(event.key === 'Enter') verifyCode()"
                        />
                    </div>
                    <div class="form-group">
                        <label for="signin-code">Verification Code</label>
                        <input 
                            type="text" 
                            id="signin-code" 
                            placeholder="Enter 6-digit code" 
                            maxlength="6"
                            onkeypress="if(event.key === 'Enter') verifyCode()"
                        />
                    </div>
                    <button class="btn-submit" onclick="verifyCode()" id="signin-submit">
                        Verify Code
                    </button>
                    <div id="signin-response" class="response"></div>
                    <a class="resend-link" onclick="resendCode()" id="resend-link" style="display: none;">
                        Resend code
                    </a>
                    <div class="timer" id="resend-timer"></div>
                \`;
                document.getElementById('form-container').classList.add('fade-in');
            }

            function showMainMenu() {
                currentForm = '';
                document.getElementById('main-buttons').style.display = 'flex';
                document.getElementById('form-container').innerHTML = '';
                clearTimeout(resendTimer);
            }

            function showResponse(elementId, message, type) {
                const responseEl = document.getElementById(elementId);
                responseEl.textContent = message;
                responseEl.className = \`response \${type}\`;
                responseEl.style.display = 'block';
                
                // Auto-hide success messages after 5 seconds
                if (type === 'success') {
                    setTimeout(() => {
                        responseEl.style.display = 'none';
                    }, 5000);
                }
            }

            function setLoading(buttonId, isLoading) {
                const button = document.getElementById(buttonId);
                if (isLoading) {
                    button.innerHTML = '<span class="loading"></span> Processing...';
                    button.disabled = true;
                } else {
                    if (buttonId === 'signup-submit') {
                        button.textContent = 'Send Verification Code';
                    } else {
                        button.textContent = 'Verify Code';
                    }
                    button.disabled = false;
                }
            }

            function startResendTimer() {
                let timeLeft = 60;
                const timerEl = document.getElementById('resend-timer');
                const resendLink = document.getElementById('resend-link');
                
                resendLink.style.display = 'none';
                timerEl.style.display = 'block';
                canResend = false;

                const updateTimer = () => {
                    timerEl.textContent = \`Resend available in \${timeLeft} seconds\`;
                    timeLeft--;

                    if (timeLeft < 0) {
                        timerEl.style.display = 'none';
                        resendLink.style.display = 'inline-block';
                        canResend = true;
                        clearInterval(resendTimer);
                    }
                };

                updateTimer();
                resendTimer = setInterval(updateTimer, 1000);
            }

            async function resendCode() {
                if (!canResend) return;

                const email = document.getElementById('signin-email').value;
                if (!email) {
                    showResponse('signin-response', 'Please enter your email first', 'error');
                    return;
                }

                setLoading('signin-submit', true);
                try {
                    const res = await fetch('/submit-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await res.json();
                    
                    if (data.ok) {
                        showResponse('signin-response', 'New verification code sent!', 'success');
                        startResendTimer();
                    } else {
                        showResponse('signin-response', 'Error: ' + data.error, 'error');
                    }
                } catch (error) {
                    showResponse('signin-response', 'Network error. Please try again.', 'error');
                }
                setLoading('signin-submit', false);
            }

            async function submitEmail() {
                const email = document.getElementById('signup-email').value;
                const responseEl = document.getElementById('signup-response');
                
                if (!email) {
                    showResponse('signup-response', 'Please enter your email', 'error');
                    return;
                }

                if (!email.toLowerCase().includes('.edu')) {
                    showResponse('signup-response', 'Please use a valid .edu email address', 'error');
                    return;
                }

                setLoading('signup-submit', true);
                try {
                    const res = await fetch('/submit-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await res.json();
                    
                    if (data.ok) {
                        showResponse('signup-response', '✓ Verification code sent to your email!', 'success');
                        // Auto-switch to signin after successful submission
                        setTimeout(() => showSignin(), 2000);
                    } else {
                        showResponse('signup-response', data.error, 'error');
                    }
                } catch (error) {
                    showResponse('signup-response', 'Network error. Please try again.', 'error');
                }
                setLoading('signup-submit', false);
            }

            async function verifyCode() {
                const email = document.getElementById('signin-email').value;
                const code = document.getElementById('signin-code').value;
                const responseEl = document.getElementById('signin-response');
                
                if (!email) {
                    showResponse('signin-response', 'Please enter your email', 'error');
                    return;
                }

                if (!code || code.length !== 6) {
                    showResponse('signin-response', 'Please enter a valid 6-digit code', 'error');
                    return;
                }

                setLoading('signin-submit', true);
                try {
                    const res = await fetch('/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, code })
                    });
                    const data = await res.json();
                    
                    if (data.ok) {
                        showResponse('signin-response', '✓ Email verified successfully! Redirecting...', 'success');
                        // Simulate redirect
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        showResponse('signin-response', data.error, 'error');
                    }
                } catch (error) {
                    showResponse('signin-response', 'Network error. Please try again.', 'error');
                }
                setLoading('signin-submit', false);
            }

            // Add input validation
            document.addEventListener('DOMContentLoaded', function() {
                document.addEventListener('input', function(e) {
                    if (e.target.id === 'signin-code') {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }
                });
            });
        </script>
    </body>
    </html>
  `)
);