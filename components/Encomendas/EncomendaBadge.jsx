import React, { useEffect, useState } from 'react';
import { encomendaAPI } from '../../services/api';

const colorMap = {
  green: { bg: '#dcfce7', color: '#15803d', label: 'Encomenda(s) de hoje' },
  yellow: { bg: '#fef9c3', color: '#a16207', label: 'Encomenda(s) até 3 dias' },
  red: { bg: '#fee2e2', color: '#b91c1c', label: 'Encomenda(s) há 3+ dias' },
  none: { bg: '#e2e8f0', color: '#475569', label: 'Sem encomendas pendentes' }
};

function EncomendaBadge({ unidadeId, className = '' }) {
  const [data, setData] = useState({ total: 0, green: 0, yellow: 0, red: 0, badge_color: 'none' });
  const [loading, setLoading] = useState(false);

  const fetchBadge = async () => {
    if (!unidadeId) return;
    setLoading(true);
    try {
      const res = await encomendaAPI.badge({ unidade_id: unidadeId });
      setData(res.data);
    } catch (err) {
      console.error('Erro ao carregar badge de encomendas:', err);
      setData({ total: 0, green: 0, yellow: 0, red: 0, badge_color: 'none' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadge();
    const interval = setInterval(fetchBadge, 60_000); // atualiza a cada 1 min
    return () => clearInterval(interval);
  }, [unidadeId]);

  const color = colorMap[data.badge_color] || colorMap.none;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: color.bg,
        color: color.color,
        padding: '10px 14px',
        borderRadius: 12,
        fontWeight: 600,
        border: '1px solid rgba(0,0,0,0.05)'
      }}
      title={color.label}
    >
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'white',
        color: color.color,
        border: `2px solid ${color.color}`,
        fontSize: 14
      }}>
        {loading ? '…' : data.total}
      </span>
      <span>
        {data.total > 0 ? 'Encomendas pendentes' : 'Sem encomendas pendentes'}
      </span>
    </div>
  );
}

export default EncomendaBadge;
