import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const MONTHS = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
]

const COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#30cfd0', '#330867'
]

export default function MonthlyChart({ expenses, year }) {
    // Aggregate expenses by month
    const monthlyData = MONTHS.map((month, index) => {
        const monthNumber = index + 1
        const monthExpenses = expenses.filter(
            exp => exp.month === monthNumber && exp.year === year && !exp.is_planned && !exp.is_risk_item
        )
        const total = monthExpenses.reduce((sum, exp) => sum + (parseFloat(exp.value) || 0), 0)

        return {
            month,
            total,
            fullMonth: new Date(2000, index).toLocaleDateString('pt-BR', { month: 'long' })
        }
    })

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="chart-tooltip">
                    <p className="tooltip-label">{payload[0].payload.fullMonth}</p>
                    <p className="tooltip-value">R$ {payload[0].value.toFixed(2)}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h2>📊 Despesas Mensais - {year}</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="month"
                        stroke="#666"
                        style={{ fontSize: '12px', fontWeight: '500' }}
                    />
                    <YAxis
                        stroke="#666"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }} />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                        {monthlyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
