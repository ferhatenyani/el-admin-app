# Keycloak Configuration for Direct Password Grant Login

This document explains the required Keycloak configuration to enable the Resource Owner Password Grant flow for the frontend login.

## Overview

The frontend now authenticates users by:
1. Collecting username/password in a React form
2. Calling Keycloak's token endpoint directly with password grant
3. Storing JWT tokens in localStorage
4. Including Bearer tokens in all backend API requests

## Required Keycloak Configuration

### 1. Enable Direct Access Grants

You must enable the **Resource Owner Password Credentials Grant** (also called "Direct Access Grants") for your client.

#### Steps:
1. Open Keycloak Admin Console at `http://localhost:9080`
2. Select the `jhipster` realm
3. Go to **Clients** → Click on `web_app`
4. Go to the **Settings** tab
5. Scroll down to **Capability config** section
6. Enable **Direct access grants**
7. Click **Save**

### 2. Verify Client Configuration

Ensure your `web_app` client has these settings:

```
Client ID: web_app
Client authentication: OFF (public client)
Authorization: OFF
Authentication flow:
  ✓ Standard flow
  ✓ Direct access grants ← MUST BE ENABLED
  ☐ Implicit flow
  ✓ Service accounts roles (optional)
  ✓ OAuth 2.0 Device Authorization Grant (optional)
```

### 3. Valid Redirect URIs

Make sure these are configured (if using OAuth2 flows as backup):
```
Valid redirect URIs:
  - http://localhost:5173/*
  - http://localhost:8080/*
```

### 4. Web Origins

Configure CORS settings:
```
Web origins:
  - http://localhost:5173
  - http://localhost:8080
```

## Frontend Environment Variables

Create a `.env` file in your frontend project root:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:8080

# Keycloak Configuration
VITE_KEYCLOAK_URL=http://localhost:9080
VITE_KEYCLOAK_REALM=jhipster
VITE_KEYCLOAK_CLIENT_ID=web_app
```

## Token Endpoint

The frontend calls this Keycloak endpoint:

```
POST http://localhost:9080/realms/jhipster/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=web_app
&username=<username>
&password=<password>
&scope=openid profile email
```

## Testing

### Test with cURL:

```bash
curl -X POST 'http://localhost:9080/realms/jhipster/protocol/openid-connect/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password' \
  -d 'client_id=web_app' \
  -d 'username=admin' \
  -d 'password=admin' \
  -d 'scope=openid profile email'
```

Expected response:
```json
{
  "access_token": "eyJhbGc...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer",
  "id_token": "eyJhbGc...",
  "not-before-policy": 0,
  "session_state": "...",
  "scope": "openid profile email"
}
```

## Security Considerations

### ⚠️ Important Notes:

1. **Direct Access Grants (Password Grant) is considered less secure** than Authorization Code Flow with PKCE
2. Only enable this for **trusted first-party applications**
3. The password is sent directly from the browser to Keycloak
4. Tokens are stored in localStorage (vulnerable to XSS attacks)

### Recommended for Production:

For production environments, consider:
- Using Authorization Code Flow with PKCE instead
- Implementing additional security measures (CSP headers, etc.)
- Using httpOnly cookies for token storage
- Implementing token refresh logic

## Troubleshooting

### Error: "Invalid grant: Invalid client or Invalid client credentials"

**Solution**: Make sure "Direct access grants" is enabled in Keycloak client settings

### Error: "CORS error" when calling token endpoint

**Solution**:
1. Add `http://localhost:5173` to Web Origins in Keycloak client settings
2. Restart Keycloak if needed

### Error: "401 Unauthorized" when calling backend API

**Solution**:
1. Check that the access token is being sent in the Authorization header
2. Verify backend is configured to accept JWT tokens from Keycloak
3. Check token hasn't expired (default: 5 minutes)

### Error: "Invalid username or password"

**Solution**:
1. Verify the user exists in Keycloak
2. Check the password is correct
3. Ensure the user is enabled in Keycloak

## Files Modified

The following files were created/modified in the frontend:

### Created:
- `src/utils/cookies.js` - Cookie reading utility
- `src/services/authApi.js` - Keycloak authentication API
- `src/contexts/AuthContext.jsx` - Authentication context provider
- `src/components/ProtectedRoute.jsx` - Route guard component

### Modified:
- `src/services/booksApi.js` - Added Bearer token interceptor
- `src/pages/Login.jsx` - Username/password form with Keycloak login
- `src/App.jsx` - Wrapped with AuthProvider
- `src/router/AdminRoutes.jsx` - Using new ProtectedRoute

## Login Flow

1. User enters username and password in React form
2. Frontend calls Keycloak token endpoint with credentials
3. Keycloak validates credentials and returns tokens
4. Frontend stores tokens in localStorage
5. Frontend fetches user profile from backend using access token
6. All subsequent API calls include Bearer token in Authorization header
7. Backend validates JWT token on each request

## Logout Flow

1. User clicks logout
2. Frontend calls backend `/api/logout` endpoint
3. Backend returns Keycloak logout URL
4. Frontend clears tokens from localStorage
5. Frontend redirects browser to Keycloak logout URL
6. User is logged out from Keycloak
7. Keycloak redirects back to login page