/* === Saved + Collections — demo-only views ===
   Three pages mounted from app.jsx via the `agent` state:
   - agent === 'saved'        → SavedPage         (flat bookmark drawer)
   - agent === 'projects'     → ProjectsListPage  (list of saved collections)
   - agent === 'project:<id>' → ProjectDetailPage (one collection)

   No persistence — clicking "unsave" or "remove from collection" only updates
   local state for the duration of the page view. */

const SPIcon = window.Icon;
const { useState: useSP } = React;

/* ============================================================ */
/* === Mock data ============================================== */
/* ============================================================ */

/* Faculty used across Saved + Project detail. Each item carries
   the same shape ProviderHero expects, plus an optional `project`
   reference so the Saved page can show an "In: …" chip. */
const SAVED_DOCTORS = [
  {
    name: 'Prof. Priya Ramanathan, PhD',
    role: 'Computer Science — AI & Robotics',
    years: '18 years',
    rating: 4.9, count: 412,
    dist: '3.1 mi · Engineering & Computing',
    langs: 'English, Hindi',
    ins: 'Accepts Meridian Promise',
    slots: ['Mon 9:00 AM', 'Wed 1:30 PM', 'Fri 11:00 AM'],
    acceptingNew: true,
    project: 'mom-hip',
    savedAt: '2 days ago',
  },
  {
    name: 'Prof. Marcus Hayes, PhD',
    role: 'Computer Science',
    years: '22 years',
    rating: 4.8, count: 287,
    dist: '4.0 mi · Hudson Hall',
    langs: 'English',
    ins: 'Accepts Meridian Promise',
    slots: ['Tue 10:15 AM', 'Thu 3:00 PM'],
    acceptingNew: true,
    project: 'mom-hip',
    savedAt: '4 days ago',
  },
  {
    name: 'Andre Thibault, advisor',
    role: 'Admissions Advising — Transfer',
    years: '10 years',
    rating: 4.8, count: 198,
    dist: '1.2 mi · West Side',
    langs: 'English, French',
    ins: 'Accepts Meridian Promise',
    slots: ['Today 4:15 PM', 'Tomorrow 9:00 AM'],
    acceptingNew: true,
    project: 'mom-hip',
    savedAt: '1 week ago',
  },
  {
    name: 'Prof. Maya Okonjo, PhD',
    role: 'Business & Economics',
    years: '12 years',
    rating: 4.9, count: 412,
    dist: '0.8 mi · Main Campus',
    langs: 'English, French',
    ins: 'Accepts Meridian Promise',
    slots: ['Tomorrow 9:40 AM', 'Thu 11:20 AM'],
    acceptingNew: true,
    project: 'annual-physical-2026',
    savedAt: '5 days ago',
  },
  {
    name: 'Prof. Lin Chen, PhD',
    role: 'Natural Sciences — Physics',
    years: '15 years',
    rating: 4.8, count: 521,
    dist: '1.4 mi · West Side',
    langs: 'English, Mandarin',
    ins: 'Accepts Meridian Promise',
    slots: ['Mon 10:00 AM', 'Tue 1:45 PM'],
    acceptingNew: true,
    project: 'back-pain',
    savedAt: '3 weeks ago',
  },
];

const SAVED_LOCATIONS = [
  {
    name: 'College of Engineering & Computing',
    role: 'Computer science & engineering programs',
    rating: 4.9, count: 612,
    avail: 'Mon–Fri, 7 AM – 6 PM',
    dist: '3.1 mi · 2200 Webster St',
    project: 'mom-hip',
    savedAt: '2 days ago',
  },
  {
    name: 'Meridian Hudson Hall',
    role: 'Engineering labs & studios',
    rating: 4.8, count: 380,
    avail: 'By appointment',
    dist: '2.0 mi · 60 Hudson St',
    project: 'mom-hip',
    savedAt: '4 days ago',
  },
  {
    name: 'Meridian Main Campus',
    role: 'Admissions & advising center',
    rating: 4.7, count: 1240,
    avail: 'Open until 9 PM',
    dist: '0.8 mi · 245 W 38th St',
    project: null,
    savedAt: '2 weeks ago',
  },
];

