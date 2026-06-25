/* === Message / answer renderer === */
const Icon = window.Icon;
const { useState, useEffect, useRef, useMemo } = React;

function StreamingSummary({ tokens, done }) {
  // tokens: array of {text, cite} — animate appearance over time
  const [visible, setVisible] = useState(done ? tokens.length : 0);
  useEffect(() => {
    if (done) { setVisible(tokens.length); return; }
    setVisible(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i > tokens.length) { clearInterval(interval); return; }
      setVisible(i);
    }, 220);
    return () => clearInterval(interval);
  }, [tokens, done]);

  return (
    <div className="summary">
      <p>
        {tokens.slice(0, visible).map((t, idx) => (
          <span key={idx} className="fade-in">
            {t.text}
            {t.cite && t.cite.map(n => (
              <a href={`#src-${n}`} className="cite" key={n}>{n}</a>
            ))}
          </span>
        ))}
        {!done && visible < tokens.length && <span className="streaming-pulse"></span>}
      </p>
    </div>
  );
}

function Section({ section, idx, registerRef, ctx }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) registerRef(section.id, ref.current); }, []);
  const num = String(idx + 1).padStart(2, '0');
  return (
    <section ref={ref} id={section.id} className="section fade-in" data-screen-label={`${num} ${section.title}`}>
      <header className="section__head">
        <h2 className="section__title">{section.title}</h2>
      </header>
      <div className="section__body">
        {section.body(ctx || {})}
      </div>
    </section>
  );
}


function ActionsRow() {
  const [reaction, setReaction] = useState(null);
  return (
    <div className="actions-row">
      <div className="actions-row__buttons">
        <button className="action-btn" title="Copy">{Icon.Copy()}</button>
        <button className="action-btn" title="Share">{Icon.Share()}</button>
        <button className="action-btn" title="Retry">{Icon.Refresh()}</button>
        <button
          className={'action-btn' + (reaction === 'up' ? ' action-btn--active' : '')}
          onClick={() => setReaction(r => r === 'up' ? null : 'up')}
          title="Good response">
          {Icon.ThumbsUp()}
        </button>
        <button
          className={'action-btn' + (reaction === 'down' ? ' action-btn--active' : '')}
          onClick={() => setReaction(r => r === 'down' ? null : 'down')}
          title="Bad response">
          {Icon.ThumbsDown()}
        </button>
      </div>
      <div className="actions-row__note">AI can make mistakes. Double check responses.</div>
    </div>
  );
}

const FOLLOWUPS_KEY = 'followups-collapsed';
const followupsListeners = new Set();
function getFollowupsCollapsed() {
  try { return localStorage.getItem(FOLLOWUPS_KEY) === '1'; } catch { return false; }
}
function setFollowupsCollapsed(v) {
  try { localStorage.setItem(FOLLOWUPS_KEY, v ? '1' : '0'); } catch {}
  followupsListeners.forEach(fn => fn(v));
}
function useFollowupsCollapsed() {
  const [v, setV] = useState(getFollowupsCollapsed);
  useEffect(() => {
    followupsListeners.add(setV);
    return () => followupsListeners.delete(setV);
  }, []);
  return [v, setFollowupsCollapsed];
}

