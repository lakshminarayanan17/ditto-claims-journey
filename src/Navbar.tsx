export function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-20 w-full border-b border-[var(--color-line)] bg-white">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-10">
        <a
          href="/"
          className="text-[34px] font-bold leading-none tracking-tight text-[var(--color-ink)]"
          style={{ letterSpacing: "-0.02em" }}
        >
          ditto
        </a>

        <nav className="hidden items-center gap-9 text-[16px] font-medium md:flex">
          <NavItem label="Health Insurance" hasChevron />
          <NavItem label="Term Insurance" hasChevron />
          <NavItem label="Claims" active />
          <NavItem label="Careers" />
        </nav>

        <button
          type="button"
          className="flex items-center gap-2 rounded-[14px] bg-[var(--color-blue-600)] px-4 py-2.5 text-[15px] font-medium text-white shadow-[0_0.5px_2px_rgba(31,42,52,0.18)] transition hover:bg-[#0670e5] active:scale-[0.98]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Schedule a Call
        </button>
      </div>
    </header>
  );
}

function NavItem({
  label,
  hasChevron,
  active,
}: {
  label: string;
  hasChevron?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 ${
        active ? "text-[var(--color-grey-900)]" : "text-[var(--color-ink)]"
      } transition hover:opacity-70`}
    >
      {active && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-blue-600)]" />
      )}
      <span>{label}</span>
      {hasChevron && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </button>
  );
}
