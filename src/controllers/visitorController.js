const visitorService = require('../services/visitorService');
const AppError = require('../utils/AppError');
const fs = require('fs');
const PDFDocument = require('pdfkit');

exports.createVisitor = async (req, res, next) => {
    try {
        const visitor = await visitorService.createVisitor(req.body);
        res.status(201).json({
            status: 'success',
            data: { visitor }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllVisitors = async (req, res, next) => {
    try {
        const result = await visitorService.getAllVisitors(req.query);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.getVisitor = async (req, res, next) => {
    try {
        const visitor = await visitorService.getVisitorById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { visitor }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateVisitor = async (req, res, next) => {
    try {
        const visitor = await visitorService.updateVisitor(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: { visitor }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteVisitor = async (req, res, next) => {
    try {
        await visitorService.deleteVisitor(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadExcel = async (req, res, next) => {
    try {
        const workbook = await visitorService.generateExcel(req.query);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=visitors.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        next(error);
    }
};

exports.downloadPDF = async (req, res, next) => {
    try {
        const doc = visitorService.generatePDF(req.query);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=visitors.pdf');

        doc.pipe(res);
        // doc.end() is called in the service
    } catch (error) {
        next(error);
    }
};
