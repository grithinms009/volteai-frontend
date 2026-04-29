# VoltSave AI – Backend API Requirements

This document lists **every HTTP endpoint** the VoltSave AI frontend currently calls. Use this as a contract for the Node.js backend (`anigravity_backend` container on port `3000`).

- **Base URL (current):** `http://95.217.223.40:3000`
- **Auth scheme:** `Authorization: Bearer <JWT>` header for all protected routes.
- **Content type:** `application/json` for all routes except file uploads (which use `multipart/form-data`).
- **CORS:** Must allow the frontend origin (`http://localhost:5173`, `http://localhost:5174`, and the production domain). Allow headers: `Authorization, Content-Type`. Allow methods: `GET, POST, PUT, DELETE, OPTIONS`.

---

## 1. Authentication

### 1.1 `POST /api/auth/register`
Create a new user account.

**Request body**
```json
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "password123"
}
```

**Success response (200 / 201)**
```json
{
  "token": "<jwt>",
  "userId": "usr_abc123",
  "name": "Test User",
  "email": "test@test.com"
}
```

**Errors**
- `400` – validation failure (`{ "error": "Email already in use" }`, etc.)
- `500` – server error

**Frontend usage:** `AuthModal.tsx` Sign Up tab.

---

### 1.2 `POST /api/auth/login`
Sign in an existing user.

