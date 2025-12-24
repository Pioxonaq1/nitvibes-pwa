'use server'

export async function verifyTeamCredentials(email: string, pass: string) {
  // 1. Recuperamos las variables de Vercel
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;
  const collabEmail = process.env.COLLAB_EMAIL;
  const collabPass = process.env.COLLAB_PASSWORD || process.env.ADMIN_PASSWORD;

  // 2. CHEQUEO DE ADMIN
  // Usamos trim() para seguridad contra espacios accidentales
  if (adminEmail && email.trim() === adminEmail.trim() && adminPass && pass.trim() === adminPass.trim()) {
    return { success: true, role: 'admin' };
  }

  // 3. CHEQUEO DE COLLABORATOR
  if (collabEmail && email.trim() === collabEmail.trim() && collabPass && pass.trim() === collabPass.trim()) {
    return { success: true, role: 'collab' };
  }
  
  // 4. FALLO
  return { success: false, role: null };
}