const SAVED_PAGES = [
  {
    kind: 'Student guide',
    url: '/learn/cs-major-overview',
    title: 'What to expect from the B.S. Computer Science',
    snippet: 'A step-by-step overview of the curriculum, core requirements, labs, and what to prepare before your first term.',
    meta: ['Faculty-reviewed', '8 min read'],
    project: 'mom-hip',
    savedAt: '2 days ago',
  },
  {
    kind: 'Student guide',
    url: '/learn/cs-four-year-plan',
    title: 'Computer Science four-year plan',
    snippet: 'Year-by-year milestones from first-year seminars through capstone. Includes internships, electives, and graduation benchmarks.',
    meta: ['Faculty-reviewed', '6 min read'],
    project: 'mom-hip',
    savedAt: '2 days ago',
  },
  {
    kind: 'Student guide',
    url: '/learn/choosing-an-advisor',
    title: 'How to choose a faculty advisor',
    snippet: 'Questions to ask, research areas that matter, and how to read faculty profiles when comparing advisors.',
    meta: ['Faculty-reviewed', '5 min read'],
    project: 'mom-hip',
    savedAt: '5 days ago',
  },
  {
    kind: 'Financial aid',
    url: '/aid/engineering-scholarships',
    title: 'Financial aid for engineering majors',
    snippet: 'FAFSA requirements, typical cost of attendance, and how merit scholarships affect your aid package.',
    meta: ['Meridian Promise', 'Updated Feb 2026'],
    project: 'mom-hip',
    savedAt: '6 days ago',
  },
  {
    kind: 'Admissions resource',
    url: '/learn/choosing-a-major',
    title: 'How do I choose a major?',
    snippet: 'Interests, strengths, career outcomes, and when to declare. The most common ways students narrow it down, ranked.',
    meta: ['Faculty-reviewed', '7 min read'],
    project: 'back-pain',
    savedAt: '3 weeks ago',
  },
  {
    kind: 'Admissions resource',
    url: '/learn/exploring-without-a-major',
    title: 'Five ways to explore before declaring',
    snippet: 'Low-stakes steps with the strongest payoff — intro seminars, advising chats, info sessions, club visits, and shadowing days.',
    meta: ['Faculty-reviewed', '4 min read'],
    project: 'back-pain',
    savedAt: '3 weeks ago',
  },
  {
    kind: 'Financial aid',
    url: '/aid/cost-comparison-2026',
    title: '2026 cost comparison — grants vs loans',
    snippet: 'Side-by-side of cost of attendance, grant awards, and typical-year costs for the two most-chosen aid paths.',
    meta: ['Aid deadlines', 'Updated Oct 2025'],
    project: 'insurance-2026',
    savedAt: 'last month',
  },
];

const SAVED_CHATS = [
  { query: 'Compare CS programs across colleges',  savedAt: '2 days ago', project: 'mom-hip' },
  { query: 'First-year prep and placement tests',  savedAt: '4 days ago', project: 'mom-hip' },
  { query: 'Engineering scholarship eligibility',  savedAt: '5 days ago', project: 'mom-hip' },
  { query: 'Campus options near home',             savedAt: '6 days ago', project: 'mom-hip' },
  { query: 'How do I choose a major?',             savedAt: '3 weeks ago', project: 'back-pain' },
  { query: 'Ways to explore before declaring',     savedAt: '3 weeks ago', project: 'back-pain' },
  { query: 'Find an advisor near me',              savedAt: '3 weeks ago', project: 'back-pain' },
  { query: 'Does my aid cover summer courses?',    savedAt: 'last month', project: 'insurance-2026' },
  { query: 'Book an advising appointment',         savedAt: '5 days ago', project: 'annual-physical-2026' },
  { query: 'Advising offices open right now',      savedAt: '2 weeks ago', project: null },
];

