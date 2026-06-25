/* === Mock data for Meridian University search ===
   Two fully-built answer flows: CS_PROGRAM (explore a major) and COST_AID
   (cost, aid & scholarships). app.jsx resolveAnswer() keyword-matches a typed
   query to one of these and streams it. Shape per template:
     { query, chatLabel, tabs[], summary[] (tokens with optional cite),
       sections[] ({id, tab, title, icon, body()}), sources[], followups[] } */

const Icon = window.Icon;

/* === Reusable carousels (faculty + campus), styled like the app's cards === */
function FacultyCarousel({ items }) {
  return (
    <div className="carousel">
      {items.map((p, i) => (
        <div className="provider-card" key={i}>
          <div className="provider-card__head">
            <div className="provider-photo">{Icon.Person()}</div>
            <div>
              <p className="provider-card__name">{p.name}</p>
              <p className="provider-card__role">{p.role}</p>
              {p.rating && (
                <div className="rating" style={{marginTop: 4}}>
                  <span className="rating__stars">{Icon.Star()}</span>
                  <span className="rating__num">{p.rating}</span>
                  <span className="rating__count">({p.count})</span>
                </div>
              )}
            </div>
          </div>
          <div className="provider-card__meta">
            <div className="meta-row">{Icon.Beaker()}<span>{p.focus}</span></div>
            <div className="meta-row">{Icon.MapPin()}<span>{p.office}</span></div>
            <div className="meta-row">{Icon.Check()}<span>{p.note}</span></div>
          </div>
          <div className="provider-card__actions">
            <button className="btn btn--primary">Profile</button>
            <button className="btn">Office hours</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CampusCarousel({ items }) {
  return (
    <div className="carousel">
      {items.map((p, i) => (
        <div className="provider-card" key={i}>
          <div className="provider-card__head">
            <div className="provider-photo" style={{borderRadius: 10}}>{Icon.Building()}</div>
            <div>
              <p className="provider-card__name">{p.name}</p>
              <p className="provider-card__role">{p.role}</p>
              {p.rating && (
                <div className="rating" style={{marginTop: 4}}>
                  <span className="rating__stars">{Icon.Star()}</span>
                  <span className="rating__num">{p.rating}</span>
                  <span className="rating__count">({p.count})</span>
                </div>
              )}
            </div>
          </div>
          <div className="provider-card__meta">
            <div className="meta-row">{Icon.Clock()}<span>{p.hours}</span></div>
            <div className="meta-row">{Icon.MapPin()}<span>{p.dist}</span></div>
            {p.phone && <div className="meta-row">{Icon.Phone()}<span>{p.phone}</span></div>}
          </div>
          <div className="provider-card__actions">
            <button className="btn btn--primary">{p.cta || 'Visit'}</button>
            <button className="btn">Map</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* === CS_PROGRAM: explore a major =================================== */
const CS_PROGRAM = {
  query: 'Tell me about the Computer Science major',
  chatLabel: 'Computer Science (B.S.)',
  actions: [
    { label: 'Apply now', href: './computer-science.html#apply', primary: true, icon: 'GraduationCap' },
    { label: 'View program page', href: './computer-science.html', icon: 'FileText' },
  ],
  tabs: [
    { id: 'services', label: 'Programs', icon: 'BookOpen', count: 3 },
    { id: 'doctors', label: 'Faculty', icon: 'Person', count: 4 },
    { id: 'locations', label: 'Campus', icon: 'MapPin', count: 2 },
  ],
  summary: [
    { text: "Meridian’s B.S. in Computer Science is a STEM-designated program in the College of Engineering & Computing, with concentrations in AI, security, and systems" },
    { text: ". It runs at an 18:1 student–faculty ratio with classes averaging 24 students", cite: [1] },
    { text: ", and every student finishes with a year-long capstone or a paid industry co-op", cite: [2] },
    { text: ". Recent graduates report a median first-year salary near $92,000, with 94% placed within six months", cite: [3] },
    { text: "." },
  ],
  sections: [
    {
      id: 'cs-overview', tab: 'overview', title: 'Program overview', icon: 'BookOpen',
      body: () => (
        <>
          <ul className="bullet-list">
            <li><div className="bullet-list__label">STEM-designated B.S.</div><div className="bullet-list__desc">120 credits over four years, eligible for the 24-month STEM OPT extension for international students.<sup><a href="#src-1" className="cite">1</a></sup></div></li>
            <li><div className="bullet-list__label">Three concentrations</div><div className="bullet-list__desc">Choose Artificial Intelligence, Cybersecurity, or Systems &amp; Architecture — or stay broad and sample all three.</div></li>
            <li><div className="bullet-list__label">Co-op &amp; capstone</div><div className="bullet-list__desc">A paid co-op or a year-long team capstone with a real client before you graduate.</div></li>
          </ul>
          <div className="callout">
            <div className="callout__icon">{Icon.Info()}</div>
            <div>
              <p className="callout__title">Test-optional admission</p>
              <p className="callout__body">CS reviews your full profile — no SAT/ACT required. AP or IB credit can place you out of introductory courses.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'cs-courses', tab: 'programs', title: 'Courses you’ll take', icon: 'FileText',
      body: () => (
        <>
          <p>A typical four-year path through the major.<sup><a href="#src-1" className="cite">1</a></sup></p>
          <ul className="bullet-list">
            <li><div className="bullet-list__label">CS 110 · Intro to Computer Science</div><div className="bullet-list__desc">Foundations of programming in Python, problem-solving, and computational thinking.</div></li>
            <li><div className="bullet-list__label">CS 210 · Data Structures &amp; Algorithms</div><div className="bullet-list__desc">The core toolkit: lists, trees, graphs, and how to reason about efficiency.</div></li>
            <li><div className="bullet-list__label">CS 245 · Computer Systems</div><div className="bullet-list__desc">How software meets hardware — memory, the OS, and the C language.</div></li>
            <li><div className="bullet-list__label">CS 360 · Machine Learning</div><div className="bullet-list__desc">Models, training, and evaluation, with a focus on responsible AI.</div></li>
            <li><div className="bullet-list__label">CS 480 · Senior Capstone</div><div className="bullet-list__desc">Ship real software for a real client across two semesters on a student team.</div></li>
          </ul>
        </>
      ),
    },
    {
      id: 'cs-faculty', tab: 'faculty', title: 'Faculty you’ll learn from', icon: 'Person',
      body: () => (
        <>
          <p>A few of the professors teaching in the CS department this year.<sup><a href="#src-2" className="cite">2</a></sup></p>
          <FacultyCarousel items={[
            { name: 'Dr. Lena Park', role: 'Associate Professor, AI', rating: 4.9, count: 212, focus: 'Machine learning & fairness', office: 'Hale Computing 314', note: 'Accepting research students' },
            { name: 'Dr. Marcus Webb', role: 'Professor, Systems', rating: 4.8, count: 188, focus: 'Operating systems & networks', office: 'Hale Computing 220', note: 'Teaches CS 245' },
            { name: 'Dr. Priya Nair', role: 'Assistant Professor, Security', rating: 4.9, count: 96, focus: 'Applied cryptography', office: 'Hale Computing 410', note: 'Directs the Security Lab' },
            { name: 'Dr. Sofia Alvarez', role: 'Teaching Professor, HCI', rating: 4.9, count: 240, focus: 'Human–computer interaction', office: 'Hale Computing 118', note: 'First-year CS advisor' },
          ]} />
        </>
      ),
    },
    {
      id: 'cs-outcomes', tab: 'overview', title: 'Careers & outcomes', icon: 'ThumbsUp',
      body: () => (
        <>
          <ul className="bullet-list">
            <li><div className="bullet-list__label">Median first-year salary: $92,000</div><div className="bullet-list__desc">From the Class of 2025 first-destination survey.<sup><a href="#src-3" className="cite">3</a></sup></div></li>
            <li><div className="bullet-list__label">94% placed within six months</div><div className="bullet-list__desc">Employed, in graduate school, or launching a venture.</div></li>
            <li><div className="bullet-list__label">Where grads go</div><div className="bullet-list__desc">Microsoft, Epic, Datadog, regional startups, and top CS Ph.D. programs.</div></li>
          </ul>
          <div className="callout">
            <div className="callout__icon">{Icon.Award()}</div>
            <div>
              <p className="callout__title">Co-op pays</p>
              <p className="callout__body">CS co-op students earn an average of $28/hour and convert to full-time offers at a high rate.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'cs-campus', tab: 'campus', title: 'Where you’ll study', icon: 'MapPin',
      body: () => (
        <>
          <p>Home base for computing students on the North Quad.</p>
          <CampusCarousel items={[
            { name: 'Hale Computing Center', role: 'Labs, maker space & CS advising', rating: 4.8, count: 360, hours: 'Open until 11 PM', dist: 'North Quad', cta: 'Tour' },
            { name: 'Innovation Studio', role: 'Project & co-op workspace', rating: 4.7, count: 145, hours: 'Open until 9 PM', dist: 'Engineering Walk', cta: 'Tour' },
          ]} />
        </>
      ),
    },
    {
      id: 'cs-related', tab: 'programs', title: 'Related programs', icon: 'Compass',
      body: () => (
        <div className="related-programs">
          {[
            { name: 'Data Science (B.S.)', desc: 'Shares a first year with CS; adds statistics and data engineering.' },
            { name: 'Cybersecurity (B.S.)', desc: 'A security-first track with a dedicated lab and red-team coursework.' },
            { name: 'Software Engineering (B.S.)', desc: 'Team-built software, testing, and shipping at scale.' },
            { name: 'Mathematics (B.S.) + CS minor', desc: 'For students drawn to theory, cryptography, or graduate research.' },
          ].map((p, i) => (
            <button type="button" className="related-program" key={i}>
              <span className="related-program__icon">{Icon.BookOpen()}</span>
              <span className="related-program__text">
                <span className="related-program__name">{p.name}</span>
                <span className="related-program__desc">{p.desc}</span>
              </span>
              <span className="related-program__arrow">{Icon.ArrowRight()}</span>
            </button>
          ))}
        </div>
      ),
    },
  ],
  sources: [
    { num: 1, fav: 'M', name: 'Meridian Course Catalog', title: 'B.S. Computer Science', date: 'Apr 2026', url: '#' },
    { num: 2, fav: 'M', name: 'Engineering & Computing', title: 'CS faculty & facts', date: 'Mar 2026', url: '#' },
    { num: 3, fav: 'M', name: 'Meridian Career Center', title: 'Class of 2025 outcomes', date: 'Jan 2026', url: '#' },
  ],
  followups: [
    { q: 'How much does Meridian cost and what aid can I get?', to: 'COST_AID' },
    { q: 'Who teaches in the CS department?', to: 'CS_PROGRAM' },
    { q: 'What scholarships am I eligible for?', to: 'COST_AID' },
  ],
};

/* === COST_AID: cost, aid & scholarships ============================ */
const COST_AID = {
  query: 'How much does Meridian cost and what aid can I get?',
  chatLabel: 'Cost, aid & scholarships',
  tabs: [
    { id: 'conditions', label: 'Cost & Aid', icon: 'DollarSign', count: 4 },
    { id: 'locations', label: 'Campus', icon: 'MapPin', count: 1 },
    { id: 'pages', label: 'Admissions', icon: 'FileText', count: 1 },
  ],
  summary: [
    { text: "Meridian’s published cost of attendance for 2026–27 is about $58,400, but most first-year students pay far less after aid" },
    { text: ". Last year we awarded $75M in grants and scholarships, and 68% of students received need-based aid", cite: [1] },
    { text: ". Families earning under $75,000 typically pay $0 tuition through the Meridian Promise", cite: [2] },
    { text: ". Use the Net Price Calculator for an estimate tailored to you", cite: [3] },
    { text: "." },
  ],
  sections: [
    {
      id: 'aid-cost', tab: 'cost', title: 'What it actually costs', icon: 'DollarSign',
      body: () => (
        <>
          <p>Full-time undergraduate cost of attendance, 2026–27.<sup><a href="#src-1" className="cite">1</a></sup></p>
          <ul className="bullet-list">
            <li><div className="bullet-list__label">Tuition &amp; fees — $41,200</div><div className="bullet-list__desc">Covers full-time enrollment, technology, and student activity fees.</div></li>
            <li><div className="bullet-list__label">Housing &amp; meals — $15,400</div><div className="bullet-list__desc">A standard residence hall and a full meal plan.</div></li>
            <li><div className="bullet-list__label">Books &amp; personal — $1,800</div><div className="bullet-list__desc">Many courses use free or open materials, which lowers this further.</div></li>
          </ul>
          <div className="callout">
            <div className="callout__icon">{Icon.Info()}</div>
            <div>
              <p className="callout__title">Net price beats the sticker</p>
              <p className="callout__body">After grants and scholarships, the average first-year student pays about $24,300 — run the Net Price Calculator for your number.<sup><a href="#src-3" className="cite">3</a></sup></p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'aid-package', tab: 'aid', title: 'A sample aid package', icon: 'Award',
      body: () => (
        <window.CoverageCard
          plan="Need-based grant + Presidential Scholarship"
          status="covered"
          copay="12,150"
          deductible={{ met: '29,000', total: '41,200' }}
          visitsPerYear="30"
          referralRequired={true}
          network="6"
          preauth="Renews yearly with the FAFSA" />
      ),
    },
    {
      id: 'aid-steps', tab: 'aid', title: 'How aid works, step by step', icon: 'FileText',
      body: () => (
        <window.TimelineStepper steps={[
          { when: 'Step 1', title: 'Submit the FAFSA', detail: 'Use Meridian’s school code 003842. The FAFSA unlocks federal, state, and need-based Meridian aid.' },
          { when: 'Step 2', title: 'Get your aid offer', detail: 'Within about two weeks of admission, you’ll receive an offer listing grants, scholarships, work-study, and any loans.' },
          { when: 'Step 3', title: 'Compare your net price', detail: 'Subtract grants and scholarships (money you don’t repay) from the cost of attendance to see what you’ll actually pay.' },
          { when: 'Step 4', title: 'Accept & enroll', detail: 'Accept the aid you want, set up a payment plan if needed, and you’re set for fall.' },
        ]} />
      ),
    },
    {
      id: 'aid-scholarships', tab: 'scholarships', title: 'Scholarships you could earn', icon: 'Award',
      body: () => (
        <>
          <ul className="bullet-list">
            <li><div className="bullet-list__label">Meridian Promise — full tuition</div><div className="bullet-list__desc">Automatic for admitted students whose family income is under $75,000.<sup><a href="#src-2" className="cite">2</a></sup></div></li>
            <li><div className="bullet-list__label">Presidential Scholarship — up to $20,000/yr</div><div className="bullet-list__desc">Merit award for top applicants; no separate application required.</div></li>
            <li><div className="bullet-list__label">Dean’s Scholarship — up to $12,000/yr</div><div className="bullet-list__desc">Awarded across all colleges for strong academics and involvement.</div></li>
            <li><div className="bullet-list__label">Talent &amp; program awards</div><div className="bullet-list__desc">Music, art, athletics, and program-specific scholarships you can stack with merit aid.</div></li>
          </ul>
          <div className="callout">
            <div className="callout__icon">{Icon.Info()}</div>
            <div>
              <p className="callout__title">Most awards renew</p>
              <p className="callout__body">Keep the required GPA and your scholarship renews for all four years.</p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'aid-office', tab: 'campus', title: 'Talk to financial aid', icon: 'MapPin',
      body: () => (
        <>
          <p>One-on-one help estimating costs, comparing offers, and filing the FAFSA.</p>
          <CampusCarousel items={[
            { name: 'Office of Financial Aid', role: 'Aid counseling & FAFSA help', rating: 4.8, count: 540, hours: 'Mon–Fri, 9 AM–5 PM', dist: 'Whitman Hall, 1st floor', phone: '(212) 555-0190', cta: 'Book advising' },
          ]} />
        </>
      ),
    },
    {
      id: 'aid-faq', tab: 'admissions', title: 'Aid FAQ', icon: 'BookOpen',
      body: () => (
        <ul className="bullet-list">
          <li><div className="bullet-list__label">When is the FAFSA priority deadline?</div><div className="bullet-list__desc">February 15 for the best consideration; we accept it year-round.</div></li>
          <li><div className="bullet-list__label">Does Meridian meet full need?</div><div className="bullet-list__desc">Yes — admitted students receive aid that meets 100% of demonstrated need.</div></li>
          <li><div className="bullet-list__label">Is there a payment plan?</div><div className="bullet-list__desc">An interest-free monthly plan spreads the balance across the term.</div></li>
          <li><div className="bullet-list__label">Can I appeal my offer?</div><div className="bullet-list__desc">Yes. If your circumstances change, financial aid can review your package.</div></li>
        </ul>
      ),
    },
  ],
  sources: [
    { num: 1, fav: 'M', name: 'Meridian Office of Financial Aid', title: 'Cost of attendance 2026–27', date: 'Apr 2026', url: '#' },
    { num: 2, fav: 'M', name: 'Meridian Promise', title: 'Free-tuition eligibility', date: 'Mar 2026', url: '#' },
    { num: 3, fav: 'M', name: 'Meridian Admissions', title: 'Net Price Calculator', date: 'Feb 2026', url: '#' },
  ],
  followups: [
    { q: 'Tell me about the Computer Science major', to: 'CS_PROGRAM' },
    { q: 'What scholarships am I eligible for?', to: 'COST_AID' },
    { q: 'When is the FAFSA deadline?', to: 'COST_AID' },
  ],
};

window.AlmaData = { CS_PROGRAM, COST_AID };
window.FacultyCarousel = FacultyCarousel;
window.CampusCarousel = CampusCarousel;
