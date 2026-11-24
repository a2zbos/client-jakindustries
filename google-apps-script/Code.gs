/**
 * JAK Industries contact form backend (Google Apps Script).
 *
 * Receives the quote request from the website and emails it to RECIPIENT.
 * Deploy as a Web app (Execute as: Me, Who has access: Anyone). See README.md.
 */

const RECIPIENT = "jakindustries2007@yahoo.com";

function doPost(e) {
  const p = (e && e.parameter) || {};

  const name = clean(p.name);
  const email = clean(p.email);
  const company = clean(p.company);
  const phone = clean(p.phone);
  const message = clean(p.message);

  // Basic validation: the same fields the form marks as required.
  if (!name || !email || !message) {
    return reply({ success: false, error: "Missing required fields." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply({ success: false, error: "Invalid email address." });
  }

  const body = [
    "New quote request from the JAK Industries website.",
    "",
    "Name: " + name,
    "Company: " + (company || "-"),
    "Phone: " + (phone || "-"),
    "Email: " + email,
    "",
    "Requirement:",
    message,
  ].join("\n");

  MailApp.sendEmail({
    to: RECIPIENT,
    subject: "Quote request from " + name,
    body: body,
    replyTo: email, // so "Reply" in your mail app goes to the customer
    name: "JAK Industries Website",
  });

  return reply({ success: true });
}

// GET is only used to check that the web app is running.
function doGet() {
  return reply({ success: true, status: "JAK contact form is running." });
}

function clean(value) {
  return String(value || "").trim().slice(0, 5000);
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