function FollowUps({ chips, onPick }) {
  const items = (chips || []).slice(0, 3);
  const [collapsed, setCollapsed] = useFollowupsCollapsed();
  if (!items.length) return null;
  return (
    <div className={`followups ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        className="followups__label"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-controls="followups-list">
        <span>you can also ask ({items.length})</span>
        <span className="followups__chevron">{Icon.ChevronDown()}</span>
      </button>
      <ul className="followups__list" id="followups-list" hidden={collapsed}>
        {items.map((c, i) => (
          <li key={i}>
            <button className="followup-link" onClick={() => onPick(c)}>
              <span className="followup-link__icon">{Icon.CornerUpLeft()}</span>
              <span>{(c && c.q) || c}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="disclaimer">
      {Icon.Info()}
      <span>AI answers may contain errors. Information from Meridian University and partner sources is for general guidance — confirm details with an admissions counselor or the official catalog.</span>
    </div>
  );
}

function ThinkingState() {
  const [phase, setPhase] = useState(0);
  const phases = ['Searching the Meridian catalog…', 'Cross-referencing admissions & aid…', 'Composing answer…'];
  useEffect(() => {
    const id = setInterval(() => setPhase(p => Math.min(p + 1, phases.length - 1)), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="thinking">
      <div className="thinking__dots"><span></span><span></span><span></span></div>
      <span>{phases[phase]}</span>
    </div>
  );
}

function TabRefinement({ tab, onFollowUp }) {
  if (!tab) return null;
  const r = tab.refinement;
  if (r) {
    return (
      <div className="tab-refine fade-in">
        <div className="tab-refine__head">
          <span className="tab-refine__icon">{Icon.Sliders()}</span>
          <span className="tab-refine__label">Needs refinement</span>
        </div>
        <h3 className="tab-refine__title">{r.title}</h3>
        <p className="tab-refine__body">{r.body}</p>
        {r.chips && (
          <div className="tab-refine__chips">
            {r.chips.map((c, i) => (
              <button
                key={i}
                className="tab-refine__chip"
                onClick={() => onFollowUp && onFollowUp(`${c} \u2014 urgent care near me`)}>
                <span>{c}</span>
                <span className="tab-refine__chip-plus">{Icon.Plus()}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  // Fallback for tabs without explicit refinement copy but no sections either.
  return (
    <div className="tab-refine fade-in">
      <div className="tab-refine__head">
        <span className="tab-refine__icon">{Icon[tab.icon]()}</span>
        <span className="tab-refine__label">{tab.label}</span>
      </div>
      <h3 className="tab-refine__title">No high-confidence results yet</h3>
      <p className="tab-refine__body">Results for this view will appear once we have a clearer match. Try a follow-up to narrow the search.</p>
    </div>
  );
}

/* === Message: one Q&A turn === */
function Message({ msg, onFollowUp, onSectionInView, isLast, idx, activeScope, isCurrent, loggedIn }) {
  const sectionRefs = useRef({});
  const registerRef = (id, el) => { sectionRefs.current[id] = el; };
  const ctx = { loggedIn };

  // status: 'thinking' | 'summary' | 'sections' | 'done'
  const status = msg.status;
  const sectionsVisible = msg.sectionsVisible || 0;
  const scope = activeScope || 'ask';
  const visibleSections = msg.data.sections.slice(0, sectionsVisible);
  // Filter sections by the active scope. Ask shows everything except pages;
  // pages shows page-tagged sections only; the other scopes match exactly.
  const scopeOf = window.sectionScope || (() => 'ask');
  const filtered = scope === 'ask'
    ? visibleSections.filter(s => scopeOf(s) !== 'pages')
    : visibleSections.filter(s => scopeOf(s) === scope);

  return (
    <div className="message" data-msg-idx={idx} data-msg-id={msg.id} data-sources={JSON.stringify(msg.data.sources || [])} data-screen-label={`Message ${idx + 1}`}>
      <h1 className="query">{msg.query}</h1>
      {status === 'thinking' && <ThinkingState />}
      {status !== 'thinking' && (
        <div className="answer-block">
          <StreamingSummary tokens={msg.data.summary} done={status === 'done' || status === 'sections'} />
        </div>
      )}
      {(status === 'sections' || status === 'done') && (
        <>
          {filtered.map((s, i) => (
            <Section key={s.id} section={s} idx={i} registerRef={registerRef} ctx={ctx} />
          ))}
          {status === 'done' && filtered.length === 0 && (
            <div className="tab-refine fade-in">
              <h3 className="tab-refine__title">Nothing here yet</h3>
              <p className="tab-refine__body">No {scope} content for this answer. Try Ask for the full response.</p>
            </div>
          )}
          {status === 'sections' && sectionsVisible < msg.data.sections.length && (
            <ThinkingState />
          )}
        </>
      )}
      {status === 'done' && (
        <>
          <ActionsRow />
          {isLast && <FollowUps chips={msg.data.followups} onPick={onFollowUp} />}
        </>
      )}
    </div>
  );
}

window.AlmaMessage = Message;
