import {
  Activity, BarChart3, CalendarDays, ClipboardCheck, Dumbbell,
  Gauge, LayoutDashboard, Menu, ShieldCheck, Trophy, Users, X
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import type { AppData } from '../types';

const items = [
  ['/', 'Главная', LayoutDashboard],
  ['/players', 'Игроки', Users],
  ['/testing', 'Тестирование', ClipboardCheck],
  ['/trainings', 'Тренировки', CalendarDays],
  ['/matches', 'Матчи', Trophy],
  ['/lineups', 'Составы', ShieldCheck],
  ['/rating', 'Рейтинг', Gauge],
  ['/progress', 'Прогресс', BarChart3]
] as const;

export default function Layout({ data }: { data: AppData }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Открыть меню">
        <Menu size={22} />
      </button>

      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark"><Activity size={23} /></div>
          <div><strong>Futsal Coach</strong><span>Team performance</span></div>
        </div>
        <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Закрыть меню"><X size={20}/></button>
        <nav>
          {items.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <Icon size={18}/><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Dumbbell size={18}/>
          <div><b>F1–F6</b><span>Физическая батарея</span></div>
        </div>
      </aside>

      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <main className="main-content">
        <Outlet context={data} />
      </main>
    </div>
  );
}
