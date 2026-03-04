

## Plan: Wire Contact Form to Email

### Approach
1. **Create a backend function** (`send-contact-email`) that receives the form data and sends an email to `maria.freydell.v@gmail.com` using the Resend API (available via Lovable connector).
2. **Store submissions** in a `contact_submissions` database table as a backup/record.
3. **Update `Contact.tsx`** to call the backend function instead of just showing a toast.

### Steps

**1. Database: Create `contact_submissions` table**
- Columns: `id`, `name`, `email`, `subject`, `message`, `created_at`
- No RLS needed (public insert, no select for anonymous users)

**2. Backend function: `send-contact-email`**
- Accepts `{ name, email, subject, message }`
- Inserts into `contact_submissions` table
- Sends email to `maria.freydell.v@gmail.com` via Resend with the form details
- Returns success/error

**3. Update `src/pages/Contact.tsx`**
- Replace the dummy `handleSubmit` with an async call to the `send-contact-email` backend function
- Add loading state and error handling
- Keep the success confirmation UI

### Connector Needed
- **Resend** connector for email sending (will check availability)

