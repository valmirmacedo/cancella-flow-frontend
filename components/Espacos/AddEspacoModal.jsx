import React, { useState } from 'react';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { espacoAPI, espacoInventarioAPI } from '../../services/api';
import GenericTable from '../GenericTable';
import '../../styles/Modal.css';

export default function AddEspacoModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nome: '',
    capacidade_pessoas: 0,
    valor_aluguel: 0,
    is_active: true
  });
  const [inventario, setInventario] = useState([]);
  const [newItem, setNewItem] = useState({ nome: '', codigo: '' });
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    if (!newItem.nome.trim() || !newItem.codigo.trim()) {
      alert('Preencha nome e código do item');
      return;
    }
    setInventario(prev => [...prev, { ...newItem, is_active: true, tempId: Date.now() }]);
    setNewItem({ nome: '', codigo: '' });
  };

  const handleRemoveItem = (tempId) => {
    setInventario(prev => prev.filter(item => item.tempId !== tempId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      alert('Informe o nome do espaço');
      return;
    }

    try {
      setLoading(true);
      // Criar espaço
      const respEspaco = await espacoAPI.create({
        nome: form.nome.trim(),
        capacidade_pessoas: Number(form.capacidade_pessoas) || 0,
        valor_aluguel: parseFloat(form.valor_aluguel) || 0,
        is_active: form.is_active
      });

      const espacoId = respEspaco.data.id;

      // Criar itens de inventário
      for (const item of inventario) {
        await espacoInventarioAPI.create({
          espaco: espacoId,
          nome: item.nome.trim(),
          codigo: item.codigo.trim(),
          is_active: item.is_active
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Erro ao criar espaço:', err);
      alert('Erro ao criar espaço: ' + (err.response?.data?.error || 'Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
  <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800 }}>
        <div className="modal-header">
          <h2>Novo Espaço</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div className="form-field" style={{ marginBottom: 8 }}>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                    required
                    placeholder="Nome do espaço"
                  />
                  <label>Nome*</label>
                </div>
                <div style={{ paddingLeft: 4 }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#22c55e' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {form.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-field" style={{ width: 80, marginBottom: 0 }}>
                <input
                  type="number"
                  min="0"
                  value={form.capacidade_pessoas}
                  onChange={(e) => setForm(prev => ({ ...prev, capacidade_pessoas: e.target.value }))}
                  placeholder="0"
                />
                <label style={{ fontSize: '0.85rem' }}>Pessoas</label>
              </div>

              <div className="form-field" style={{ width: 120, marginBottom: 0 }}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valor_aluguel}
                  onChange={(e) => setForm(prev => ({ ...prev, valor_aluguel: e.target.value }))}
                  placeholder="0.00"
                />
                <label style={{ fontSize: '0.85rem' }}>Valor (R$)</label>
              </div>
            </div>

            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

            <h3 style={{ marginBottom: 10, fontSize: '1rem', fontWeight: 600 }}>Itens do Inventário</h3>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={newItem.nome}
                onChange={(e) => setNewItem(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do item"
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 4 }}
              />
              <input
                type="text"
                value={newItem.codigo}
                onChange={(e) => setNewItem(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Código"
                style={{ width: '150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 4 }}
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="button-primary"
                style={{ padding: '8px 16px' }}
              >
                <FaPlus />
              </button>
            </div>

            {inventario.length > 0 && (
              <div className="modal-table-area" style={{ marginTop: 8 }}>
                <GenericTable
                  className="compact-table"
                  columns={[
                    { key: 'nome', header: 'Nome', width: '40%' },
                    { key: 'codigo', header: 'Código', width: '30%' },
                    { 
                      key: 'is_active', 
                      header: 'Status', 
                      width: '15%',
                      render: (value) => (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: value ? '#dcfce7' : '#fee2e2',
                          color: value ? '#15803d' : '#dc2626',
                          display: 'inline-block'
                        }}>
                          {value ? 'Ativo' : 'Inativo'}
                        </span>
                      )
                    },
                    { 
                      key: 'actions', 
                      header: 'Ações', 
                      width: '15%',
                      render: (value, row) => (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(row.tempId)}
                          className="cancel-button"
                          style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                        >
                          <FaTrash />
                        </button>
                      )
                    }
                  ]}
                  data={inventario.slice(0, 5)}
                  loading={false}
                  totalPages={1}
                  currentPage={1}
                  onPageChange={() => {}}
                />
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ marginTop: '16px' }}>
            <button type="button" className="button-secondary" onClick={onClose}>
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="button-primary" disabled={loading}>
              <FaSave /> {loading ? 'Salvando...' : 'Salvar Espaço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
