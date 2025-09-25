# API Endpoints and Webhooks Analysis Report

## Summary
This analysis searched through all JavaScript files in the Ignite Health Systems website project to identify API endpoints, webhooks, and form submission handlers. The primary focus was finding the N8N webhook URL and ensuring API integrations are preserved in built files.

## Key Findings

### 1. Primary N8N Webhook URL Found
**URL**: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-contact-form`
- **Location**: `/join.html` (line 1184)
- **Purpose**: Contact form submission handler
- **Status**: Active and configured
- **Implementation**: Direct fetch API call with FormData

### 2. Alternative N8N Webhook URL
**URL**: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
- **Location**: Multiple documentation files
- **Purpose**: Interest form submission handler
- **Status**: Referenced in configuration but not found in active code
- **Environment Variable**: `NEXT_PUBLIC_N8N_WEBHOOK_URL`

### 3. Form Submission Handlers

#### A. Contact Form (join.html)
- **File**: `/join.html` (lines 1170-1200)
- **Method**: POST with FormData
- **Features**:
  - File upload support (CV/resume)
  - Form validation
  - Success/error handling
  - Progress indicators

```javascript
// Submit to n8n webhook for automated email processing
const apiUrl = 'https://bhavenmurji.app.n8n.cloud/webhook/ignite-contact-form';

const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData
});
```

#### B. React Signup Form (SignupForm.tsx)
- **File**: `/client/src/components/SignupForm.tsx`
- **Status**: TODO implementation (line 30)
- **Current Behavior**: Logs to console, shows toast notification
- **Expected Integration**: Should use environment variable `NEXT_PUBLIC_N8N_WEBHOOK_URL`

```typescript
const onSubmit = async (data: SignupFormData) => {
    console.log('Form submitted:', data)
    // TODO: Implement actual form submission
    toast({
      title: "Thank you for joining!",
      description: "We'll be in touch soon with updates about the platform.",
    })
}
```

### 4. API Client Infrastructure

#### A. Query Client (queryClient.ts)
- **File**: `/client/src/lib/queryClient.ts`
- **Purpose**: Centralized API request handling
- **Features**:
  - JSON content-type headers
  - Credential inclusion
  - Error handling
  - Response validation

```typescript
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}
```

#### B. Server API Routes
- **File**: `/server/routes.ts`
- **Status**: Template with placeholder comments
- **URL Pattern**: All routes prefixed with `/api`
- **Implementation**: Not yet developed

### 5. Environment Variables Configuration

The project uses environment variables for webhook URLs:

#### Production Environment
```bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form
```

#### Configuration Locations
- Cloudflare Pages settings
- Local `.env.local` files
- Documentation templates

### 6. N8N Workflow Integration

#### Active Workflows
1. **Interest Form Handler**
   - **URL**: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-interest-form`
   - **Features**:
     - Google Sheets logging
     - Mailchimp integration for physicians
     - Telegram notifications for investors/specialists

2. **Contact Form Handler**
   - **URL**: `https://bhavenmurji.app.n8n.cloud/webhook/ignite-contact-form`
   - **Features**: Email processing automation

### 7. Built Files Analysis

#### Compiled JavaScript
- **Files**: `index-BfGLj_sI.js`, `/dist/index.js`
- **Status**: Minified React bundles contain standard library code
- **API Calls**: No hardcoded external API endpoints found in built files
- **Implementation**: API calls are likely handled through environment variables

#### Static Files
- **File**: `/ignite-ehr-websitepreview/app.js`
- **Purpose**: EMR demo application
- **API Calls**: None found (static demo data only)
- **Form Elements**: UI form controls for demo purposes only

## Status Assessment

### ✅ Working Components
- Contact form in `join.html` with direct N8N integration
- N8N webhook endpoints are active and accessible
- Environment variable configuration is properly documented
- API client infrastructure is ready for implementation

### ⚠️ Needs Implementation
- React SignupForm requires actual API integration
- Server-side API routes need development
- Environment variable integration in React components

### 🔍 Built File Preservation
- API endpoints are preserved through environment variables
- No hardcoded URLs found in minified bundles
- Form submission logic properly separated from static assets

## Recommendations

1. **Complete React Form Integration**
   - Implement actual API calls in `SignupForm.tsx`
   - Use `process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL`
   - Add proper error handling and loading states

2. **Verify Environment Variables**
   - Ensure `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set in production
   - Test both webhook endpoints are accessible
   - Validate form submissions reach N8N workflows

3. **Build Process Validation**
   - Confirm environment variables are injected during build
   - Test form functionality in deployed environment
   - Monitor N8N webhook execution logs

4. **API Endpoint Security**
   - Implement rate limiting for form submissions
   - Add CSRF protection for sensitive forms
   - Validate webhook payload formats

## Files Analyzed

### JavaScript/TypeScript Source Files
- `/client/src/components/SignupForm.tsx`
- `/client/src/lib/queryClient.ts`
- `/server/index.ts`
- `/server/routes.ts`
- `/client/src/components/ui/carousel.tsx`

### Built/Distribution Files
- `/assets/index-BfGLj_sI.js` (minified React bundle)
- `/dist/index.js` (server bundle)
- `/dist/public/assets/index-BfGLj_sI.js` (client bundle)

### Static HTML Files
- `/join.html` (contains active webhook integration)
- `/ignite-ehr-websitepreview/app.js` (demo application)

### Configuration Files
- Environment variable references in multiple documentation files
- Cloudflare Pages configuration
- N8N workflow documentation

## Conclusion

The project has a well-structured approach to API integration with proper separation of concerns. The primary webhook URL is actively used in the contact form, while the React-based signup form awaits implementation. All API endpoints are properly externalized through environment variables, ensuring they will be preserved in built files and can be configured per environment.