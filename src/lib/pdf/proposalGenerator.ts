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

interface TradeModule {
  staffingPlan: string[];
  equipmentList: string[];
  executionProtocol: string[];
  qaPoints: string[];
}

function getTradeModule(trade: string): TradeModule {
  const normalized = (trade || '').toLowerCase();

  if (normalized.includes('pressure') || normalized.includes('washing')) {
    return {
      staffingPlan: [
        '• Lead Rig Operator with OSHA-10 & Aerial Lift Certification on site 100% of shift.',
        '• Secondary Spotter/Tech assigned for water containment, hose routing, and traffic control.',
        '• Dedicated Night Shift Float Techs for zero-interruption municipal garage wash-downs.',
        '• Weekly supervisor pre-shift briefing covering environmental run-off protocols.'
      ],
      equipmentList: [
        '• 4000 PSI @ 8.0 GPM Commercial Hot-Water Skid Pressure Units.',
        '• Hydro-Tek Recovery Surface Cleaners with integrated vacuum waste reclamation.',
        '• Biodegradable, non-toxic degreasers compliant with Florida Clean Water standards.'
      ],
      executionProtocol: [
        '• Storm drain isolation: Deploy sediment berms and vacuum recovery prior to wash cycle.',
        '• High-pressure rotary surface cleaning at 200°F to eliminate grease and vehicle oil.',
        '• Vertical facade soft-wash application to protect structural sealants and coatings.',
        '• Final rinse and post-cleaning inspection sign-off logged with digital timestamp.'
      ],
      qaPoints: [
        '• 100% wastewater recovery verification prior to site departure.',
        '• Post-shift photo verification uploaded to client dashboard within 2 hours of completion.'
      ]
    };
  }

  if (normalized.includes('landscap') || normalized.includes('mowing') || normalized.includes('grounds')) {
    return {
      staffingPlan: [
        '• Commercial Grounds Crew Lead with Florida GI-BMP (Green Industries BMP) Certification.',
        '• 3-man specialized crew: Zero-Turn Operator, Slope/Basin Trimmer, and Debris Blower.',
        '• Dedicated mechanic on standby for rapid equipment turnaround during storm seasons.',
        '• Mandatory pre-cut site sweep for foreign objects, wildlife, and safety hazards.'
      ],
      equipmentList: [
        '• Commercial 60" & 72" Zero-Turn Mulching Mowers (Scag / Exmark commercial spec).',
        '• Heavy-duty slope & basin hydraulic bush hog equipment for steep retention basins.',
        '• Commercial dual-line trimmers, stick edgers, and low-noise commercial backpack blowers.'
      ],
      executionProtocol: [
        '• Uniform turf cutting height maintained between 3.5" to 4.0" per seasonal guidelines.',
        '• Retention basin clearing and inlet grate unblocking to maintain proper drainage flow.',
        '• Hard edge detailing along all sidewalks, curbs, bed perimeters, and obstacles.',
        '• Complete organic debris blowing, sweeping, and off-site green waste recycling.'
      ],
      qaPoints: [
        '• Clean-edge line audits and storm drainage flow checks conducted post-cut.',
        '• Bi-weekly turf health and sprinkler head safety checks reported directly to agency.'
      ]
    };
  }

  if (normalized.includes('haul') || normalized.includes('waste') || normalized.includes('debris')) {
    return {
      staffingPlan: [
        '• CDL Class-A Certified Roll-Off Driver with clean institutional driving record.',
        '• 2-person Debris Loading & Ground Spotter Crew equipped with full PPE and safety vests.',
        '• 24/7 Rapid Emergency Response Coordinator designated for immediate municipal call-outs.',
        '• Daily driver electronic logbook inspection (ELD) and vehicle safety verification.'
      ],
      equipmentList: [
        '• Tandem Axle Roll-Off Trucks equipped with automatic tarping systems.',
        '• 20-Yard and 30-Yard Heavy Duty Steel Roll-Off Dumpster Containers.',
        '• Compact skid-steer loader with heavy debris grapple attachment for rapid loading.'
      ],
      executionProtocol: [
        '• Container positioning strictly within designated load areas with surface protection pads.',
        '• Secure load tarping and weight distribution checks complying with Florida DOT standards.',
        '• Transport directly to certified county solid waste / recycling transfer stations.',
        '• Post-haul ground sweeping and magnet sweep to eliminate nails and hazardous sharp debris.'
      ],
      qaPoints: [
        '• Certified weigh-station manifests archived digitally and attached to agency billing.',
        '• Same-day container turnaround and site clearance within 4 hours of agency dispatch.'
      ]
    };
  }

  // Default: Commercial Janitorial & Custodial
  return {
    staffingPlan: [
      '• Designated On-Site Supervisor assigned with 24/7 emergency dispatch capability.',
      '• 100% background-checked, vetted, and badged personnel complying with agency security.',
      '• Redundant labor float pool (15% reserve) to prevent shift call-out disruptions.',
      '• Comprehensive OSHA and chemical safety (SDS) onboarding mandatory prior to facility entry.'
    ],
    equipmentList: [
      '• HEPA-filtered commercial backpack vacuums meeting CRI Green Label Plus standards.',
      '• Dual-bucket microfiber floor mopping systems with color-coded cross-contamination barriers.',
      '• Hospital-grade EPA-registered disinfectants with 60-second kill claims.'
    ],
    executionProtocol: [
      '• Top-to-bottom zone protocol: high dusting, vertical sanitizing, touchpoints, and floor care.',
      '• Nightly comprehensive rest-room deep scrub, fixture disinfection, and consumable restock.',
      '• High-frequency touchpoint wipe down: door handles, push plates, elevator panels, handrails.',
      '• Floor scrubbing, high-gloss burnishing, and quarterly hard-surface stripping.'
    ],
    qaPoints: [
      '• Daily digital supervisor punch-lists submitted via mobile quality audit system.',
      '• 30-day ATP bioluminescence surface swab tests conducted on primary high-touch surfaces.'
    ]
  };
}

