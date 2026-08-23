import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

interface ProposalEmailParams {
  toEmail: string;
  contractorName: string;
  solicitationTitle: string;
  agencyName: string;
  proposalId: string;
}

export async function sendProposalConfirmationEmail({
  toEmail,
  contractorName,
  solicitationTitle,
  agencyName,
  proposalId,
}: ProposalEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing. Skipping real email dispatch.');
    return { success: true, simulated: true };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bidpulse-portal.vercel.app';
  const downloadUrl = `${appUrl}/api/proposals/download?id=${proposalId}`;
  const portalUrl = `${appUrl}/dashboard/proposals`;

  try {
    const data = await resend.emails.send({
      from: 'BidPulse Procurement <proposals@bidpulse.com>',
      to: [toEmail],
      subject: `Your Proposal Binder is Ready: ${solicitationTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0;">BidPulse Turnkey Fulfillment</h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Institutional Bid Assembly Confirmation</p>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            Hello <strong>${contractorName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            Your turnkey 5-tab proposal packet for <strong>${solicitationTitle}</strong> with <strong>${agencyName}</strong> has been generated and compiled.
          </p>

          <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin: 0 0 12px 0;">Deliverable File</p>
            <a href="${downloadUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              Download 5-Tab Binder (PDF)
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b; margin-top: 24px; line-height: 1.5;">
            You can also review all active solicitations and track deliverable statuses directly from your 
            <a href="${portalUrl}" style="color: #38bdf8; text-decoration: none;">Client Proposals Dashboard</a>.
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to send email notification:', error);
    return { success: false, error: error.message };
  }
}
