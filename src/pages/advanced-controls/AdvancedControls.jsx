import { useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['date', 'time', 'slider', 'range-slider', 'color', 'file-upload', 'file-download']

export default function AdvancedControls() {
  const { isDone, toggle, completedCount, total } = useProgress('advanced-controls', SPECIMEN_IDS)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [volume, setVolume] = useState(50)
  const [rangeMin, setRangeMin] = useState(20)
  const [rangeMax, setRangeMax] = useState(80)
  const [color, setColor] = useState('#d6472b')
  const [fileName, setFileName] = useState('')

  function handleRangeMinChange(e) {
    const val = Math.min(Number(e.target.value), rangeMax - 1)
    setRangeMin(val)
  }

  function handleRangeMaxChange(e) {
    const val = Math.max(Number(e.target.value), rangeMin + 1)
    setRangeMax(val)
  }

  function handleDownload() {
    const content = `UI Automation Playground — sample export\nGenerated: ${new Date().toISOString()}\n`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'playground-sample.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>AC — Advanced Controls</h1>
          <p>
            Native date/time pickers, single and dual-handle sliders, a color picker, and file
            upload/download — good targets for practicing non-text input interactions.
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
        id="date"
        title="Date picker"
        done={isDone('date')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'date-picker'],
          ['value', date || '(empty)'],
          ['note', 'native input — set value directly or via send_keys with YYYY-MM-DD'],
        ]}
      >
        <input id="date-picker" data-testid="date-picker" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Specimen>

      <Specimen
        id="time"
        title="Time picker"
        done={isDone('time')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'time-picker'],
          ['value', time || '(empty)'],
        ]}
      >
        <input id="time-picker" data-testid="time-picker" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </Specimen>

      <Specimen
        id="slider"
        title="Slider — single value"
        done={isDone('slider')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'volume-slider'],
          ['value', String(volume)],
          ['note', 'drag, or send arrow keys after focusing'],
        ]}
      >
        <div style={{ maxWidth: 300 }}>
          <input
            id="volume-slider"
            data-testid="volume-slider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </Specimen>

      <Specimen
        id="range-slider"
        title="Range slider — min/max pair"
        done={isDone('range-slider')}
        onToggleDone={toggle}
        annotations={[
          ['ids', 'price-range-min / price-range-max'],
          ['selected range', `${rangeMin} – ${rangeMax}`],
          ['note', 'implemented as two linked native ranges, not a single dual-thumb element'],
        ]}
      >
        <div style={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>Min: {rangeMin}</label>
          <input
            id="price-range-min"
            data-testid="price-range-min"
            type="range"
            min="0"
            max="100"
            value={rangeMin}
            onChange={handleRangeMinChange}
          />
          <label style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>Max: {rangeMax}</label>
          <input
            id="price-range-max"
            data-testid="price-range-max"
            type="range"
            min="0"
            max="100"
            value={rangeMax}
            onChange={handleRangeMaxChange}
          />
        </div>
      </Specimen>

      <Specimen
        id="color"
        title="Color picker"
        done={isDone('color')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'color-picker'],
          ['value', color],
        ]}
      >
        <input id="color-picker" data-testid="color-picker" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </Specimen>

      <Specimen
        id="file-upload"
        title="File upload"
        done={isDone('file-upload')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'file-upload-input'],
          ['selected file', fileName || '(none)'],
          ['note', 'send_keys an absolute file path to this input in Selenium/Playwright'],
        ]}
      >
        <input
          id="file-upload-input"
          data-testid="file-upload-input"
          type="file"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
        />
      </Specimen>

      <Specimen
        id="file-download"
        title="File download"
        done={isDone('file-download')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'download-btn'],
          ['downloads', 'playground-sample.txt'],
          ['note', 'verify the file landed in your automation tool\u2019s download directory'],
        ]}
      >
        <button id="download-btn" data-testid="download-btn" className="btn" onClick={handleDownload}>
          Download sample file
        </button>
      </Specimen>
    </>
  )
}
