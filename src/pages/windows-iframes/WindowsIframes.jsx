import Specimen from '../../components/Specimen.jsx'
import { useProgress } from '../../hooks/useProgress.js'

const SPECIMEN_IDS = ['new-tab', 'new-window', 'iframe', 'nested-iframe']

const basicIframeHtml = `<html><body style="font-family:sans-serif;padding:12px;margin:0;">
<p id="iframe-label">Content inside the iframe</p>
<button id="iframe-btn" onclick="document.getElementById('iframe-label').textContent='Clicked inside iframe!'">Click me</button>
</body></html>`

const nestedInnerHtml = `<html><body style="font-family:sans-serif;padding:10px;margin:0;">
<p id="inner-label">Inner nested frame content</p>
<button id="inner-nested-btn" onclick="document.getElementById('inner-label').textContent='Clicked inside nested iframe'">Click me</button>
</body></html>`

const nestedOuterHtml = `<html><body style="font-family:sans-serif;padding:12px;margin:0;">
<p id="outer-label">Outer frame content</p>
<iframe id="nested-iframe-inner" data-testid="nested-iframe-inner" style="width:100%;height:70px;border:1px solid #cdd8e2;" srcdoc="${nestedInnerHtml.replace(/"/g, '&quot;')}"></iframe>
</body></html>`

export default function WindowsIframes() {
  const { isDone, toggle, completedCount, total } = useProgress('windows-iframes', SPECIMEN_IDS)

  function openNewWindow() {
    window.open('https://example.com', '_blank', 'width=420,height=320')
  }

  return (
    <>
      <div className="title-block">
        <div className="title-block-main">
          <h1>WN — Windows &amp; iFrames</h1>
          <p>
            New tabs, new windows, and single/nested iframes — practice switching window handles
            and frame contexts, and returning to the parent document.
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
        id="new-tab"
        title="Opens in a new tab"
        done={isDone('new-tab')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'new-tab-link'],
          ['target', '_blank'],
        ]}
      >
        <a id="new-tab-link" data-testid="new-tab-link" href="https://example.com" target="_blank" rel="noreferrer" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Open in new tab
        </a>
      </Specimen>

      <Specimen
        id="new-window"
        title="Opens a new window"
        done={isDone('new-window')}
        onToggleDone={toggle}
        annotations={[
          ['id', 'new-window-btn'],
          ['note', 'uses window.open with explicit width/height — some browsers still open this as a tab depending on popup settings'],
        ]}
      >
        <button id="new-window-btn" data-testid="new-window-btn" className="btn" onClick={openNewWindow}>
          Open new window
        </button>
      </Specimen>

      <Specimen
        id="iframe"
        title="Single iframe"
        done={isDone('iframe')}
        onToggleDone={toggle}
        annotations={[
          ['iframe id', 'basic-iframe'],
          ['inner button id', 'iframe-btn (inside the frame document)'],
          ['note', 'switch into the frame context before locating elements inside it'],
        ]}
      >
        <iframe
          id="basic-iframe"
          data-testid="basic-iframe"
          title="Basic iframe demo"
          srcDoc={basicIframeHtml}
          style={{ width: '100%', height: 90, border: '1px solid var(--color-grid)', borderRadius: 4 }}
        />
      </Specimen>

      <Specimen
        id="nested-iframe"
        title="Nested iframe"
        done={isDone('nested-iframe')}
        onToggleDone={toggle}
        annotations={[
          ['outer iframe id', 'nested-iframe-outer'],
          ['inner iframe id', 'nested-iframe-inner (inside the outer frame document)'],
          ['note', 'requires switching into the outer frame, then into the inner frame'],
        ]}
      >
        <iframe
          id="nested-iframe-outer"
          data-testid="nested-iframe-outer"
          title="Nested iframe demo"
          srcDoc={nestedOuterHtml}
          style={{ width: '100%', height: 150, border: '1px solid var(--color-grid)', borderRadius: 4 }}
        />
      </Specimen>
    </>
  )
}
