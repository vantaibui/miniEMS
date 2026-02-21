# Keycloak Realm & Client Configuration Guide

This document provides step-by-step instructions for setting up the `sonic-vista` Realm, configuring the interface (Theme), creating a Client for the Frontend, and creating a Test User in Keycloak.

## Prerequisites

* **Java (JDK):** Version 17 or 21. Verify with `java -version`.
* **Keycloak Distribution:** Downloaded and extracted from [keycloak.org](https://www.keycloak.org/downloads). Let's call the extracted folder `keycloak-server`.
* **Reference Guide:** For a detailed walkthrough on setting up Keycloak on Windows, you can refer to this article: [Setup and Run Keycloak on Local Machine (Windows 10)](https://medium.com/@vishu2k3/setup-and-run-keycloak-on-local-machine-windows-10-dcca57c995fc).

---

## Part 1: Theme Installation

Before running the server, you need to install the custom theme.

### Step 1: Unzip the Theme
1.  Locate the theme file: `sonic-vista-theme.zip`.
2.  **Unzip** this file. You should get a folder named `sonic-vista-theme`.
3.  Verify the folder structure inside `sonic-vista-theme`:
    ```text
    sonic-vista-theme/
    └── login/
        ├── theme.properties
        ├── login.ftl
        ├── login-reset-password.ftl
        └── resources/
            ├── css/
            └── img/
    ```

### Step 2: Copy to Keycloak
1.  Navigate to your Keycloak installation directory: `keycloak-server/themes/`.
2.  **Copy** the extracted `sonic-vista-theme` folder into this directory.
3.  The final path should look like: `.../keycloak-server/themes/sonic-vista-theme/login/...`

---

## Part 2: Running Keycloak Locally

### Step 1: Open Terminal
Open your command prompt (CMD) or Terminal and navigate to the `bin` directory of your Keycloak server.

```bash
cd path/to/keycloak-server/bin
```

### Step 2: Start Server (Dev Mode)

```bash
kc.bat start-dev
```

## Part 3: Realm & Client Configuration

## Step 1: Access Admin Console

1.  Open your browser and navigate to: [http://localhost:8080](http://localhost:8080)
2.  Click **Administration Console**.
3.  **First Login:** The system will ask you to create an initial Admin account.
    * **Username:** `admin`
    * **Password:** `admin`
4.  Click **Create**.

## Step 2: Create "sonic-vista" Realm & Configure Login

1.  In the top-left corner, hover over the **Master** dropdown menu.
2.  Click **Create Realm**.
3.  **Realm name:** `sonic-vista` -> Click **Create**.
4.  **Enable Forgot Password:**
    * Go to **Realm settings** > **Login** tab.
    * Toggle **Forgot password** to **ON**.
    * Click **Save**.

## Step 3: Configure Theme

1.  Ensure you are currently in the **sonic-vista** realm.
2.  In the left menu, select **Realm settings**.
3.  Switch to the **Themes** tab.
4.  For **Login theme**: Select `sonic-vista-theme` from the dropdown list.
5.  Click **Save**.

## Step 4: Create Client for Frontend

1.  In the left menu, select **Clients**.
2.  Click **Create client**.

### General Settings
* **Client type:** `OpenID Connect`
* **Client ID:** `sonic-vista-fe`
* Click **Next**.

### Capability config
* **Client authentication:** `Off` (Public client for frontend)
* **Authentication flow:** Check the following:
    * [x] Standard flow
    * [x] Direct access grants
* Click **Next**.

### Login settings
Configure the URLs for Vite/Frontend:
* **Root URL:** `http://localhost:5173`
* **Home URL:** `http://localhost:5173`
* **Valid redirect URIs:** `http://localhost:5173/*`
* **Web origins:** `+` (or enter `http://localhost:5173`)
* Click **Save**.

## Step 5: Create Test User

1.  In the left menu, select **Users**.
2.  Click **Add user**.
3.  Enter information:
    * **Username:** `testuser`
4.  Click **Create**.
5.  After creation, switch to the **Credentials** tab.
6.  Click **Set password**.
7.  Set the password:
    * **Password:** `123` (or any password you prefer).
    * **Temporary:** Toggle **OFF** (to avoid requiring a password change on first login).
8.  Click **Save**.