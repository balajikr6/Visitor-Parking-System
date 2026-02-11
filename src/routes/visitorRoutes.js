const express = require('express');
const visitorController = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes below are protected

router.route('/')
    .get(visitorController.getAllVisitors)
    .post(visitorController.createVisitor);

router.get('/download/excel', visitorController.downloadExcel);
router.get('/download/pdf', visitorController.downloadPDF);

router.route('/:id')
    .get(visitorController.getVisitor)
    .put(visitorController.updateVisitor)
    .delete(visitorController.deleteVisitor);

module.exports = router;
