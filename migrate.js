const fs = require('fs');
const path = require('path');

// 1. CONFIGURACIÓN DE RUTAS
const root = process.cwd();
const appDir = path.join(root, 'app');
const compDir = path.join(root, 'components');

console.log('🚀 INICIANDO MIGRACIÓN CON NODE.JS...');
console.log(`📂 Directorio base: ${root}`);

// Función para crear carpetas recursivamente
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${path.relative(root, dirPath)}`);
  }
};

// Función para mover archivos
const moveFile = (oldPath, newPath) => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`🚚 Movido: ${path.basename(oldPath)} -> ${path.relative(root, newPath)}`);
  } else {
    console.log(`⚠️ No encontrado (saltando): ${path.relative(root, oldPath)}`);
  }
};

// Función para mover contenido de carpetas
const moveFolderContent = (src, dest) => {
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    files.forEach(file => {
      moveFile(path.join(src, file), path.join(dest, file));
    });
    // Intentar borrar carpeta vieja si quedó vacía
    try { fs.rmdirSync(src); } catch (e) {}
  }
};

// Función para reemplazar texto en archivos (sed)
const replaceInFile = (filePath, searchValue, replaceValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchValue)) {
      content = content.split(searchValue).join(replaceValue);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🔧 Actualizado código en: ${path.relative(root, filePath)}`);
    }
  }
};

// --- EJECUCIÓN ---

// A. Crear Estructura (roles)
const rolesPath = path.join(appDir, '(roles)');
createDir(path.join(rolesPath, 'team/dashboard'));
createDir(path.join(rolesPath, 'team/components'));
createDir(path.join(rolesPath, 'partner/dashboard'));
createDir(path.join(rolesPath, 'partner/components'));
createDir(path.join(rolesPath, 'viber/dashboard'));
createDir(path.join(rolesPath, 'viber/components'));
createDir(path.join(rolesPath, 'gov/dashboard'));
createDir(path.join(rolesPath, 'gov/components'));

// B. Mover Dashboards (Pages)
moveFile(path.join(appDir, 'admin/page.tsx'), path.join(rolesPath, 'team/dashboard/page.tsx'));
moveFile(path.join(appDir, 'business/page.tsx'), path.join(rolesPath, 'partner/dashboard/page.tsx'));
moveFile(path.join(appDir, 'gov/page.tsx'), path.join(rolesPath, 'gov/dashboard/page.tsx'));
moveFile(path.join(appDir, 'viber/page.tsx'), path.join(rolesPath, 'viber/dashboard/page.tsx'));

// C. Mover Componentes de Team
const oldTeamCompPath = path.join(compDir, 'dashboard/team');
const newTeamCompPath = path.join(rolesPath, 'team/components');
moveFolderContent(oldTeamCompPath, newTeamCompPath);

// Limpiar carpetas viejas de components si están vacías
try { fs.rmdirSync(path.join(compDir, 'dashboard')); } catch (e) {}
// Limpiar carpetas viejas de app si están vacías
try { fs.rmdirSync(path.join(appDir, 'admin')); } catch (e) {}
try { fs.rmdirSync(path.join(appDir, 'business')); } catch (e) {}
try { fs.rmdirSync(path.join(appDir, 'gov')); } catch (e) {}
try { fs.rmdirSync(path.join(appDir, 'viber')); } catch (e) {}

// D. Actualizar Referencias en Código
const perfilPage = path.join(appDir, 'perfil/page.tsx');
const loginPage = path.join(appDir, 'login/page.tsx');
const bottomMenu = path.join(compDir, 'BottomMenu.tsx');
const teamDashPage = path.join(rolesPath, 'team/dashboard/page.tsx');

// Actualizar Perfil
replaceInFile(perfilPage, "'/admin'", "'/team/dashboard'");
replaceInFile(perfilPage, "'/business'", "'/partner/dashboard'");
replaceInFile(perfilPage, "'/gov'", "'/gov/dashboard'");
replaceInFile(perfilPage, "'/viber'", "'/viber/dashboard'");

// Actualizar Login
replaceInFile(loginPage, "'/admin'", "'/team/dashboard'");
replaceInFile(loginPage, "'/business'", "'/partner/dashboard'");
replaceInFile(loginPage, "'/gov'", "'/gov/dashboard'");

// Actualizar Menu
replaceInFile(bottomMenu, "'/admin'", "'/team/dashboard'");
replaceInFile(bottomMenu, "'/business'", "'/partner/dashboard'");
replaceInFile(bottomMenu, "'/gov'", "'/gov/dashboard'");
// Active states en Menu
replaceInFile(bottomMenu, "pathname.includes('/admin')", "pathname.includes('/team')");
replaceInFile(bottomMenu, "pathname.includes('/business')", "pathname.includes('/partner')");

// Actualizar Import en Team Dashboard
replaceInFile(teamDashPage, '@/components/dashboard/team/', '../components/');

console.log('✨ ¡MIGRACIÓN COMPLETADA! ✨');
console.log('Ahora puedes borrar el archivo migrate.js');