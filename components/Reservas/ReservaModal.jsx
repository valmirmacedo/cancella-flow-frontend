import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { espacoAPI, espacoReservaAPI } from '../../services/api';
import CalendarioReservas from './CalendarioReservas';
import '../../styles/Modal.css';

export default function ReservaModal({ onClose, onSuccess }) {
  const [espacos, setEspacos] = useState([]);
  const [espacoSelecionado, setEspacoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [datasOcupadas, setDatasOcupadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEspacos, setLoadingEspacos] = useState(true);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  useEffect(() => {
    carregarEspacos();
  }, []);

  useEffect(() => {
    if (espacoSelecionado) {
      carregarDisponibilidade();
    }
  }, [espacoSelecionado]);

  const carregarEspacos = async () => {
    try {
      setLoadingEspacos(true);
      const resp = await espacoAPI.list({ is_active: true });
      const items = resp.data.results || resp.data || [];
      setEspacos(items);
    } catch (err) {
      console.error('Erro ao carregar espaços:', err);
      alert('Erro ao carregar espaços disponíveis.');
    } finally {
      setLoadingEspacos(false);
    }
  };

  const carregarDisponibilidade = async () => {
    try {
      if (!espacoSelecionado?.id) return;
      
      // Buscar datas ocupadas do espaço selecionado para próximo ano
      const hoje = new Date();
      const umAnoFrente = new Date(hoje);
      umAnoFrente.setFullYear(umAnoFrente.getFullYear() + 1);
      umAnoFrente.setMonth(umAnoFrente.getMonth(), 0); // Último dia do mês

      const resp = await espacoReservaAPI.disponibilidade({
        espaco_id: espacoSelecionado.id,
        data_ini: hoje.toISOString().split('T')[0],
        data_fim: umAnoFrente.toISOString().split('T')[0],
      });

      setDatasOcupadas(resp.data.datas_ocupadas || []);
    } catch (err) {
      console.error('Erro ao carregar disponibilidade:', err);
      setDatasOcupadas([]);
    }
  };

  const handleEspacoChange = (e) => {
    const id = parseInt(e.target.value);
    const espaco = espacos.find(esp => esp.id === id);
    setEspacoSelecionado(espaco);
    setDataSelecionada(null);
    setDatasOcupadas([]);
    setShowConfirmacao(false);
  };

  const handleDateSelect = (date) => {
    setDataSelecionada(date);
    setShowConfirmacao(false);
  };

  const handleConfirmar = () => {
    if (!espacoSelecionado || !dataSelecionada) {
      alert('Selecione um espaço e uma data.');
      return;
    }
    setShowConfirmacao(true);
  };

  const handleReservar = async () => {
    if (!espacoSelecionado || !dataSelecionada) return;

    try {
      setLoading(true);
      const payload = {
        espaco: espacoSelecionado.id,
        data_reserva: dataSelecionada.toISOString().split('T')[0],
        valor_cobrado: espacoSelecionado.valor_aluguel || 0,
        status: 'confirmada',
      };

      await espacoReservaAPI.create(payload);
      
      // Fechar modal primeiro
      onClose?.();
      
      // Atualizar lista
      onSuccess?.();
      
      // Mostrar sucesso fora da modal
      setTimeout(() => {
        alert('✅ Reserva realizada com sucesso!');
      }, 100);
      
    } catch (err) {
      console.error('Erro ao criar reserva:', err);
      let errorMsg = 'Erro ao criar reserva. Tente novamente.';
      
      if (err.response?.data?.non_field_errors) {
        errorMsg = 'Esta data já está reservada para este espaço. Por favor, escolha outra data.';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.data_reserva?.[0]) {
        errorMsg = err.response.data.data_reserva[0];
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container reserva-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Reservar Espaço</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          {/* Seleção de espaço */}
          <div className="form-field" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#19294a', fontSize: '0.9rem' }}>
              Selecione o Espaço*
            </label>
            <select
              value={espacoSelecionado?.id || ''}
              onChange={handleEspacoChange}
              disabled={loadingEspacos}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '0.9rem',
              }}
            >
              <option value="">-- Selecione --</option>
              {espacos.map(espaco => (
                <option key={espaco.id} value={espaco.id}>
                  {espaco.nome} - R$ {parseFloat(espaco.valor_aluguel || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Calendário */}
          {espacoSelecionado && (
            <>
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 6 }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 0, lineHeight: 1.5 }}>
                  <strong>Espaço:</strong> {espacoSelecionado.nome}<br />
                  <strong>Capacidade:</strong> {espacoSelecionado.capacidade_pessoas} pessoas<br />
                  <strong>Valor:</strong> R$ {parseFloat(espacoSelecionado.valor_aluguel || 0).toFixed(2)} por dia
                </p>
              </div>

              <CalendarioReservas
                espacoId={espacoSelecionado.id}
                datasOcupadas={datasOcupadas}
                onDateSelect={handleDateSelect}
                selectedDate={dataSelecionada}
              />

              {dataSelecionada && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 6 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#19294a', marginBottom: '0.25rem' }}>
                    Data Selecionada:
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: 0 }}>
                    {dataSelecionada.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

              {showConfirmacao && (
                <div 
                  style={{ 
                    marginTop: '0.75rem', 
                    padding: '0.75rem', 
                    background: '#fff7ed', 
                    border: '2px solid #f59e0b',
                    borderRadius: 6
                  }}
                >
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>
                    ⚠️ Atenção
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#78350f', marginBottom: 0 }}>
                    Será cobrado o valor de <strong>R$ {parseFloat(espacoSelecionado.valor_aluguel || 0).toFixed(2)}</strong> pela reserva deste espaço.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="button-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            <FaTimes /> Cancelar
          </button>
          {dataSelecionada && !showConfirmacao && (
            <button 
              type="button" 
              className="button-primary" 
              onClick={handleConfirmar}
              disabled={loading}
            >
              Confirmar
            </button>
          )}
          {showConfirmacao && (
            <button 
              type="button" 
              className="button-primary" 
              onClick={handleReservar}
              disabled={loading}
            >
              <FaSave /> {loading ? 'Reservando...' : 'Reservar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
