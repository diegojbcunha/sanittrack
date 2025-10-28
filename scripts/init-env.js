#!/usr/bin/env node

/**
 * Script de inicialização do ambiente
 * Ajuda a configurar o arquivo .env com base no .env.example
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 SanitTrack - Script de Inicialização do Ambiente');
console.log('==================================================\n');

// Verifica se o arquivo .env já existe
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env já existe. Nenhuma ação necessária.');
  process.exit(0);
}

// Copia o .env.example para .env se não existir
if (fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado com base no .env.example');
    
    // Gera uma chave JWT segura
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    console.log(`🔐 Chave JWT gerada: ${jwtSecret.substring(0, 10)}... (mantenha em segredo)`);
    
    // Lê o conteúdo do arquivo .env
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Substitui a chave JWT placeholder por uma chave segura
    envContent = envContent.replace(
      /JWT_SECRET=.*$/,
      `JWT_SECRET=${jwtSecret}`
    );
    
    // Escreve o conteúdo atualizado
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n📝 Próximos passos:');
    console.log('1. Edite o arquivo .env com suas credenciais reais');
    console.log('2. Configure seu banco de dados PostgreSQL');
    console.log('3. Execute: npm run setup');
    console.log('4. Execute: npm run seed');
    console.log('5. Execute: npm run dev');
    
  } catch (error) {
    console.error('❌ Erro ao criar o arquivo .env:', error.message);
    process.exit(1);
  }
} else {
  console.log('❌ Arquivo .env.example não encontrado. Por favor, verifique a instalação.');
  process.exit(1);
}

console.log('\n✅ Ambiente inicializado com sucesso!');