/* === [System] — main App === */
const Icon = window.Icon;
const Message = window.AlmaMessage;
const { useState: useS, useEffect: useE, useRef: useR, useCallback } = React;

// Resets on full page reload — staged landing intro plays once per session.
let introPlayed = false;

/* Animated placeholder texts (cycles when unfocused and empty) */
const PLACEHOLDER_TEXTS = [
'computer science major requirements',
'scholarships for first-year students',
'how much does tuition really cost'];


/* Focused-empty suggestions (exactly 3, no heading) */
const RECOMMENDATIONS = [
'Tell me about the Computer Science major',
'How much does Meridian cost and what aid can I get?',
'What scholarships am I eligible for?'];


/* Tagged search index — every suggestion carries the category we surface at the
   right edge of each dropdown row, plus the scope it belongs to so an active
   scope pill can filter the pool. */
const SEARCH_INDEX = [
// Programs & majors
{ text: 'Tell me about the Computer Science major', category: 'Program', scope: 'services' },
{ text: 'Computer Science major requirements', category: 'Program', scope: 'services' },
{ text: 'Data Science program', category: 'Program', scope: 'services' },
{ text: 'Business Administration degree', category: 'Program', scope: 'services' },
{ text: 'Nursing program requirements', category: 'Program', scope: 'services' },
{ text: 'Psychology major overview', category: 'Program', scope: 'services' },
{ text: 'Mechanical Engineering degree', category: 'Program', scope: 'services' },
{ text: 'Online and hybrid programs', category: 'Program', scope: 'services' },
{ text: 'What courses will I take in CS?', category: 'Course', scope: 'conditions' },
// Compare
{ text: 'Compare Computer Science and Data Science', category: 'Compare', scope: 'services' },
{ text: 'Computer Science vs Data Science', category: 'Compare', scope: 'services' },
{ text: 'Difference between CS and Data Science', category: 'Compare', scope: 'services' },
// Faculty
{ text: 'Who teaches in the CS department?', category: 'Faculty', scope: 'doctors' },
{ text: 'Computer Science faculty', category: 'Faculty', scope: 'doctors' },
{ text: 'Faculty accepting research students', category: 'Faculty', scope: 'doctors' },
{ text: 'Meet a faculty advisor', category: 'Faculty', scope: 'doctors' },
{ text: 'Who teaches data science?', category: 'Faculty', scope: 'doctors' },
// Campus
{ text: 'Schedule a campus visit', category: 'Campus', scope: 'locations' },
{ text: 'Residence halls and housing', category: 'Campus', scope: 'locations' },
{ text: 'Where is the engineering building?', category: 'Campus', scope: 'locations' },
{ text: 'Libraries and study spaces', category: 'Campus', scope: 'locations' },
{ text: 'Dining and meal plans', category: 'Campus', scope: 'locations' },
{ text: 'Tour the computing labs', category: 'Campus', scope: 'locations' },
// Cost & aid
{ text: 'How much does Meridian cost and what aid can I get?', category: 'Cost', scope: 'conditions' },
{ text: 'Tuition and cost of attendance', category: 'Cost', scope: 'conditions' },
{ text: 'What scholarships am I eligible for?', category: 'Cost', scope: 'conditions' },
{ text: 'Financial aid for first-year students', category: 'Cost', scope: 'conditions' },
{ text: 'What is the net price after aid?', category: 'Cost', scope: 'conditions' },
{ text: 'Does Meridian meet full need?', category: 'Cost' },
{ text: 'When is the FAFSA deadline?', category: 'Cost' },
{ text: 'Is there a tuition payment plan?', category: 'Cost' },
// Admissions
{ text: 'Admission requirements', category: 'Admissions', scope: 'pages' },
{ text: 'Application deadlines', category: 'Admissions', scope: 'pages' },
{ text: 'How do I apply to Meridian?', category: 'Admissions', scope: 'pages' },
{ text: 'Is Meridian test-optional?', category: 'Admissions', scope: 'pages' },
{ text: 'Transfer credit policy', category: 'Admissions', scope: 'pages' }];


/* The five established demo chats navigable from search */
const DEMO_QUERIES = new Set(['Tell me about the Computer Science major', 'How much does Meridian cost and what aid can I get?', 'What scholarships am I eligible for?', 'What courses will I take in CS?', 'Who teaches in the CS department?', 'Compare Computer Science and Data Science', 'Computer Science vs Data Science']);

function getSuggestions(text, scope) {
  const t = text.toLowerCase().trim();
  if (!t) return [];
  // "pt" is a two-char special case; all others require 3+ chars
  const isPt = t === 'pt' || t.startsWith('pt ');
  if (!isPt && t.length < 3) return [];

  // Typeahead is INDEPENDENT of the active scope chip — the chip is a filter
  // that applies to results, not a constraint on what the user can search for.
  // We still let scope softly re-rank: scope-matching items float to the top,
  // but everything matching the query is searchable.
  const starts = [],contains = [];
  for (const s of SEARCH_INDEX) {
    const lo = s.text.toLowerCase();
    if (lo.startsWith(t)) starts.push(s);else
    if (lo.includes(t)) contains.push(s);
  }
  const ranked = [...starts, ...contains];
  if (scope && scope.id !== 'ask') {
    const inScope = ranked.filter((s) => s.scope === scope.id);
    const outScope = ranked.filter((s) => s.scope !== scope.id);
    return [...inScope, ...outScope].slice(0, 6);
  }
  return ranked.slice(0, 6);
}

/* Primary nav (the "categories" of search) */
const PRIMARY_NAV = [
{ id: 'degree-planner', icon: 'GraduationCap', label: 'Degree Planner', kind: 'agent' },
{ id: 'virtual-advisor', icon: 'Users', label: 'Virtual Advisor', kind: 'agent' },
{ id: 'financial-aid', icon: 'DollarSign', label: 'Financial Aid Assistant', kind: 'agent' },
{ id: 'career-dreamer', icon: 'Compass', label: 'Career Dreamer', kind: 'agent' },
{ id: 'visit-planner', icon: 'Calendar', label: 'Visit Planner', kind: 'agent' }];


/* Recent chats — every entry maps to one of our existing result flows */
const HISTORY = [
{ id: 'h1', q: 'Computer Science major', query: 'Tell me about the Computer Science major' },
{ id: 'h2', q: 'CS vs Data Science', query: 'Compare Computer Science and Data Science' },
{ id: 'h3', q: 'Cost & financial aid', query: 'How much does Meridian cost and what aid can I get?' },
{ id: 'h4', q: 'Scholarships I can earn', query: 'What scholarships am I eligible for?' },
{ id: 'h5', q: 'CS faculty', query: 'Who teaches in the CS department?' },
{ id: 'h6', q: 'Net price & aid', query: 'What is the net price after aid?' }];


const RESPONSE_MODES = [
{ id: 'Quick', desc: 'Concise answer with the most relevant next step' },
{ id: 'Detailed', desc: 'Broader answer with more context, related results, and more complete coverage' }];

/* Agents listed in the chat input's "+" menu. IDs map to pickAgent(). */
const ADD_MENU_AGENTS = [
{ id: 'degree-planner', icon: 'GraduationCap', label: 'Degree Planner' },
{ id: 'virtual-advisor', icon: 'Users', label: 'Virtual Advisor' },
{ id: 'financial-aid', icon: 'DollarSign', label: 'Financial Aid Assistant' },
{ id: 'career-dreamer', icon: 'Compass', label: 'Career Dreamer' },
{ id: 'visit-planner', icon: 'Calendar', label: 'Visit Planner' }];





/* Category scopes — tabs above the search input. `all` is the default and
   behaves as no scope filter. `suggestions` are the 4 example queries shown
   below the input when the field is empty. */
const SCOPES = [
{ id: 'ask', label: 'Ask', icon: 'Sparkle',
  placeholder: 'Ask anything about Meridian',
  suggestions: [
  'Tell me about the Computer Science major',
  'How much does Meridian cost and what aid can I get?',
  'What scholarships am I eligible for?',
  'How do I apply to Meridian?'] },
{ id: 'services', label: 'Programs', icon: 'BookOpen',
  placeholder: 'Explore majors and programs',
  suggestions: [
  'Computer Science major',
  'Data Science program',
  'Nursing program requirements',
  'Online and hybrid programs'] },
{ id: 'doctors', label: 'Faculty', icon: 'Person',
  placeholder: 'Find professors and advisors',
  suggestions: [
  'Computer Science faculty',
  'Faculty accepting research students',
  'Who teaches data science?',
  'Meet a faculty advisor'] },
{ id: 'locations', label: 'Campus', icon: 'MapPin',
  placeholder: 'Find your way around campus',
  suggestions: [
  'Schedule a campus visit',
  'Residence halls and housing',
  'Libraries and study spaces',
  'Dining and meal plans'] },
{ id: 'conditions', label: 'Cost & Aid', icon: 'DollarSign',
  placeholder: 'Estimate tuition, aid, and scholarships',
  suggestions: [
  'Tuition and cost of attendance',
  'What scholarships am I eligible for?',
  'What is the net price after aid?',
  'When is the FAFSA deadline?'] },
{ id: 'pages', label: 'Admissions', icon: 'FileText',
  placeholder: 'Admissions, deadlines, and how to apply',
  suggestions: [
  'Admission requirements',
  'Application deadlines',
  'How do I apply to Meridian?',
  'Is Meridian test-optional?'] }];

