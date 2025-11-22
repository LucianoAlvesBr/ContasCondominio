const MONTHS = [
    { num: 1, name: 'JANEIRO' },
    { num: 2, name: 'FEVEREIRO' },
    { num: 3, name: 'MARÇO' },
    { num: 4, name: 'ABRIL' },
    { num: 5, name: 'MAIO' },
    { num: 6, name: 'JUNHO' },
    { num: 7, name: 'JULHO' },
    { num: 8, name: 'AGOSTO' },
    { num: 9, name: 'SETEMBRO' },
    { num: 10, name: 'OUTUBRO' },
    { num: 11, name: 'NOVEMBRO' },
    { num: 12, name: 'DEZEMBRO' }
]

export default function MonthlySummary({ expenses, year }) {
    // Calculate monthly totals
    const monthlyTotals = MONTHS.map(({ num, name }) => {
        const monthExpenses = expenses.filter(
            exp => exp.month === num && exp.year === year && !exp.is_planned && !exp.is_risk_item
        )
        const total = monthExpenses.reduce((sum, exp) => sum + (parseFloat(exp.value) || 0), 0)
        return { month: name, total }
    })

    // Calculate yearly total
    const yearTotal = monthlyTotals.reduce((sum, month) => sum + month.total, 0)

    return (
        <div className="monthly-summary-container">
            <div className="monthly-summary-header">
                <h2>📅 Soma Mês a Mês - {year}</h2>
            </div>
            <div className="monthly-summary-table-wrapper">
                <table className="monthly-summary-table">
                    <thead>
                        <tr>
                            <th>Mês</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyTotals.map(({ month, total }, index) => (
                            <tr key={month} className={index % 2 === 0 ? 'even' : 'odd'}>
                                <td className="month-name">{month}</td>
                                <td className="month-value">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="total-row">
                            <td className="total-label">SOMA TOTAL DE TODOS OS MESES</td>
                            <td className="total-value">R$ {yearTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
