<#import "template.ftl" as layout>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${msg("emailForgotTitle")}</title>
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
                        <svg class="user-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    
                    <h2 class="form-title">${msg("emailForgotTitle")}</h2>
                    <p class="form-description">You will receive an email with instructions to reset your password.</p>
                    
                    <#if message?has_content>
                         <div class="alert alert-${message.type}">
                            <span class="alert-message">${kcSanitize(message.summary)?no_esc}</span>
                        </div>
                    </#if>
                    
                    <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
                        <div class="form-group">
                            <label for="username" class="form-label">
                                <#if !realm.loginWithEmailAllowed>${msg("username")}
                                <#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}
                                <#else>${msg("email")}</#if>
                            </label>
                            <input type="text" id="username" name="username" class="form-control" autofocus value="${(auth.attemptedUsername!'')}" />
                        </div>

                        <div class="form-group">
                            <input class="btn btn-primary btn-block submit-button" type="submit" value="${msg('doSubmit')}"/>
                        </div>
                        
                        <div class="back-to-login">
                            <a href="${url.loginUrl}" class="back-link">
                                <span class="back-icon">←</span> Back to Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>