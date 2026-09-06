import { useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['personal-info', 'contact-info', 'date-uuid', 'string-password', 'numeric']

const FIRST_NAMES = ['Asha', 'Marco', 'Wei', 'Fatima', 'Liam', 'Sofia', 'Kenji', 'Priya', 'Diego', 'Elena']
const LAST_NAMES = ['Patel', 'Silva', 'Chen', 'Khan', 'Murphy', 'Rossi', 'Tanaka', 'Nair', 'Garcia', 'Novak']
const STREETS = ['Maple St', 'Oak Ave', 'River Rd', 'Highland Dr', 'Cedar Ln']
const CITIES = ['Springfield', 'Riverside', 'Fairview', 'Georgetown', 'Salem']

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function randomDate() {
  const start = new Date(2015, 0, 1).getTime()
  const end = new Date(2026, 11, 31).getTime()
  return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10)
}

export default function TestDataLab() {
  const { isDone, toggle, completedCount, total } = useProgress('test-data-lab', SPECIMEN_IDS)

  const [personal, setPersonal] = useState(null)
  const [contact, setContact] = useState(null)
  const [dateUuid, setDateUuid] = useState(null)
  const [stringPassword, setStringPassword] = useState(null)
  const [numericRange, setNumericRange] = useState({ min: 1, max: 100 })
  const [numericValue, setNumericValue] = useState(null)

  function genPersonal() {
    const first = randomOf(FIRST_NAMES)
    const last = randomOf(LAST_NAMES)
    setPersonal({ first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}${randomInt(1, 99)}@example.com` })
  }

  function genContact() {
    setContact({
      phone: `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
      address: `${randomInt(10, 9999)} ${randomOf(STREETS)}, ${randomOf(CITIES)}`,
    })
  }

  function genDateUuid() {
    setDateUuid({ date: randomDate(), uuid: generateUuid() })
  }

  function genStringPassword() {
    setStringPassword({ str: generateRandomString(10), pass: generatePassword(12) })
  }

  function genNumeric() {
    setNumericValue(randomInt(numericRange.min, numericRange.max))
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>TD — Test Data Lab</h1>
          <p>
            Generate realistic-looking fake data on demand — names, emails, phone numbers,
            addresses, dates, UUIDs, random strings, passwords, and bounded random integers — for
            data-driven and parameterized test practice.
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
        id="personal-info"
        title="Name + email"
        done={isDone('personal-info')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'gen-personal-btn'],
          ['output ids', 'gen-first-name / gen-last-name / gen-email'],
        ]}
      >
        <button id="gen-personal-btn" data-testid="gen-personal-btn" className="btn" onClick={genPersonal}>
          Generate
        </button>
        {personal && (
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span id="gen-first-name" data-testid="gen-first-name">
              First: {personal.first}
            </span>
            <span id="gen-last-name" data-testid="gen-last-name">
              Last: {personal.last}
            </span>
            <span id="gen-email" data-testid="gen-email">
              Email: {personal.email}
            </span>
          </div>
        )}
      </Specimen>

      <Specimen
        id="contact-info"
        title="Phone + address"
        done={isDone('contact-info')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'gen-contact-btn'],
          ['output ids', 'gen-phone / gen-address'],
        ]}
      >
        <button id="gen-contact-btn" data-testid="gen-contact-btn" className="btn" onClick={genContact}>
          Generate
        </button>
        {contact && (
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span id="gen-phone" data-testid="gen-phone">
              Phone: {contact.phone}
            </span>
            <span id="gen-address" data-testid="gen-address">
              Address: {contact.address}
            </span>
          </div>
        )}
      </Specimen>

      <Specimen
        id="date-uuid"
        title="Date + UUID"
        done={isDone('date-uuid')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'gen-date-uuid-btn'],
          ['output ids', 'gen-date / gen-uuid'],
        ]}
      >
        <button id="gen-date-uuid-btn" data-testid="gen-date-uuid-btn" className="btn" onClick={genDateUuid}>
          Generate
        </button>
        {dateUuid && (
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span id="gen-date" data-testid="gen-date">
              Date: {dateUuid.date}
            </span>
            <span id="gen-uuid" data-testid="gen-uuid">
              UUID: {dateUuid.uuid}
            </span>
          </div>
        )}
      </Specimen>

      <Specimen
        id="string-password"
        title="Random string + password"
        done={isDone('string-password')}
        onToggleDone={toggle}
        annotations={[
          ['button id', 'gen-string-password-btn'],
          ['output ids', 'gen-random-string / gen-password'],
        ]}
      >
        <button id="gen-string-password-btn" data-testid="gen-string-password-btn" className="btn" onClick={genStringPassword}>
          Generate
        </button>
        {stringPassword && (
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span id="gen-random-string" data-testid="gen-random-string">
              String: {stringPassword.str}
            </span>
            <span id="gen-password" data-testid="gen-password">
              Password: {stringPassword.pass}
            </span>
          </div>
        )}
      </Specimen>

      <Specimen
        id="numeric"
        title="Bounded random integer"
        done={isDone('numeric')}
        onToggleDone={toggle}
        annotations={[
          ['min/max inputs', 'numeric-min / numeric-max'],
          ['button id', 'gen-numeric-btn'],
          ['output id', 'gen-numeric-value'],
        ]}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <input
            id="numeric-min"
            data-testid="numeric-min"
            type="number"
            value={numericRange.min}
            onChange={(e) => setNumericRange((r) => ({ ...r, min: Number(e.target.value) }))}
            style={{ width: 80 }}
          />
          <span>to</span>
          <input
            id="numeric-max"
            data-testid="numeric-max"
            type="number"
            value={numericRange.max}
            onChange={(e) => setNumericRange((r) => ({ ...r, max: Number(e.target.value) }))}
            style={{ width: 80 }}
          />
          <button id="gen-numeric-btn" data-testid="gen-numeric-btn" className="btn" onClick={genNumeric}>
            Generate
          </button>
        </div>
        {numericValue !== null && (
          <div id="gen-numeric-value" data-testid="gen-numeric-value" className="result-line">
            Value: {numericValue}
          </div>
        )}
      </Specimen>
    </>
  )
}
