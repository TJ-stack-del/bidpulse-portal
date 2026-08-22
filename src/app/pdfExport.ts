import jsPDF from "jspdf";
import { BidItem } from "./bids";

export function exportBidToPdf(bid: BidItem) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter"
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 612, 80, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("BidPulse Executive Procurement Summary", 40, 48);

  // Metadata Section
  doc.setTextColor(51, 65, 85); // slate-700
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 105);
  doc.text(`Bid ID: ${bid.id}`, 450, 105);

  // Bid Title & Agency
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(bid.title, 40, 140);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Issuing Agency: ${bid.agency}`, 40, 160);

  // Summary Metrics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 180, 532, 70, 6, 6, "FD");

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("ESTIMATED VALUE", 60, 205);
  doc.text("DUE DATE", 220, 205);
  doc.text("STATUS", 360, 205);
  doc.text("FIT SCORE", 480, 205);

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(bid.estimatedValue || "N/A", 60, 228);
  doc.text(bid.dueDate, 220, 228);
  doc.text(bid.status, 360, 228);
  doc.text(`${bid.fitScore}%`, 480, 228);

  // Scope Section
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Scope of Work Summary", 40, 280);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const splitScope = doc.splitTextToSize(bid.scope || "No detailed scope provided.", 532);
  doc.text(splitScope, 40, 300);

  // Scoring Breakdown Table
  let currentY = 300 + (splitScope.length * 14) + 20;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Scoring Breakdown Analysis", 40, currentY);

  currentY += 20;
  doc.setFillColor(241, 245, 249);
  doc.rect(40, currentY, 532, 24, "F");

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("CRITERIA", 50, currentY + 16);
  doc.text("MAX", 430, currentY + 16);
  doc.text("SCORE", 500, currentY + 16);

  const breakdown = bid.scoringBreakdown || {
    certifications: 20,
    pastPerformance: 20,
    laborCapacity: 20,
    equipmentReadiness: 20
  };

  const rows = [
    { label: "Technical Certifications & Compliance", max: "25 pts", score: `${breakdown.certifications} pts` },
    { label: "Past Performance & Past Contracts", max: "25 pts", score: `${breakdown.pastPerformance} pts` },
    { label: "Labor & Staffing Capacity", max: "25 pts", score: `${breakdown.laborCapacity} pts` },
    { label: "Equipment Readiness & Response Time", max: "25 pts", score: `${breakdown.equipmentReadiness} pts` }
  ];

  rows.forEach((row, i) => {
    currentY += 24;
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(40, currentY, 532, 24, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(row.label, 50, currentY + 16);
    doc.text(row.max, 430, currentY + 16);
    doc.setFont("helvetica", "bold");
    doc.text(row.score, 500, currentY + 16);
  });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Confidential — Generated automatically by BidPulse Procurement Intelligence System.", 40, 750);

  doc.save(`${bid.id}_Procurement_Summary.pdf`);
}
