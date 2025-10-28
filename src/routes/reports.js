// routes/reports.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { validateReport, checkValidation } = require('../middleware/validation');
const { rateLimitByRA } = require('../middleware/rateLimiter');

// Criar novo reporte
router.post('/', validateReport, checkValidation, rateLimitByRA, async (req, res) => {
  const { name, categoryId, buildingId, floorId, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reports (name, category_id, building_id, floor_id, description, status)
       VALUES ($1, $2, $3, $4, $5, 'open') RETURNING *`,
      [name, categoryId, buildingId, floorId, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar reporte:', err);
    res.status(500).json({ error: 'Erro interno ao criar reporte' });
  }
});

// Listar categorias
router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Listar prédios
router.get('/predios', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM buildings ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar prédios:', err);
    res.status(500).json({ error: 'Erro ao buscar prédios' });
  }
});

// Listar andares
router.get('/andares', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, floor_number, building_id FROM floors ORDER BY building_id, floor_number');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar andares:', err);
    res.status(500).json({ error: 'Erro ao buscar andares' });
  }
});

module.exports = router;