const DEFAULT_SCOPE = SCOPES[0];

/* Map per-section `tab` ids (defined in data.jsx) to the 6 canonical scope ids.
   Used by ChatHeader (to decide which tabs to render) and by Message (to filter
   sections by active scope). */
const TAB_TO_SCOPE = {
  pages: 'pages',
  admissions: 'pages',
  locations: 'locations',
  campus: 'locations',
  doctors: 'doctors',
  faculty: 'doctors',
  providers: 'doctors',
  services: 'services',
  programs: 'services',
  courses: 'services',
  cost: 'conditions',
  aid: 'conditions',
  scholarships: 'conditions',
  overview: 'ask',
  ask: 'ask',
};
const sectionScope = (s) => (s && s.tab && TAB_TO_SCOPE[s.tab]) || 'ask';
window.sectionScope = sectionScope;



/* === Input bar === */
function InputBar({ value, onChange, onSubmit, large, placeholder, autoFocus, onFocus, onBlur, onPickAgent }) {
  const ta = useR(null);
  const [mode, setMode] = useS('Quick');
  const [modeOpen, setModeOpen] = useS(false);
  const modeRef = useR(null);
  const suppressNextFocus = useR(false);
  const [taFocused, setTaFocused] = useS(false);
  const [phIdx, setPhIdx] = useS(0);
  const [phVisible, setPhVisible] = useS(true);
  const [addOpen, setAddOpen] = useS(false);
  const addRef = useR(null);
  const fileInputRef = useR(null);
  const photoInputRef = useR(null);
  const [attachments, setAttachments] = useS([]);

  const addFiles = (fileList, kind) => {
    if (!fileList || fileList.length === 0) return;
    const next = Array.from(fileList).map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      kind }));

    setAttachments((prev) => [...prev, ...next]);
  };
  const onFilePicked = (e, kind) => {
    addFiles(e.target.files, kind);
    e.target.value = '';
  };
  const removeAttachment = (id) => setAttachments((prev) => prev.filter((x) => x.id !== id));
  const pickAgentItem = (id) => {
    if (onPickAgent) onPickAgent(id);
    setAddOpen(false);
  };

  useE(() => {
    if (ta.current) {
      ta.current.style.height = 'auto';
      ta.current.style.height = Math.min(ta.current.scrollHeight, 180) + 'px';
    }
  }, [value]);
  useE(() => {
    if (autoFocus && ta.current) {
      suppressNextFocus.current = true;
      ta.current.focus();
    }
  }, [autoFocus]);
  useE(() => {
    if (!modeOpen) return;
    const close = (e) => {
      if (modeRef.current && !modeRef.current.contains(e.target)) setModeOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [modeOpen]);
  useE(() => {
    if (!addOpen) return;
    const close = (e) => {
      if (addRef.current && !addRef.current.contains(e.target)) setAddOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [addOpen]);
  // Static placeholder — no animated cycling in this layout
  const showAnimPh = false;

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSubmit(value.trim());
    }
  };
  const handleTextareaFocus = () => {
    if (suppressNextFocus.current) {suppressNextFocus.current = false;return;}
    setTaFocused(true);
    if (onFocus) onFocus();
  };
  const handleTextareaBlur = (e) => {
    setTaFocused(false);
    if (onBlur) onBlur(e);
  };
  return (
    <div className={'input-shell' + (large ? ' input-shell--large' : '')}>
      <div className="input__textarea-wrap">
        <textarea
          ref={ta}
          className="input__textarea"
          placeholder={placeholder || 'Search programs, faculty, campus, or ask a question…'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          rows={1} />
      </div>

      {attachments.length > 0 &&
      <div className="input__chips">
          {attachments.map((a) =>
        <span key={a.id} className="input__chip">
              <span className="input__chip-icon">{a.kind === 'photo' ? Icon.Image() : Icon.FileText()}</span>
              <span className="input__chip-name">{a.name}</span>
              <button
            type="button"
            className="input__chip-x"
            title="Remove"
            onClick={() => removeAttachment(a.id)}>
                {Icon.X()}
              </button>
            </span>
        )}
        </div>
      }

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFilePicked(e, 'file')} />

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onFilePicked(e, 'photo')} />


      <div className="input__row">
        <div className="input__tools">
          <div className="input__add-wrap" ref={addRef}>
            <button
              type="button"
              className={'icon-btn' + (addOpen ? ' icon-btn--open' : '')}
              title="Add"
              onClick={() => setAddOpen((o) => !o)}>
              {Icon.Plus()}
            </button>
            {addOpen &&
            <div className="input__add-menu">
                <button
                className="input__add-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {fileInputRef.current?.click();setAddOpen(false);}}>
                  <span className="input__add-item-icon">{Icon.FileText()}</span>
                  <span className="input__add-item-label">Add files</span>
                </button>
                <button
                className="input__add-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {photoInputRef.current?.click();setAddOpen(false);}}>
                  <span className="input__add-item-icon">{Icon.Image()}</span>
                  <span className="input__add-item-label">Add photo</span>
                </button>
                <div className="input__add-divider" />
                {ADD_MENU_AGENTS.map((a) =>
              <button
                key={a.id}
                className="input__add-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickAgentItem(a.id)}>
                    <span className="input__add-item-icon">{Icon[a.icon]()}</span>
                    <span className="input__add-item-label">{a.label}</span>
                  </button>
              )}
              </div>
            }
          </div>
          <button className="icon-btn" title="Voice">{Icon.Mic()}</button>
        </div>
        <div className="input__right">
          <div className="input__mode-wrap" ref={modeRef}>
            <button className={'input__mode' + (modeOpen ? ' input__mode--open' : '')} onClick={() => setModeOpen((o) => !o)}>
              <span>{mode}</span>
              <span className="input__mode-caret">{Icon.ChevronDown()}</span>
            </button>
            {modeOpen &&
            <div className="input__mode-menu">
                {RESPONSE_MODES.map((m) =>
              <button
                key={m.id}
                className={'input__mode-item' + (mode === m.id ? ' input__mode-item--active' : '')}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {setMode(m.id);setModeOpen(false);}}>
                    <span className="input__mode-item-label">{m.id}</span>
                    <span className="input__mode-item-desc">{m.desc}</span>
                  </button>
              )}
              </div>
            }
          </div>
          <button
            className="input__send"
            disabled={!value.trim()}
            onClick={() => value.trim() && onSubmit(value.trim())}
            title="Send">
            {Icon.ArrowRight()}
          </button>
        </div>
      </div>
    </div>);

}

/* === Search suggestion / recommendation panel ===
   Clean typeahead — plain list of matches with the typed portion muted and
   the rest bold. No category labels, no pinned rows. */
function SearchPanel({ draft, onSelect, onFillDraft, scope, unboxed }) {
  const t = draft.trim();
  const suggestions = t ? getSuggestions(draft, scope) : [];

  if (!t || suggestions.length === 0) return null;

  const pick = (e, s) => {
    e.preventDefault();
    if (DEMO_QUERIES.has(s)) onSelect(s);else
    onFillDraft(s);
  };

  return (
    <div className={'search-panel search-panel--typeahead' + (unboxed ? ' search-panel--unboxed' : '')}>
      {suggestions.map((s, i) => {
        const lo = s.text.toLowerCase();
        const q = t.toLowerCase();
        const isPrefix = lo.startsWith(q);
        const idx = isPrefix ? 0 : lo.indexOf(q);
        return (
          <button key={i} className="search-panel__item" onMouseDown={(e) => pick(e, s.text)}>
            <span className="search-panel__item-icon">{Icon.Search()}</span>
            <span className="search-panel__item-text">
              {isPrefix ?
              <>
                  <span className="search-panel__match">{s.text.slice(0, q.length)}</span>
                  <span className="search-panel__rest">{s.text.slice(q.length)}</span>
                </> :
              idx > -1 ?
              <>
                  <span className="search-panel__match">{s.text.slice(0, idx)}</span>
                  <span className="search-panel__rest">{s.text.slice(idx, idx + q.length)}</span>
                  <span className="search-panel__match">{s.text.slice(idx + q.length)}</span>
                </> :
              <span className="search-panel__rest">{s.text}</span>
              }
            </span>
          </button>);
      })}
    </div>);
}

