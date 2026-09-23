import { ArrowLeft, Activity, BrainCircuit, Gauge, Target } from 'lucide-react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import type { AppData } from '../types';

export default function PlayerPage() {
  const { id } = useParams();
  const data = useOutletContext<AppData>();
  const p = data.players.find(x => x.id === id);
  const ph = data.physicalProfiles.find(x => x.playerId === id);

  if (!p) {
    return <div className="empty-state"><h2>Игрок не найден</h2><Link to="/players">К списку игроков</Link></div>;
  }

  const domains = [
    ['Скорость', ph?.speed],
    ['COD', ph?.cod],
    ['RSA', ph?.rsa],
    ['Выносливость', ph?.endurance],
    ['Взрывная сила', ph?.power]
  ] as const;

  return (
    <>
      <Link to="/players" className="back-link"><ArrowLeft size={17}/> Игроки</Link>
      <header className="player-hero">
        <div className="player-avatar xl">{p.name.slice(0,1)}</div>
        <div className="grow">
          <span className="kicker">{p.id} · {p.position}</span>
          <h1>{p.name}</h1>
          <p>{p.age ? p.age+' лет · ' : ''}{p.group || 'Команда'} · {p.status}</p>
        </div>
        <div className="hero-rating"><span>Общий рейтинг</span><b>{p.rating == null ? '—' : Math.round(p.rating)}</b></div>
      </header>

      <section className="metrics-grid">
        <div className="summary-card"><Activity/><span>Физика</span><b>{p.physical == null ? '—' : Math.round(p.physical)}</b></div>
        <div className="summary-card"><Target/><span>Техника</span><b>{p.technique == null ? '—' : Math.round(p.technique)}</b></div>
        <div className="summary-card"><BrainCircuit/><span>Тактика</span><b>{p.tactics == null ? '—' : Math.round(p.tactics)}</b></div>
        <div className="summary-card"><Gauge/><span>Посещаемость</span><b>{p.attendance == null ? '—' : Math.round(p.attendance)+'%'}</b></div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><h2>Физический профиль</h2><p>{ph?.status || 'Нет полного контрольного тестирования'}</p></div>
          <Link to={'/testing?player='+p.id}>Добавить тест</Link>
        </div>
        <div className="domain-grid">
          {domains.map(([name, val])=>(
            <div className="domain" key={name}>
              <div className="domain-top"><span>{name}</span><b>{val == null ? '—' : Math.round(val)}</b></div>
              <div className="bar"><i style={{width: (val || 0)+'%'}}/></div>
            </div>
          ))}
        </div>
        {ph && (
          <div className="profile-notes">
            <span>Ограничивающий: <b>{ph.limiting || '—'}</b></span>
            <span>Сильнейший: <b>{ph.strongest || '—'}</b></span>
            <span>COD асимметрия: <b>{ph.codAsymmetry == null ? '—' : ph.codAsymmetry.toFixed(1)+'%'}</b></span>
          </div>
        )}
      </section>
    </>
  );
}
