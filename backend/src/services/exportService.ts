import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Response } from 'express';
import { UserResponse } from '../models/userModel';
import { AuditLog } from '@prisma/client';

export class ExportService {
  /**
   * Export users to PDF
   */
  static async exportUsersToPDF(users: UserResponse[], res: Response): Promise<void> {
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Title
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Users Report', { align: 'center' });

    doc.moveDown();
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.moveDown(2);

    // Table headers
    const tableTop = 150;
    const colWidths = [50, 150, 200, 80];
    const startX = 50;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('#', startX, tableTop)
      .text('Name', startX + colWidths[0], tableTop)
      .text('Email', startX + colWidths[0] + colWidths[1], tableTop)
      .text('Role', startX + colWidths[0] + colWidths[1] + colWidths[2], tableTop);

    // Draw line under headers
    doc
      .moveTo(startX, tableTop + 15)
      .lineTo(500, tableTop + 15)
      .stroke();

    // Table rows
    let y = tableTop + 25;
    doc.font('Helvetica').fontSize(9);

    users.forEach((user, index) => {
      // Check if we need a new page
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc
        .text(String(index + 1), startX, y)
        .text(user.name, startX + colWidths[0], y)
        .text(user.email, startX + colWidths[0] + colWidths[1], y)
        .text(user.role, startX + colWidths[0] + colWidths[1] + colWidths[2], y);

      y += 20;
    });

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .text(
          `Page ${i + 1} of ${pageCount}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
    }

    doc.end();
  }

  /**
   * Export users to Excel
   */
  static async exportUsersToExcel(users: UserResponse[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Set column headers and widths
    worksheet.columns = [
      { header: '#', key: 'index', width: 10 },
      { header: 'ID', key: 'id', width: 38 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data rows
    users.forEach((user, index) => {
      worksheet.addRow({
        index: index + 1,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.createdAt).toLocaleString(),
      });
    });

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A1',
      to: 'F1',
    };

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  }

  /**
   * Export audit logs to PDF
   */
  static async exportAuditLogsToPDF(logs: AuditLog[], res: Response): Promise<void> {
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.pdf');

    doc.pipe(res);

    // Title
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Audit Logs Report', { align: 'center' });

    doc.moveDown();
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.moveDown(2);

    // Table headers
    const tableTop = 150;
    const colWidths = [30, 80, 80, 80, 150];
    const startX = 50;

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('#', startX, tableTop)
      .text('Action', startX + colWidths[0], tableTop)
      .text('Entity', startX + colWidths[0] + colWidths[1], tableTop)
      .text('User ID', startX + colWidths[0] + colWidths[1] + colWidths[2], tableTop)
      .text('Date', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);

    doc
      .moveTo(startX, tableTop + 15)
      .lineTo(700, tableTop + 15)
      .stroke();

    // Table rows
    let y = tableTop + 25;
    doc.font('Helvetica').fontSize(8);

    logs.forEach((log, index) => {
      if (y > 500) {
        doc.addPage();
        y = 50;
      }

      doc
        .text(String(index + 1), startX, y)
        .text(log.action, startX + colWidths[0], y)
        .text(log.entity, startX + colWidths[0] + colWidths[1], y)
        .text(log.userId || 'N/A', startX + colWidths[0] + colWidths[1] + colWidths[2], y, {
          width: 80,
          ellipsis: true,
        })
        .text(
          new Date(log.createdAt).toLocaleString(),
          startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
          y
        );

      y += 20;
    });

    doc.end();
  }

  /**
   * Export audit logs to Excel
   */
  static async exportAuditLogsToExcel(logs: AuditLog[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Audit Logs');

    worksheet.columns = [
      { header: '#', key: 'index', width: 10 },
      { header: 'ID', key: 'id', width: 38 },
      { header: 'User ID', key: 'userId', width: 38 },
      { header: 'Action', key: 'action', width: 25 },
      { header: 'Entity', key: 'entity', width: 20 },
      { header: 'Entity ID', key: 'entityId', width: 38 },
      { header: 'IP Address', key: 'ipAddress', width: 20 },
      { header: 'Date', key: 'createdAt', width: 20 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data
    logs.forEach((log, index) => {
      worksheet.addRow({
        index: index + 1,
        id: log.id,
        userId: log.userId || 'N/A',
        action: log.action,
        entity: log.entity,
        entityId: log.entityId || 'N/A',
        ipAddress: log.ipAddress || 'N/A',
        createdAt: new Date(log.createdAt).toLocaleString(),
      });
    });

    worksheet.autoFilter = { from: 'A1', to: 'H1' };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
