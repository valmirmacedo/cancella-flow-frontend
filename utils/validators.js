export const validateCPF = (cpf) => {
  const strCPF = cpf.replace(/[^\d]/g, '');
  if (strCPF.length !== 11) return false;
  
  let sum = 0;
  let rest;
  
  if (strCPF === "00000000000") return false;
  
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  }
  
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(strCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
  }
  
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(strCPF.substring(10, 11))) return false;
  
  return true;
};

export const validateCNPJ = (cnpj) => {
  const strCNPJ = cnpj.replace(/[^\d]/g, '');
  if (strCNPJ.length !== 14) return false;
  
  if (strCNPJ === "00000000000000") return false;
  
  // Validação do primeiro dígito
  let size = strCNPJ.length - 2;
  let numbers = strCNPJ.substring(0, size);
  let digits = strCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Validação do segundo dígito
  size = size + 1;
  numbers = strCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

// Validação simples de telefone brasileiro (10 ou 11 dígitos)
export const validatePhone = (phone) => {
  const digits = String(phone || '').replace(/[^\d]/g, '');
  if (digits.length < 10 || digits.length > 11) return false;
  // Rejeita DDDs iniciando com 0
  if (digits.slice(0, 1) === '0') return false;
  return true;
};

// Validação de CEP (deve ter 8 dígitos)
export const validateCEP = (cep) => {
  const digits = String(cep || '').replace(/[^\d]/g, '');
  return digits.length === 8;
};

// Formata CEP no padrão XXXXX-XXX
export const formatCEP = (cep) => {
  const digits = String(cep || '').replace(/[^\d]/g, '');
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};

// Busca dados do CEP na API Brasil
export const fetchCEPData = async (cep) => {
  const cepLimpo = String(cep || '').replace(/[^\d]/g, '');
  
  if (cepLimpo.length !== 8) {
    return { success: false, error: 'CEP inválido' };
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepLimpo}`);
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        data: {
          logradouro: data.street || '',
          bairro: data.neighborhood || '',
          cidade: data.city || '',
          estado: data.state || '',
          cep: cepLimpo
        }
      };
    } else {
      return { success: false, error: 'CEP não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return { success: false, error: 'Erro ao buscar CEP' };
  }
};
