const fs = require('fs');
const path = require('path');

const outputFile = 'AUDITORIA_NITVIBES.txt';
let report = `AUDITORÍA DE PROYECTO - ${new Date().toISOString()}\n`;
report += `=================================================\n\n`;

function append(text) { report += text + '\n'; }

// 1. ESCANEO DE ESTRUCTURA (Ignorando node_modules y .git)
append('--- 1. ESTRUCTURA DE CARPETAS ---');
function scanDir(dir, depth = 0) {
    if (depth > 3) return; // Limite de profundidad
    try {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) return;
        
        const items = fs.readdirSync(fullPath);
        items.forEach(item => {
            if (['node_modules', '.git', '.next', '.vscode'].includes(item)) return;
            
            const itemPath = path.join(fullPath, item);
            const stats = fs.statSync(itemPath);
            const indent = '  '.repeat(depth);
            
            if (stats.isDirectory()) {
                append(`${indent}📁 ${item}/`);
                scanDir(path.join(dir, item), depth + 1);
            } else {
                append(`${indent}📄 ${item}`);
            }
        });
    } catch (e) {
        append(`Error leyendo ${dir}: ${e.message}`);
    }
}

// Escaneamos carpetas clave
['app', 'components', 'lib', 'context', 'sanity', 'public', 'types', 'hooks'].forEach(d => {
    append(`\n[ CARPETA: ${d} ]`);
    if (fs.existsSync(d)) {
        scanDir(d);
    } else {
        append('❌ NO EXISTE');
    }
});

// 2. DEPENDENCIAS (package.json)
append('\n--- 2. package.json ---');
if (fs.existsSync('package.json')) {
    try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        append(`Nombre: ${pkg.name}`);
        append('Dependencies:');
        append(JSON.stringify(pkg.dependencies, null, 2));
        append('DevDependencies:');
        append(JSON.stringify(pkg.devDependencies, null, 2));
    } catch (e) {
        append('Error leyendo package.json');
    }
} else {
    append('❌ package.json NO ENCONTRADO');
}

// 3. ARCHIVOS DE CONFIGURACIÓN
append('\n--- 3. VERIFICACIÓN DE CONFIG ---');
['tsconfig.json', 'next.config.mjs', 'tailwind.config.ts', '.env', '.env.local'].forEach(f => {
    const exists = fs.existsSync(f);
    append(`${exists ? '✅' : '❌'} ${f}`);
    if (exists && f === 'tsconfig.json') {
         // Leemos tsconfig para ver los paths
         try {
             const ts = JSON.parse(fs.readFileSync(f, 'utf8'));
             append('   Paths configurados: ' + JSON.stringify(ts.compilerOptions?.paths || {}));
         } catch(e) {}
    }
});

// 4. GUARDAR
fs.writeFileSync(outputFile, report);
console.log(`\n✅ Auditoría completada. Archivo generado: ${outputFile}`);
