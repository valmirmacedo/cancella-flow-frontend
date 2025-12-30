import React, { useState, useEffect } from 'react';
import '../styles/GenericMobileCard.css';

function GenericMobileCard({ 
  columns, 
  data, 
  loading, 
  onSave, 
  onEdit, 
  onCancel, 
  onPageChange, 
  totalPages, 
  currentPage, 
  editingRowId, 
  onEditRow, 
  className = '',
  onEditDataChange,
  onEditChange,
  currentEditData
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Sincronizar edição com controle externo
  useEffect(() => {
    if (editingRowId && Array.isArray(data)) {
      const row = data.find((r) => r.id === editingRowId);
      if (row) {
        setEditData({ ...row });
        if (onEditDataChange) onEditDataChange({ ...row });
      }
    } else {
      setEditData({});
      if (onEditDataChange) onEditDataChange({});
    }
    setEditingId(editingRowId || null);
  }, [editingRowId, data]);

  const handleEdit = (item) => {
    console.log('[GenericMobileCard] Iniciando edição:', {
      itemId: item.id,
      itemData: item,
      columns: columns.map(c => ({ key: c.key, editable: c.editable, hasEditComponent: !!c.editComponent }))
    });
    
    setEditingId(item.id);
    const initialData = { ...item };
    
    setEditData(initialData);
    if (onEditDataChange) onEditDataChange(initialData);
    if (onEditRow) onEditRow(item.id);
    if (onEdit) onEdit(item);
  };

  const handleSave = (rowId, updatedData) => {
    console.log('[GenericMobileCard] Salvando dados:', {
      rowId,
      updatedData,
      currentEditData,
      editData
    });
    
    // Usar updatedData diretamente pois já contém todos os dados necessários
    const dataToSave = updatedData || currentEditData || editData;
    
    console.log('[GenericMobileCard] Dados a serem salvos:', dataToSave);
    
    if (onSave) {
      onSave(rowId, dataToSave);
    }
    setEditingId(null);
    setEditData({});
    if (onEditRow) onEditRow(null);
    if (onEditDataChange) onEditDataChange({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    if (onCancel) onCancel();
    if (onEditRow) onEditRow(null);
    if (onEditDataChange) onEditDataChange({});
  };

  const handleInputChange = (key, value) => {
    if (onEditChange) {
      onEditChange(key, value);
    } else {
      setEditData(prev => {
        const updated = { ...prev, [key]: value };
        if (onEditDataChange) onEditDataChange(updated);
        return updated;
      });
    }
  };



  const renderField = (row, column) => {
    const isEditingRow = (editingId === row.id) || (editingRowId === row.id);
    const activeEditData = currentEditData || editData;

    // Não renderizar coluna de ações aqui (será renderizada separadamente)
    // Verificar por key, label e header para cobrir todas as possibilidades
    const isActionsColumn = column.key === 'actions' || 
                           column.key === 'acoes' ||
                           column.label?.toLowerCase() === 'ações' ||
                           column.header?.toLowerCase() === 'ações';
    
    if (isActionsColumn) {
      return null;
    }

    // Renderizar campo em modo de edição
    // NO MOBILE: Por padrão TODOS os campos são editáveis (exceto se explicitamente editable: false)
    // ou se for campo de data de criação/atualização
    const isDateField = column.key === 'created_on' || 
                        column.key === 'criado_em' || 
                        column.key === 'updated_on' ||
                        column.key === 'atualizado_em';
    
    const isEditable = column.editable !== false && !isActionsColumn && !isDateField;
    
    if (isEditingRow && isEditable) {
      console.log('[GenericMobileCard] Renderizando campo editável:', {
        key: column.key,
        header: column.header || column.label,
        editable: column.editable,
        hasEditComponent: !!column.editComponent
      });
      
      return (
        <div className="mobile-card-field editing">
          <label className="field-label">{column.header || column.label}</label>
          <div className="field-value">
            {column.editComponent ? (
              column.editComponent(activeEditData, handleInputChange)
            ) : (
              // Detectar campos de status booleano e renderizar como checkbox
              // Apenas se o valor for booleano (não strings como 'confirmada', 'cancelada', etc)
              (column.key === 'is_active' || column.key === 'ativo' || 
               (column.key === 'status' && typeof row[column.key] === 'boolean')) ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(activeEditData[column.key] ?? row[column.key])}
                    onChange={(e) => handleInputChange(column.key, e.target.checked)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#2abb98' }}
                  />
                  <span>{activeEditData[column.key] ?? row[column.key] ? 'Ativo' : 'Inativo'}</span>
                </label>
              ) : (column.key === 'status' && typeof row[column.key] === 'string') ? (
                // Renderizar status de reservas como select com choices
                <select
                  className="mobile-edit-input"
                  value={activeEditData[column.key] || row[column.key] || "pendente"}
                  onChange={(e) => handleInputChange(column.key, e.target.value)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              ) : (
                <input
                  className="mobile-edit-input"
                  type={column.type || "text"}
                  value={activeEditData[column.key] || row[column.key] || ""}
                  onChange={(e) => handleInputChange(column.key, e.target.value)}
                />
              )
            )}
          </div>
        </div>
      );
    }

    // Renderizar campo em modo de visualização
    let displayValue;
    if (column.render) {
      const value = row[column.key];
      try {
        displayValue = column.render(value, row);
      } catch (err) {
        console.error('Erro no render da coluna', column.key, err);
        if (typeof value === 'object' && value !== null) {
          displayValue = JSON.stringify(value);
        } else {
          displayValue = value ?? '-';
        }
      }
    } else {
      // Formatação especial para campos de data
      if (isDateField && row[column.key]) {
        try {
          const date = new Date(row[column.key]);
          displayValue = date.toLocaleDateString('pt-BR');
        } catch {
          displayValue = row[column.key];
        }
      } else {
        displayValue = row[column.key] ?? '-';
      }
    }

    return (
      <div className="mobile-card-field">
        <label className="field-label">{column.header || column.label}</label>
        <div className="field-value">{displayValue}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`mobile-cards-container ${className}`}>
        <div className="mobile-card">
          <div className="mobile-card-content">
            <p className="loading-text">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`mobile-cards-container ${className}`}>
        <div className="mobile-card">
          <div className="mobile-card-content">
            <p className="empty-text">Nenhum registro encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  // Obter coluna de ações para renderizar os botões customizados
  const actionsColumn = columns.find(col => col.key === 'actions');

  return (
    <div className={`mobile-cards-container ${className}`}>
      {/* Renderizar todos os cards da página */}
      {data.map((row) => {
        const isEditingRow = (editingId === row.id) || (editingRowId === row.id);
        
        // Obter primeira coluna (que não seja actions) para o cabeçalho
        const firstColumn = columns.find(col => col.key !== 'actions');
        const firstColumnValue = firstColumn ? (row[firstColumn.key] ?? '-') : row.id;
        const firstColumnLabel = firstColumn ? (firstColumn.header || firstColumn.label) : 'ID';
        
        // NO MOBILE: Não renderizar ações customizadas, apenas o botão padrão "Editar"
        // Isso evita duplicação de botões de editar com ícones
        const customActions = null;

        return (
          <div key={row.id} className={`mobile-card ${isEditingRow ? 'editing-active' : ''}`}>
            {/* Cabeçalho do card */}
            <div className="mobile-card-header">
              <div className="card-title">
                {firstColumnLabel}: {firstColumnValue}
              </div>
            </div>

            {/* Conteúdo do card */}
            <div className="mobile-card-content">
              {columns.map((column) => {
                const field = renderField(row, column);
                return field ? <React.Fragment key={column.key || column.header}>{field}</React.Fragment> : null;
              })}
            </div>

            {/* Ações do card */}
            <div className="mobile-card-actions">
              {isEditingRow ? (
                <>
                  <button 
                    type="button" 
                    className="mobile-action-button save-button" 
                    onClick={() => handleSave(row.id, currentEditData || editData)}
                  >
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    className="mobile-action-button cancel-button" 
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="mobile-action-button edit-button" 
                    onClick={() => handleEdit(row)}
                  >
                    Editar
                  </button>
                  {customActions}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mobile-pagination">
          <button 
            type="button" 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="page-button"
          >
            ← Anterior
          </button>
          <span className="page-indicator">
            Página {currentPage} de {totalPages}
          </span>
          <button 
            type="button" 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="page-button"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}

export default GenericMobileCard;
