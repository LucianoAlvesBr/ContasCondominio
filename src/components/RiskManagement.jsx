import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function RiskManagement({ expenses, onRefresh }) {
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        item: '',
        risk_type: '',
        obs: '',
        deadline: '',
        description: ''
    })

    const riskItems = expenses.filter(exp => exp.is_risk_item)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const dataToSave = {
                ...formData,
                is_risk_item: true,
                is_planned: false,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                value: 0
            }

            if (editingItem) {
                const { error } = await supabase
                    .from('expenses')
                    .update(dataToSave)
                    .eq('id', editingItem.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('expenses')
                    .insert([dataToSave])

                if (error) throw error
            }

            setShowForm(false)
            setEditingItem(null)
            resetForm()
            onRefresh()
        } catch (error) {
            console.error('Error saving risk item:', error)
            alert('Erro ao salvar item de risco.')
        }
    }

    async function handleDelete(id) {
        if (!confirm('Tem certeza que deseja excluir este item de risco?')) return

        try {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id)

            if (error) throw error
            onRefresh()
        } catch (error) {
            console.error('Error deleting risk item:', error)
            alert('Erro ao excluir item.')
        }
    }

    function openEditForm(item) {
        setEditingItem(item)
        setFormData({
            item: item.item || '',
            risk_type: item.risk_type || '',
            obs: item.obs || '',
            deadline: item.deadline || '',
            description: item.description || ''
        })
        setShowForm(true)
    }

    function resetForm() {
        setFormData({
            item: '',
            risk_type: '',
            obs: '',
            deadline: '',
            description: ''
        })
    }

    function openNewForm() {
        setEditingItem(null)
        resetForm()
        setShowForm(true)
    }

    return (
        <div className="risk-management-container">
            <div className="section-header risk-header">
                <h2>⚠️ Gerenciamento de Risco</h2>
                <button className="btn-primary btn-sm" onClick={openNewForm}>
                    <Plus size={16} />
                    Adicionar Risco
                </button>
            </div>

            {riskItems.length === 0 ? (
                <div className="empty-section">
                    <p>Nenhum item de risco identificado.</p>
                </div>
            ) : (
                <div className="risk-table-wrapper">
                    <table className="risk-table">
                        <thead>
                            <tr>
                                <th>Tipo de Risco</th>
                                <th>Item</th>
                                <th>Descrição</th>
                                <th>Prazo</th>
                                <th>Observações</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riskItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="risk-type-cell">{item.risk_type || '-'}</td>
                                    <td className="item-cell">{item.item}</td>
                                    <td className="description-cell">{item.description || '-'}</td>
                                    <td className="deadline-cell">
                                        {item.deadline ? new Date(item.deadline).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                    <td className="obs-cell">{item.obs || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" onClick={() => openEditForm(item)} title="Editar">
                                                <Edit2 size={14} />
                                            </button>
                                            <button className="btn-icon danger" onClick={() => handleDelete(item.id)} title="Excluir">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingItem ? 'Editar Item de Risco' : 'Novo Item de Risco'}</h3>
                            <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Tipo de Risco</label>
                                    <input
                                        type="text"
                                        value={formData.risk_type}
                                        onChange={(e) => setFormData({ ...formData, risk_type: e.target.value })}
                                        placeholder="Ex: Extintor de Incêndio"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Item *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.item}
                                        onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                                        placeholder="Nome do item"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Prazo</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descrição detalhada do risco..."
                                    rows="2"
                                />
                            </div>

                            <div className="form-group">
                                <label>Observações</label>
                                <textarea
                                    value={formData.obs}
                                    onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                                    placeholder="Observações adicionais..."
                                    rows="2"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingItem ? 'Salvar' : 'Adicionar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
