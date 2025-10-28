// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Validação para criação de reporte (agora alinhada com reports.js)
const validateReport = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome do reporte é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),

  body('categoryId')
    .notEmpty().withMessage('Categoria é obrigatória')
    .isInt({ min: 1 }).withMessage('categoryId deve ser um número inteiro positivo'),

  body('buildingId')
    .notEmpty().withMessage('Prédio é obrigatório')
    .isInt({ min: 1 }).withMessage('buildingId deve ser um número inteiro positivo'),

  body('floorId')
    .notEmpty().withMessage('Andar é obrigatório')
    .isInt({ min: 1 }).withMessage('floorId deve ser um número inteiro positivo'),

  body('description')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 1000 }).withMessage('Descrição deve ter entre 10 e 1000 caracteres')
];

// Validação de login
const validateLogin = [
  body('email')
    .isEmail().withMessage('Email válido é obrigatório')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
];

// Validação de atualização de status
const validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status é obrigatório')
    .isIn(['pendente', 'em_andamento', 'resolvido']).withMessage('Status inválido. Use: pendente, em_andamento ou resolvido'),

  body('observacao')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Observação deve ter no máximo 500 caracteres')
];

// Middleware para verificar erros de validação
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      detalhes: errors.array().map(err => ({
        campo: err.path,
        mensagem: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateReport,
  validateLogin,
  validateStatusUpdate,
  checkValidation
};