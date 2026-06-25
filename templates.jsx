/* === Custom layout components for varied query types === */
const TIcon = window.Icon;

/* === Timeline stepper (application prep) === */
function TimelineStepper({ steps }) {
  return (
    <ol className="timeline">
      {steps.map((s, i) => (
        <li key={i} className="timeline__step">
          <div className="timeline__rail">
            <div className="timeline__dot" style={s.danger ? {background: 'var(--danger)', borderColor: 'var(--danger)'} : null}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="timeline__body">
            <div className="timeline__when">{s.when}</div>
            <h4 className="timeline__title">{s.title}</h4>
            <div className="timeline__detail">{s.detail}</div>
            {s.list && (
              <ul className="timeline__list">
                {s.list.map((li, j) => <li key={j}>{li}</li>)}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* === Financial aid card (aid & scholarships) === */
function CoverageCard({ plan, status, copay, deductible, visitsPerYear, referralRequired, network, preauth }) {
  return (
    <div className="coverage">
      <div className="coverage__head">
        <div className="coverage__plan">
          <div style={{fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace'}}>Your aid package</div>
          <div className="coverage__plan-name">{plan}</div>
        </div>
        <div className={'coverage__status coverage__status--' + (status === 'covered' ? 'ok' : 'no')}>
          {status === 'covered' ? TIcon.Check() : TIcon.Alert()}
          <span>{status === 'covered' ? 'Eligible' : 'Not eligible'}</span>
        </div>
      </div>
      <div className="coverage__grid">
        <div className="coverage__stat">
          <div className="coverage__stat-label">Cost per term</div>
          <div className="coverage__stat-value">${copay}</div>
          <div className="coverage__stat-sub">after aid applied</div>
        </div>
        <div className="coverage__stat">
          <div className="coverage__stat-label">Aid awarded</div>
          <div className="coverage__stat-value">{deductible.met} / ${deductible.total}</div>
          <div className="coverage__stat-sub">{deductible.met === deductible.total ? 'Fully funded this year' : 'remaining to award'}</div>
        </div>
        <div className="coverage__stat">
          <div className="coverage__stat-label">Credits per year</div>
          <div className="coverage__stat-value">{visitsPerYear}</div>
          <div className="coverage__stat-sub">full-time</div>
        </div>
        <div className="coverage__stat">
          <div className="coverage__stat-label">FAFSA required</div>
          <div className="coverage__stat-value">{referralRequired ? 'Yes' : 'No'}</div>
          <div className="coverage__stat-sub">{referralRequired ? 'from financial aid' : 'merit-based'}</div>
        </div>
        {preauth && (
          <div className="coverage__stat">
            <div className="coverage__stat-label">Renewal terms</div>
            <div className="coverage__stat-value" style={{fontSize: 14, paddingTop: 4}}>{preauth}</div>
          </div>
        )}
      </div>
      <div className="coverage__network">
        <span className="pill pill--ok">{TIcon.Check()}<span>Aid-eligible</span></span>
        <span style={{color: 'var(--text-muted)', fontSize: 13}}>{network} scholarships matched to your profile</span>
      </div>
    </div>
  );
}

/* === Walk-in advising list — wait times + drop-in CTAs === */
function UrgentCareList({ items }) {
  return (
    <div className="urgent-list">
      {items.map((u, i) => (
        <div className="urgent-card" key={i}>
          <div className="urgent-card__main">
            <div className="urgent-card__head">
              <h4 className="urgent-card__name">{u.name}</h4>
              <span className={'pill ' + (u.wait < 15 ? 'pill--ok' : u.wait < 40 ? '' : 'pill--neutral')}>
                <span className="pill__dot"></span>
                <span>{u.wait}-min wait</span>
              </span>
            </div>
            <div className="urgent-card__meta">
              <div className="meta-row">{TIcon.MapPin()}<span>{u.dist} · {u.address}</span></div>
              <div className="meta-row">{TIcon.Clock()}<span><strong style={{color: 'oklch(0.42 0.1 145)'}}>Open now</strong> · closes {u.closes}</span></div>
              <div className="meta-row">{TIcon.Phone()}<span>{u.phone}</span></div>
            </div>
          </div>
          <div className="urgent-card__actions">
            <button className="btn btn--accent">Reserve spot</button>
            <button className="btn">Drop in</button>
            <button className="btn">Directions</button>
          </div>
          <div className="urgent-card__chart">
            <div className="urgent-card__chart-label">Today's wait</div>
            <div className="urgent-bars">
              {u.hourly.map((h, j) => {
                const max = Math.max(...u.hourly);
                const pct = (h / max) * 100;
                const now = j === u.nowIdx;
                return (
                  <div key={j} className={'urgent-bar' + (now ? ' urgent-bar--now' : '')} title={`${h} min`}>
                    <div className="urgent-bar__fill" style={{height: pct + '%'}}></div>
                  </div>
                );
              })}
            </div>
            <div className="urgent-card__chart-axis">
              <span>8a</span><span>12p</span><span>5p</span><span>9p</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* === Bookstore list (scoped to a single Campus facet) === */
function PharmacyList({ items }) {
  return (
    <div className="urgent-list">
      {items.map((p, i) => (
        <div className="urgent-card urgent-card--compact" key={i}>
          <div className="urgent-card__main">
            <div className="urgent-card__head">
              <h4 className="urgent-card__name">{p.name}</h4>
              <span className={'pill ' + (p.tagKind === 'accent' ? 'pill--accent' : 'pill--ok')}>
                <span className="pill__dot"></span>
                <span>{p.tag}</span>
              </span>
            </div>
            <div className="urgent-card__meta">
              <div className="meta-row">{TIcon.MapPin()}<span>{p.dist} · {p.address}</span></div>
              <div className="meta-row">{TIcon.Clock()}<span><strong style={{color: 'oklch(0.42 0.1 145)'}}>Open now</strong> · closes {p.closes}</span></div>
              <div className="meta-row">{TIcon.Phone()}<span>{p.phone}</span></div>
            </div>
          </div>
          <div className="urgent-card__actions">
            <button className="btn btn--accent">Directions</button>
            <button className="btn">View booklist</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* === Faculty hero (large featured faculty) === */
function ProviderHero({ providers }) {
  return (
    <div className="prov-hero">
      {providers.map((p, i) => (
        <div key={i} className={'prov-hero__card' + (i === 0 ? ' prov-hero__card--featured' : '')}>
          <div className="prov-hero__photo">{TIcon.Person()}</div>
          <div className="prov-hero__body">
            <div className="prov-hero__name">
              {p.name}
              {p.acceptingNew && <span className="pill pill--ok"><span className="pill__dot"></span><span>Accepting</span></span>}
            </div>
            <div className="prov-hero__role">{p.role} · {p.years}</div>
            <div className="prov-hero__row">
              <span className="rating">
                <span className="rating__stars">{TIcon.Star()}</span>
                <span className="rating__num">{p.rating}</span>
                <span className="rating__count">({p.count} reviews)</span>
              </span>
              <span className="prov-hero__dot">·</span>
              <span style={{color: 'var(--text-muted)', fontSize: 13}}>{p.dist}</span>
              <span className="prov-hero__dot">·</span>
              <span style={{color: 'var(--text-muted)', fontSize: 13}}>Speaks {p.langs}</span>
              {p.ins && (
                <>
                  <span className="prov-hero__dot">·</span>
                  <span style={{color: 'var(--text-muted)', fontSize: 13}}>{p.ins}</span>
                </>
              )}
            </div>
            <div className="prov-hero__avail">
              <span style={{fontSize: 12, color: 'var(--text-muted)'}}>Next available</span>
              <div className="prov-hero__slots">
                {p.slots.map((s, j) => (
                  <button key={j} className="prov-hero__slot">{s}</button>
                ))}
                <button className="prov-hero__slot prov-hero__slot--more">+ more</button>
              </div>
            </div>
          </div>
          <div className="prov-hero__actions">
            <button className="btn btn--primary">Book advising</button>
            <button className="btn">View profile</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* === Compact comparison table === */
function CompareTable({ headers, rows }) {
  return (
    <div className="compare-wrap">
      <table className="compare">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j}>
                  {typeof cell === 'object' && cell !== null && cell.type === 'name' ? (
                    <>
                      <div className="compare__name">{cell.name}</div>
                      <div className="compare__sub">{cell.sub}</div>
                    </>
                  ) : typeof cell === 'object' && cell !== null && cell.type === 'tag' ? (
                    <span className={'tag' + (cell.neutral ? ' tag--neutral' : '')}>{cell.label}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* === Advising slot cards — time + campus + wait + reserve CTA === */
function AppointmentSlots({ slots, gated, onReserve, hideLiveHeader }) {
  return (
    <div className="slots">
      {gated ? (
        <div className="slots__gate">
          <span className="slots__gate-icon">{TIcon.Lock()}</span>
          <span className="slots__gate-text">
            <strong>Sign in to reserve.</strong> These are live openings from campus advising offices — holding one requires a verified account.
          </span>
          <button className="slots__gate-btn">Sign in</button>
        </div>
      ) : !hideLiveHeader && (
        <div className="slots__live">
          <span className="slots__live-dot"></span>
          <span>Live openings from campus advising offices. Availability may change minute to minute.</span>
        </div>
      )}
      <div className="slots__grid">
        {slots.map((s, i) => (
          <div className={'slot' + (gated ? ' slot--gated' : '')} key={i}>
            <div className="slot__when">
              <span className="slot__when-day">{s.when}</span>
              <span className="slot__when-time">{s.time}</span>
            </div>
            <div className="slot__body">
              <div className="slot__loc">{s.loc}</div>
              <div className="slot__meta">
                <span className="slot__meta-item">{TIcon.MapPin()}<span>{s.dist}</span></span>
                <span className="slot__meta-dot">·</span>
                <span className="slot__meta-item">{TIcon.Clock()}<span>{s.wait}</span></span>
                {s.closes && (
                  <>
                    <span className="slot__meta-dot">·</span>
                    <span className="slot__meta-item slot__meta-item--muted">{s.closes}</span>
                  </>
                )}
              </div>
            </div>
            <button
              className={'slot__cta' + (gated ? ' slot__cta--gated' : '')}
              onClick={() => { if (!gated && onReserve) onReserve(s); }}
              type="button"
            >
              {gated ? (
                <>
                  <span>{TIcon.Lock()}</span>
                  <span>Sign in to reserve</span>
                </>
              ) : (
                <>
                  <span>Reserve</span>
                  <span>{TIcon.ArrowRight()}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* === Page results — site-search style list === */
function PageResults({ items }) {
  return (
    <ul className="page-results">
      {items.map((p, i) => (
        <li className="page-result" key={i}>
          <div className="page-result__head">
            <span className="page-result__kind">{p.kind}</span>
            <span className="page-result__sep">·</span>
            <span className="page-result__url">{p.url}</span>
          </div>
          <a href="#" className="page-result__title">{p.title}</a>
          <p className="page-result__snippet">{p.snippet}</p>
          {p.meta && (
            <div className="page-result__meta">
              {p.meta.map((m, j) => (
                <span key={j} className="page-result__meta-item">{m}</span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

window.TimelineStepper = TimelineStepper;
window.CoverageCard = CoverageCard;
window.UrgentCareList = UrgentCareList;
window.PharmacyList = PharmacyList;
window.ProviderHero = ProviderHero;
window.CompareTable = CompareTable;
window.AppointmentSlots = AppointmentSlots;
window.PageResults = PageResults;
