const { Op } = require('sequelize');
const { Visitor } = require('../models');
const AppError = require('../utils/AppError');
const excel = require('exceljs');
const PDFDocument = require('pdfkit');

class VisitorService {
    async createVisitor(data) {
        return await Visitor.create(data);
    }

    async getAllVisitors(query) {
        const { page = 1, limit = 10, search, status, fromDate, toDate } = query;
        const offset = (page - 1) * limit;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { plate_number: { [Op.iLike]: `%${search}%` } },
                { visitor_name: { [Op.iLike]: `%${search}%` } },
                { mobile_number: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (status) {
            whereClause.status = status;
        }

        if (fromDate && toDate) {
            whereClause.visit_date = {
                [Op.between]: [fromDate, toDate]
            };
        }

        const { count, rows } = await Visitor.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'plate_number', 'visit_date', 'entry_time', 'entry_gate', 'visitor_name', 'mobile_number', 'purpose', 'vehicle_type', 'status', 'exit_time', 'exit_gate', 'notes', 'createdAt', 'updatedAt']
        });

        return {
            visitors: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getVisitorById(id) {
        const visitor = await Visitor.findByPk(id);
        if (!visitor) {
            throw new AppError('Visitor not found', 404);
        }
        return visitor;
    }

    async updateVisitor(id, data) {
        const visitor = await Visitor.findByPk(id);
        if (!visitor) {
            throw new AppError('Visitor not found', 404);
        }
        return await visitor.update(data);
    }

    async deleteVisitor(id) {
        const visitor = await Visitor.findByPk(id);
        if (!visitor) {
            throw new AppError('Visitor not found', 404);
        }
        await visitor.destroy();
    }

    async generateExcel(query) {
        const visitors = await Visitor.findAll({ where: query });
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Visitors');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'visitor_name', width: 20 },
            { header: 'Plate Number', key: 'plate_number', width: 15 },
            { header: 'Mobile', key: 'mobile_number', width: 15 },
            { header: 'Purpose', key: 'purpose', width: 20 },
            { header: 'Entry Time', key: 'entry_time', width: 15 },
            { header: 'Status', key: 'status', width: 10 }
        ];

        worksheet.addRows(visitors);
        return workbook;
    }

    generatePDF(query) {
        const doc = new PDFDocument();

        // Start async process
        (async () => {
            try {
                const visitors = await Visitor.findAll({ where: query });

                // Add title
                doc.fontSize(20).text('Visitor Report', { align: 'center' });
                doc.moveDown();

                // Add timestamp
                doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
                doc.moveDown();

                // Define table columns and positions
                const tableTop = 150;
                const col1Left = 50;  // ID
                const col2Left = 100; // Name
                const col3Left = 250; // Plate
                const col4Left = 350; // Mobile
                const col5Left = 450; // Purpose

                doc.font('Helvetica-Bold');
                doc.text('ID', col1Left, tableTop);
                doc.text('Name', col2Left, tableTop);
                doc.text('Plate', col3Left, tableTop);
                doc.text('Mobile', col4Left, tableTop);
                doc.text('Purpose', col5Left, tableTop);

                doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

                let y = tableTop + 25;
                doc.font('Helvetica');

                visitors.forEach(visitor => {
                    if (y > 700) {
                        doc.addPage();
                        y = 50;
                    }

                    doc.text(visitor.id.toString(), col1Left, y);
                    doc.text(visitor.visitor_name, col2Left, y);
                    doc.text(visitor.plate_number || '-', col3Left, y);
                    doc.text(visitor.mobile_number, col4Left, y);
                    doc.text(visitor.purpose, col5Left, y);

                    y += 20;
                });
            } catch (error) {
                // Handle error
                doc.text(`Error generating report: ${error.message}`);
            } finally {
                doc.end();
            }
        })();

        return doc;
    }
}

module.exports = new VisitorService();
