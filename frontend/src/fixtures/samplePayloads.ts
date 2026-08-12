export type SampleKind = 'phishing' | 'legitimate';

export interface SamplePayload {
  id: string;
  label: string;
  kind: SampleKind;
  description: string;
  text: string;
}

/**
 * Sandbox-only vectors for UI and heuristic QA.
 * Domains and IPs are reserved / fictional (RFC 2606, RFC 5737).
 */
export const SAMPLE_PAYLOADS: SamplePayload[] = [
  {
    id: 'mfa-reset',
    label: 'MFA reset',
    kind: 'phishing',
    description: 'Helpdesk impersonation, HTTP+IP link, high urgency',
    text: `From: IT Security Helpdesk <security-update@corp-verify-auth.example>
To: target.analyst@company.example
Subject: URGENT: Mandatory MFA Reset Required Within 2 Hours

ATTENTION: Our Automated Threat System detected an unauthorized login attempt on your account from an unrecognized IP address (203.0.113.88).

To prevent account suspension, you must immediately re-verify your multi-factor authentication credentials within 2 hours. Failure to update your details will result in automatic termination of active single sign-on (SSO) sessions and domain lockouts.

Please click http://192.0.2.18/verify immediately to validate your password.`,
  },
  {
    id: 'payroll-bec',
    label: 'Payroll BEC',
    kind: 'phishing',
    description: 'Executive-style wire-change request',
    text: `From: Maya Chen, CFO <maya.chen@finance-ops-secure.example>
To: payroll@company.example
Cc: ap-team@company.example
Subject: ACTION REQUIRED — Update vendor ACH before Friday close

Team,

I am in diligence meetings and cannot take calls. Legal flagged an unauthorized change on the Northwind retainers. Accounts payable must verify the new routing details immediately or Friday payouts will be locked.

Updated banking packet (final warning if missed):
http://198.51.100.42/ach/northwind-update

Do not route this through Slack. Validate the password-protected sheet, then confirm once the transfer is submitted.

Maya Chen
Chief Financial Officer`,
  },
  {
    id: 'parcel-lure',
    label: 'Parcel lure',
    kind: 'phishing',
    description: 'Delivery scam with mixed HTTP/HTTPS links',
    text: `From: Parcel Notification <no-reply@tracking-alert.example>
To: jordan.hale@company.example
Subject: Security alert: your package is on hold

Your shipment 1Z999AA10123456784 could not be delivered. Customs requires you to verify the recipient address or the parcel will expire and be returned.

Pay the processing fee immediately:
http://203.0.113.44/hold/1Z999AA10123456784

Tracking (reference only): https://status.carrier-notify.example/1Z999AA10123456784

If you do not validate this alert today the label will be suspended.`,
  },
  {
    id: 'password-expire',
    label: 'Password expire',
    kind: 'phishing',
    description: 'Mailbox quota / password expiry classic',
    text: `From: Mailbox Administrator <admin@secure-mail-access.example>
To: target.analyst@company.example
Subject: Final warning — mailbox will be locked tonight

This is an urgent security notice. Your password will expire at 23:59 UTC and the account will be suspended for unauthorized storage overage.

Click below to validate access and terminate the lockout:
http://10.0.0.8/owa/password

If you ignore this alert, remote access and Active Directory sessions will be locked.`,
  },
  {
    id: 'sprint-sync',
    label: 'Sprint sync',
    kind: 'legitimate',
    description: 'Internal meeting note, no lure links',
    text: `From: Jordan Hale <jordan.hale@company.example>
To: platform-team@company.example
Subject: Phase 2 roadmap review — Thursday 10 AM

Hi Team, please review the attached project roadmap for Phase 2. We have scheduled our sprint sync meeting for tomorrow at 10 AM EST. Let me know if you need any adjustments to the agenda beforehand.

Notes live here: https://wiki.company.example/roadmap/phase-2

Thanks,
Jordan`,
  },
  {
    id: 'hr-benefits',
    label: 'HR benefits',
    kind: 'legitimate',
    description: 'Calm internal comms with a clean HTTPS link',
    text: `From: People Operations <people@company.example>
To: all-staff@company.example
Subject: Open enrollment window — reminder for next week

Hello everyone,

Open enrollment for 2026 benefits runs Monday through Friday. There is no action required this week unless you want to change medical or commuter elections.

Guide and FAQ: https://intranet.company.example/benefits/2026
Office hours are Tuesday 2–3 PM in the 4th floor huddle.

Best,
People Operations`,
  },
  {
    id: 'vendor-invoice',
    label: 'Vendor invoice',
    kind: 'legitimate',
    description: 'Normal AP thread; HTTPS only',
    text: `From: Billing Desk <billing@northwind.example>
To: ap-team@company.example
Subject: Invoice NW-10428 for March retainers

Hello AP team,

Please find invoice NW-10428 for the March design retainers. Net-30, no change to banking details on file.

PDF copy: https://billing.northwind.example/invoices/NW-10428
PO reference: PO-88421

Reply if the line items do not match the SOW.

Regards,
Northwind Billing`,
  },
];

export const SAMPLE_PHISHING_VECTOR =
  SAMPLE_PAYLOADS.find((sample) => sample.id === 'mfa-reset')?.text ?? '';

export const SAMPLE_SAFE_VECTOR =
  SAMPLE_PAYLOADS.find((sample) => sample.id === 'sprint-sync')?.text ?? '';
