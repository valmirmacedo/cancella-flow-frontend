import React, { useState, useEffect } from 'react';
import { FaUsers, FaTimes, FaSave } from 'react-icons/fa';
import api from '../../services/api';
import GenericDropdown from '../common/GenericDropdown';

function AddTeamDropdown({ onClose, onSuccess, triggerRef }) {
  const [formData, setFormData] = useState({ name: '', sector: '', profile_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoadingProfiles(true);
        const res = await api.get('/access/profiles/', { params: { page: 1, page_size: 200 } });
        if (res.data && Array.isArray(res.data.results)) {
          setProfiles(res.data.results);
        } else if (Array.isArray(res.data)) {
          setProfiles(res.data);
        } else {
          setProfiles([]);
        }
      } catch (err) {
        console.error('Erro ao carregar perfis para AddTeamDropdown:', err);
        setProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        sector: formData.sector || '',
      };

      if (formData.profile_id) {
        // Backend espera o campo `profile` com o id do perfil
        payload.profile = formData.profile_id;
      }

      await api.post('/access/teams/create/', payload);

      onSuccess('teams');
      onClose();
    } catch (err) {
      console.error('Erro ao criar equipe:', err);
      let msg = 'Erro ao criar equipe';
      if (err.response?.data?.detail) msg = err.response.data.detail;
      else if (err.response?.data?.message) msg = err.response.data.message;
      else if (typeof err.response?.data === 'string') msg = err.response.data;
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericDropdown
      title="Adicionar Nova Equipe"
      onClose={onClose}
      icon={<FaUsers />}
      className="add-team-dropdown"
  position="center"
      size="medium"
      triggerRef={triggerRef}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome da equipe"
            required
            autoFocus
          />
          <label>Nome*</label>
        </div>

        <div className="form-field">
          <input
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            placeholder="Setor (opcional)"
          />
          <label>Setor</label>
        </div>

        <div className="form-field select-field">
          <select name="profile_id" value={formData.profile_id} onChange={handleChange}>
            <option value="">Selecione um perfil (opcional)</option>
            {loadingProfiles ? (
              <option disabled>Carregando perfis...</option>
            ) : profiles.length === 0 ? (
              <option disabled>Nenhum perfil disponível</option>
            ) : (
              profiles.map(p => (
                <option key={p.id} value={p.id}>{p.nome || p.name || `${p.id}`}</option>
              ))
            )}
          </select>
          <label>Perfil</label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onClose}>
            <FaTimes /> Cancelar
          </button>
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : <><FaSave /> Salvar</>}
          </button>
        </div>
      </form>
    </GenericDropdown>
  );
}

export default AddTeamDropdown;