/* === Default suggestions (shown below the input when draft is empty) === */
function DefaultSuggestions({ items, onPick }) {
  return (
    <div className="default-suggestions">
      {items.map((q, i) =>
      <button
        key={i}
        type="button"
        className="default-suggestions__item"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onPick(q)}>
          <span className="default-suggestions__icon">{Icon.Search()}</span>
          <span className="default-suggestions__text">{q}</span>
        </button>
      )}
    </div>);

}

/* === Landing state === */
function Landing({ onAsk, draft, setDraft, loggedIn, onSignIn, intro, onPickAgent }) {
  const [focused, setFocused] = useS(false);
  const [scope, setScope] = useS(DEFAULT_SCOPE);
  // Page-contextual landing (set by site-shell.jsx via window.SEARCH_CONTEXT)
  const searchCtx = (typeof window !== 'undefined' && window.SEARCH_CONTEXT) || null;
  const landingHeading = (searchCtx && searchCtx.heading) || 'What do you want to explore at Meridian?';
  const defaultItems = (searchCtx && searchCtx.suggestions && scope.id === DEFAULT_SCOPE.id)
    ? searchCtx.suggestions
    : scope.suggestions;
  const wrapRef = useR(null);
  const tabsRef = useR(null);
  const mountedWithIntroRef = useR(intro);

  // Keep the active tab in view on phone (the strip scrolls horizontally)
  useE(() => {
    const el = tabsRef.current?.querySelector('.search-tab--active');
    if (el && el.scrollIntoView) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [scope.id]);

  // onClick fires only on real user interaction, never on programmatic .focus()
  const handleOpen = () => setFocused(true);
  const handleBlur = (e) => {
    // Keep panel open if focus moves to another element within the wrapper
    if (wrapRef.current && wrapRef.current.contains(e.relatedTarget)) return;
    setFocused(false);
  };

  const hasDraft = draft.trim().length > 0;
  const typeahead = hasDraft ? getSuggestions(draft, scope) : [];
  const showPanel = hasDraft && typeahead.length > 0;

  return (
    <div className={'landing ' + (intro ? 'landing--intro' : (mountedWithIntroRef.current ? '' : 'fade-in'))}>
      {!loggedIn &&
      <button className="landing__banner" onClick={onSignIn}>
          <span className="landing__banner-icon">{Icon.Sparkle()}</span>
          <span className="landing__banner-text">
            <strong>Log in</strong> for personalized program recommendations and saved searches.
          </span>
          <span className="landing__banner-arrow">{Icon.ArrowRight()}</span>
        </button>
      }
      <h1 className="landing__title">{landingHeading}</h1>
      <div className="search-tabs" role="tablist" ref={tabsRef}>
        {SCOPES.map((s) => {
          const active = scope.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={'search-tab' + (active ? ' search-tab--active' : '')}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setScope(s)}>
              <span className="search-tab__icon">{Icon[s.icon]()}</span>
              <span className="search-tab__label">{s.label}</span>
            </button>);

        })}
      </div>
      <div className="landing__input" ref={wrapRef} onBlur={handleBlur}>
        <InputBar value={draft}
        onChange={setDraft}
        onSubmit={(q) => onAsk(q, scope)}
        large
        autoFocus
        onFocus={handleOpen}
        onPickAgent={onPickAgent}
        placeholder={scope.placeholder || 'Ask anything'} />
        {showPanel ?
        <SearchPanel
          draft={draft}
          scope={scope}
          unboxed
          onSelect={(q) => {setFocused(false);onAsk(q, scope);}}
          onFillDraft={(q) => setDraft(q)} /> :
        !hasDraft &&
        <DefaultSuggestions items={defaultItems} onPick={(q) => setDraft(q)} />
        }
      </div>
    </div>);

}

function AlmaMark() {
  // Soft four-petal spark — a small bloom evoking care + conversation.
  // Filled curves rather than thin lines so it reads at any size.
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      {/* Four teardrop petals arranged radially around the center */}
      <path d="M16 4 C 17.6 9, 17.6 11.5, 16 14 C 14.4 11.5, 14.4 9, 16 4 Z" />
      <path d="M28 16 C 23 17.6, 20.5 17.6, 18 16 C 20.5 14.4, 23 14.4, 28 16 Z" />
      <path d="M16 28 C 14.4 23, 14.4 20.5, 16 18 C 17.6 20.5, 17.6 23, 16 28 Z" />
      <path d="M4 16 C 9 14.4, 11.5 14.4, 14 16 C 11.5 17.6, 9 17.6, 4 16 Z" />
      {/* Small offset center dot for warmth */}
      <circle cx="16" cy="16" r="1.6" />
    </svg>);

}

/* === Auth modal — appears for "Log in" / "Sign up" === */
const GoogleG = () =>
<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.7-.06-1.22-.2-1.77H12v3.21h5.5c-.11.83-.71 2.07-2.04 2.91l-.02.12 2.96 2.3.2.02c1.88-1.74 2.97-4.29 2.97-7.31" />
    <path fill="#34A853" d="M12 21.6c2.7 0 4.96-.89 6.6-2.41l-3.15-2.44c-.84.59-1.97 1-3.45 1-2.64 0-4.88-1.74-5.68-4.14l-.12.01-3.08 2.38-.04.11C4.72 19.39 8.08 21.6 12 21.6" />
    <path fill="#FBBC04" d="M6.32 13.61A5.95 5.95 0 0 1 6 12c0-.56.1-1.1.31-1.6L6.3 10.27 3.18 7.85l-.1.05A9.59 9.59 0 0 0 2.4 12c0 1.55.37 3.02 1.03 4.32l3.08-2.38" />
    <path fill="#EA4335" d="M12 5.86c1.88 0 3.14.81 3.86 1.49l2.82-2.75C16.96 3.04 14.7 2.4 12 2.4 8.08 2.4 4.72 4.61 3.08 7.85l3.23 2.45C7.12 8.16 9.36 5.86 12 5.86" />
  </svg>;


const AppleLogo = () =>
<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M17.07 12.41c-.03-2.51 2.05-3.72 2.14-3.78-1.17-1.71-2.99-1.94-3.63-1.97-1.55-.16-3.02.91-3.81.91-.79 0-2-.89-3.29-.86-1.69.03-3.25.98-4.12 2.5-1.76 3.05-.45 7.57 1.27 10.05.84 1.21 1.84 2.57 3.15 2.52 1.27-.05 1.75-.82 3.28-.82s1.96.82 3.3.79c1.36-.02 2.22-1.23 3.05-2.45.96-1.41 1.36-2.78 1.38-2.85-.03-.01-2.65-1.01-2.68-4.04zM14.7 5.07c.69-.84 1.16-2 1.03-3.16-1 .04-2.22.67-2.93 1.5-.64.74-1.2 1.93-1.05 3.06 1.12.09 2.26-.57 2.95-1.4z" />
  </svg>;


const PhoneIcon = () =>
<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>;


