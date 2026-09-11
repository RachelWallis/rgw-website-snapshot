export type CoverageTier = 'core' | 'mid' | 'wider';

export type ServiceArea = {
  name: string;
  postcodes: string[];
  tier: CoverageTier;
};

export const serviceAreas: ServiceArea[] = [
  { name: 'Bishopstoke', postcodes: ['SO50'], tier: 'core' },
  { name: 'Eastleigh', postcodes: ['SO50'], tier: 'core' },
  { name: 'Fair Oak', postcodes: ['SO50'], tier: 'core' },
  { name: 'Horton Heath', postcodes: ['SO50'], tier: 'core' },
  { name: 'Boyatt Wood', postcodes: ['SO50'], tier: 'core' },
  { name: 'Allbrook', postcodes: ['SO50'], tier: 'core' },
  { name: "Chandler's Ford", postcodes: ['SO53'], tier: 'core' },
  { name: 'Hiltingbury', postcodes: ['SO53'], tier: 'core' },

  { name: 'Hedge End', postcodes: ['SO30'], tier: 'mid' },
  { name: 'Botley', postcodes: ['SO30'], tier: 'mid' },
  { name: 'Boorley Green', postcodes: ['SO32'], tier: 'mid' },
  { name: 'West End', postcodes: ['SO30'], tier: 'mid' },
  { name: 'Colden Common', postcodes: ['SO21'], tier: 'mid' },
  { name: 'Otterbourne', postcodes: ['SO21'], tier: 'mid' },
  { name: 'Twyford', postcodes: ['SO21'], tier: 'mid' },
  { name: 'Compton', postcodes: ['SO21'], tier: 'mid' },
  { name: 'Hockley', postcodes: ['SO21'], tier: 'mid' },
  { name: 'Owslebury', postcodes: ['SO21'], tier: 'mid' },
  { name: 'Winchester', postcodes: ['SO22', 'SO23'], tier: 'mid' },
  { name: 'Bursledon', postcodes: ['SO31'], tier: 'mid' },
  { name: 'Netley', postcodes: ['SO31'], tier: 'mid' },
  { name: 'Hamble', postcodes: ['SO31'], tier: 'mid' },
  { name: 'North Baddesley', postcodes: ['SO52'], tier: 'mid' },

  {
    name: 'Southampton',
    postcodes: ['SO14', 'SO15', 'SO16', 'SO17', 'SO18', 'SO19'],
    tier: 'mid',
  },
  { name: 'Romsey', postcodes: ['SO51'], tier: 'mid' },
  { name: 'Ampfield', postcodes: ['SO51'], tier: 'mid' },
  { name: 'Alresford', postcodes: ['SO24'], tier: 'mid' },
  { name: "Bishop's Waltham", postcodes: ['SO32'], tier: 'mid' },
  { name: 'Upham', postcodes: ['SO32'], tier: 'mid' },
  { name: 'Curdridge', postcodes: ['SO32'], tier: 'mid' },
  { name: 'Durley', postcodes: ['SO32'], tier: 'mid' },
  { name: 'Totton', postcodes: ['SO40'], tier: 'mid' },
  { name: 'Hythe', postcodes: ['SO45'], tier: 'mid' },
  { name: 'Fawley', postcodes: ['SO45'], tier: 'mid' },
];

export function areasByTier(tier: CoverageTier): ServiceArea[] {
  return serviceAreas.filter((a) => a.tier === tier);
}

export function formatAreaLabel(area: ServiceArea): string {
  return `${area.name} (${area.postcodes.join(', ')})`;
}

export const allPostcodes: string[] = Array.from(
  new Set(serviceAreas.flatMap((a) => a.postcodes))
).sort();

export const allTownNames: string[] = serviceAreas.map((a) => a.name);
