const Report = require('../models/Report');
const ProblemCategory = require('../models/ProblemCategory');
const logger = require('../utils/logger');

// Buildings list
const buildings = ['Prédio A', 'Prédio B', 'Prédio C', 'Prédio D', 'Biblioteca', 'Refeitório'];

// Floors list
const floors = ['Térreo', '1º Andar', '2º Andar', '3º Andar'];

// Create a new report
const createReport = async (req, res) => {
  try {
    const reportData = req.body;
    
    // Create the report
    const report = await Report.create(reportData);
    
    logger.info(`New report created with ID: ${report.id} by RA: ${reportData.ra}`);
    
    res.status(201).json({
      success: true,
      message: 'Obrigado pela sua contribuição!',
      report_id: report.id
    });
  } catch (error) {
    logger.error('Error creating report:', error);
    res.status(500).json({
      error: 'Falha ao criar reporte',
      message: error.message
    });
  }
};

// Get problem categories
const getCategories = async (req, res) => {
  try {
    const categories = await ProblemCategory.getAllGrouped();
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Falha ao buscar categorias',
      message: error.message
    });
  }
};

// Get buildings
const getBuildings = async (req, res) => {
  try {
    res.json({
      success: true,
      buildings
    });
  } catch (error) {
    logger.error('Error fetching buildings:', error);
    res.status(500).json({
      error: 'Falha ao buscar prédios',
      message: error.message
    });
  }
};

// Get floors
const getFloors = async (req, res) => {
  try {
    // Filter floors by building if provided
    const { predio } = req.query;
    let filteredFloors = floors;
    
    // In a real application, you might have different floors for different buildings
    // For now, we'll return all floors
    
    res.json({
      success: true,
      floors: filteredFloors
    });
  } catch (error) {
    logger.error('Error fetching floors:', error);
    res.status(500).json({
      error: 'Falha ao buscar andares',
      message: error.message
    });
  }
};

module.exports = {
  createReport,
  getCategories,
  getBuildings,
  getFloors
};