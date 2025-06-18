package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import org.springframework.stereotype.Component;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import java.io.File;

@Component
public class PDFGenerator {

    public File createPDF(AppointmentDTO dto) throws Exception {
        String filename = "Appointment_" + System.currentTimeMillis() + ".pdf";
        PdfWriter writer = new PdfWriter(filename);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        doc.add(new Paragraph("🩺 Appointment Slip").setBold().setFontSize(20));
        doc.add(new Paragraph("Doctor ID: " + dto.getDoctorId()));
        doc.add(new Paragraph("Date: " + dto.getDate()));
        doc.add(new Paragraph("Time: " + dto.getTime()));
        doc.add(new Paragraph("Reason: " + dto.getReason()));
        doc.add(new Paragraph("Contact: " + dto.getContact()));

        doc.close();
        return new File(filename);
    }
} 