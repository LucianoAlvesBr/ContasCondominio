import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Plus, Trash2, Edit2, DollarSign, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    item: '',
    obs: '',
    value: '',
    periodicity: '',
    maintenance_date: '',
    description: '',
    law: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: false
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
      alert('Erro ao carregar despesas. Verifique sua conexão com o Supabase.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      if (editingExpense) {
        const { error } = await supabase
          .from('expenses')
          .update(formData)
          .eq('id', editingExpense.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('expenses')
          .insert([formData])

        if (error) throw error
      }

      setShowModal(false)
      setEditingExpense(null)
      resetForm()
      fetchExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Erro ao salvar despesa.')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Erro ao excluir despesa.')
    }
  }

  async function toggleStatus(expense) {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ status: !expense.status })
        .eq('id', expense.id)

      if (error) throw error
      fetchExpenses()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  function openEditModal(expense) {
    setEditingExpense(expense)
    setFormData({
      item: expense.item || '',
      obs: expense.obs || '',
      value: expense.value || '',
      periodicity: expense.periodicity || '',
      maintenance_date: expense.maintenance_date || '',
      description: expense.description || '',
      law: expense.law || '',
      month: expense.month || new Date().getMonth() + 1,
      year: expense.year || new Date().getFullYear(),
      status: expense.status || false
    })
    setShowModal(true)
  }

  function resetForm() {
    setFormData({
      item: '',
      obs: '',
      value: '',
      periodicity: '',
      maintenance_date: '',
      description: '',
      law: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      status: false
    })
  }

  function openNewModal() {
    setEditingExpense(null)
    resetForm()
    setShowModal(true)
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.value) || 0), 0)
  const paidExpenses = expenses.filter(exp => exp.status).length
  const pendingExpenses = expenses.filter(exp => !exp.status).length

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>💼 Controle de Despesas do Condomínio</h1>
          <p>Gerencie todas as despesas de forma eficiente</p>
        </div>
      </header>

      <main className="main">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total de Despesas</p>
              <p className="stat-value">R$ {totalExpenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total de Registros</p>
              <p className="stat-value">{expenses.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pagas</p>
              <p className="stat-value">{paidExpenses}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pendentes</p>
              <p className="stat-value">{pendingExpenses}</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>Despesas Registradas</h2>
            <button className="btn-primary" onClick={openNewModal}>
              <Plus size={20} />
              Nova Despesa
            </button>
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>Nenhuma despesa registrada ainda.</p>
              <button className="btn-primary" onClick={openNewModal}>
                Adicionar Primeira Despesa
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Item</th>
                    <th>Valor</th>
                    <th>Periodicidade</th>
                    <th>Mês/Ano</th>
                    <th>Data Manutenção</th>
                    <th>Observações</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        <button
                          className={`status-badge ${expense.status ? 'paid' : 'pending'}`}
                          onClick={() => toggleStatus(expense)}
                        >
                          {expense.status ? 'Paga' : 'Pendente'}
                        </button>
                      </td>
                      <td className="item-cell">{expense.item}</td>
                      <td className="value-cell">R$ {parseFloat(expense.value || 0).toFixed(2)}</td>
                      <td>{expense.periodicity || '-'}</td>
                      <td>{expense.month}/{expense.year}</td>
                      <td>{expense.maintenance_date ? new Date(expense.maintenance_date).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="obs-cell">{expense.obs || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" onClick={() => openEditModal(expense)} title="Editar">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDelete(expense.id)} title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpense ? 'Editar Despesa' : 'Nova Despesa'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Item *</label>
                  <input
                    type="text"
                    required
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    placeholder="Ex: Energia Elétrica"
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

                <div className="form-group">
                  <label>Periodicidade</label>
                  <select
                    value={formData.periodicity}
                    onChange={(e) => setFormData({ ...formData, periodicity: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Bimestral">Bimestral</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                    <option value="Única">Única</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Data de Manutenção</label>
                  <input
                    type="date"
                    value={formData.maintenance_date}
                    onChange={(e) => setFormData({ ...formData, maintenance_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Mês</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Ano</label>
                  <input
                    type="number"
                    min="2020"
                    max="2100"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
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

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Lei/Regulamento</label>
                <input
                  type="text"
                  value={formData.law}
                  onChange={(e) => setFormData({ ...formData, law: e.target.value })}
                  placeholder="Ex: Lei 1234/2020"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                  <span>Marcar como paga</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingExpense ? 'Salvar Alterações' : 'Adicionar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