export async function generateTurnkeyProposalPdf(data: ProposalInputData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const tradeData = getTradeModule(data.solicitation.trade);

  const addHeaderFooter = (page: any, tabTitle: string, pageNum: number) => {
    const { width, height } = page.getSize();
    
    // Top Accent Bar
    page.drawRectangle({
      x: 40,
      y: height - 48,
      width: width - 80,
      height: 2,
      color: rgb(0.15, 0.39, 0.92), // BidPulse Blue
    });
    
    page.drawText(`BidPulse Turnkey Proposal Binder | ${tabTitle}`, {
      x: 40,
      y: height - 40,
      size: 8.5,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Footer
    page.drawText(`Prepared for: ${data.solicitation.agency}`, {
      x: 40,
      y: 28,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(`Page ${pageNum} of 4`, {
      x: width - 90,
      y: 28,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  // --- TAB 1: Entity Profile & Compliance ---
  const page1 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page1, 'TAB 1: Entity Profile & Compliance', 1);

  page1.drawText('PROPOSAL SUBMISSION & ENTITY PROFILE', {
    x: 40,
    y: 690,
    size: 15,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  page1.drawText(`Solicitation: ${data.solicitation.title}`, {
    x: 40,
    y: 660,
    size: 10.5,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  page1.drawText(`Issuing Agency: ${data.solicitation.agency}`, {
    x: 40,
    y: 642,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page1.drawText(`Trade Domain: ${data.solicitation.trade}   |   Ref Number: ${data.solicitation.refNumber || 'N/A'}`, {
    x: 40,
    y: 626,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Contractor Compliance Box
  page1.drawRectangle({
    x: 40,
    y: 470,
    width: 532,
    height: 130,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.85, 0.88, 0.93),
    borderWidth: 1,
  });

  page1.drawText('CONTRACTOR STATUTORY COMPLIANCE RECORD', {
    x: 55,
    y: 575,
    size: 10,
    font: fontBold,
    color: rgb(0.15, 0.39, 0.92),
  });

  page1.drawText(`Legal Business Entity:   ${data.contractor.legalName}`, {
    x: 55,
    y: 552,
    size: 9,
    font: fontRegular,
  });

  page1.drawText(`Federal Tax ID (FEIN):     ${data.contractor.fein || 'Verified on File'}`, {
    x: 55,
    y: 532,
    size: 9,
    font: fontRegular,
  });

  page1.drawText(`Florida Sunbiz Reg #:      ${data.contractor.sunbizNumber || 'Active / Good Standing'}`, {
    x: 55,
    y: 512,
    size: 9,
    font: fontRegular,
  });

  page1.drawText(`State Trade License #:     ${data.contractor.licenseNumber || 'Certified / Bonded'}`, {
    x: 55,
    y: 492,
    size: 9,
    font: fontRegular,
  });

  // --- TAB 2: Staffing & Equipment Allocation ---
  const page2 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page2, 'TAB 2: Staffing & Equipment Plan', 2);

  page2.drawText('STAFFING PLAN & WORKFORCE ALLOCATION', {
    x: 40,
    y: 690,
    size: 13,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  let currentY = 660;
  tradeData.staffingPlan.forEach(point => {
    page2.drawText(point, { x: 40, y: currentY, size: 9.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    currentY -= 24;
  });

  page2.drawText('COMMERCIAL EQUIPMENT & RESOURCE DEPLOYMENT', {
    x: 40,
    y: currentY - 15,
    size: 13,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  currentY -= 45;
  tradeData.equipmentList.forEach(item => {
    page2.drawText(item, { x: 40, y: currentY, size: 9.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    currentY -= 24;
  });

  // --- TAB 3: Statement of Work (SOW) & Technical Execution ---
  const page3 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page3, 'TAB 3: Technical Execution & SOW', 3);

  page3.drawText('SCOPE OF WORK & OPERATIONAL METHODOLOGY', {
    x: 40,
    y: 690,
    size: 13,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  currentY = 660;
  tradeData.executionProtocol.forEach(step => {
    page3.drawText(step, { x: 40, y: currentY, size: 9.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    currentY -= 28;
  });

  // --- TAB 4 & 5: Quality Assurance & Legal Execution ---
  const page4 = pdfDoc.addPage([612, 792]);
  addHeaderFooter(page4, 'TAB 4 & 5: QA & Statutory Execution', 4);

  page4.drawText('QUALITY ASSURANCE PROTOCOL & INSPECTIONS', {
    x: 40,
    y: 690,
    size: 13,
    font: fontBold,
    color: rgb(0.08, 0.13, 0.24),
  });

  currentY = 660;
  tradeData.qaPoints.forEach(qa => {
    page4.drawText(qa, { x: 40, y: currentY, size: 9.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    currentY -= 24;
  });

  // Signature Block
  page4.drawRectangle({
    x: 40,
    y: 430,
    width: 532,
    height: 150,
    borderColor: rgb(0.8, 0.83, 0.88),
    borderWidth: 1,
  });

  page4.drawText('AUTHORIZED STATUTORY CONTRACTOR SIGNATURE', {
    x: 55,
    y: 550,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.35, 0.45),
  });

  page4.drawText(`Authorized Signatory: _____________________________________________`, {
    x: 55,
    y: 505,
    size: 9.5,
    font: fontRegular,
  });

  page4.drawText(`Title: Managing Officer / Principal        Date: ________________________`, {
    x: 55,
    y: 465,
    size: 9.5,
    font: fontRegular,
  });

  return await pdfDoc.save();
}
