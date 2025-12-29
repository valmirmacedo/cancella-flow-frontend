import React from 'react';
import { FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaBell } from 'react-icons/fa';
import '../../styles/Aviso.css';

const prioridadeConfig = {
  baixa: { className: 'aviso-baixa', icon: <FaInfoCircle /> },
  media: { className: 'aviso-media', icon: <FaBell /> },
  alta: { className: 'aviso-alta', icon: <FaExclamationTriangle /> },
  urgente: { className: 'aviso-urgente', icon: <FaExclamationCircle /> },
};

export default function AvisoBanner({ aviso }) {
  const cfg = prioridadeConfig[aviso.prioridade] || prioridadeConfig.media;
  return (
    <div className={`aviso-banner ${cfg.className}`}>
      <div className="aviso-icon">{cfg.icon}</div>
      <div className="aviso-content">
        <div className="aviso-title">{aviso.titulo}</div>
        {aviso.descricao && <div className="aviso-description">{aviso.descricao}</div>}
        <div className="aviso-meta">
          <span className="aviso-chip">{(aviso.prioridade || '').toUpperCase()}</span>
          {aviso.grupo_nome && <span className="aviso-chip light">{aviso.grupo_nome}</span>}
        </div>
      </div>
    </div>
  );
}
