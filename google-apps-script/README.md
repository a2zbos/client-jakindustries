# Contact form: Google Apps Script setup

The contact form posts to a Google Apps Script web app, which emails each request to `jakindustries2007@yahoo.com` with the customer's email as Reply-To.

Best done while signed in to the Google account that should own the form (ideally a JAK Industries Google account, not a personal one).

## 1. Create the script

1. Go to https://script.google.com and click **New project**.
2. Delete the default code and paste in the contents of `Code.gs`.
3. Change `RECIPIENT` at the top if the address is different.
4. Click the disk icon to save. Rename the project to "JAK Contact Form".

## 2. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon, select **Web app**.
3. Set:
   - **Description:** Contact form v1
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Approve the permissions when Google asks (Gmail send). If you see "Google hasn't verified this app", click **Advanced → Go to JAK Contact Form (unsafe)**. This is expected for a script you wrote yourself.
5. Copy the **Web app URL**. It ends in `/exec`.

## 3. Connect the website

1. Open `src/lib/site-data.ts`.
2. Replace `PASTE_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL from step 2.
3. Run `npm run build:static` and upload the new files to `public_html` on Hostinger.

## 4. Test

1. Open the contact page on the live site and submit a test request.
2. Check `jakindustries2007@yahoo.com` (the first email may land in spam).
3. To check that the script is running, open the Web app URL in a browser. It should show `{"success":true,"status":"JAK contact form is running."}`.

## Updating the script later

Edit `Code.gs`, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same, so the website does not need changing.

## Limits

- Free Gmail accounts can send about 100 emails per day. Google Workspace accounts allow about 1,500.
- Requests are not stored anywhere. If the client wants a record, add a Google Sheet logger to `Code.gs`.
- The website can't read the script's reply because of browser security rules, so the form shows "sent" unless the connection itself fails. Check the inbox during testing.
