/* === Host website shell — representative Meridian University pages ===
   The "Search" affordances (nav button + hero search bar) call onOpenSearch,
   which opens the full search experience in a modal overlay (see search-modal.jsx).

   The site renders one of several PAGES (home, computer-science, …). Each page
   also defines a `search` context (heading + suggestions) that the modal's
   landing reads via window.SEARCH_CONTEXT, so the same search tool feels
   contextual to the page you opened it from. */

const SITE_IS_MAC = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');
const SITE_SHORTCUT = SITE_IS_MAC ? '⌘K' : 'Ctrl K';

const SITE_NAV_LINKS = ['Academics', 'Admissions', 'Tuition & Aid', 'Campus Life', 'Visit'];

/* Verified Unsplash photo ids. Campus imagery is the brand's first impression;
   colored panels are not a substitute for it. */
const PHOTO = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* One college leads with a photograph; the rest read as a list. Six identical
   cards is the shape every generated page reaches for. */
const HOME_FEATURE = {
  name: 'Engineering & Computing',
  desc: 'Computer science, data, robotics, and engineering — hands-on labs from the first semester and paid co-ops with employers who hire our graduates.',
  href: './computer-science.html',
  cta: 'Explore the college',
  photo: 'photo-1723987251277-18fc0a1effd0',
  alt: 'Students working together at monitors in a Meridian computing lab',
};

const HOME_COLLEGES = [
  { name: 'Business & Economics', desc: 'Finance, marketing, analytics, and entrepreneurship with real-world practicums.' },
  { name: 'Arts & Humanities', desc: 'Writing, history, design, and languages that sharpen how you think and create.' },
  { name: 'Natural Sciences', desc: 'Biology, chemistry, physics, and environmental science with research from year one.' },
  { name: 'Health & Nursing', desc: 'Nursing, public health, and pre-health pathways tied to clinical partners.' },
  { name: 'Social Sciences', desc: 'Psychology, politics, and sociology that connect ideas to communities.' },
];

const CS_FEATURE = {
  name: 'Artificial Intelligence',
  desc: 'Machine learning, neural networks, and responsible AI — from the mathematics through to systems students ship in the capstone.',
  cta: 'See the AI concentration',
  photo: 'photo-1531497082986-2422f7b87330',
  alt: 'A Meridian professor working through a problem with two students',
};

const CS_CONCENTRATIONS = [
  { name: 'Cybersecurity', desc: 'Secure systems, cryptography, and ethical hacking in a dedicated security lab.' },
  { name: 'Systems & Architecture', desc: 'Operating systems, networks, and the hardware–software boundary.' },
  { name: 'Human–Computer Interaction', desc: 'Design, accessibility, and the craft of software people love to use.' },
  { name: 'Theory & Algorithms', desc: 'The mathematics of computation, complexity, and provably correct code.' },
  { name: 'Software Engineering', desc: 'Team-built projects, version control, and shipping real software.' },
];

