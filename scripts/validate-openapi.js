/**
 * Script untuk validasi file OpenAPI YAML
 * 
 * Cara menggunakan:
 * node scripts/validate-openapi.js
 */

const fs = require('fs');
const path = require('path');

// Warna untuk output console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateYAMLStructure(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic YAML validation checks (critical only)
    const checks = {
      'OpenAPI Version': content.includes('openapi:'),
      'Info Section': content.includes('info:'),
      'Paths Section': content.includes('paths:'),
      'Valid Indentation': !content.match(/^\t/gm), // No tabs
      'Components Section': content.includes('components:'),
      'Schemas Defined': content.includes('schemas:'),
    };

    // Warnings (non-critical)
    const warnings = {
      'No Trailing Spaces': !content.match(/ $/gm),
    };

    const allPassed = Object.values(checks).every(v => v);
    
    return {
      valid: allPassed,
      checks,
      warnings,
      content
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

function countEndpoints(content) {
  const getMatches = (content.match(/get:/g) || []).length;
  const postMatches = (content.match(/post:/g) || []).length;
  const putMatches = (content.match(/put:/g) || []).length;
  const patchMatches = (content.match(/patch:/g) || []).length;
  const deleteMatches = (content.match(/delete:/g) || []).length;

  return {
    GET: getMatches,
    POST: postMatches,
    PUT: putMatches,
    PATCH: patchMatches,
    DELETE: deleteMatches,
    total: getMatches + postMatches + putMatches + patchMatches + deleteMatches
  };
}

function validateFile(filePath, serviceName) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Validating: ${serviceName}`, 'cyan');
  log(`File: ${filePath}`, 'cyan');
  log('='.repeat(60), 'cyan');

  if (!fs.existsSync(filePath)) {
    log('❌ File tidak ditemukan!', 'red');
    return false;
  }

  const result = validateYAMLStructure(filePath);

  if (result.error) {
    log(`❌ Error membaca file: ${result.error}`, 'red');
    return false;
  }

  log('\n📋 Hasil Validasi Struktur:', 'yellow');
  for (const [check, passed] of Object.entries(result.checks)) {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`  ${icon} ${check}`, color);
  }

  if (result.warnings && Object.keys(result.warnings).length > 0) {
    log('\n⚠️  Peringatan (Non-Critical):', 'yellow');
    for (const [warning, passed] of Object.entries(result.warnings)) {
      const icon = passed ? '✅' : '⚠️';
      const color = passed ? 'green' : 'yellow';
      log(`  ${icon} ${warning}`, color);
    }
  }

  // Count endpoints
  const endpoints = countEndpoints(result.content);
  log('\n📊 Statistik Endpoints:', 'yellow');
  log(`  GET:    ${endpoints.GET}`, 'blue');
  log(`  POST:   ${endpoints.POST}`, 'blue');
  log(`  PUT:    ${endpoints.PUT}`, 'blue');
  log(`  PATCH:  ${endpoints.PATCH}`, 'blue');
  log(`  DELETE: ${endpoints.DELETE}`, 'blue');
  log(`  ──────────────`, 'blue');
  log(`  Total:  ${endpoints.total}`, 'green');

  // File size
  const stats = fs.statSync(filePath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);
  log(`\n📏 Ukuran File: ${fileSizeKB} KB`, 'yellow');

  if (result.valid) {
    log('\n✅ Validasi BERHASIL - File OpenAPI valid!', 'green');
    return true;
  } else {
    log('\n❌ Validasi GAGAL - Ada masalah dengan struktur file!', 'red');
    return false;
  }
}

function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🔍 OpenAPI YAML Validator', 'cyan');
  log('Digital Payment E-Wallet API Documentation', 'cyan');
  log('='.repeat(60), 'cyan');

  const files = [
    {
      path: path.join(process.cwd(), 'openapi.yaml'),
      name: 'Combined API Documentation (Root)'
    },
    {
      path: path.join(process.cwd(), 'backend', 'user-service', 'openapi.yaml'),
      name: 'User Service API'
    },
    {
      path: path.join(process.cwd(), 'backend', 'payment-service', 'openapi.yaml'),
      name: 'Payment Service API'
    }
  ];

  let allValid = true;

  for (const file of files) {
    const isValid = validateFile(file.path, file.name);
    if (!isValid) {
      allValid = false;
    }
  }

  log('\n' + '='.repeat(60), 'cyan');
  if (allValid) {
    log('✅ SEMUA FILE VALID - Ready to use!', 'green');
    log('\n💡 Cara Menggunakan:', 'yellow');
    log('  1. Buka https://editor.swagger.io/', 'blue');
    log('  2. Import salah satu file YAML', 'blue');
    log('  3. Atau akses Swagger UI yang sudah terintegrasi:', 'blue');
    log('     - User Service: http://localhost:8001/api-docs', 'cyan');
    log('     - Payment Service: http://localhost:8002/api-docs', 'cyan');
  } else {
    log('❌ ADA FILE YANG TIDAK VALID - Perbaiki error di atas', 'red');
  }
  log('='.repeat(60) + '\n', 'cyan');

  process.exit(allValid ? 0 : 1);
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = { validateYAMLStructure, countEndpoints };

