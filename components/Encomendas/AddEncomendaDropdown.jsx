import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaBox } from 'react-icons/fa';
import api from '../../services/api';
import Select from 'react-select';
import GenericDropdown from '../common/GenericDropdown';

function AddEncomendaDropdown({ onClose, onEncomendaAdded, triggerRef }) {
  const [formData, setFormData] = useState({
    unidade_id: '',
    destinatario_nome: '',
    descricao: '',
    codigo_rastreio: '',
  });
  const [unidades, setUnidades] = useState([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        setLoadingUnidades(true);
        // Buscar lista de unidades
        const response = await api.get('/cadastros/unidades/');
        
        const unidadesList = response.data.results || response.data || [];
        setUnidades(unidadesList);
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
        setUnidades([]);
      } finally {
        setLoadingUnidades(false);
      }
    };

    fetchUnidades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.unidade_id) {
      alert('Por favor, selecione uma unidade');
      return;
    }

    if (!formData.destinatario_nome?.trim()) {
      alert('Por favor, informe o nome do destinatário');
      return;
    }

    if (!formData.descricao?.trim()) {
      alert('Por favor, informe a descrição da encomenda');
      return;
    }
    
    try {
      const payload = {
        unidade_id: formData.unidade_id,
        destinatario_nome: formData.destinatario_nome.trim(),
        descricao: formData.descricao.trim(),
        codigo_rastreio: formData.codigo_rastreio?.trim() || '',
      };

      await api.post('/cadastros/encomendas/create/', payload);
      
      alert('Encomenda cadastrada com sucesso!');
      onEncomendaAdded();
      onClose();
      
    } catch (error) {
      console.error('Erro ao criar encomenda:', error);
      alert('Erro ao cadastrar encomenda: ' + (error.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderColor: state.isFocused ? '#2abb98' : 'rgba(25, 41, 74, 0.2)',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(42, 187, 152, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#2abb98'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2abb98' : state.isFocused ? 'rgba(42, 187, 152, 0.1)' : 'white',
      color: state.isSelected ? 'white' : '#19294a',
      '&:active': {
        backgroundColor: '#2abb98'
      }
    })
  };

  return (
    <GenericDropdown
      title="Nova Encomenda"
      onClose={onClose}
      icon={<FaBox size={18} />}
      className="add-encomenda-dropdown"
  position="center"
      triggerRef={triggerRef}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Unidade*</label>
          {loadingUnidades ? (
            <div style={{ padding: '10px', textAlign: 'center' }}>Carregando unidades...</div>
          ) : (
            <Select
              options={unidades.map(unidade => ({
                value: unidade.id,
                label: unidade.identificacao_completa || `${unidade.bloco || ''} ${unidade.numero || ''}`
              }))}
              value={unidades.find(u => u.id === formData.unidade_id) ? {
                value: formData.unidade_id,
                label: unidades.find(u => u.id === formData.unidade_id).identificacao_completa || 
                       `${unidades.find(u => u.id === formData.unidade_id).bloco || ''} ${unidades.find(u => u.id === formData.unidade_id).numero || ''}`
              } : null}
              onChange={(selectedOption) => setFormData(prev => ({
                ...prev,
                unidade_id: selectedOption?.value || ''
              }))}
              placeholder="Selecione a unidade"
              isClearable
              styles={customSelectStyles}
            />
          )}
        </div>

        <div className="form-field">
          <input
            required
            type="text"
            value={formData.destinatario_nome}
            onChange={e => setFormData({...formData, destinatario_nome: e.target.value})}
            placeholder="Ex: João Silva"
            maxLength={255}
          />
          <label>Nome do Destinatário*</label>
        </div>

        <div className="form-field">
          <input
            required
            type="text"
            value={formData.descricao}
            onChange={e => setFormData({...formData, descricao: e.target.value})}
            placeholder="Ex: Caixa pequena, envelope, pacote..."
            maxLength={200}
          />
          <label>Descrição*</label>
        </div>

        <div className="form-field">
          <input
            type="text"
            value={formData.codigo_rastreio}
            onChange={e => setFormData({...formData, codigo_rastreio: e.target.value})}
            placeholder="Ex: BR123456789XX"
            maxLength={50}
          />
          <label>Código de Rastreio</label>
        </div>

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onClose}>
            <FaTimes /> Cancelar
          </button>
          <button 
            type="submit" 
            className="button-primary"
          >
            <FaSave /> Cadastrar Encomenda
          </button>
        </div>
      </form>
    </GenericDropdown>
  );
}

export default AddEncomendaDropdown;
