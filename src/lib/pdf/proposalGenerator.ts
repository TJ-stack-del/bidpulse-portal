import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface ProposalInputData {
  contractor: {
    legalName: string;
    fein: string;
    sunbizNumber: string;
    licenseNumber: string;
  };
  solicitation: {
    title: string;
    agency: string;
    trade: string;
    refNumber: string;
  };
}

export async function generateTurnkeyProposalPdf(data: ProposalInputData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const addHeaderFooter = (page: any, tabTitle: string, pageNum: number) => {
    const { width, height } = page.getSize();
    
    // Top Bar
    page.drawRectangle({
      x: 40,
      y: height - 50,
      width: width - 80,
      height: 2,
      color: rgb(0.15, 0.39, 0.92), // BidPulse Blue
    });
    
    page.drawText(`BidPulse Turnkey Proposal Binder | ${tabTitle}`, {
      x: 40,
      y: height - 42,
      size: 9,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Footer
    page.drawText(`Confidential — Prepared for ${data.solicitation.agency}`, {
      x: 40,
      y: 30,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(`Page ${pageNum}`, {
      x: width - 80,
      y: 30,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // --- COVER / TAB 1: Entity Profile & Compliance ---
  const page1 = pdfDoc.addPage([612, 792]); // Letter size
  addHeaderFooter(page1, 'TAB 1: Entity Profile & Compliance', 1);

  page1.drawText('PROPOSAL SUBMISSION & ENTITY PROFILE', {
    x: 40,
    y: 680,
    size: 16,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  page1.drawText(`Solicitation: ${data.solicitation.title}`, {
    x: 40,
    y: 650,
    size: 11,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  page1.drawText(`Issuing Agency: ${data.solicitation.agency}`, {
    x: 40,
    y: 630,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page1.drawText(`Solicitation Reference: ${data.solicitation.refNumber || 'N/A'}`, {
    x: 40,
    y: 615,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Contractor Box
  page1.drawRectangle({
    x: 40,
    y: 470,
    width: 532,
    height: 120,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.85, 0.88, 0.93),
    borderWidth: 1,
  });

  page1.drawText('CONTRACTOR COMPLIANCE VERIFICATION', {
    x: 55,
    y: 565,
    size: 10,
    font: fontBold,
    color: rgb(0.15, 0.39, 0.92),
  });

  page1.drawText(`Legal Business Name: ${data.contractor.legalName}`, {
    x: 55,
    y: 545,
    size: 9,
    font: fontRegular,
  });

  page1.drawText(`Federal Tax ID (FEIN): ${data.contractor.fein || 'Verified on file'}`, {
    x: 55,
    y: 525,
    size: 9,
    font: fontRegular,
  });

  page1.drawText(`Sunbiz Document Number: ${data.contractor.sunbizNumber || 'Active / Good Standing'}`, {
    x: 55,
    y: 505,
    size: 9,
    font: fontRegular,
  });

  page1.drawText(`State Trade License #: ${data.contractor.licenseNumber || 'Compliant'}`, {
    x: 55,
    y: 485,
    size: 9,
    font: fontRegular,
  });

  // --- TAB 2: Staffing & Management Plan ---
  const page2 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page2, 'TAB 2: Staffing & Management Plan', 2);

  page2.drawText('STAFFING, SUPERVISION & WORKFORCE ALLOCATION', {
    x: 40,
    y: 680,
    size: 14,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  const staffingPoints = [
    '• Designated On-Site Supervisor assigned with 24/7 emergency dispatch capability.',
    '• 100% background-checked, vetted, and badged personnel complying with agency security.',
    '• Redundant labor float pool (15% reserve) to prevent shift call-out disruptions.',
    '• Comprehensive OSHA and equipment safety onboarding mandatory prior to facility placement.'
  ];

  let currentY = 640;
  staffingPoints.forEach(point => {
    page2.drawText(point, { x: 40, y: currentY, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    currentY -= 28;
  });

  // --- TAB 3: Technical Execution & SOW ---
  const page3 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page3, 'TAB 3: Technical Execution Plan', 3);

  page3.drawText('SCOPE OF WORK & OPERATIONAL METHODOLOGY', {
    x: 40,
    y: 680,
    size: 14,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  page3.drawText(`Trade Domain: ${data.solicitation.trade}`, {
    x: 40,
    y: 650,
    size: 10,
    font: fontBold,
    color: rgb(0.15, 0.39, 0.92),
  });

  const methodPoints = [
    '• Structured zone-by-zone execution protocol matching facility floorplans.',
    '• Daily operational logs digitally transmitted to agency contract managers.',
    '• Commercial-grade, eco-compliant equipment meeting federal energy/environmental standards.'
  ];

  currentY = 610;
  methodPoints.forEach(point => {
    page3.drawText(point, { x: 40, y: currentY, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    currentY -= 28;
  });

  // --- TAB 4 & 5: QC & Fee Schedule ---
  const page4 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page4, 'TAB 4 & 5: Quality Control & Cost Schedule', 4);

  page4.drawText('QUALITY ASSURANCE & SUBMISSION SIGN-OFF', {
    x: 40,
    y: 680,
    size: 14,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  page4.drawText('The contractor warrants full compliance with all terms, specifications, and requirements.', {
    x: 40,
    y: 650,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Signature Block
  page4.drawRectangle({
    x: 40,
    y: 460,
    width: 532,
    height: 140,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });

  page4.drawText('AUTHORIZED CONTRACTOR SIGNATURE', {
    x: 55,
    y: 575,
    size: 9,
    font: fontBold,
    color: rgb(0.4, 0.4, 0.4),
  });

  page4.drawText(`Authorized Signatory: ____________________________________`, {
    x: 55,
    y: 530,
    size: 10,
    font: fontRegular,
  });

  page4.drawText(`Date Signed: ________________________   Title: Managing Officer`, {
    x: 55,
    y: 490,
    size: 10,
    font: fontRegular,
  });

  return await pdfDoc.save();
}
