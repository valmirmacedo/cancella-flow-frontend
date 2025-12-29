/**
 * Valida placa de veículo brasileira
 * Aceita formatos: ABC-1234, ABC1234 (antigo) ou ABC1D23, ABC-1D23 (Mercosul)
 * @param {string} placa - Placa a ser validada
 * @returns {boolean} - true se válida, false caso contrário
 */
export function validatePlaca(placa) {
  if (!placa) return false;
  
  // Remove espaços, hífens e converte para maiúsculas
  const placaLimpa = placa.trim().toUpperCase().replace(/[-\s]/g, '');
  
  // Formato antigo: 3 letras + 4 números (ABC1234)
  const formatoAntigo = /^[A-Z]{3}\d{4}$/;
  
  // Formato Mercosul: 3 letras + 1 número + 1 letra + 2 números (ABC1D23)
  const formatoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  
  return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa);
}

/**
 * Formata placa de veículo brasileira
 * Adiciona hífen no formato apropriado (ABC-1234 ou ABC-1D23)
 * @param {string} placa - Placa a ser formatada
 * @returns {string} - Placa formatada ou string original se inválida
 */
export function formatPlaca(placa) {
  if (!placa || typeof placa !== 'string') return '';
  
  // Remove espaços, hífens e converte para maiúsculas
  const placaLimpa = placa.trim().toUpperCase().replace(/[-\s]/g, '');
  
  // Formato antigo: ABC-1234
  if (/^[A-Z]{3}\d{4}$/.test(placaLimpa)) {
    return `${placaLimpa.slice(0, 3)}-${placaLimpa.slice(3)}`;
  }
  
  // Formato Mercosul: ABC-1D23
  if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(placaLimpa)) {
    return `${placaLimpa.slice(0, 3)}-${placaLimpa.slice(3)}`;
  }
  
  // Retorna placa limpa em maiúsculas se não se encaixar nos formatos
  return placaLimpa;
}

/**
 * Normaliza placa para envio ao backend
 * Remove hífen e espaços, converte para maiúsculas
 * @param {string} placa - Placa a ser normalizada
 * @returns {string} - Placa normalizada
 */
export function normalizePlaca(placa) {
  if (!placa) return '';
  return placa.trim().toUpperCase().replace(/[-\s]/g, '');
}

/**
 * Máscara de input para placa (aceita typing livre e aplica maiúsculas)
 * @param {string} value - Valor atual do input
 * @returns {string} - Valor com máscara aplicada
 */
export function maskPlaca(value) {
  if (!value) return '';
  
  // Remove caracteres não permitidos e converte para maiúsculas
  let cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  
  // Limita a 8 caracteres (7 + hífen)
  if (cleaned.length > 8) {
    cleaned = cleaned.slice(0, 8);
  }
  
  return cleaned;
}
