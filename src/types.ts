export type Player = {
  id: string;
  name: string;
  position: string;
  secondaryPosition?: string;
  status: string;
  age?: number;
  group?: string;
  profile?: string;
  rating?: number | null;
  physical?: number | null;
  technique?: number | null;
  tactics?: number | null;
  attendance?: number | null;
};

export type PhysicalProfile = {
  playerId: string;
  speed?: number | null;
  cod?: number | null;
  rsa?: number | null;
  endurance?: number | null;
  power?: number | null;
  rating?: number | null;
  completeness?: string;
  limiting?: string;
  strongest?: string;
  batteryId?: string;
  date?: string;
  status?: string;
  codAsymmetry?: number | null;
};

export type AppData = {
  players: Player[];
  physicalProfiles: PhysicalProfile[];
  source: 'google-sheets' | 'demo';
};

export type PhysicalTestPayload = {
  playerId: string;
  code: 'F1' | 'F2' | 'F3-R' | 'F3-L' | 'F4' | 'F5' | 'F6';
  attempts: number[];
  rsa5m?: number[];
  fietDistance?: number;
  method?: string;
  comment?: string;
  batteryId?: string;
  testType?: 'Контрольное' | 'Мониторинг';
};
