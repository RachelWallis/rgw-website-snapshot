import { PillButton } from '@/components/PillButton/PillButton';
import { areasByTier, type ServiceArea } from '@/lib/service-areas';
import classes from './AreasTeaser.module.css';

/** Homepage teaser for /areas-we-cover — the homepage currently names the
    region but never the towns, and this gives the ten location landing
    pages the internal links they need. */

/** Every service-area name that has (or feeds into) one of the ten real
    `/areas/<town>` pages (content/town-pages.ts) — same mapping as
    app/areas-we-cover/page.tsx, kept in sync by hand for the same reason
    noted there: names not listed here never had their own page. RGW-055
    added the links themselves (this teaser previously showed plain town
    names with no page-level link). */
const townPageForArea: Record<string, string> = {
  Eastleigh: 'eastleigh',
  Allbrook: 'eastleigh',
  Bishopstoke: 'bishopstoke',
  "Chandler's Ford": 'chandlers-ford',
  Hiltingbury: 'chandlers-ford',
  'Fair Oak': 'fair-oak',
  'Horton Heath': 'fair-oak',
  'Hedge End': 'hedge-end',
  'Boorley Green': 'hedge-end',
  Winchester: 'winchester',
  Compton: 'winchester',
  Otterbourne: 'winchester',
  Twyford: 'winchester',
  Hockley: 'winchester',
  Owslebury: 'winchester',
  'Colden Common': 'winchester',
  Alresford: 'winchester',
  Southampton: 'southampton',
  Romsey: 'romsey',
  Ampfield: 'romsey',
  'North Baddesley': 'romsey',
  "Bishop's Waltham": 'bishops-waltham',
  Upham: 'bishops-waltham',
  Durley: 'bishops-waltham',
  Botley: 'botley',
};

function TownNames({ areas }: { areas: ServiceArea[] }) {
  return (
    <p className={classes.towns}>
      {areas.map((area, i) => {
        const slug = townPageForArea[area.name];
        return (
          <span key={area.name}>
            {i > 0 ? ' · ' : ''}
            {slug ? (
              <a href={`/areas/${slug}`} className={classes.townLink}>
                {area.name}
              </a>
            ) : (
              area.name
            )}
          </span>
        );
      })}
    </p>
  );
}

export function AreasTeaser() {
  const core = areasByTier('core');
  const regular = [...areasByTier('mid'), ...areasByTier('wider')];

  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.secHead}>
          <span className={classes.eyebrow}>Areas we cover</span>
          <h2 className={classes.heading}>Where we work</h2>
        </div>

        <div className={classes.card}>
          <div className={classes.group}>
            <h3 className={classes.groupTitle}>Every day, no travel charge</h3>
            <TownNames areas={core} />
          </div>
          <div className={classes.group}>
            <h3 className={classes.groupTitle}>Regularly, also no travel charge</h3>
            <TownNames areas={regular} />
          </div>
          <p className={classes.note}>
            Somewhere else? Ring and ask — we travel about an hour from Bishopstoke.
          </p>
          <PillButton href="/areas-we-cover" variant="dark">
            See all areas
          </PillButton>
        </div>
      </div>
    </section>
  );
}
