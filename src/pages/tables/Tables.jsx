import { useMemo, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['static', 'sortable', 'filterable', 'paginated', 'row-actions']

const STATIC_ROWS = [
  { id: 1, name: 'Asha Patel', role: 'SDET', status: 'Active' },
  { id: 2, name: 'Marco Silva', role: 'QA Lead', status: 'Active' },
  { id: 3, name: 'Wei Chen', role: 'Automation Engineer', status: 'On leave' },
]

const SORTABLE_ROWS = [
  { name: 'Nairobi', country: 'Kenya', population: 4397073 },
  { name: 'Lisbon', country: 'Portugal', population: 545796 },
  { name: 'Hanoi', country: 'Vietnam', population: 8053663 },
  { name: 'Quito', country: 'Ecuador', population: 1978376 },
]

const PEOPLE = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Contact ${i + 1}`,
  email: `contact${i + 1}@example.com`,
}))

const PAGE_SIZE = 5

export default function Tables() {
  const { isDone, toggle, completedCount, total } = useProgress('tables', SPECIMEN_IDS)

  // --- Sortable ---
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const sortedRows = useMemo(() => {
    if (!sortKey) return SORTABLE_ROWS
    const copy = [...SORTABLE_ROWS]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [sortKey, sortDir])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // --- Filterable ---
  const [filterText, setFilterText] = useState('')
  const filteredRows = STATIC_ROWS.filter((r) => r.name.toLowerCase().includes(filterText.toLowerCase()))

  // --- Paginated ---
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(PEOPLE.length / PAGE_SIZE)
  const pageRows = PEOPLE.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // --- Row actions ---
  const [actionRows, setActionRows] = useState([
    { id: 1, name: 'Draft report' },
    { id: 2, name: 'Review PR #42' },
    { id: 3, name: 'Update runbook' },
  ])
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(row) {
    setEditingId(row.id)
    setEditValue(row.name)
  }

  function saveEdit(id) {
    setActionRows((rows) => rows.map((r) => (r.id === id ? { ...r, name: editValue } : r)))
    setEditingId(null)
  }

  function deleteRow(id) {
    setActionRows((rows) => rows.filter((r) => r.id !== id))
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>TB — Tables</h1>
          <p>
            Static, sortable, filterable, paginated tables, and a table with per-row edit/delete
            actions.
          </p>
        </div>
        <div className="title-block-fields">
          <div>
            <span className="field-label">Progress</span>
            {completedCount} / {total} marked done
          </div>
        </div>
      </div>

      <Specimen
        id="static"
        title="Static table"
        done={isDone('static')}
        onToggleDone={toggle}
        annotations={[
          ['table id', 'static-table'],
          ['row selector', 'tr[data-row-id]'],
        ]}
      >
        <table id="static-table" data-testid="static-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {STATIC_ROWS.map((r) => (
              <tr key={r.id} data-row-id={r.id} data-testid={`static-row-${r.id}`}>
                <td>{r.name}</td>
                <td>{r.role}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Specimen>

      <Specimen
        id="sortable"
        title="Sortable table"
        done={isDone('sortable')}
        onToggleDone={toggle}
        annotations={[
          ['table id', 'sortable-table'],
          ['header buttons', 'data-testid="sort-name" / "sort-population"'],
          ['current sort', sortKey ? `${sortKey} (${sortDir})` : 'unsorted'],
        ]}
      >
        <table id="sortable-table" data-testid="sortable-table">
          <thead>
            <tr>
              <th>
                <button data-testid="sort-name" onClick={() => handleSort('name')} className="btn btn-outline" style={{ padding: '4px 8px' }}>
                  City {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>Country</th>
              <th>
                <button
                  data-testid="sort-population"
                  onClick={() => handleSort('population')}
                  className="btn btn-outline"
                  style={{ padding: '4px 8px' }}
                >
                  Population {sortKey === 'population' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r) => (
              <tr key={r.name} data-testid={`sortable-row-${r.name}`}>
                <td>{r.name}</td>
                <td>{r.country}</td>
                <td>{r.population.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Specimen>

      <Specimen
        id="filterable"
        title="Filterable table"
        done={isDone('filterable')}
        onToggleDone={toggle}
        annotations={[
          ['filter input id', 'table-filter-input'],
          ['visible rows', String(filteredRows.length)],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            id="table-filter-input"
            data-testid="table-filter-input"
            type="text"
            placeholder="Filter by name…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ maxWidth: 260 }}
          />
          <table id="filterable-table" data-testid="filterable-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} data-testid={`filterable-row-${r.id}`}>
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={3} data-testid="filterable-empty">
                    No matches
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Specimen>

      <Specimen
        id="paginated"
        title="Paginated table"
        done={isDone('paginated')}
        onToggleDone={toggle}
        annotations={[
          ['total rows', String(PEOPLE.length)],
          ['page size', String(PAGE_SIZE)],
          ['pager', 'data-testid="page-prev" / "page-next" / "page-indicator"'],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <table id="paginated-table" data-testid="paginated-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id} data-testid={`paginated-row-${r.id}`}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              data-testid="page-prev"
              className="btn btn-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span data-testid="page-indicator" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              Page {page} of {totalPages}
            </span>
            <button
              data-testid="page-next"
              className="btn btn-outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </Specimen>

      <Specimen
        id="row-actions"
        title="Table with row actions"
        done={isDone('row-actions')}
        onToggleDone={toggle}
        annotations={[
          ['edit button', 'data-testid="edit-row-{id}"'],
          ['delete button', 'data-testid="delete-row-{id}"'],
          ['note', 'delete removes the row from the DOM entirely — practice re-querying after mutation'],
        ]}
      >
        <table id="actions-table" data-testid="actions-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {actionRows.map((r) => (
              <tr key={r.id} data-testid={`actions-row-${r.id}`}>
                <td>
                  {editingId === r.id ? (
                    <input
                      data-testid={`edit-input-${r.id}`}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    r.name
                  )}
                </td>
                <td style={{ display: 'flex', gap: 8 }}>
                  {editingId === r.id ? (
                    <button data-testid={`save-row-${r.id}`} className="btn" style={{ padding: '4px 10px' }} onClick={() => saveEdit(r.id)}>
                      Save
                    </button>
                  ) : (
                    <button data-testid={`edit-row-${r.id}`} className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => startEdit(r)}>
                      Edit
                    </button>
                  )}
                  <button data-testid={`delete-row-${r.id}`} className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => deleteRow(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {actionRows.length === 0 && (
              <tr>
                <td colSpan={2} data-testid="actions-empty">
                  No rows left
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Specimen>
    </>
  )
}