function AuthModal({ open, onClose, onComplete }) {
  const [email, setEmail] = React.useState('');
  const [mode, setMode] = React.useState('default'); // 'default' | 'sso'
  const [ssoDomain, setSsoDomain] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {if (e.key === 'Escape') onClose();};
    document.addEventListener('keydown', handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  React.useEffect(() => {if (!open) {setEmail('');setMode('default');setSsoDomain('');}}, [open]);

  if (!open) return null;

  const finish = () => onComplete();
  const emailValid = /\S+@\S+\.\S+/.test(email.trim());

  return (
    <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onClick={onClose}>
      <div className="auth-modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Close">{Icon.X()}</button>
        {mode === 'default' &&
        <>
            <div className="auth-modal__mark"><AlmaMark /></div>
            <h2 className="auth-modal__title" id="auth-modal-title">Log in or sign up</h2>
            <p className="auth-modal__sub">You'll get smarter responses and can save searches, track programs you like, and plan a campus visit.</p>
            <div className="auth-modal__providers">
              <button className="auth-provider" onClick={finish}>
                <span className="auth-provider__icon"><GoogleG /></span>
                <span>Continue with Google</span>
              </button>
              <button className="auth-provider" onClick={finish}>
                <span className="auth-provider__icon"><AppleLogo /></span>
                <span>Continue with Apple</span>
              </button>
              <button className="auth-provider" onClick={finish}>
                <span className="auth-provider__icon"><PhoneIcon /></span>
                <span>Continue with phone</span>
              </button>
            </div>
            <div className="auth-modal__divider"><span>OR</span></div>
            <form className="auth-modal__email" onSubmit={(e) => {e.preventDefault();if (emailValid) finish();}}>
              <input
              type="email"
              className="auth-modal__input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus />
            
              <button
              type="submit"
              className="auth-modal__continue"
              disabled={!emailValid}>
                Continue
              </button>
            </form>
            <button className="auth-modal__sso" onClick={() => setMode('sso')}>
              Single sign-on (SSO)
            </button>
            <div className="auth-modal__legal">
              By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </div>
          </>
        }
        {mode === 'sso' &&
        <>
            <button className="auth-modal__back" onClick={() => setMode('default')} aria-label="Back">←</button>
            <h2 className="auth-modal__title">Single sign-on</h2>
            <p className="auth-modal__sub">Enter your organization's SSO domain to continue.</p>
            <form className="auth-modal__email" onSubmit={(e) => {e.preventDefault();if (ssoDomain.trim()) finish();}}>
              <input
              type="text"
              className="auth-modal__input"
              placeholder="company.com"
              value={ssoDomain}
              onChange={(e) => setSsoDomain(e.target.value)}
              autoFocus />
            
              <button
              type="submit"
              className="auth-modal__continue"
              disabled={!ssoDomain.trim()}>
                Continue with SSO
              </button>
            </form>
          </>
        }
      </div>
    </div>);

}

/* Locked rail item — disabled state + hover promo card prompting sign-in */
function RailLockedItem({ icon, label, title, desc, collapsed, onSignIn }) {
  const [hover, setHover] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  const ref = React.useRef(null);
  const timer = React.useRef(null);
  const show = () => {
    clearTimeout(timer.current);
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top, left: r.right + 6 });
    }
    setHover(true);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHover(false), 120);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="rail__locked"
    ref={ref}
    onMouseEnter={show}
    onMouseLeave={hide}
    onFocus={show}
    onBlur={hide}>
      <div className={'rail__item rail__item--locked' + (hover ? ' rail__item--locked-hover' : '')} aria-disabled="true" tabIndex={0}>
        <span className="rail__item-icon">{Icon[icon]()}</span>
        <span className="rail__text">{label}</span>
        <span className="rail__item-trail rail__item-trail--lock">{Icon.Lock()}</span>
      </div>
      {hover &&
      <div className="rail__promo"
      role="tooltip"
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ top: pos.top, left: pos.left }}>
          <div className="rail__promo-title">{title}</div>
          <div className="rail__promo-desc">{desc}</div>
          <button
          className="rail__promo-btn"
          onClick={(e) => {e.stopPropagation();onSignIn && onSignIn();}}>
            Sign up
          </button>
        </div>
      }
    </div>);

}

/* Collapsed-rail tooltip — single floating element driven by [data-rail-tip]
   attributes on rail items. Active only while the rail is collapsed; uses
   fixed positioning so it escapes the rail's overflow clipping. */
