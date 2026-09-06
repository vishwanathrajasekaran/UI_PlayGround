import { useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['checkboxes', 'radios', 'dropdown', 'multiselect', 'toggle', 'autocomplete']

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']

export default function SelectionControls() {
  const { isDone, toggle, completedCount, total } = useProgress('selection-controls', SPECIMEN_IDS)

  // --- Checkboxes with "select all" indeterminate state ---
  const [interests, setInterests] = useState({ frontend: false, backend: false, devops: false })
  const allChecked = Object.values(interests).every(Boolean)
  const noneChecked = Object.values(interests).every((v) => !v)

  function toggleInterest(key) {
    setInterests((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleAll() {
    const next = !allChecked
    setInterests({ frontend: next, backend: next, devops: next })
  }

  // --- Radio buttons ---
  const [plan, setPlan] = useState('')

  // --- Dropdown ---
  const [country, setCountry] = useState('')

  // --- Multi-select ---
  const [selectedFruits, setSelectedFruits] = useState([])

  function handleMultiSelectChange(e) {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value)
    setSelectedFruits(values)
  }

  // --- Toggle switch ---
  const [darkMode, setDarkMode] = useState(false)

  // --- Autocomplete ---
  const [query, setQuery] = useState('')
  const [autocompleteValue, setAutocompleteValue] = useState('')
  const suggestions =
    query.length > 0 ? FRUITS.filter((f) => f.toLowerCase().startsWith(query.toLowerCase())) : []

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>SC — Selection Controls</h1>
          <p>
            Checkboxes, radios, dropdowns, multi-select, a toggle switch, and an autocomplete field
            with a dynamically-generated suggestion list.
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
        id="checkboxes"
        title="Checkboxes — select all / indeterminate"
        done={isDone('checkboxes')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'interest-frontend / -backend / -devops'],
          ['select-all id', 'select-all-interests'],
          ['selected', Object.entries(interests).filter(([, v]) => v).map(([k]) => k).join(', ') || '(none)'],
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontWeight: 500 }}>
            <input
              id="select-all-interests"
              data-testid="select-all-interests"
              type="checkbox"
              checked={allChecked}
              ref={(el) => el && (el.indeterminate = !allChecked && !noneChecked)}
              onChange={toggleAll}
            />{' '}
            Select all
          </label>
          {Object.keys(interests).map((key) => (
            <label key={key} style={{ marginLeft: 20 }}>
              <input
                id={`interest-${key}`}
                data-testid={`interest-${key}`}
                type="checkbox"
                checked={interests[key]}
                onChange={() => toggleInterest(key)}
              />{' '}
              {key}
            </label>
          ))}
        </div>
      </Specimen>

      <Specimen
        id="radios"
        title="Radio buttons"
        done={isDone('radios')}
        onToggleDone={toggle}
        annotations={[
          ['name', 'plan'],
          ['id', 'plan-basic / plan-pro / plan-enterprise'],
          ['selected', plan || '(none)'],
        ]}
      >
        <div style={{ display: 'flex', gap: 20 }}>
          {['basic', 'pro', 'enterprise'].map((p) => (
            <label key={p}>
              <input
                id={`plan-${p}`}
                data-testid={`plan-${p}`}
                type="radio"
                name="plan"
                value={p}
                checked={plan === p}
                onChange={() => setPlan(p)}
              />{' '}
              {p[0].toUpperCase() + p.slice(1)}
            </label>
          ))}
        </div>
      </Specimen>

      <Specimen
        id="dropdown"
        title="Dropdown — native select"
        done={isDone('dropdown')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'country-select'],
          ['selected value', country || '(none)'],
        ]}
      >
        <select id="country-select" data-testid="country-select" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Choose a country…</option>
          <option value="in">India</option>
          <option value="us">United States</option>
          <option value="gb">United Kingdom</option>
          <option value="de">Germany</option>
        </select>
      </Specimen>

      <Specimen
        id="multiselect"
        title="Multi-select"
        done={isDone('multiselect')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'fruit-multiselect'],
          ['selected', selectedFruits.join(', ') || '(none)'],
        ]}
      >
        <select
          id="fruit-multiselect"
          data-testid="fruit-multiselect"
          multiple
          value={selectedFruits}
          onChange={handleMultiSelectChange}
          style={{ minWidth: 200, minHeight: 120 }}
        >
          {FRUITS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Specimen>

      <Specimen
        id="toggle"
        title="Toggle switch"
        done={isDone('toggle')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'dark-mode-toggle'],
          ['role', 'switch'],
          ['aria-checked', String(darkMode)],
        ]}
      >
        <button
          id="dark-mode-toggle"
          data-testid="dark-mode-toggle"
          role="switch"
          aria-checked={darkMode}
          onClick={() => setDarkMode((v) => !v)}
          style={{
            width: 48,
            height: 26,
            borderRadius: 13,
            border: '1px solid var(--color-grid)',
            background: darkMode ? 'var(--color-accent)' : 'var(--color-grid)',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: darkMode ? 24 : 2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.15s ease',
            }}
          />
        </button>
      </Specimen>

      <Specimen
        id="autocomplete"
        title="Autocomplete — dynamic suggestion list"
        hard
        done={isDone('autocomplete')}
        onToggleDone={toggle}
        annotations={[
          ['input id', 'fruit-autocomplete'],
          ['suggestion list', 'renders only while typing — data-testid="autocomplete-option"'],
          ['selected', autocompleteValue || '(none)'],
        ]}
      >
        <div style={{ position: 'relative', maxWidth: 260 }}>
          <input
            id="fruit-autocomplete"
            data-testid="fruit-autocomplete"
            type="text"
            placeholder="Type a fruit name…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setAutocompleteValue('')
            }}
          />
          {suggestions.length > 0 && (
            <ul
              data-testid="autocomplete-list"
              style={{
                listStyle: 'none',
                margin: '4px 0 0',
                padding: 0,
                border: '1px solid var(--color-grid)',
                borderRadius: 4,
                background: 'var(--color-surface)',
                position: 'absolute',
                width: '100%',
                zIndex: 1,
              }}
            >
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    data-testid="autocomplete-option"
                    onClick={() => {
                      setAutocompleteValue(s)
                      setQuery(s)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '6px 10px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Specimen>
    </>
  )
}
