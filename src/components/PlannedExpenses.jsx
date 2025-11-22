import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function PlannedExpenses({ expenses, onRefresh }) {
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        item: '',
        obs: '',
        value: '',
        status: false
    })

    const plannedExpenses = expenses.filter(exp => exp.is_planned)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const dataToSave = {
                ...formData,
                is_planned: true,
                is_risk_item: false,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
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
            console.error('Error saving planned expense:', error)
            alert('Erro ao salvar item planejado.')
        }
    }

    async function handleDelete(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return

        try {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id)

            if (error) throw error
            onRefresh()
        } catch (error) {
            console.error('Error deleting planned expense:', error)
            alert('Erro ao excluir item.')
        }
    }

    function openEditForm(item) {
        setEditingItem(item)
        setFormData({
            item: item.item || '',
            obs: item.obs || '',
            value: item.value || '',
            status: item.status || false
        })
        setShowForm(true)
    }

    function resetForm() {
        setFormData({
            item: '',
            obs: '',
            value: '',
            status: false
        })
    }

    function openNewForm() {
        setEditingItem(null)
        resetForm()
        setShowForm(true)
    }

    return (
        <div className="planned-expenses-container">
            <div className="section-header planned-header">
                <h2>📋 Nunca Realizado - Em Programação</h2>
                <button className="btn-primary btn-sm" onClick={openNewForm}>
                    <Plus size={16} />
                    Adicionar Item
                </button>
            </div>

            {plannedExpenses.length === 0 ? (
                <div className="empty-section">
                    <p>Nenhum item em programação.</p>
                </div>
            ) : (
                <div className="planned-table-wrapper">
                    <table className="planned-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Observação</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plannedExpenses.map((item) => (
                                <tr key={item.id}>
                                    <td className="item-cell">{item.item}</td>
                                    <td className="obs-cell">{item.obs || '-'}</td>
                                    <td className="value-cell">R$ {parseFloat(item.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>
                                        <span className={`status-badge ${item.status ? 'completed' : 'pending'}`}>
                                            {item.status ? 'Concluído' : 'Pendente'}
                                        </span>
                                    </td>
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
                    <div className="modal small-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingItem ? 'Editar Item' : 'Novo Item Planejado'}</h3>
                            <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
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
                                <label>Observação</label>
                                <textarea
                                    value={formData.obs}
                                    onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                                    placeholder="Observações..."
                                    rows="2"
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                                    />
                                    <span>Marcar como concluído</span>
                                </label>
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