const PAGES = {
  home: {
    title: 'Meridian University — Search',
    breadcrumb: null,
    hero: {
      title: 'Find your future at Meridian.',
      sub: 'Explore 150+ programs, estimate your financial aid, and get answers about admissions — all in one place.',
      placeholder: 'Search programs, majors, scholarships…',
      primaryCta: { icon: 'GraduationCap', label: 'Explore programs' },
      photo: 'photo-1760917094679-d33f2ec13110',
      alt: 'Meridian’s North Quad buildings under low evening light',
    },
    section: {
      title: 'Explore by college',
      feature: HOME_FEATURE,
      items: HOME_COLLEGES,
      itemsLabel: 'Eight colleges, one application',
    },
    figure: {
      value: '$75M',
      lead: 'awarded in aid every year.',
      body: 'Meridian Promise covers full tuition for families under $75,000, and 92% of graduates are employed or in graduate school within six months.',
    },
    band: { title: 'Not sure what to study?', sub: 'Tell us what you’re into and we’ll point you to the right program.' },
    search: { heading: null, suggestions: null },
  },
  'computer-science': {
    title: 'Computer Science — Meridian University',
    breadcrumb: 'Computer Science',
    hero: {
      kicker: 'College of Engineering & Computing',
      title: 'Build what’s next in Computer Science.',
      sub: 'A STEM-designated B.S. with concentrations in AI, security, and systems — plus co-ops with leading employers.',
      placeholder: 'Ask about Computer Science at Meridian…',
      primaryCta: { icon: 'Laptop', label: 'Explore the CS major' },
      photo: 'photo-1707960572634-8b7649870d95',
      alt: 'Students crossing the green between Meridian’s computing buildings',
    },
    section: {
      title: 'Concentrations & focus areas',
      feature: CS_FEATURE,
      items: CS_CONCENTRATIONS,
      itemsLabel: 'Six ways to specialize',
    },
    figure: {
      value: '$92,000',
      lead: 'median first-year salary.',
      body: '94% of the Class of 2025 was placed within six months, and CS co-op students earn an average of $28 an hour before they graduate.',
    },
    band: { title: 'Have a question about CS?', sub: 'Ask Meridian about courses, faculty, outcomes, and how to apply.' },
    search: {
      heading: 'Want to learn more about Computer Science at Meridian?',
      suggestions: [
        'Tell me about the Computer Science major',
        'What courses will I take in CS?',
        'Who teaches in the CS department?',
        'How much does Meridian cost and what aid can I get?',
      ],
    },
  },
};

const CURRENT_PAGE = (typeof window !== 'undefined' && window.PAGE && PAGES[window.PAGE]) ? window.PAGE : 'home';
// The modal's landing reads this to render a context-relevant heading + suggestions.
if (typeof window !== 'undefined') window.SEARCH_CONTEXT = PAGES[CURRENT_PAGE].search;

