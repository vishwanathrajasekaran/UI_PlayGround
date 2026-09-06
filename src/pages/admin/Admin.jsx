import { useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['dashboard', 'users-crud', 'bulk-actions', 'settings']

export default function Admin() {
  const { isDone, toggle, completedCount, total } = useProgress('admin', SPECIMEN_IDS)

  // --- Users CRUD (shared by users-crud and bulk-actions) ---
  const [users, setUsers] = useState([
    { id: 1, name: 'Priya Nair', email: 'priya@example.com' },
    { id: 2, name: 'Tom Becker', email: 'tom@example.com' },
    { id: 3, name: 'Lucia Fernandez', email: 'lucia@example.com' },
  ])
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  function addUser(e) {
    e.preventDefault()
    if (!newName || !newEmail) return
    setUsers((u) => [...u, { id: Date.now(), name: newName, email: newEmail }])
    setNewName('')
    setNewEmail('')
  }

  function deleteUser(id) {
    setUsers((u) => u.filter((x) => x.id !== id))
    setSelected((s) => s.filter((x) => x !== id))
  }

  function startEdit(u) {
    setEditingId(u.id)
    setEditName(u.name)
  }

  function saveEdit(id) {
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, name: editName } : x)))
    setEditingId(null)
  }

  // --- Bulk actions ---
  const [selected, setSelected] = useState([])
  const allSelected = users.length > 0 && selected.length === users.length

  function toggleSelect(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function toggleSelectAll() {
    setSelected(allSelected ? [] : users.map((u) => u.id))
  }

  function deleteSelected() {
    setUsers((u) => u.filter((x) => !selected.includes(x.id)))
    setSelected([])
  }

  // --- Settings ---
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [confirmingMaintenance, setConfirmingMaintenance] = useState(false)

  function requestEnableMaintenance() {
    if (maintenanceMode) {
      setMaintenanceMode(false)
    } else {
      setConfirmingMaintenance(true)
    }
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>AD — Admin Portal</h1>
          <p>
            A dashboard with stat cards, a users table with add/edit/delete, multi-row selection
            with a bulk-delete action, and a settings toggle gated behind a confirmation step.
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
        id="dashboard"
        title="Dashboard — stat cards"
        done={isDone('dashboard')}
        onToggleDone={toggle}
        annotations={[
          ['ids', 'stat-total-users / stat-active-sessions / stat-revenue'],
        ]}
      >
        <div style={{ display: 'flex', gap: 14 }}>
          <div data-testid="stat-total-users" id="stat-total-users" style={{ border: '1px solid var(--color-grid)', borderRadius: 6, padding: 14, minWidth: 120 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>Total users</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{users.length}</div>
          </div>
          <div data-testid="stat-active-sessions" id="stat-active-sessions" style={{ border: '1px solid var(--color-grid)', borderRadius: 6, padding: 14, minWidth: 120 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>Active sessions</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>7</div>
          </div>
          <div data-testid="stat-revenue" id="stat-revenue" style={{ border: '1px solid var(--color-grid)', borderRadius: 6, padding: 14, minWidth: 120 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>Revenue (MTD)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>$4,210</div>
          </div>
        </div>
      </Specimen>

      <Specimen
        id="users-crud"
        title="Users — add / edit / delete"
        done={isDone('users-crud')}
        onToggleDone={toggle}
        annotations={[
          ['add form id', 'admin-add-user-form'],
          ['row actions', 'data-testid="admin-edit-{id}" / "admin-delete-{id}"'],
        ]}
      >
        <form id="admin-add-user-form" data-testid="admin-add-user-form" onSubmit={addUser} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input data-testid="admin-new-name" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input data-testid="admin-new-email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          <button data-testid="admin-add-user-btn" className="btn" type="submit">
            Add user
          </button>
        </form>
        <table data-testid="admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} data-testid={`admin-row-${u.id}`}>
                <td>{editingId === u.id ? <input data-testid={`admin-edit-input-${u.id}`} value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus /> : u.name}</td>
                <td>{u.email}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  {editingId === u.id ? (
                    <button data-testid={`admin-save-${u.id}`} className="btn" style={{ padding: '4px 10px' }} onClick={() => saveEdit(u.id)}>
                      Save
                    </button>
                  ) : (
                    <button data-testid={`admin-edit-${u.id}`} className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => startEdit(u)}>
                      Edit
                    </button>
                  )}
                  <button data-testid={`admin-delete-${u.id}`} className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={() => deleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Specimen>

      <Specimen
        id="bulk-actions"
        title="Bulk actions — select all + bulk delete"
        done={isDone('bulk-actions')}
        onToggleDone={toggle}
        annotations={[
          ['select-all id', 'admin-select-all'],
          ['bulk delete id', 'admin-bulk-delete-btn'],
          ['selected count', String(selected.length)],
        ]}
      >
        <table data-testid="admin-bulk-table">
          <thead>
            <tr>
              <th>
                <input id="admin-select-all" data-testid="admin-select-all" type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
              </th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} data-testid={`admin-bulk-row-${u.id}`}>
                <td>
                  <input data-testid={`admin-select-${u.id}`} type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button id="admin-bulk-delete-btn" data-testid="admin-bulk-delete-btn" className="btn btn-outline" style={{ marginTop: 10 }} disabled={selected.length === 0} onClick={deleteSelected}>
          Delete selected ({selected.length})
        </button>
      </Specimen>

      <Specimen
        id="settings"
        title="Settings — confirmed toggle"
        done={isDone('settings')}
        onToggleDone={toggle}
        annotations={[
          ['toggle button id', 'maintenance-toggle-btn'],
          ['confirm dialog id', 'maintenance-confirm-dialog'],
          ['state', maintenanceMode ? 'ON' : 'OFF'],
        ]}
      >
        <button id="maintenance-toggle-btn" data-testid="maintenance-toggle-btn" className="btn btn-outline" onClick={requestEnableMaintenance}>
          {maintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode'}
        </button>
        {confirmingMaintenance && (
          <div
            id="maintenance-confirm-dialog"
            data-testid="maintenance-confirm-dialog"
            style={{ marginTop: 10, border: '1px solid var(--color-hard-mode)', borderRadius: 6, padding: 12, maxWidth: 300 }}
          >
            <div style={{ fontSize: '0.85rem', marginBottom: 10 }}>This will log out all active users. Are you sure?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                data-testid="maintenance-confirm-yes"
                className="btn"
                onClick={() => {
                  setMaintenanceMode(true)
                  setConfirmingMaintenance(false)
                }}
              >
                Yes, enable
              </button>
              <button data-testid="maintenance-confirm-no" className="btn btn-outline" onClick={() => setConfirmingMaintenance(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Specimen>
    </>
  )
}
