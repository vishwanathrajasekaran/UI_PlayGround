import { useEffect, useRef, useState } from 'react'
import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['hover', 'double-click', 'right-click', 'drag-drop', 'resize', 'keyboard', 'scroll']

const INITIAL_ITEMS = ['Alpha', 'Beta', 'Gamma']

export default function MouseKeyboard() {
  const { isDone, toggle, completedCount, total } = useProgress('mouse-keyboard', SPECIMEN_IDS)

  // --- Double click ---
  const [dblClickCount, setDblClickCount] = useState(0)

  // --- Right click / context menu ---
  const [contextMenu, setContextMenu] = useState(null) // { x, y }
  const contextMenuRef = useRef(null)

  useEffect(() => {
    function closeMenu(e) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) setContextMenu(null)
    }
    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])

  function handleContextMenu(e) {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  // --- Drag and drop ---
  const [pool, setPool] = useState(INITIAL_ITEMS)
  const [dropped, setDropped] = useState([])
  const [dragOver, setDragOver] = useState(false)

  function handleDragStart(e, item) {
    e.dataTransfer.setData('text/plain', item)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const item = e.dataTransfer.getData('text/plain')
    if (!item) return
    setPool((p) => p.filter((i) => i !== item))
    setDropped((d) => (d.includes(item) ? d : [...d, item]))
  }

  // --- Resize (native CSS resize + ResizeObserver reporting) ---
  const resizeBoxRef = useRef(null)
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = resizeBoxRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setBoxSize({ width: Math.round(width), height: Math.round(height) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // --- Keyboard actions ---
  const [lastKey, setLastKey] = useState('(none yet)')

  function handleKeyDown(e) {
    const parts = []
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.metaKey) parts.push('Cmd')
    if (e.shiftKey) parts.push('Shift')
    if (e.altKey) parts.push('Alt')
    parts.push(e.key)
    setLastKey(parts.join('+'))
  }

  // --- Scroll ---
  const scrollBoxRef = useRef(null)
  const [reachedBottom, setReachedBottom] = useState(false)

  function handleScroll(e) {
    const el = e.target
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 12
    if (nearBottom) setReachedBottom(true)
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>MK — Mouse &amp; Keyboard</h1>
          <p>
            Hover reveals, double-click, a custom right-click context menu, native HTML5 drag &amp;
            drop, a resizable box, keyboard-combo detection, and scroll-triggered visibility.
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
        id="hover"
        title="Hover reveal"
        done={isDone('hover')}
        onToggleDone={toggle}
        annotations={[
          ['trigger id', 'hover-card'],
          ['overlay id', 'hover-overlay'],
          ['note', 'overlay is only in the DOM while the mouse is over the card'],
        ]}
      >
        <div id="hover-card" data-testid="hover-card" className="hover-card">
          <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>Hover over this card</span>
          <div id="hover-overlay" data-testid="hover-overlay" className="hover-overlay">
            Revealed on hover
          </div>
        </div>
      </Specimen>

      <Specimen
        id="double-click"
        title="Double click"
        done={isDone('double-click')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'double-click-zone'],
          ['count', String(dblClickCount)],
        ]}
      >
        <div
          id="double-click-zone"
          data-testid="double-click-zone"
          onDoubleClick={() => setDblClickCount((c) => c + 1)}
          style={{
            border: '1px dashed var(--color-grid)',
            borderRadius: 6,
            padding: '20px 16px',
            textAlign: 'center',
            userSelect: 'none',
            cursor: 'pointer',
            maxWidth: 260,
          }}
        >
          Double-click this box
          <div className="result-line" data-testid="double-click-count">
            Count: {dblClickCount}
          </div>
        </div>
      </Specimen>

      <Specimen
        id="right-click"
        title="Right click — custom context menu"
        done={isDone('right-click')}
        onToggleDone={toggle}
        annotations={[
          ['zone id', 'context-menu-zone'],
          ['menu id', 'custom-context-menu'],
          ['note', 'default browser menu is suppressed via preventDefault'],
        ]}
      >
        <div
          id="context-menu-zone"
          data-testid="context-menu-zone"
          onContextMenu={handleContextMenu}
          style={{
            border: '1px dashed var(--color-grid)',
            borderRadius: 6,
            padding: '20px 16px',
            textAlign: 'center',
            userSelect: 'none',
            maxWidth: 260,
          }}
        >
          Right-click this box
        </div>
        {contextMenu && (
          <ul
            ref={contextMenuRef}
            id="custom-context-menu"
            data-testid="custom-context-menu"
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              listStyle: 'none',
              margin: 0,
              padding: 4,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-grid)',
              borderRadius: 4,
              minWidth: 140,
              zIndex: 30,
            }}
          >
            {['Copy', 'Rename', 'Delete'].map((item) => (
              <li key={item}>
                <button
                  data-testid={`context-item-${item.toLowerCase()}`}
                  onClick={() => setContextMenu(null)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit' }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Specimen>

      <Specimen
        id="drag-drop"
        title="Drag & drop"
        done={isDone('drag-drop')}
        onToggleDone={toggle}
        annotations={[
          ['draggable items', 'data-testid="drag-item-{name}"'],
          ['drop zone id', 'drop-zone'],
          ['note', 'uses the native HTML5 drag-and-drop API — a known tricky spot for some automation tools'],
        ]}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)', marginBottom: 6 }}>Drag from here</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {pool.map((item) => (
                <div
                  key={item}
                  draggable
                  data-testid={`drag-item-${item}`}
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="drag-chip"
                >
                  {item}
                </div>
              ))}
              {pool.length === 0 && <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.82rem' }}>(all dropped)</span>}
            </div>
          </div>
          <div
            id="drop-zone"
            data-testid="drop-zone"
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              minWidth: 160,
              minHeight: 70,
              border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'var(--color-grid)'}`,
              borderRadius: 6,
              padding: 10,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignContent: 'flex-start',
            }}
          >
            {dropped.length === 0 && <span style={{ color: 'var(--color-ink-soft)', fontSize: '0.78rem' }}>Drop zone</span>}
            {dropped.map((item) => (
              <div key={item} data-testid={`dropped-item-${item}`} className="drag-chip drag-chip-dropped">
                {item}
              </div>
            ))}
          </div>
        </div>
      </Specimen>

      <Specimen
        id="resize"
        title="Resize"
        done={isDone('resize')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'resizable-box'],
          ['current size', `${boxSize.width} × ${boxSize.height}px`],
          ['note', 'drag the bottom-right corner'],
        ]}
      >
        <div
          id="resizable-box"
          data-testid="resizable-box"
          ref={resizeBoxRef}
          style={{
            resize: 'both',
            overflow: 'auto',
            width: 200,
            height: 100,
            border: '1px solid var(--color-grid)',
            borderRadius: 6,
            padding: 10,
            fontSize: '0.8rem',
            color: 'var(--color-ink-soft)',
          }}
        >
          Resize me from the corner.
        </div>
      </Specimen>

      <Specimen
        id="keyboard"
        title="Keyboard actions"
        done={isDone('keyboard')}
        onToggleDone={toggle}
        annotations={[
          ['input id', 'keyboard-capture-input'],
          ['last key/combo', lastKey],
        ]}
      >
        <input
          id="keyboard-capture-input"
          data-testid="keyboard-capture-input"
          type="text"
          placeholder="Click here, then press any key or combo"
          onKeyDown={handleKeyDown}
          style={{ maxWidth: 280 }}
        />
        <div className="result-line" data-testid="keyboard-last-key">
          Last: {lastKey}
        </div>
      </Specimen>

      <Specimen
        id="scroll"
        title="Scroll — reveal on reaching bottom"
        done={isDone('scroll')}
        onToggleDone={toggle}
        annotations={[
          ['scroll container id', 'scroll-box'],
          ['target id', 'scroll-bottom-marker'],
          ['state', reachedBottom ? 'reached bottom' : 'not yet scrolled to bottom'],
        ]}
      >
        <div
          id="scroll-box"
          data-testid="scroll-box"
          ref={scrollBoxRef}
          onScroll={handleScroll}
          style={{
            height: 120,
            overflowY: 'auto',
            border: '1px solid var(--color-grid)',
            borderRadius: 6,
            padding: '8px 14px',
            maxWidth: 320,
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i} style={{ fontSize: '0.82rem', color: 'var(--color-ink-soft)' }}>
              Scrollable line {i + 1}
            </p>
          ))}
          <div id="scroll-bottom-marker" data-testid="scroll-bottom-marker" className="result-line">
            {reachedBottom ? '✓ You reached the bottom' : ''}
          </div>
        </div>
      </Specimen>
    </>
  )
}
