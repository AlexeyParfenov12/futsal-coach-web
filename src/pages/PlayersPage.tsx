import { Search, UserPlus } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { AppData } from '../types';

export default function PlayersPage() {
  const data = useOutletContext<AppData>();
  const [query, setQuery] = useState('');
  const players = useMemo(
    () => data.players.filter(p => (p.name+' '+p.position+' '+p.id).toLowerCase().includes(query.toLowerCase())),
    [data.players, query]
  );

  return (
    <>
      <header className="page-header">
        <div>
          <span className="kicker">КОМАНДА</span>
          <h1>Игроки</h1>
          <p>Карточки игроков и все накопленные показатели.</p>
        </div>
      </header>

      {data.players.length > 0 && (
        <div className="toolbar">
          <label className="search">
            <Search size={18}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Найти игрока..." />
          </label>
        </div>
      )}

      {data.players.length === 0 ? (
        <section className="panel empty-state">
          <div className="empty-icon"><UserPlus size={26}/></div>
          <h2>Игроков пока нет</h2>
          <p>Сайт подключён к реальной Futsal Coach System. Когда в системе появятся игроки, их карточки автоматически появятся здесь.</p>
        </section>
      ) : players.length === 0 ? (
        <section className="panel empty-state">
          <h2>Ничего не найдено</h2>
          <p>Попробуй изменить запрос поиска.</p>
        </section>
      ) : (
        <section className="player-grid">
          {players.map(p => (
            <Link to={'/players/'+p.id} key={p.id} className="player-card">
              <div className="player-card-top">
                <div className="player-avatar large">{p.name.slice(0,1)}</div>
                <span className="position-pill">{p.position || '—'}</span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.id}{p.age ? ' · '+p.age+' лет' : ''}</p>
              <div className="mini-stats">
                <span><b>{p.rating == null ? '—' : Math.round(p.rating)}</b> рейтинг</span>
                <span><b>{p.physical == null ? '—' : Math.round(p.physical)}</b> физика</span>
                <span><b>{p.attendance == null ? '—' : Math.round(p.attendance)+'%'}</b> посещ.</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
