import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import asyncHandler from "express-async-handler";
import db from "../config/db.js";

export const generatePDF = asyncHandler(async (req, res, next) => {
  const id_consultation = req.params.id_consultation;

  // Fetch the consultation data from the database
  const consultation = await db.consultation.findUnique({
    where: { id_consultation },
    include: {
      patient: true,
    },
  });

  if (!consultation) {
    return res.status(404).json({ message: "Consultation not found" });
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed the standard font
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Add a new page to the document
  const page = await pdfDoc.addPage();

  // Define the font size and color
  const fontSize = 12;
  const fontColor = rgb(0, 0, 0);

  // Add the consultation details to the PDF
  page.drawText(`Consultation ID: ${consultation.id_consultation}`, {
    x: 50,
    y: page.getHeight() - 50,
    size: fontSize,
    font,
    color: fontColor,
  });
  page.drawText(
    `Patient: ${consultation.patient.prenom_patient} ${consultation.patient.nom_patient}`,
    {
      x: 50,
      y: page.getHeight() - 75,
      size: fontSize,
      font,
      color: fontColor,
    }
  );
  page.drawText(
    `Date: ${consultation.date_consultation.toLocaleDateString()}`,
    {
      x: 50,
      y: page.getHeight() - 100,
      size: fontSize,
      font,
      color: fontColor,
    }
  );
  page.drawText(`Motif: ${consultation.motif}`, {
    x: 50,
    y: page.getHeight() - 125,
    size: fontSize,
    font,
    color: fontColor,
  });
  page.drawText(`Statut: ${consultation.status}`, {
    x: 50,
    y: page.getHeight() - 150,
    size: fontSize,
    font,
    color: fontColor,
  });

  // Save the PDF document
  const pdfBytes = await pdfDoc.save();

  // Send the PDF as a response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=consultation_${consultation.id_consultation}.pdf`
  );
  res.send(pdfBytes);
});
