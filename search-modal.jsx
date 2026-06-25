/* === Search modal overlay + Site root ===
   SiteShell (the website) renders as the page. Clicking "Search" in the top nav
   (or ⌘/Ctrl-K, or any hero affordance) opens the full search experience — the
   existing <App /> — inside a blurred, darkened modal overlay.

   <App /> stays mounted at all times (hidden via CSS when closed) so the demo
   keeps its state across open/close. */

function SearchModal({ open, onClose }) {
  const panelRef = React.useRef(null);

  // Esc to close + body scroll-lock while open (mirrors AuthModal in app.jsx).
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    document.addEventListener('keydown', handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Focus the search input when the modal opens (App's own autoFocus won't
  // refire since App stays mounted).
  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const input = panelRef.current && panelRef.current.querySelector('.input__textarea');
      if (input) input.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <div
      className={'search-modal' + (open ? ' search-modal--open' : '')}
      role="dialog"
      aria-modal="true"
      aria-label="Search Meridian University"
      aria-hidden={open ? undefined : true}
      onClick={onClose}>
      <div className="search-modal__frame" onClick={(e) => e.stopPropagation()}>
        <button
          className="search-modal__close"
          onClick={onClose}
          aria-label="Close search">
          <Icon.X />
        </button>
        <div className="search-modal__panel" ref={panelRef}>
          <div className="app-modal-mount in-modal">
            <App />
          </div>
        </div>
      </div>
    </div>
  );
}

function Site() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  const openSearch = React.useCallback(() => setSearchOpen(true), []);
  const closeSearch = React.useCallback(() => {
    setSearchOpen(false);
    // Return focus to the nav trigger.
    requestAnimationFrame(() => { if (triggerRef.current) triggerRef.current.focus(); });
  }, []);

  // ⌘K / Ctrl-K toggles the search modal.
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => {
          if (v) requestAnimationFrame(() => { if (triggerRef.current) triggerRef.current.focus(); });
          return !v;
        });
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <SiteShell onOpenSearch={openSearch} triggerRef={triggerRef} />
      <SearchModal open={searchOpen} onClose={closeSearch} />
    </>
  );
}

window.SearchModal = SearchModal;
window.Site = Site;

ReactDOM.createRoot(document.getElementById('root')).render(<Site />);
