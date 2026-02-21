<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico">
    <link href="${url.resourcesPath}/css/styles.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <div class="page-background"></div>
    <div class="login-container">
        <div class="login-box">
            <div class="left-panel">
                <div class="tech-grid"></div>
                <div class="tech-particles">
                    <div class="particle" style="top:20%; left:10%; animation-delay:0s;"></div>
                    <div class="particle" style="top:40%; left:25%; animation-delay:1s;"></div>
                    <div class="particle" style="top:60%; left:15%; animation-delay:2s;"></div>
                    <div class="particle" style="top:30%; left:40%; animation-delay:0.5s;"></div>
                    <div class="particle" style="top:70%; left:35%; animation-delay:1.5s;"></div>
                    <div class="particle" style="top:50%; left:50%; animation-delay:2.5s;"></div>
                    <div class="particle" style="top:25%; left:60%; animation-delay:3s;"></div>
                    <div class="particle" style="top:80%; left:55%; animation-delay:0.8s;"></div>
                </div>

                <div class="logo-container">
                    <img src="${url.resourcesPath}/img/tma-logo.png" alt="TMA Logo" class="logo-image">
                </div>

                <div class="welcome-text">
                    <div class="welcome-title">WELCOME TO</div>
                    <div class="welcome-platform">TEDP</div>
                    <div class="welcome-tagline">TMA Enterprise Data Platform</div>
                </div>

                <div class="features-list">
                    <div class="feature-item">
                        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span>Secure Single Sign-On</span>
                    </div>
                    <div class="feature-item">
                        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        <span>Enterprise-grade Security</span>
                    </div>
                    <div class="feature-item">
                        <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        <span>Unified Data Analytics</span>
                    </div>
                </div>
            </div>
            
            <div class="right-panel">
                <div class="form-container">
                    <div class="user-icon-wrapper">
                        <svg class="user-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#1976d2"/><circle cx="12" cy="10" r="3.5" fill="white"/><path d="M6 19.5C6 16.5 8.68629 14 12 14C15.3137 14 18 16.5 18 19.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                        </svg>
                    </div>
                    
                    <h2 class="form-title">${msg("doLogIn")}</h2>
                    <p class="form-description">Enter your username and password to access your account</p>
                    
                    <#if message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                        <div class="alert alert-${message.type}">
                            <span class="alert-message">${kcSanitize(message.summary)?no_esc}</span>
                        </div>
                    </#if>
                    
                    <#if realm.password>
                        <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                            <div class="form-group">
                                <input tabindex="1" id="username" class="form-control" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off" placeholder="${msg('usernameOrEmail')}" />
                            </div>
                            <div class="form-group">
                                <div class="password-input-wrapper">
                                    <input tabindex="2" id="password" class="form-control" name="password" type="password" autocomplete="off" placeholder="${msg('password')}" />
                                    <button type="button" class="password-toggle-btn" onclick="togglePassword('password', this)"><svg class="eye-icon eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><svg class="eye-icon eye-closed" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg></button>
                                </div>
                            </div>
                            <div class="forgot-password-wrapper">
                                <#if realm.resetPasswordAllowed>
                                    <a tabindex="5" href="${url.loginResetCredentialsUrl}" class="forgot-password-link">${msg("doForgotPassword")}</a>
                                </#if>
                            </div>
                            <div class="form-group">
                                <input tabindex="4" class="btn btn-primary btn-block submit-button" name="login" id="kc-login" type="submit" value="${msg('doLogIn')}"/>
                            </div>
                        </form>
                    </#if>
                </div>
            </div>
        </div>
    </div>
    <script>
        function togglePassword(id, btn){
            const inp = document.getElementById(id);
            const open = btn.querySelector('.eye-open');
            const closed = btn.querySelector('.eye-closed');
            if(inp.type==='password'){ inp.type='text'; open.style.display='none'; closed.style.display='block'; }
            else{ inp.type='password'; open.style.display='block'; closed.style.display='none'; }
        }
    </script>
</body>
</html>