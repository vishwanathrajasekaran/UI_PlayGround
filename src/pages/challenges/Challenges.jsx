import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress.js'

const TIERS = [
  {
    key: 'beginner',
    title: 'Beginner',
    tasks: [
      { id: 'beg-1', text: 'Find a textbox by id and type text into it', to: '/basic-elements' },
      { id: 'beg-2', text: 'Click a button and verify a click counter updates', to: '/basic-elements' },
      { id: 'beg-3', text: 'Check a checkbox and verify it becomes checked', to: '/selection-controls' },
      { id: 'beg-4', text: 'Select a radio button option', to: '/selection-controls' },
      { id: 'beg-5', text: 'Select a dropdown value by visible text', to: '/selection-controls' },
    ],
  },
  {
    key: 'intermediate',
    title: 'Intermediate',
    tasks: [
      { id: 'int-1', text: 'Sort a table column and verify the new row order', to: '/tables' },
      { id: 'int-2', text: 'Set a value via a native date picker', to: '/advanced-controls' },
      { id: 'int-3', text: 'Switch into an iframe and click a button inside it', to: '/windows-iframes' },
      { id: 'int-4', text: 'Open a link in a new tab and switch to that window handle', to: '/windows-iframes' },
      { id: 'int-5', text: 'Drag an item into a drop zone', to: '/mouse-keyboard' },
      { id: 'int-6', text: 'Navigate to page 2 of a paginated table', to: '/tables' },
    ],
  },
  {
    key: 'advanced',
    title: 'Advanced',
    tasks: [
      { id: 'adv-1', text: 'Locate a button with no id or class, by text only', to: '/basic-elements' },
      { id: 'adv-2', text: 'Wait for an element that only appears after a delay', to: '/dynamic-behavior' },
      { id: 'adv-3', text: 'Handle an input whose id regenerates on every render', to: '/basic-elements' },
      { id: 'adv-4', text: 'Scroll a container until a hidden marker becomes visible', to: '/mouse-keyboard' },
      { id: 'adv-5', text: 'Detect and act on a toast before it auto-dismisses', to: '/popups' },
      { id: 'adv-6', text: 'Trigger a failing API call and verify the retry button appears', to: '/api-network' },
    ],
  },
  {
    key: 'expert',
    title: 'Expert',
    tasks: [
      { id: 'exp-1', text: 'Log in, then handle a session that expires mid-test', to: '/authentication' },
      { id: 'exp-2', text: 'Trigger and act on a custom right-click context menu', to: '/mouse-keyboard' },
      { id: 'exp-3', text: 'Assert on a value that only becomes correct via polling', to: '/wait-strategies' },
      { id: 'exp-4', text: 'Complete a full login \u2192 browse \u2192 cart \u2192 checkout flow', to: '/ecommerce' },
      { id: 'exp-5', text: 'Verify role-gated content only appears for the correct role', to: '/authentication' },
      { id: 'exp-6', text: 'Handle an element reference that goes stale mid-test', to: '/special-challenges' },
    ],
  },
]

const ALL_IDS = TIERS.flatMap((t) => t.tasks.map((task) => task.id))

export default function Challenges() {
  const { isDone, toggle, completedCount, total } = useProgress('challenges', ALL_IDS)

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>CH — Automation Challenges</h1>
          <p>
            A graded checklist rather than new widgets — each task points at the sheet where you
            can actually perform it. Work through a tier at a time, or jump straight to whichever
            skill you're practicing.
          </p>
        </div>
        <div className="title-block-fields">
          <div>
            <span className="field-label">Progress</span>
            {completedCount} / {total} marked done
          </div>
        </div>
      </div>

      {TIERS.map((tier) => {
        const tierDone = tier.tasks.filter((t) => isDone(t.id)).length
        return (
          <section key={tier.key} className="specimen">
            <div className="specimen-header">
              <h3>{tier.title}</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>
                {tierDone} / {tier.tasks.length}
              </span>
            </div>
            <div className="specimen-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tier.tasks.map((task) => (
                  <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      data-testid={`challenge-check-${task.id}`}
                      checked={isDone(task.id)}
                      onChange={() => toggle(task.id)}
                    />
                    <span style={{ flex: 1, fontSize: '0.88rem', textDecoration: isDone(task.id) ? 'line-through' : 'none', color: isDone(task.id) ? 'var(--color-ink-soft)' : 'var(--color-ink)' }}>
                      {task.text}
                    </span>
                    <Link to={task.to} className="btn btn-outline" style={{ padding: '3px 10px', fontSize: '0.76rem', textDecoration: 'none' }}>
                      Go →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}
    </>
  )
}
