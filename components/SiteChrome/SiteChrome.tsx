'use client';

import { usePathname } from 'next/navigation';
import { ContactRail } from '@/components/ContactRail/ContactRail';
import { Footer } from '@/components/Footer/Footer';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio') ?? false;
  // Homepage hero carries its own embedded nav pill (see components/Hero),
  // matching the Calm Premium design, no separate sticky header there.
  const isHome = pathname === '/';

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {!isHome && <HeaderMegaMenu />}
      {/* flow-root: several page-top components (Hero, PhotoBand, SolidBand)
          have their own margin-top to inset from the viewport edge, without
          this, that margin collapses through <main> and escapes above it,
          exposing the body background instead of the page's own. */}
      <main id="main-content" style={{ flex: 1, display: 'flow-root' }}>
        {children}
      </main>
      <Footer />
      <ContactRail />
    </div>
  );
}
