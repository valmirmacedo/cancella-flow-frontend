import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';
import logo from '../assets/logo_login.svg';
import api from '../services/api';
import { generateStrongPassword } from '../utils/passwordGenerator';
import PasswordResetModal from '../components/Users/PasswordResetModal';

function SignupPage() {
  useEffect(() => {
    document.title = 'Solicitações NID - Cadastro';
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ra_matricula: '',
    email: '@telefonica.com' // Pré-preenchido com o domínio
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState({ show: false, username: '', password: '' });
  const [raIsValid, setRaIsValid] = useState(null); // null = não validado, true = válido, false = inválido
  const [emailIsValid, setEmailIsValid] = useState(null);

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ra_matricula') {
      // Validar que é apenas números
      // Permite apenas dígitos e limita a 8 caracteres
      const sanitizedValue = value.replace(/\D/g, '').substring(0, 8);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      
      // Validação visual sem mensagem
      if (sanitizedValue) {
        setRaIsValid(sanitizedValue.length === 8);
      } else {
        setRaIsValid(null); // Campo vazio - estado neutro
      }
    } else if (name === 'email') {
      // Garantir que o e-mail sempre contenha @telefonica.com
      let newEmail = value;
      if (!value.includes('@')) {
        newEmail = value + '@telefonica.com';
      }
      setFormData(prev => ({ ...prev, [name]: newEmail }));
      
      if (newEmail) {
        setEmailIsValid(validateEmail(newEmail));
      } else {
        setEmailIsValid(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação final do RA/Matrícula
    if (formData.ra_matricula.length !== 8) {
      setRaIsValid(false);
      setError('RA/Matrícula deve conter exatamente 8 dígitos numéricos.');
      return;
    }

    // Validação de e-mail
    if (!validateEmail(formData.email)) {
      setEmailIsValid(false);
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const password = generateStrongPassword();
      // Usar o RA/Matrícula como username, em vez de gerar a partir do nome
      const username = formData.ra_matricula;
      
      const userData = {
        username,
        password: password.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        ra_matricula: formData.ra_matricula,
        email: formData.email.trim(),
        first_access: true,
        is_ativo: true
      };

      const response = await api.post('/access/signup/', userData);

      if (response.status === 201 || response.status === 200) {
        // Mostrar modal com a senha gerada
        setResetPassword({ 
          show: true, 
          username: username, // Não precisa converter para minúsculas, pois já é apenas números
          password: password.trim() 
        });
      } else {
        setError(response.data.error || 'Erro ao criar cadastro');
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      // Extrair a mensagem de erro da resposta da API
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Erro ao criar cadastro. Verifique os dados e tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setResetPassword({ show: false, username: '', password: '' });
    // Redirecionar para a página de login após o cadastro bem-sucedido
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <Link to="/">
            <img src={logo} alt="Logo" height="40" />
          </Link>
          <h2>Cadastre-se</h2>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder=" "
                value={formData.first_name}
                onChange={handleChange}
                required
                maxLength={30}
              />
              <label htmlFor="first_name">Primeiro Nome</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder=" "
                value={formData.last_name}
                onChange={handleChange}
                required
                maxLength={30}
              />
              <label htmlFor="last_name">Último Nome</label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group matricula-field">
              <input
                type="text"
                id="ra_matricula"
                name="ra_matricula"
                placeholder=" "
                value={formData.ra_matricula}
                onChange={handleChange}
                required
                inputMode="numeric"
                className={`${raIsValid === false ? 'input-error' : ''} ${raIsValid === true ? 'input-valid' : ''}`}
              />
              <label htmlFor="ra_matricula">RA/Matrícula (8 dígitos)</label>
            </div>

            <div className="form-group email-field">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
                className={`${emailIsValid === false ? 'input-error' : ''} ${emailIsValid === true ? 'input-valid' : ''}`}
              />
              <label htmlFor="email">E-mail</label>
            </div>
          </div>

          {error && <div className="error-balloon">{error}</div>}

          <button 
            type="submit" 
            className="signup-button" 
            disabled={loading || 
                     raIsValid === false || 
                     emailIsValid === false || 
                     (formData.ra_matricula && formData.ra_matricula.length !== 8) ||
                     !formData.email}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          
          <div className="login-link">
            Já possui cadastro? <Link to="/login">Faça login aqui</Link>
          </div>
        </form>
      </div>

      {resetPassword.show && (
        <PasswordResetModal
          title="Cadastro Realizado com Sucesso"
          subtitle={`Seu usuário: ${resetPassword.username}`}
          message="Por favor, aguarde a liberação do acesso ao sistema."
          password={resetPassword.password}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default SignupPage;