function SiteSearchTrigger({ onOpenSearch, triggerRef, variant, placeholder }) {
  if (variant === 'hero') {
    return (
      <button
        type="button"
        className="site-herosearch"
        onClick={onOpenSearch}
        aria-haspopup="dialog"
        aria-label="Open search">
        <span className="site-herosearch__icon"><Icon.SearchAI /></span>
        <span className="site-herosearch__text">{placeholder}</span>
        <span className="site-herosearch__kbd">{SITE_SHORTCUT}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      ref={triggerRef}
      className="site-nav__search"
      onClick={onOpenSearch}
      aria-haspopup="dialog"
      aria-label="Open search">
      <span className="site-nav__search-icon"><Icon.SearchAI /></span>
      <span className="site-nav__search-label">Search</span>
    </button>
  );
}

function SiteShell({ onOpenSearch, triggerRef }) {
  const page = PAGES[CURRENT_PAGE];
  const PrimaryCtaGlyph = Icon[page.hero.primaryCta.icon];

  return (
    <div className="site">
      <header className="site-nav">
        <div className="site-nav__inner">
          <a className="site-nav__brand" href="./">
            <span className="site-nav__logo" aria-hidden="true"><Icon.GraduationCap /></span>
            <span className="site-nav__name">Meridian University</span>
          </a>
          <nav className="site-nav__links" aria-label="Primary">
            {SITE_NAV_LINKS.map((l) => (
              <a key={l} href="#" className="site-nav__link" onClick={(e) => e.preventDefault()}>{l}</a>
            ))}
          </nav>
          <div className="site-nav__actions">
            <SiteSearchTrigger onOpenSearch={onOpenSearch} triggerRef={triggerRef} />
            <button type="button" className="site-nav__cta" onClick={onOpenSearch}>Apply now</button>
          </div>
        </div>
      </header>

      <main className="site-main">
        {page.breadcrumb &&
          <nav className="site-breadcrumb" aria-label="Breadcrumb">
            <a href="./">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.breadcrumb}</span>
          </nav>
        }

        <section className="site-hero">
          <img
            className="site-hero__photo"
            src={PHOTO(page.hero.photo, 2000)}
            alt={page.hero.alt}
            fetchpriority="high" />
          <div className="site-hero__inner">
            {page.hero.kicker && <p className="site-hero__kicker">{page.hero.kicker}</p>}
            <h1 className="site-hero__title serif">{page.hero.title}</h1>
            <p className="site-hero__sub">{page.hero.sub}</p>
            <SiteSearchTrigger onOpenSearch={onOpenSearch} variant="hero" placeholder={page.hero.placeholder} />
            <div className="site-hero__ctas">
              <button type="button" className="site-btn site-btn--primary" onClick={onOpenSearch}>
                {PrimaryCtaGlyph ? <PrimaryCtaGlyph /> : null} {page.hero.primaryCta.label}
              </button>
              <button type="button" className="site-btn site-btn--ghost" onClick={onOpenSearch}>
                <Icon.Calendar /> Visit campus
              </button>
            </div>
          </div>
        </section>

        <section className="site-programs" aria-label={page.section.title}>
          <div className="site-section__head">
            <h2 className="site-section__title">{page.section.title}</h2>
            <a href="#" className="site-section__link" onClick={(e) => { e.preventDefault(); onOpenSearch(); }}>
              Browse all programs <Icon.ArrowRight />
            </a>
          </div>

          <div className="site-programs__body">
            {(() => {
              const f = page.section.feature;
              const inner = (
                <>
                  <img className="site-feature__photo" src={PHOTO(f.photo, 1200)} alt={f.alt} loading="lazy" />
                  <div className="site-feature__text">
                    <h3 className="site-feature__name serif">{f.name}</h3>
                    <p className="site-feature__desc">{f.desc}</p>
                    <span className="site-feature__cta">{f.cta} <Icon.ArrowRight /></span>
                  </div>
                </>
              );
              return f.href
                ? <a className="site-feature" href={f.href}>{inner}</a>
                : <button type="button" className="site-feature" onClick={onOpenSearch}>{inner}</button>;
            })()}

            <div className="site-list">
              <h3 className="site-list__label">{page.section.itemsLabel}</h3>
              {page.section.items.map((s) => (
                <button key={s.name} type="button" className="site-list__row" onClick={onOpenSearch}>
                  <span className="site-list__name">{s.name}</span>
                  <span className="site-list__desc">{s.desc}</span>
                  <span className="site-list__arrow" aria-hidden="true"><Icon.ArrowRight /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="site-figure" aria-label="By the numbers">
          <div className="site-figure__inner">
            <p className="site-figure__lead serif">
              <span className="site-figure__value">{page.figure.value}</span> {page.figure.lead}
            </p>
            <p className="site-figure__body">{page.figure.body}</p>
          </div>
        </section>

        <section className="site-band">
          <div className="site-band__inner">
            <div>
              <h2 className="site-band__title serif">{page.band.title}</h2>
              <p className="site-band__sub">{page.band.sub}</p>
            </div>
            <button type="button" className="site-btn site-btn--primary site-btn--lg" onClick={onOpenSearch}>
              <Icon.SearchAI /> Ask Meridian
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <span className="site-nav__logo" aria-hidden="true"><Icon.GraduationCap /></span>
            <span className="site-nav__name">Meridian University</span>
          </div>
          <div className="site-footer__cols">
            <div className="site-footer__col">
              <h3>Academics</h3>
              <a href="#" onClick={(e) => e.preventDefault()}>Programs</a>
              <a href="./computer-science.html">Computer Science</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Honors College</a>
            </div>
            <div className="site-footer__col">
              <h3>Admissions</h3>
              <a href="#" onClick={(e) => e.preventDefault()}>Apply</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Visit campus</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Tuition & aid</a>
            </div>
            <div className="site-footer__col">
              <h3>Students</h3>
              <a href="#" onClick={(e) => e.preventDefault()}>MyMeridian portal</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Course catalog</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Student support</a>
            </div>
          </div>
        </div>
        <div className="site-footer__legal">© 2026 Meridian University. This is a design demo.</div>
      </footer>
    </div>
  );
}

window.SiteShell = SiteShell;
