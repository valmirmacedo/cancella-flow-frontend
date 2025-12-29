import React, { useState } from 'react';
import { FaSave, FaTimes, FaBuilding } from 'react-icons/fa';
import api from '../../services/api';
import GenericDropdown from '../common/GenericDropdown';

function AddCompanyDropdown({ onClose, onSuccess, triggerRef }) {
  const [formData, setFormData] = useState({
    nome: '',
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cadastro/empresa/', formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      alert('Erro ao adicionar empresa');
    }
  };

  return (
    <GenericDropdown
      title="Nova Empresa"
      onClose={onClose}
      icon={<FaBuilding size={18} />}
      className="add-company-dropdown"
  position="center"
      triggerRef={triggerRef}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome da empresa"
              required
              maxLength={50}
            />
            <label>Nome da Empresa*</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Status da Empresa</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-button ${formData.status ? 'active' : ''}`}
                onClick={() => setFormData({...formData, status: true})}
              >
                Ativo
              </button>
              <button
                type="button"
                className={`role-button ${!formData.status ? 'active' : ''}`}
                onClick={() => setFormData({...formData, status: false})}
              >
                Inativo
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onClose}>
            <FaTimes /> Cancelar
          </button>
          <button type="submit" className="button-primary">
            <FaSave /> Criar Empresa
          </button>
        </div>
      </form>
    </GenericDropdown>
  );
}

export default AddCompanyDropdown;
