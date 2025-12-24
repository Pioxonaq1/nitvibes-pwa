'use server'

export async function verifyTeamCredentials(email: string, pass: string) {
  // Recuperamos las variables reales de Vercel (Lado Servidor)
  const validEmail = process.env.COLLAB_EMAIL;
  const validPass = process.env.ADMIN_PASSWORD;

  // Comprobación estricta
  if (email === validEmail && pass === validPass) {
    return { success: true };
  }
  
  return { success: false };
}