const PROJECTS = [
  {
    id: 'mom-hip',
    name: 'Schools I am comparing',
    icon: 'Heart',
    color: 'warm',
    updated: '2 days ago',
    summary: "Application checklist underway. Campus visit booked March 14 with Prof. Ramanathan at Engineering & Computing. Looking at scholarship options to help with cost.",
    keyDates: [
      { date: 'Mar 14', label: 'Campus visit' },
      { date: 'Mar 21', label: 'App deadline' },
      { date: 'Apr 1',  label: 'Aid review' },
    ],
    featured: true,
  },
  {
    id: 'annual-physical-2026',
    name: 'Fall 2026 application',
    icon: 'Clipboard',
    color: 'accent',
    updated: '5 days ago',
    summary: "Application for fall. Want to meet with Prof. Okonjo before April. Also ask about honors program eligibility.",
    keyDates: [],
  },
  {
    id: 'back-pain',
    name: 'Choosing a major',
    icon: 'Compass',
    color: 'accent-2',
    updated: '3 weeks ago',
    summary: "Exploring fields of study before declaring a major or committing to a college.",
    keyDates: [],
  },
  {
    id: 'insurance-2026',
    name: 'Financial aid planning',
    icon: 'Shield',
    color: 'neutral',
    updated: 'last month',
    summary: "Comparing aid packages before the FAFSA priority deadline on Nov 30.",
    keyDates: [],
  },
];

function projectById(id) { return PROJECTS.find((p) => p.id === id); }
function countItemsIn(id) {
  return SAVED_DOCTORS.filter((d) => d.project === id).length
    + SAVED_LOCATIONS.filter((l) => l.project === id).length
    + SAVED_PAGES.filter((p) => p.project === id).length;
}
function countChatsIn(id) {
  return SAVED_CHATS.filter((c) => c.project === id).length;
}

/* ============================================================ */
/* === Saved page ============================================= */
/* ============================================================ */

const SAVED_TABS = [
  { id: 'all',       label: 'All' },
  { id: 'doctors',   label: 'Faculty' },
  { id: 'locations', label: 'Campuses' },
  { id: 'pages',     label: 'Pages' },
  { id: 'chats',     label: 'Searches' },
];