function CollapsedRailTip({ collapsed }) {
  const [tip, setTip] = useS(null);
  useE(() => {
    if (!collapsed) { setTip(null); return; }
    const enter = (e) => {
      const el = e.target.closest && e.target.closest('[data-rail-tip]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTip({ label: el.getAttribute('data-rail-tip'), top: r.top + r.height / 2, left: r.right + 10 });
    };
    const leave = (e) => {
      const el = e.target.closest && e.target.closest('[data-rail-tip]');
      if (!el) return;
      const next = e.relatedTarget;
      if (next && next.closest && next.closest('[data-rail-tip]') === el) return;
      setTip(null);
    };
    document.addEventListener('mouseover', enter);
    document.addEventListener('mouseout', leave);
    return () => {
      document.removeEventListener('mouseover', enter);
      document.removeEventListener('mouseout', leave);
    };
  }, [collapsed]);
  if (!collapsed || !tip) return null;
  return (
    <div className="rail-tip" style={{ top: tip.top, left: tip.left }}>
      {tip.label}
    </div>);
}

/* === Left rail === */
function LeftRail({ history, onNewConv, onPickHistory, collapsed, onToggleCollapsed, onPickAgent, loggedIn, onSetLoggedIn, onOpenAuth, userMenuOpen, onToggleMenu, onCloseMenu, drawerOpen }) {
  return (
    <aside className={'rail' + (collapsed ? ' rail--collapsed' : '') + (drawerOpen ? ' rail--open' : '')}>
      <CollapsedRailTip collapsed={collapsed} />

      {/* Header: brand + collapse control on same row (expanded); stacked column (collapsed) */}
      <div className="rail__header">
        <button className="rail__brand" onClick={onNewConv} data-rail-tip="Home">
          <span className="rail__brand-mark"><Icon.Shield /></span>
          <span className="rail__text">Ask Meridian</span>
        </button>
        <button className="rail__icon-btn" data-rail-tip={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggleCollapsed}>
          {Icon.Sidebar()}
        </button>
      </div>

      {/* Divider below toggle — visible only when collapsed */}
      <div className="rail__divider rail__divider--header"></div>

      {/* Nav section — New chat, Saved, Projects */}
      <div className="rail__section">
        <button className="rail__item" onClick={onNewConv} data-rail-tip="New chat">
          <span className="rail__item-icon">{Icon.NewChat()}</span>
          <span className="rail__text">New chat</span>
        </button>
        {loggedIn ?
        <>
            <button className="rail__item" data-rail-tip="Saved" onClick={() => onPickAgent('saved')}>
              <span className="rail__item-icon">{Icon.Bookmark()}</span>
              <span className="rail__text">Saved</span>
            </button>
            <button className="rail__item" data-rail-tip="Projects" onClick={() => onPickAgent('projects')}>
              <span className="rail__item-icon">{Icon.Folder()}</span>
              <span className="rail__text">Projects</span>
              <span className="rail__item-trail" onClick={(e) => { e.stopPropagation(); onPickAgent('projects:new'); }}>{Icon.PlusCircle()}</span>
            </button>
          </> :
        <>
            <RailLockedItem
            icon="Bookmark" label="Saved"
            title="Save anything you find"
            desc="Bookmark programs, faculty, and answers to revisit them later."
            collapsed={collapsed}
            onSignIn={onOpenAuth} />
            <RailLockedItem
            icon="Folder" label="Projects"
            title="Organize your search"
            desc="Group searches by program, college, or application step."
            collapsed={collapsed}
            onSignIn={onOpenAuth} />
          </>
        }
      </div>

      <div className="rail__divider"></div>

      {/* Agents section */}
      <div className="rail__section">
        <div className="rail__label rail__section-head">Agents</div>
        {PRIMARY_NAV.map((n, i) => {
          if (n.requiresAuth && !loggedIn) {
            return (
              <RailLockedItem
                key={i} icon={n.icon} label={n.label}
                title={n.promo?.title || `Log in to use ${n.label}`}
                desc={n.promo?.desc || 'Sign up to unlock this agent.'}
                collapsed={collapsed}
                onSignIn={onOpenAuth} />);

          }
          return (
            <button
              key={i}
              className="rail__item"
              data-rail-tip={n.label}
              onClick={() => n.kind === 'agent' ? onPickAgent(n.id) : n.query && onPickHistory(n.query)}>
              <span className="rail__item-icon">{Icon[n.icon]()}</span>
              <span className="rail__text">{n.label}</span>
            </button>);

        })}
      </div>

      <div className="rail__divider"></div>

      {/* Recent section — hidden when collapsed */}
      {loggedIn &&
      <div className="rail__section rail__section--recent">
          <div className="rail__label rail__section-head">Recent</div>
          {history.map((h) =>
        <button
          key={h.id}
          className={'rail__recent' + (h.active ? ' rail__recent--active' : '')}
          onClick={() => onPickHistory(h.query)}>
              <span className="rail__recent-text">{h.q}</span>
              {h.active && <span className="rail__recent-more" onClick={(e) => e.stopPropagation()}>{Icon.MoreHorizontal()}</span>}
            </button>
        )}
        </div>
      }

      <div style={{ flex: 1 }}></div>

      {/* Logged-out: callout (expanded) or login button (collapsed) */}
      {!loggedIn &&
      <>
          <div className="signin-callout">
            <div className="signin-callout__title">Save your chats</div>
            <div className="signin-callout__desc">
              Log in to get personalized recommendations, save programs you like, and revisit past conversations.
            </div>
            <div className="signin-callout__actions">
              <button className="signin-callout__primary" onClick={onOpenAuth}>Log in</button>
              <button className="signin-callout__secondary" onClick={onOpenAuth}>Sign up</button>
            </div>
          </div>
          <button className="rail__item rail__item--login" data-rail-tip="Log in" onClick={onOpenAuth}>
            <span className="rail__item-icon">{Icon.Person()}</span>
            <span className="rail__text">Log in</span>
          </button>
        </>
      }

      {/* Logged-in: user row */}
      {loggedIn &&
      <div className="rail__user-wrap">
          {userMenuOpen &&
        <div className="user-menu">
              <button className="user-menu__item" onClick={() => {onCloseMenu();onPickAgent('profile');}}>
                <span className="user-menu__icon">{Icon.Person()}</span>
                <span>Profile</span>
              </button>
              <button className="user-menu__item" onClick={() => {onCloseMenu();onPickAgent('care-profile');}}>
                <span className="user-menu__icon">{Icon.Heart()}</span>
                <span>Health data</span>
              </button>
              <button className="user-menu__item" onClick={() => {onCloseMenu();onPickAgent('preferences');}}>
                <span className="user-menu__icon">{Icon.Sliders()}</span>
                <span>Search preferences</span>
              </button>
              <button className="user-menu__item" onClick={() => {onCloseMenu();onPickAgent('settings');}}>
                <span className="user-menu__icon">{Icon.Settings()}</span>
                <span>Settings</span>
              </button>
              <button className="user-menu__item">
                <span className="user-menu__icon">{Icon.Globe()}</span>
                <span>Language</span>
                <span className="user-menu__trail">English</span>
              </button>
              <div className="user-menu__divider"></div>
              <button className="user-menu__item user-menu__item--danger" onClick={() => {onCloseMenu();onSetLoggedIn(false);}}>
                <span className="user-menu__icon">{Icon.LogOut()}</span>
                <span>Log out</span>
              </button>
            </div>
        }
          <div className={'rail__user' + (userMenuOpen ? ' rail__user--open' : '')} onClick={onToggleMenu}>
            <div className="rail__user-avatar">BM</div>
            <div className="rail__user-text">
              <div className="rail__user-name">Bryan McCarthy</div>
              <div className="rail__user-sub">Signed in</div>
            </div>
            <button className="rail__user-action">{Icon.ChevronUpDown()}</button>
          </div>
        </div>
      }
    </aside>);

}

/* === Main header (Search ⌄ left) === */
function MainHeader({ mode, onModeChange }) {
  const labels = { search: 'Search', 'degree-planner': 'Degree Planner', 'profile': 'Profile', 'care-profile': 'Academic profile', 'preferences': 'Search preferences', 'settings': 'Settings', 'saved': 'Saved', 'projects': 'Collections', 'projects:new': 'Collections' };
  let label = labels[mode];
  if (!label && mode && mode.startsWith && mode.startsWith('project:')) {
    label = window.projectAgentLabel ? window.projectAgentLabel(mode) : 'Project';
    if (!label) label = 'Project';
  }
  return (
    <div className="main__header">
      <button className="main__mode">
        <span>{label || 'Search'}</span>
        <span className="main__mode-caret">{Icon.ChevronDown()}</span>
      </button>
    </div>);

}

/* === Role selector (shared between landing header and chat header) === */
const ROLE_OPTIONS = [
{ id: 'prospective', label: "I'm a prospective student" },
{ id: 'current', label: "I'm a current student" },
{ id: 'parent', label: "I'm a parent or family" },
{ id: 'counselor', label: "I'm a counselor" }];

function RoleSelect({ role, onRoleChange }) {
  const [open, setOpen] = useS(false);
  const ref = useR(null);
  useE(() => {
    if (!open) return;
    const close = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const label = ROLE_OPTIONS.find((r) => r.id === role)?.label || "I'm a prospective student";
  return (
    <div className="role-wrap" ref={ref}>
      <button className={'role-select' + (open ? ' role-select--open' : '')} onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <span className="role-select__caret">{Icon.ChevronDown()}</span>
      </button>
      {open &&
      <div className="role-menu">
          <div className="role-menu__header">View results for</div>
          {ROLE_OPTIONS.map((r) =>
        <button
          key={r.id}
          className={'role-menu__item' + (role === r.id ? ' role-menu__item--active' : '')}
          onClick={() => {onRoleChange(r.id);setOpen(false);}}>
              <span>{r.label}</span>
              {role === r.id && <span className="role-menu__check">{Icon.Check()}</span>}
            </button>
        )}
          <div className="role-menu__footer">Personalizes language, sources, and detail level.</div>
        </div>
      }
    </div>);

}

/* === Chat header — name + unified scope tabs + role dropdown ===
   Renders the same 6 scope tabs as the landing page, filtered to those
   that have at least one section of content for this chat (plus Ask, which
   is always shown). The active tab drives section filtering in Message. */
function ChatHeader({ chatLabel, sections, activeScope, onScopeChange, role, onRoleChange }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const tabsRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  React.useEffect(() => {
    const el = tabsRef.current?.querySelector('.chat-tab--active');
    if (el && el.scrollIntoView) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeScope]);

  const scopesWithContent = React.useMemo(() => {
    const present = new Set(['ask']);
    (sections || []).forEach((s) => present.add(sectionScope(s)));
    return SCOPES.filter((sc) => present.has(sc.id));
  }, [sections]);

  return (
    <div className="chat-header">
      <div className="chat-header__left" ref={menuRef}>
        <div className="chat-header__name" title={chatLabel}>{chatLabel}</div>
        <button
          className={'chat-header__more' + (menuOpen ? ' chat-header__more--open' : '')}
          onClick={() => setMenuOpen((o) => !o)}
          title="Chat options">
          {Icon.MoreHorizontal()}
        </button>
        {menuOpen &&
        <div className="chat-menu">
            <button className="chat-menu__item">Rename</button>
            <button className="chat-menu__item">Save chat</button>
            <button className="chat-menu__item">Export</button>
            <div className="chat-menu__divider"></div>
            <button className="chat-menu__item chat-menu__item--danger">Delete</button>
          </div>
        }
      </div>

      <div className="chat-header__tabs" role="tablist" ref={tabsRef}>
        {scopesWithContent.map((sc) => {
          const active = sc.id === activeScope;
          return (
            <button
              key={sc.id}
              role="tab"
              aria-selected={active}
              className={'chat-tab' + (active ? ' chat-tab--active' : '')}
              onClick={() => onScopeChange && onScopeChange(sc.id)}>
              <span className="chat-tab__icon">{Icon[sc.icon]()}</span>
              <span className="chat-tab__label">{sc.label}</span>
            </button>);
        })}
      </div>

      <div className="chat-header__right">
        <RoleSelect role={role} onRoleChange={onRoleChange} />
      </div>
    </div>);

}

/* === Degree Planner — guided agent that matches you with degrees === */
const PROGRAM_INTERESTS = [
{ id: 'cs',        label: 'Engineering & Computing', sub: 'CS, data, robotics, engineering' },
{ id: 'business',  label: 'Business & Economics',    sub: 'Finance, marketing, analytics' },
{ id: 'arts',      label: 'Arts & Humanities',       sub: 'Writing, history, design, languages' },
{ id: 'sciences',  label: 'Natural Sciences',        sub: 'Biology, chemistry, physics' },
{ id: 'health',    label: 'Health & Nursing',        sub: 'Nursing, public health, pre-health' },
{ id: 'social',    label: 'Social Sciences',         sub: 'Psychology, politics, sociology' },
{ id: 'education', label: 'Education',               sub: 'Teaching, learning design' },
{ id: 'undecided', label: 'Still exploring',         sub: "I'm not sure yet" }];

const PROGRAM_LEVELS = [
{ id: 'bachelors',   label: "Bachelor's",  sub: '4-year undergraduate degree' },
{ id: 'masters',     label: "Master's",    sub: 'Graduate study, 1–2 years' },
{ id: 'certificate', label: 'Certificate', sub: 'Focused, shorter credential' }];

const PROGRAM_FORMATS = [
{ id: 'on-campus', label: 'On-campus', sub: 'Live and learn at Meridian' },
{ id: 'online',    label: 'Online',    sub: 'Fully remote, flexible' },
{ id: 'hybrid',    label: 'Hybrid',    sub: 'Mix of online and in-person' }];

const PROGRAM_MATCHES = {
  cs: [
    { name: 'Computer Science (B.S.)', dept: 'Engineering & Computing', tag: 'Best match', query: 'Tell me about the Computer Science major' },
    { name: 'Data Science (B.S.)',     dept: 'Engineering & Computing', tag: 'High demand', query: 'Tell me about the Data Science major' },
    { name: 'Cybersecurity (B.S.)',    dept: 'Engineering & Computing', tag: 'Hands-on lab', query: 'Tell me about the Cybersecurity major' },
  ],
  business: [
    { name: 'Business Administration (B.S.)', dept: 'Business & Economics', tag: 'Best match', query: 'Tell me about the Business Administration major' },
    { name: 'Finance (B.S.)',                 dept: 'Business & Economics', tag: 'Popular', query: 'Tell me about the Finance major' },
    { name: 'Business Analytics (B.S.)',      dept: 'Business & Economics', tag: 'STEM-designated', query: 'Tell me about the Business Analytics major' },
  ],
  arts: [
    { name: 'English & Creative Writing (B.A.)', dept: 'Arts & Humanities', tag: 'Best match', query: 'Tell me about the English major' },
    { name: 'Graphic & UX Design (B.F.A.)',      dept: 'Arts & Humanities', tag: 'Studio-based', query: 'Tell me about the Design major' },
    { name: 'History (B.A.)',                    dept: 'Arts & Humanities', tag: 'Honors track', query: 'Tell me about the History major' },
  ],
  sciences: [
    { name: 'Biology (B.S.)',               dept: 'Natural Sciences', tag: 'Best match', query: 'Tell me about the Biology major' },
    { name: 'Chemistry (B.S.)',             dept: 'Natural Sciences', tag: 'Research from year 1', query: 'Tell me about the Chemistry major' },
    { name: 'Environmental Science (B.S.)', dept: 'Natural Sciences', tag: 'Fieldwork', query: 'Tell me about the Environmental Science major' },
  ],
  health: [
    { name: 'Nursing (B.S.N.)',     dept: 'Health & Nursing', tag: 'Best match', query: 'Tell me about the Nursing major' },
    { name: 'Public Health (B.S.)', dept: 'Health & Nursing', tag: 'Growing field', query: 'Tell me about the Public Health major' },
    { name: 'Kinesiology (B.S.)',   dept: 'Health & Nursing', tag: 'Pre-health', query: 'Tell me about the Kinesiology major' },
  ],
  social: [
    { name: 'Psychology (B.A.)',        dept: 'Social Sciences', tag: 'Best match', query: 'Tell me about the Psychology major' },
    { name: 'Political Science (B.A.)', dept: 'Social Sciences', tag: 'Pre-law', query: 'Tell me about the Political Science major' },
    { name: 'Economics (B.A.)',         dept: 'Social Sciences', tag: 'Quant track', query: 'Tell me about the Economics major' },
  ],
  education: [
    { name: 'Elementary Education (B.S.)',     dept: 'College of Education', tag: 'Best match', query: 'Tell me about the Education major' },
    { name: 'Secondary STEM Education (B.S.)', dept: 'College of Education', tag: 'High demand', query: 'Tell me about the STEM Education major' },
    { name: 'Learning Design (B.A.)',          dept: 'College of Education', tag: 'New', query: 'Tell me about the Learning Design major' },
  ],
  undecided: [
    { name: 'Computer Science (B.S.)',        dept: 'Engineering & Computing', tag: 'Popular', query: 'Tell me about the Computer Science major' },
    { name: 'Business Administration (B.S.)', dept: 'Business & Economics', tag: 'Versatile', query: 'Tell me about the Business Administration major' },
    { name: 'Exploratory / Undeclared',       dept: 'Academic Advising', tag: 'Take your time', query: 'How do I choose a major at Meridian?' },
  ],
};

const PROGRAM_FINDER_STEPS = ['Interest', 'Level', 'Format'];

function DegreePlanner({ onAsk }) {
  const [step, setStep] = React.useState(1); // 1 | 2 | 3 | 'result'
  const [interest, setInterest] = React.useState(null);
  const [level, setLevel] = React.useState('bachelors');
  const [format, setFormat] = React.useState('on-campus');

  const matches = interest ? (PROGRAM_MATCHES[interest.id] || PROGRAM_MATCHES.undecided) : [];
  const levelLabel = (PROGRAM_LEVELS.find((l) => l.id === level) || {}).label;
  const formatLabel = (PROGRAM_FORMATS.find((f) => f.id === format) || {}).label;
  const stepNum = step === 'result' ? 4 : step;

  const OptionGrid = ({ items, selected, onPick }) => (
    <div className="body-grid">
      {items.map((a) => (
        <button
          key={a.id}
          className={'body-card' + (selected === a.id ? ' body-card--active' : '')}
          onClick={() => onPick(a)}>
          <span className="body-card__label">{a.label}</span>
          {a.sub && <span className="body-card__sub">{a.sub}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <div className="agent fade-in">
      <div className="agent__head">
        <div className="agent__badge">
          <span className="agent__badge-icon">{Icon.GraduationCap()}</span>
          <span>Degree Planner</span>
        </div>
        <h1 className="agent__title">Find the right degree for you.</h1>
        <p className="agent__sub">
          Three quick questions and we'll match you with Meridian degrees — then dive into any of them or estimate your aid.
        </p>
      </div>

      <div className="wizard">
        <div className="wizard__steps" role="list" aria-label="Steps">
          {PROGRAM_FINDER_STEPS.map((label, i) => {
            const n = i + 1;
            const state = n === stepNum ? ' wizard__step-dot--active' : n < stepNum ? ' wizard__step-dot--done' : '';
            return (
              <React.Fragment key={label}>
                {i > 0 && <span className="wizard__step-bar" aria-hidden="true"></span>}
                <span className={'wizard__step-dot' + state} role="listitem" aria-current={n === stepNum ? 'step' : undefined}>
                  {n < stepNum ? Icon.Check() : n}
                </span>
                <span style={{ fontSize: 12, fontWeight: n === stepNum ? 600 : 500, color: n === stepNum ? 'var(--text)' : 'var(--text-faint)', whiteSpace: 'nowrap' }}>{label}</span>
              </React.Fragment>
            );
          })}
          <span className="wizard__step-count">{step === 'result' ? 'Matches' : `Step ${stepNum} of 3`}</span>
        </div>
      </div>

      {step === 1 &&
        <div className="agent__section wizard__step fade-in">
          <div className="agent__label">1 · What are you interested in?</div>
          <OptionGrid items={PROGRAM_INTERESTS} selected={interest?.id} onPick={(a) => { setInterest(a); setStep(2); }} />
        </div>
      }

      {step === 2 &&
        <div className="agent__section wizard__step fade-in">
          <div className="agent__label">2 · What level of study?</div>
          <OptionGrid items={PROGRAM_LEVELS} selected={level} onPick={(l) => { setLevel(l.id); setStep(3); }} />
          <div className="agent__actions">
            <button className="btn" onClick={() => setStep(1)}>{Icon.CornerUpLeft()}<span style={{marginLeft: 6}}>Back</span></button>
          </div>
        </div>
      }

      {step === 3 &&
        <div className="agent__section wizard__step fade-in">
          <div className="agent__label">3 · How would you like to study?</div>
          <OptionGrid items={PROGRAM_FORMATS} selected={format} onPick={(f) => { setFormat(f.id); setStep('result'); }} />
          <div className="agent__actions">
            <button className="btn" onClick={() => setStep(2)}>{Icon.CornerUpLeft()}<span style={{marginLeft: 6}}>Back</span></button>
          </div>
        </div>
      }

      {step === 'result' &&
        <div className="agent__section wizard__step fade-in">
          <div className="agent__label">
            {matches.length} programs matched · {interest ? interest.label : ''} · {levelLabel} · {formatLabel}
          </div>
          <div className="carousel">
            {matches.map((p, i) => (
              <div className="provider-card" key={i}>
                <div className="provider-card__head">
                  <div className="provider-photo" style={{borderRadius: 10}}>{Icon.GraduationCap()}</div>
                  <div>
                    <p className="provider-card__name">{p.name}</p>
                    <p className="provider-card__role">{p.dept}</p>
                    <div className="rating" style={{marginTop: 6}}>
                      <span className="pill pill--accent">{p.tag}</span>
                    </div>
                  </div>
                </div>
                <div className="provider-card__meta">
                  <div className="meta-row">{Icon.GraduationCap()}<span>{levelLabel}</span></div>
                  <div className="meta-row">{Icon.MapPin()}<span>{formatLabel}</span></div>
                </div>
                <div className="provider-card__actions">
                  <button className="btn btn--primary" onClick={() => onAsk(p.query)}>Explore</button>
                  <button className="btn" onClick={() => onAsk('How much does Meridian cost and what aid can I get?')}>Cost & aid</button>
                </div>
              </div>
            ))}
          </div>
          <div className="agent__actions">
            <button className="btn" onClick={() => { setStep(1); setInterest(null); }}>{Icon.Refresh()}<span style={{marginLeft: 6}}>Start over</span></button>
            <button className="agent__begin" onClick={() => onAsk(matches[0] ? matches[0].query : 'Tell me about the Computer Science major')}>
              <span>Explore top match</span>
              <span>{Icon.ArrowRight()}</span>
            </button>
          </div>
        </div>
      }
    </div>
  );
}

/* === App === */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "rightRail": false,
  "density": "comfortable",
  "loggedIn": true
} /*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];
  const [messages, setMessages] = useS([]);
  const [draft, setDraft] = useS('');
  const [role, setRole] = useS('prospective');
  const [collapsed, setCollapsed] = useS(true);
  const [agent, setAgent] = useS(null); // null | 'degree-planner' | 'preferences' | 'settings'
  const [loggedIn, setLoggedIn] = useS(tweaks.loggedIn !== false);
  const [userMenuOpen, setUserMenuOpen] = useS(false);
  const [authOpen, setAuthOpen] = useS(false);
  const [activeTab, setActiveTab] = useS('ask');
  const [drawerOpen, setDrawerOpen] = useS(false);
  const [scrollEl, setScrollEl] = useS(null);
  const scrollRef = useR(null);
  const attachScroll = useCallback((el) => {scrollRef.current = el;setScrollEl(el);}, []);

  // Staged landing intro — plays once per page load, then settles so
  // returning to the landing (e.g. "New conversation") feels instantaneous.
  // The rail stays collapsed by default; users expand it via the toggle.
  const [intro, setIntro] = useS(!introPlayed);
  useE(() => {
    if (!intro) return;
    const tEnd = setTimeout(() => {introPlayed = true;setIntro(false);}, 2300);
    return () => {clearTimeout(tEnd);};
  }, []);

  // Sync tweak → state
  useE(() => {setLoggedIn(tweaks.loggedIn !== false);}, [tweaks.loggedIn]);

  // Lock body scroll while mobile drawer is open
  useE(() => {
    document.body.classList.toggle('body--locked', drawerOpen);
    return () => document.body.classList.remove('body--locked');
  }, [drawerOpen]);

  // Auto-close drawer when route/agent/conversation changes
  useE(() => {setDrawerOpen(false);}, [agent, messages.length]);

  // Close user menu on outside click
  useE(() => {
    if (!userMenuOpen) return;
    const close = (e) => {
      if (!e.target.closest('.rail__user-wrap') && !e.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [userMenuOpen]);

  // Resolve which mock answer to use. Ordered most-specific -> generic so
  // specialties win before the generic "doctor" catch and emergencies win
  // before electives. Follow-ups carry an explicit target (see onFollowUp),
  // so this only needs to robustly handle suggestion/typeahead phrasings.
  const resolveAnswer = (q) => {
    const ql = q.toLowerCase();
    const has = (...kw) => kw.some((k) => ql.includes(k));
    const D = window.AlmaData;

    if (has('compare', ' vs ', ' vs.', ' versus', 'difference between', 'cs or data', 'data science or', 'science or computer')) return D.COMPARE;
    if (has('cost', 'tuition', 'afford', 'price', 'financial aid', ' aid', 'scholar', 'fafsa', 'promise', 'net price', 'grant', 'loan', 'pay for')) return D.COST_AID;
    if (has('computer science', 'comp sci', 'cs major', 'cs department', 'in cs', 'cs course', 'programming', 'software engineer')) return D.CS_PROGRAM;
    // Only the two built-out flows resolve to an answer. Anything else returns
    // null so ask() stays inert — the prototype never shows an answer that is
    // unrelated to what the user actually clicked.
    return null;
  };

  const ask = useCallback((q, scope, forceKey) => {
    const data = forceKey && window.AlmaData[forceKey] ? window.AlmaData[forceKey] : resolveAnswer(q);
    if (!data) return; // no built-out flow for this query — stay inert, show nothing off-topic
    // Stable per-message id so async updates aren't sensitive to array index
    // (which broke when newConv() cleared the list between click and ask).
    const msgId = 'm-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const newMsg = {
      id: msgId,
      query: q,
      data: { ...data, query: q },
      status: 'thinking',
      sectionsVisible: 0
    };
    setMessages((m) => [...m, newMsg]);
    setDraft('');

    // Honor scope intent: if the resulting chat has content for the selected
    // scope (any section maps to it), land on that scope's filtered view.
    // Otherwise default to Ask (the AI summary + all non-page sections).
    const hasScopeContent = scope && data.sections &&
      data.sections.some((s) => sectionScope(s) === scope.id);
    setActiveTab(hasScopeContent ? scope.id : 'ask');

    const update = (changes) =>
    setMessages((m) => m.map((mm) => mm.id === msgId ? { ...mm, ...changes } : mm));

    // Step through phases
    setTimeout(() => update({ status: 'summary' }), 1100);

    // After summary streams, reveal sections one by one
    const summaryDur = data.summary.length * 220 + 400;
    setTimeout(() => update({ status: 'sections', sectionsVisible: 1 }), 1100 + summaryDur);

    data.sections.forEach((_, idx) => {
      setTimeout(() => update({ sectionsVisible: idx + 1 }), 1100 + summaryDur + idx * 600);
    });

    setTimeout(
      () => update({ status: 'done', sectionsVisible: data.sections.length }),
      1100 + summaryDur + data.sections.length * 600 + 200
    );

    // Scroll to the new message
    setTimeout(() => {
      const el = document.querySelector(`[data-msg-id="${msgId}"]`);
      if (el && scrollRef.current) {
        scrollRef.current.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const newConv = () => {
    setMessages([]);
    setDraft('');
    setActiveTab('ask');
    setAgent(null);
  };

  const pickAgent = (id) => {
    // Degree Planner is the one built-out agent. The other sidebar agents are
    // placeholders — they look active but intentionally do nothing. Chat flows
    // are reached by searching, not from here. Account screens route as before.
    if (id === 'degree-planner') {
      setMessages([]);
      setDraft('');
      setActiveTab(null);
      setAgent('degree-planner');
      return;
    }
    if (id === 'profile' || id === 'care-profile' || id === 'preferences' || id === 'settings') {
      setMessages([]);
      setDraft('');
      setActiveTab(null);
      setAgent(id);
      return;
    }
    if (id === 'saved' || id === 'projects' || id === 'projects:new' || (typeof id === 'string' && id.startsWith('project:'))) {
      setMessages([]);
      setDraft('');
      setActiveTab(null);
      setAgent(id);
      return;
    }
  };

  const handleSetLoggedIn = (v) => {
    setLoggedIn(v);
    setTweak('loggedIn', v);
    setUserMenuOpen(false);
    if (!v) {setMessages([]);setAgent(null);}
  };

  const onFollowUp = (c) => ask((c && c.q) || c, null, c && c.to);
  const onSubmit = (q) => ask(q);

  // Inline citation popover — keeps sources discoverable in-context
  const [citePop, setCitePop] = useS(null); // {n, source, x, y}
  useE(() => {
    const handler = (e) => {
      const a = e.target.closest && e.target.closest('a.cite');
      if (!a) return;
      e.preventDefault();
      e.stopPropagation();
      const msg = a.closest('.message');
      if (!msg) return;
      let sources = [];
      try {sources = JSON.parse(msg.getAttribute('data-sources') || '[]');}
      catch (_) {sources = [];}
      const text = (a.textContent || '').trim();
      const n = Number(text) || Number((a.getAttribute('href') || '').replace('#src-', ''));
      const source = sources.find((s) => s.num === n);
      if (!source) return;
      const r = a.getBoundingClientRect();
      setCitePop({ n, source, x: r.left + r.width / 2, y: r.bottom + 6 });
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);
  useE(() => {
    if (!citePop) return;
    const close = (e) => {
      if (e.target.closest && (e.target.closest('.cite-pop') || e.target.closest('a.cite'))) return;
      setCitePop(null);
    };
    const esc = (e) => {if (e.key === 'Escape') setCitePop(null);};
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [citePop]);

  const hasMessages = messages.length > 0;

  // Active recent item — matched to the open conversation's originating query
  // so exactly one row highlights (multiple recents can resolve to the same
  // answer template, so matching on chatLabel would light several at once).
  const activeQuery = messages[0]?.query || null;
  const historyWithActive = HISTORY.map((h) => ({
    ...h,
    active: activeQuery ? h.query === activeQuery : false
  }));

  return (
    <div className={'app' + (collapsed ? ' app--collapsed' : '') + (intro ? ' app--intro' : '')}>
      <LeftRail
        history={historyWithActive}
        onNewConv={newConv}
        onPickHistory={(q) => {newConv();setTimeout(() => ask(q), 60);}}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onPickAgent={pickAgent}
        loggedIn={loggedIn}
        onSetLoggedIn={handleSetLoggedIn}
        onOpenAuth={() => setAuthOpen(true)}
        userMenuOpen={userMenuOpen}
        onToggleMenu={() => setUserMenuOpen((v) => !v)}
        onCloseMenu={() => setUserMenuOpen(false)}
        drawerOpen={drawerOpen} />

      {drawerOpen && <div className="rail__backdrop" onClick={() => setDrawerOpen(false)} />}

      <button
        className="mobile-menu-btn"
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setDrawerOpen((v) => !v)}>
        {drawerOpen ? Icon.X() : Icon.Menu()}
      </button>

      <main className="main">
        {hasMessages ?
        <ChatHeader
          chatLabel={messages[0]?.data?.chatLabel || messages[0]?.query || 'Chat'}
          sections={messages[0]?.data?.sections}
          activeScope={activeTab || 'ask'}
          onScopeChange={setActiveTab}
          role={role}
          onRoleChange={setRole} /> :

        agent ? <MainHeader mode={agent} /> :
        <div className="landing-header">
          <RoleSelect role={role} onRoleChange={setRole} />
        </div>
        }
        <div className="main__scroll" ref={attachScroll}>
          {!hasMessages && agent === 'degree-planner' &&
          <DegreePlanner
            onAsk={(q) => { if (resolveAnswer(q)) { setAgent(null); ask(q); } }} />

          }
          {!hasMessages && agent === 'profile' &&
          <window.AccountProfile
            onDone={() => setAgent(null)}
            onOpenHealthData={() => setAgent('care-profile')} />
          }
          {!hasMessages && agent === 'care-profile' &&
          <window.CareProfile onDone={() => setAgent(null)} />
          }
          {!hasMessages && agent === 'preferences' &&
          <window.SearchPreferences
            onSave={() => setAgent(null)}
            onCancel={() => setAgent(null)} />

          }
          {!hasMessages && agent === 'settings' &&
          <window.SearchPreferences
            onSave={() => setAgent(null)}
            onCancel={() => setAgent(null)} />

          }
          {!hasMessages && agent === 'saved' &&
          <window.SavedPage
            onDone={() => setAgent(null)}
            onPickAgent={setAgent} />

          }
          {!hasMessages && (agent === 'projects' || agent === 'projects:new') &&
          <window.ProjectsListPage
            onDone={() => setAgent(null)}
            onPickAgent={setAgent}
            openNewModal={agent === 'projects:new'} />

          }
          {!hasMessages && agent && agent.startsWith && agent.startsWith('project:') &&
          <window.ProjectDetailPage
            projectId={agent.slice('project:'.length)}
            onBack={() => setAgent('projects')}
            onPickAgent={setAgent} />

          }
          {!hasMessages && !agent &&
          <Landing
            onAsk={ask}
            draft={draft}
            setDraft={setDraft}
            loggedIn={loggedIn}
            onSignIn={() => setAuthOpen(true)}
            onPickAgent={pickAgent}
            intro={intro} />

          }
          {hasMessages &&
          <div className="col">
              {messages.map((m, i) =>
            <Message
              key={m.id || i}
              msg={m}
              idx={i}
              isLast={i === messages.length - 1 && m.status === 'done'}
              isCurrent={i === messages.length - 1}
              activeScope={activeTab || 'ask'}
              onFollowUp={onFollowUp}
              loggedIn={loggedIn} />
            )}
            </div>
          }
        </div>
        {hasMessages &&
        <div className="composer">
            <div className="composer__inner">
              <InputBar
              value={draft}
              onChange={setDraft}
              onSubmit={onSubmit}
              onPickAgent={pickAgent}
              placeholder="Ask a follow-up question…" />
            
            </div>
          </div>
        }
      </main>

      {/* Tweaks panel */}
      {window.TweaksPanel &&
      <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="State">
            <window.TweakToggle
            label="Signed in"
            hint="Toggle the logged-in / logged-out state"
            value={loggedIn}
            onChange={(v) => handleSetLoggedIn(v)} />
          
            <window.TweakToggle
            label="Right rail"
            hint="Show related media beside the answer"
            value={tweaks.rightRail}
            onChange={(v) => setTweak('rightRail', v)} />
          
            <window.TweakRadio
            label="Density"
            value={tweaks.density}
            options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' }]
            }
            onChange={(v) => setTweak('density', v)} />
          
          </window.TweakSection>
          <window.TweakSection title="Try a screen">
            <window.TweakButton label="Profile" onClick={() => pickAgent('profile')} />
            <window.TweakButton label="Academic profile" onClick={() => pickAgent('care-profile')} />
            <window.TweakButton label="Search preferences" onClick={() => pickAgent('preferences')} />
            <window.TweakButton label="Degree Planner" onClick={() => pickAgent('degree-planner')} />
            <window.TweakButton label="Ask: Computer Science" onClick={() => {newConv();setTimeout(() => ask('Tell me about the Computer Science major'), 80);}} />
            <window.TweakButton label="Reset to landing" onClick={newConv} secondary />
          </window.TweakSection>
        </window.TweaksPanel>
      }

      {/* Auth modal (logged-out flows) */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onComplete={() => {setAuthOpen(false);handleSetLoggedIn(true);}} />

      {/* Right rail tweak surface */}
      {tweaks.rightRail && hasMessages && <RightRail />}

      {/* Inline citation popover */}
      {citePop &&
      <div
        className="cite-pop"
        role="dialog"
        style={{ left: Math.max(16, Math.min(citePop.x - 160, window.innerWidth - 336)), top: citePop.y }}
        onMouseDown={(e) => e.stopPropagation()}>
          <div className="cite-pop__head">
            <span className="cite-pop__num">{citePop.n}</span>
            <span className="cite-pop__source">{citePop.source.name}</span>
            <button className="cite-pop__close" onClick={() => setCitePop(null)} aria-label="Close">{Icon.X()}</button>
          </div>
          <div className="cite-pop__title">{citePop.source.title}</div>
          <div className="cite-pop__meta">
            <span className="cite-pop__date">{citePop.source.date}</span>
            <a className="cite-pop__open" href={citePop.source.url || '#'}>
              <span>Open source</span>
              <span>{Icon.ArrowRight()}</span>
            </a>
          </div>
        </div>
      }
    </div>);

}

function RightRail() {
  return (
    <aside className="right-rail" style={{
      position: 'fixed',
      right: 0, top: 0, bottom: 0,
      width: 280,
      borderLeft: '1px solid var(--border)',
      background: 'var(--bg)',
      padding: 18,
      overflowY: 'auto',
      zIndex: 5
    }}>
      <div className="rail__label">Nearby locations</div>
      <div style={{
        height: 160,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginTop: 8,
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 280 160" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
          <path d="M0 100 Q 80 60 140 90 T 280 70" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" />
          <path d="M40 0 L 60 160" stroke="var(--border-strong)" strokeWidth="1" fill="none" />
          <path d="M180 0 L 200 160" stroke="var(--border-strong)" strokeWidth="1" fill="none" />
        </svg>
        <div style={{ position: 'absolute', top: 40, left: 60, width: 16, height: 16, borderRadius: '50% 50% 50% 0', background: 'var(--warm)', transform: 'rotate(-45deg)' }}></div>
        <div style={{ position: 'absolute', top: 80, left: 130, width: 14, height: 14, borderRadius: '50% 50% 50% 0', background: 'var(--accent)', transform: 'rotate(-45deg)' }}></div>
        <div style={{ position: 'absolute', top: 60, left: 200, width: 14, height: 14, borderRadius: '50% 50% 50% 0', background: 'var(--accent)', transform: 'rotate(-45deg)' }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['[System] Midtown', '[System] West Side', '[System] Hudson Spine'].map((n, i) =>
        <div key={i} style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}>
            <div style={{ fontWeight: 500 }}>{n}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{['0.8 mi · Open', '1.2 mi · Open', '2.0 mi · By appt'][i]}</div>
          </div>
        )}
      </div>
    </aside>);

}

window.App = App;
// Root render lives in search-modal.jsx (loads last), which mounts <App /> inside the search modal.