**Request body**
```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

**Success response (200)**
```json
{
  "token": "<jwt>",
  "userId": "usr_abc123",
  "name": "Test User",
  "email": "test@test.com"
}
```

**Errors**
- `401` – invalid credentials
- `400` – missing fields

**Frontend usage:** `AuthModal.tsx` Sign In tab.

---

### 1.3 `GET /api/auth/me` *(recommended, optional)*
Validate the current JWT and return the user profile. Useful for hydrating `useAuth` on page reload.

**Headers:** `Authorization: Bearer <token>`

**Success response (200)**
```json
{
  "userId": "usr_abc123",
  "name": "Test User",
  "email": "test@test.com",
  "isAdmin": false,
  "subscription": "free"
}
```

**Errors:** `401` if token invalid/expired (frontend treats `401` globally — clears localStorage and redirects to `/`).

---

## 2. Bills (Upload & Analysis)

### 2.1 `POST /api/bills/upload`  🔒
Upload an electricity bill PDF/image for OCR + AI analysis. The backend should kick off an **asynchronous worker job** and return immediately.

**Headers:** `Authorization: Bearer <token>` (Content-Type auto-set to `multipart/form-data`)

**Request body (multipart/form-data)**
| Field         | Type            | Notes                                                         |
|---------------|-----------------|---------------------------------------------------------------|
| `file`        | File (required) | PDF / JPG / JPEG / PNG, max 10 MB                             |
| `userId`      | String          | Sent by frontend (also derivable from JWT)                    |
| `profileType` | String          | One of `home`, `home-office`, `small-shop`, `office`          |

**Success response (200 / 202)**
```json
{
  "billId": "bill_abc123",
  "status": "processing"
}
```

**Errors**
- `400` – invalid file type / oversize
- `401` – unauthorized
- `500` – upload failure

**Frontend usage:** `UploadSection.tsx` → `apiUpload('/api/bills/upload', formData)`.

---

### 2.2 `GET /api/bills/:billId/status`  🔒
Polled by the frontend every 3 seconds while the analysis job is running.

**Success response while processing (200)**
```json
{
  "billId": "bill_abc123",
  "status": "processing",
  "progress": 45
}
```

**Success response when complete (200)**
```json
{
  "billId": "bill_abc123",
  "status": "completed",
  "analysisResult": {
    "effectiveRate": 9.2,
    "effectiveRateCurrency": "INR",
    "rateVsRegionAvg": 8.2,
    "rateStatus": "above_average",
    "usageIntensity": "high",
    "efficiencyScore": 68,
    "monthlySavingsEstimate": 1800,
    "annualSavingsEstimate": 21600,
    "potentialSavingsPct": 23,
    "topIssues": [
      {
        "title": "Above Average Consumption",
        "description": "Your usage is 34% higher than similar households in your region.",
        "severity": "high"
      }
    ],
    "recommendations": [
      "Set AC temperature to 24°C — each degree lower adds 6% to consumption"
    ],
    "tariffModel": "flat",
    "confidenceLevel": "high",
    "paid": false,
    "providerName": "Tata Power",
    "unitsConsumed": 412
  }
}
```

**Failure response (200, but with failed status)**
```json
{
  "billId": "bill_abc123",
  "status": "failed",
  "error": "OCR parsing failed - image quality too low"
}
```

**Field schema (`analysisResult`)**

| Field                      | Type                                                                                  | Required | Notes |
|----------------------------|---------------------------------------------------------------------------------------|----------|-------|
| `effectiveRate`            | number                                                                                | yes      | per-unit cost |
| `effectiveRateCurrency`    | string                                                                                | yes      | `INR`, `USD`, etc. |
| `rateVsRegionAvg`          | number                                                                                | yes      | regional average rate |
| `rateStatus`               | `"above_average" \| "average" \| "below_average"`                                     | yes      |  |
| `usageIntensity`           | `"low" \| "medium" \| "high"`                                                         | yes      |  |
| `efficiencyScore`          | number (0–100)                                                                        | yes      |  |
| `monthlySavingsEstimate`   | number                                                                                | yes      | in user's currency |
| `annualSavingsEstimate`    | number                                                                                | yes      |  |
| `potentialSavingsPct`      | number (0–100)                                                                        | yes      |  |
| `topIssues`                | `Array<{ title, description, severity: "high"\|"medium"\|"low" }>`                    | yes      | ≥3 items recommended |
| `recommendations`          | `string[]`                                                                            | yes      | ≥5 items recommended |
| `tariffModel`              | `"flat" \| "tiered" \| "tod"`                                                         | yes      |  |
| `confidenceLevel`          | `"high" \| "medium" \| "low"`                                                         | yes      |  |
| `paid`                     | boolean                                                                               | yes      | `false` for free tier; `true` after unlock |
| `providerName`             | string                                                                                | optional | shown in dashboard list |
| `unitsConsumed`            | number                                                                                | optional | kWh in dashboard list |

**Frontend usage:** `ProcessingScreen.tsx` (polling) → result passed into `ResultsDashboard.tsx`.

---

### 2.3 `GET /api/bills/user/:userId`  🔒
Returns all bills uploaded by a user. Powers the user dashboard list.

**Success response (200)**
```json
{
  "bills": [
    {
      "id": "bill_abc123",
      "createdAt": "2026-04-29T12:34:56.000Z",
      "providerName": "Tata Power",
      "unitsConsumed": 412,
      "monthlySavingsEstimate": 1800,
      "status": "completed",
      "paid": false
    }
  ]
}
```

**Field schema (`bills[]`)**

| Field                    | Type                                            | Required |
|--------------------------|-------------------------------------------------|----------|
| `id`                     | string                                          | yes      |
| `createdAt`              | ISO 8601 timestamp                              | yes      |
| `status`                 | `"completed" \| "processing" \| "failed"`       | yes      |
| `paid`                   | boolean                                         | yes      |
| `providerName`           | string                                          | optional |
| `unitsConsumed`          | number                                          | optional |
| `monthlySavingsEstimate` | number                                          | optional (only when `status==="completed"`) |

**Frontend usage:** `Dashboard.tsx`.

---

### 2.4 `GET /api/bills/:billId`  🔒  *(recommended, optional)*
Fetch the full analysis result for a single bill. Used when the user clicks **View Report** on the dashboard.

Response shape: same as `analysisResult` in §2.2.

---

## 3. Reports

### 3.1 `GET /api/reports/:billId/download`  🔒
Returns a PDF report for a paid bill.

**Headers:** `Authorization: Bearer <token>`

**Response**
- `200` with `Content-Type: application/pdf` and the binary PDF body. The frontend reads it as a Blob and downloads it as `voltsave-report-<billId>.pdf`.

**Errors**
- `402` – payment required (bill not unlocked)
- `404` – bill not found
- `401` – unauthorized

**Frontend usage:** `ResultsDashboard.tsx → handleDownload`.

---

## 4. Payments (placeholder, used by `PricingModal`)

These endpoints are referenced indirectly. The frontend currently shows a "coming soon" toast, but to wire real payments expose the following:

### 4.1 `POST /api/payments/create-order`  🔒  *(to implement)*
Create a Razorpay/Stripe order for the one-time `₹199` Full Report unlock.

**Request body**
```json
{
  "billId": "bill_abc123",
  "plan": "full_report"
}
```

**Success response (200)**
```json
{
  "orderId": "order_xyz",
  "amount": 19900,
  "currency": "INR",
  "razorpayKeyId": "rzp_test_xxx"
}
```

### 4.2 `POST /api/payments/verify`  🔒  *(to implement)*
Verify the payment signature, then mark the bill as `paid: true`.

**Request body**
```json
{
  "billId": "bill_abc123",
  "razorpay_payment_id": "...",
  "razorpay_order_id": "...",
  "razorpay_signature": "..."
}
```

**Success response (200)**
```json
{ "success": true, "paid": true }
```

### 4.3 `POST /api/payments/subscribe`  🔒  *(to implement)*
Create a `₹499/month` Pro subscription. Same shape as create-order but `plan: "pro_monthly"`.

---

## 5. Admin

All admin routes should be guarded by an `isAdmin` claim on the JWT.

### 5.1 `GET /api/admin/stats`  🔒 admin
**Success response (200)**
```json
{
  "totalUsers": 1247,
  "totalReports": 3856,
  "paidReports": 892,
  "revenue": 178304
}
```

**Frontend usage:** `Admin.tsx` stat cards.

---

### 5.2 `GET /api/admin/recent-uploads`  🔒 admin
**Success response (200)**
```json
{
  "uploads": [
    {
      "id": "bill_001",
      "userId": "usr_123",
      "createdAt": "2026-04-29T12:34:56.000Z",
      "providerName": "Tata Power",
      "status": "completed",
      "confidenceLevel": "high"
    }
  ]
}
```

**Frontend usage:** `Admin.tsx` Recent Uploads list.

---

### 5.3 `GET /api/admin/failed-jobs`  🔒 admin  *(recommended)*
**Success response (200)**
```json
{
  "failedJobs": [
    {
      "billId": "bill_001",
      "error": "OCR parsing failed - image quality too low",
      "createdAt": "2026-04-29T12:34:56.000Z"
    }
  ]
}
```

The frontend currently uses placeholder data for this list — wire it up when the endpoint is available.

---

### 5.4 `POST /api/admin/jobs/:billId/retry`  🔒 admin  *(recommended)*
Re-queue a failed analysis job. Returns `{ "success": true }`.

---

## 6. Error response convention

The frontend's `apiCall` helper:
- Treats any non-2xx as an error.
- On `401`: clears `token`, `userId`, `userName` from `localStorage` and redirects to `/`.
- Reads response body as text → throws `ApiError(message, status)`.

**Recommended error shape**
```json
{ "error": "Human readable message", "code": "OPTIONAL_CODE" }
```

The frontend will display the `error` string in toasts.

---

## 7. CORS preflight

Make sure `OPTIONS` requests on every route return:
```
Access-Control-Allow-Origin: <frontend origin>
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## 8. Summary checklist

Auth
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `GET  /api/auth/me` *(recommended)*

Bills
- [ ] `POST /api/bills/upload`
- [ ] `GET  /api/bills/:billId/status`
- [ ] `GET  /api/bills/user/:userId`
- [ ] `GET  /api/bills/:billId` *(recommended)*

Reports
- [ ] `GET  /api/reports/:billId/download`

Payments
- [ ] `POST /api/payments/create-order` *(to implement)*
- [ ] `POST /api/payments/verify` *(to implement)*
- [ ] `POST /api/payments/subscribe` *(to implement)*

Admin
- [ ] `GET  /api/admin/stats`
- [ ] `GET  /api/admin/recent-uploads`
- [ ] `GET  /api/admin/failed-jobs` *(recommended)*
- [ ] `POST /api/admin/jobs/:billId/retry` *(recommended)*

CORS
- [ ] Allow frontend origin with `Authorization` header.