function SavedPage({ onPickAgent }) {
  const [tab, setTab] = useSP('all');
  const [removed, setRemoved] = useSP(() => new Set());
  const isRemoved = (key) => removed.has(key);
  const unsave = (key) => setRemoved((s) => { const n = new Set(s); n.add(key); return n; });

  const total =
    SAVED_DOCTORS.length + SAVED_LOCATIONS.length + SAVED_PAGES.length + SAVED_CHATS.length
    - removed.size;

  const visibleDocs   = SAVED_DOCTORS.filter((_, i) => !isRemoved('d' + i));
  const visibleLocs   = SAVED_LOCATIONS.filter((_, i) => !isRemoved('l' + i));
  const visiblePages  = SAVED_PAGES.filter((_, i) => !isRemoved('p' + i));
  const visibleChats  = SAVED_CHATS.filter((_, i) => !isRemoved('c' + i));

  return (
    <div className="saved-page">
      <div className="saved-page__head">
        <div>
          <h1 className="saved-page__title">Saved</h1>
          <p className="saved-page__subtitle">{total} item{total === 1 ? '' : 's'} bookmarked across your searches.</p>
        </div>
      </div>

      <div className="saved-tabs">
        {SAVED_TABS.map((t) => (
          <button
            key={t.id}
            className={'saved-tabs__btn' + (tab === t.id ? ' saved-tabs__btn--active' : '')}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'all' || tab === 'doctors') && (
        <SavedSection
          title="Faculty"
          count={visibleDocs.length}
          showAll={tab === 'all' && visibleDocs.length > 3}
          onSeeAll={() => setTab('doctors')}>
          <div className="saved-grid saved-grid--providers">
            {(tab === 'all' ? visibleDocs.slice(0, 3) : visibleDocs).map((d, i) => (
              <SavedDoctorCard
                key={'d' + i}
                doctor={d}
                onUnsave={() => unsave('d' + SAVED_DOCTORS.indexOf(d))}
                onPickAgent={onPickAgent}
              />
            ))}
          </div>
        </SavedSection>
      )}

      {(tab === 'all' || tab === 'locations') && (
        <SavedSection
          title="Campuses"
          count={visibleLocs.length}
          showAll={tab === 'all' && visibleLocs.length > 3}
          onSeeAll={() => setTab('locations')}>
          <div className="saved-grid saved-grid--locations">
            {(tab === 'all' ? visibleLocs.slice(0, 3) : visibleLocs).map((l, i) => (
              <SavedLocationCard
                key={'l' + i}
                location={l}
                onUnsave={() => unsave('l' + SAVED_LOCATIONS.indexOf(l))}
                onPickAgent={onPickAgent}
              />
            ))}
          </div>
        </SavedSection>
      )}

      {(tab === 'all' || tab === 'pages') && (
        <SavedSection
          title="Pages"
          count={visiblePages.length}
          showAll={tab === 'all' && visiblePages.length > 4}
          onSeeAll={() => setTab('pages')}>
          <ul className="saved-pages-list">
            {(tab === 'all' ? visiblePages.slice(0, 4) : visiblePages).map((p, i) => (
              <SavedPageRow
                key={'p' + i}
                page={p}
                onUnsave={() => unsave('p' + SAVED_PAGES.indexOf(p))}
                onPickAgent={onPickAgent}
              />
            ))}
          </ul>
        </SavedSection>
      )}

      {(tab === 'all' || tab === 'chats') && (
        <SavedSection
          title="Past searches"
          count={visibleChats.length}
          showAll={tab === 'all' && visibleChats.length > 4}
          onSeeAll={() => setTab('chats')}>
          <ul className="saved-chats-list">
            {(tab === 'all' ? visibleChats.slice(0, 4) : visibleChats).map((c, i) => (
              <SavedChatRow
                key={'c' + i}
                chat={c}
                onUnsave={() => unsave('c' + SAVED_CHATS.indexOf(c))}
                onPickAgent={onPickAgent}
              />
            ))}
          </ul>
        </SavedSection>
      )}
    </div>
  );
}

function SavedSection({ title, count, showAll, onSeeAll, children }) {
  return (
    <section className="saved-section">
      <div className="saved-section__head">
        <h2 className="saved-section__title">
          {title}
          <span className="saved-section__count">{count}</span>
        </h2>
        {showAll && (
          <button className="saved-section__seeall" onClick={onSeeAll}>
            See all <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ProjectChip({ projectId, onPickAgent }) {
  if (!projectId) return null;
  const p = projectById(projectId);
  if (!p) return null;
  return (
    <button
      className={'project-chip project-chip--' + p.color}
      onClick={(e) => { e.stopPropagation(); onPickAgent && onPickAgent('project:' + p.id); }}
      title={'In collection: ' + p.name}>
      <span className="project-chip__dot"></span>
      <span className="project-chip__label">In: {p.name}</span>
    </button>
  );
}

function UnsaveBtn({ onClick }) {
  return (
    <button className="saved-card__unsave" onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} title="Remove from Saved">
      {SPIcon.X ? SPIcon.X() : <span aria-hidden="true">×</span>}
    </button>
  );
}

function SavedDoctorCard({ doctor, onUnsave, onPickAgent }) {
  const p = doctor;
  return (
    <div className="saved-card saved-card--provider">
      <UnsaveBtn onClick={onUnsave} />
      <div className="provider-card__head">
        <div className="provider-photo">{SPIcon.Person()}</div>
        <div style={{ minWidth: 0 }}>
          <p className="provider-card__name">{p.name}</p>
          <p className="provider-card__role">{p.role}</p>
          <div className="rating" style={{ marginTop: 4 }}>
            <span className="rating__stars">{SPIcon.Star()}</span>
            <span className="rating__num">{p.rating}</span>
            <span className="rating__count">({p.count})</span>
          </div>
        </div>
      </div>
      <div className="provider-card__meta">
        <div className="meta-row">{SPIcon.Calendar()}<span>Next: <strong>{p.slots[0]}</strong></span></div>
        <div className="meta-row">{SPIcon.MapPin()}<span>{p.dist}</span></div>
      </div>
      <div className="saved-card__foot">
        <span className="saved-card__when">Saved {p.savedAt}</span>
        <ProjectChip projectId={p.project} onPickAgent={onPickAgent} />
      </div>
    </div>
  );
}

function SavedLocationCard({ location, onUnsave, onPickAgent }) {
  const p = location;
  return (
    <div className="saved-card saved-card--provider">
      <UnsaveBtn onClick={onUnsave} />
      <div className="provider-card__head">
        <div className="provider-photo" style={{ borderRadius: 10 }}>{SPIcon.MapPin()}</div>
        <div style={{ minWidth: 0 }}>
          <p className="provider-card__name">{p.name}</p>
          <p className="provider-card__role">{p.role}</p>
          <div className="rating" style={{ marginTop: 4 }}>
            <span className="rating__stars">{SPIcon.Star()}</span>
            <span className="rating__num">{p.rating}</span>
            <span className="rating__count">({p.count})</span>
          </div>
        </div>
      </div>
      <div className="provider-card__meta">
        <div className="meta-row">{SPIcon.Clock()}<span><strong>{p.avail}</strong></span></div>
        <div className="meta-row">{SPIcon.MapPin()}<span>{p.dist}</span></div>
      </div>
      <div className="saved-card__foot">
        <span className="saved-card__when">Saved {p.savedAt}</span>
        <ProjectChip projectId={p.project} onPickAgent={onPickAgent} />
      </div>
    </div>
  );
}

function SavedPageRow({ page, onUnsave, onPickAgent }) {
  const p = page;
  return (
    <li className="saved-page-row">
      <UnsaveBtn onClick={onUnsave} />
      <div className="page-result__head">
        <span className="page-result__kind">{p.kind}</span>
        <span className="page-result__sep">·</span>
        <span className="page-result__url">{p.url}</span>
      </div>
      <a href="#" className="page-result__title" onClick={(e) => e.preventDefault()}>{p.title}</a>
      <p className="page-result__snippet">{p.snippet}</p>
      <div className="saved-card__foot saved-card__foot--inline">
        {p.meta && p.meta.map((m, j) => <span key={j} className="page-result__meta-item">{m}</span>)}
        <span className="saved-card__when">Saved {p.savedAt}</span>
        <ProjectChip projectId={p.project} onPickAgent={onPickAgent} />
      </div>
    </li>
  );
}

function SavedChatRow({ chat, onUnsave, onPickAgent }) {
  return (
    <li className="saved-chat-row">
      <span className="saved-chat-row__icon">{SPIcon.MessageCircle ? SPIcon.MessageCircle() : SPIcon.NewChat()}</span>
      <div className="saved-chat-row__body">
        <div className="saved-chat-row__query">"{chat.query}"</div>
        <div className="saved-card__foot saved-card__foot--inline">
          <span className="saved-card__when">Saved {chat.savedAt}</span>
          <ProjectChip projectId={chat.project} onPickAgent={onPickAgent} />
        </div>
      </div>
      <UnsaveBtn onClick={onUnsave} />
    </li>
  );
}

/* ============================================================ */
/* === Projects list ========================================== */
/* ============================================================ */

function ProjectsListPage({ onPickAgent, openNewModal }) {
  const [modalOpen, setModalOpen] = useSP(!!openNewModal);
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <div className="projects-page">
      <div className="projects-page__head">
        <div>
          <h1 className="projects-page__title">Collections</h1>
          <p className="projects-page__subtitle">{PROJECTS.length} collections grouping your searches and saved items by topic.</p>
        </div>
        <button className="btn btn--primary projects-page__new" onClick={() => setModalOpen(true)}>
          <span>{SPIcon.PlusCircle()}</span>
          <span>New collection</span>
        </button>
      </div>

      {featured && (
        <ProjectFeaturedCard project={featured} onOpen={() => onPickAgent('project:' + featured.id)} />
      )}

      <div className="projects-grid">
        {rest.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => onPickAgent('project:' + p.id)} />
        ))}
      </div>

      {modalOpen && <NewProjectModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function ProjectFeaturedCard({ project, onOpen }) {
  const p = project;
  const items = SAVED_PAGES.filter((x) => x.project === p.id).slice(0, 4);
  const itemCount = countItemsIn(p.id);
  const chatCount = countChatsIn(p.id);
  return (
    <div className="project-card project-card--featured" onClick={onOpen}>
      <div className="project-card__head">
        <div className={'project-card__icon project-card__icon--' + p.color}>{SPIcon[p.icon] ? SPIcon[p.icon]() : SPIcon.Folder()}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="project-card__featured-pill">Featured</div>
          <h2 className="project-card__name">{p.name}</h2>
          <p className="project-card__summary">{p.summary}</p>
        </div>
      </div>

      {p.keyDates && p.keyDates.length > 0 && (
        <div className="project-card__dates">
          {p.keyDates.map((d, i) => (
            <div className="project-keydate" key={i}>
              <div className="project-keydate__date">{d.date}</div>
              <div className="project-keydate__label">{d.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="project-card__foot">
        <span className="project-card__meta">{chatCount} searches · {itemCount} saved items · updated {p.updated}</span>
        <span className="project-card__cta">Open<span aria-hidden="true"> →</span></span>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  const p = project;
  const itemCount = countItemsIn(p.id);
  const chatCount = countChatsIn(p.id);
  return (
    <div className="project-card" onClick={onOpen}>
      <div className="project-card__head">
        <div className={'project-card__icon project-card__icon--' + p.color}>{SPIcon[p.icon] ? SPIcon[p.icon]() : SPIcon.Folder()}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 className="project-card__name">{p.name}</h2>
          <p className="project-card__summary">{p.summary}</p>
        </div>
      </div>
      <div className="project-card__foot">
        <span className="project-card__meta">{chatCount} search{chatCount === 1 ? '' : 'es'} · {itemCount} item{itemCount === 1 ? '' : 's'}</span>
        <span className="project-card__updated">Updated {p.updated}</span>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose }) {
  const [name, setName] = useSP('');
  const [color, setColor] = useSP('accent');
  const COLORS = ['warm', 'accent', 'accent-2', 'neutral'];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h3 className="modal__title">New collection</h3>
          <button className="modal__close" onClick={onClose}>{SPIcon.X ? SPIcon.X() : <span aria-hidden="true">×</span>}</button>
        </div>
        <div className="modal__body">
          <label className="modal__label">Name</label>
          <input
            className="modal__input"
            placeholder="e.g. Schools I am comparing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus />
          <label className="modal__label" style={{ marginTop: 14 }}>Color</label>
          <div className="modal__colors">
            {COLORS.map((c) => (
              <button
                key={c}
                className={'modal__color modal__color--' + c + (color === c ? ' modal__color--active' : '')}
                onClick={() => setColor(c)}
                aria-label={c} />
            ))}
          </div>
        </div>
        <div className="modal__foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={onClose}>Create collection</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* === Project detail ========================================= */
/* ============================================================ */

function ProjectDetailPage({ projectId, onBack, onPickAgent }) {
  const project = projectById(projectId);

  if (!project) {
    return (
      <div className="project-detail">
        <button className="project-detail__back" onClick={onBack}>
          <span aria-hidden="true">‹</span> All collections
        </button>
        <h1 className="project-detail__name">Collection not found</h1>
        <p style={{ color: 'var(--text-muted)' }}>This collection may have been deleted or never existed.</p>
      </div>
    );
  }

  const docs  = SAVED_DOCTORS.filter((d) => d.project === project.id);
  const locs  = SAVED_LOCATIONS.filter((l) => l.project === project.id);
  const pages = SAVED_PAGES.filter((p) => p.project === project.id);
  const chats = SAVED_CHATS.filter((c) => c.project === project.id);

  return (
    <div className="project-detail">
      <button className="project-detail__back" onClick={onBack}>
        <span aria-hidden="true">‹</span> All collections
      </button>

      <div className="project-detail__head">
        <div className={'project-card__icon project-card__icon--' + project.color + ' project-detail__icon'}>
          {SPIcon[project.icon] ? SPIcon[project.icon]() : SPIcon.Folder()}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 className="project-detail__name">{project.name}</h1>
          <p className="project-detail__updated">Updated {project.updated} · {chats.length} search{chats.length === 1 ? '' : 'es'} · {docs.length + locs.length + pages.length} saved item{docs.length + locs.length + pages.length === 1 ? '' : 's'}</p>
        </div>
        <button className="btn">{SPIcon.MoreHorizontal()}</button>
      </div>

      <section className="project-summary">
        <div className="project-summary__head">Summary</div>
        <p className="project-summary__body">{project.summary}</p>
        {project.keyDates && project.keyDates.length > 0 && (
          <>
            <div className="project-summary__head" style={{ marginTop: 14 }}>Key dates</div>
            <ul className="project-keydates">
              {project.keyDates.map((d, i) => (
                <li className="project-keydates__item" key={i}>
                  <span className="project-keydates__date">{d.date}</span>
                  <span className="project-keydates__label">{d.label}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {chats.length > 0 && (
        <section className="project-section">
          <h3 className="project-section__title">Searches <span className="saved-section__count">{chats.length}</span></h3>
          <ul className="saved-chats-list">
            {chats.map((c, i) => (
              <li className="saved-chat-row" key={i}>
                <span className="saved-chat-row__icon">{SPIcon.MessageCircle ? SPIcon.MessageCircle() : SPIcon.NewChat()}</span>
                <div className="saved-chat-row__body">
                  <div className="saved-chat-row__query">"{c.query}"</div>
                  <div className="saved-card__foot saved-card__foot--inline">
                    <span className="saved-card__when">Saved {c.savedAt}</span>
                  </div>
                </div>
                <button className="saved-card__unsave saved-card__unsave--static" title="Remove from collection">
                  {SPIcon.X ? SPIcon.X() : <span aria-hidden="true">×</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {docs.length > 0 && (
        <section className="project-section">
          <h3 className="project-section__title">Saved faculty <span className="saved-section__count">{docs.length}</span></h3>
          <window.ProviderHero providers={docs} />
        </section>
      )}

      {locs.length > 0 && (
        <section className="project-section">
          <h3 className="project-section__title">Saved campuses <span className="saved-section__count">{locs.length}</span></h3>
          <div className="carousel">
            {locs.map((p, i) => (
              <div className="provider-card" key={i}>
                <div className="provider-card__head">
                  <div className="provider-photo" style={{ borderRadius: 10 }}>{SPIcon.MapPin()}</div>
                  <div>
                    <p className="provider-card__name">{p.name}</p>
                    <p className="provider-card__role">{p.role}</p>
                    <div className="rating" style={{ marginTop: 4 }}>
                      <span className="rating__stars">{SPIcon.Star()}</span>
                      <span className="rating__num">{p.rating}</span>
                      <span className="rating__count">({p.count})</span>
                    </div>
                  </div>
                </div>
                <div className="provider-card__meta">
                  <div className="meta-row">{SPIcon.Clock()}<span><strong>{p.avail}</strong></span></div>
                  <div className="meta-row">{SPIcon.MapPin()}<span>{p.dist}</span></div>
                </div>
                <div className="provider-card__actions">
                  <button className="btn btn--primary">Book visit</button>
                  <button className="btn">Map</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pages.length > 0 && (
        <section className="project-section">
          <h3 className="project-section__title">Saved pages <span className="saved-section__count">{pages.length}</span></h3>
          <window.PageResults items={pages} />
        </section>
      )}

      {chats.length + docs.length + locs.length + pages.length === 0 && (
        <div className="project-empty">
          <p>Nothing saved here yet. Add searches and items from your search results to start this collection.</p>
        </div>
      )}
    </div>
  );
}

/* ============================================================ */
/* === Helpers used by app.jsx ================================ */
/* ============================================================ */

/* Resolve a project's display name from an `agent` string of the form
   'project:<id>'. Returns null if the id is unknown. */
function projectAgentLabel(agent) {
  if (!agent || !agent.startsWith || !agent.startsWith('project:')) return null;
  const p = projectById(agent.slice('project:'.length));
  return p ? p.name : null;
}

window.SavedPage = SavedPage;
window.ProjectsListPage = ProjectsListPage;
window.ProjectDetailPage = ProjectDetailPage;
window.projectAgentLabel = projectAgentLabel;
