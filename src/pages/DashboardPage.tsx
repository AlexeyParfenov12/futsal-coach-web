import { Activity, ClipboardCheck, Gauge, Users } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import type { AppData } from '../types';

export default function DashboardPage() {
  const data = useOutletContext<AppData>();
  const active = data.players.filter((p) => p.status === 'Активен');
  const rated = active.filter((p) => typeof p.rating === 'number');
  const avg = rated.length ? Math.round(rated.reduce((s, p) => s + (p.rating || 0), 0) / rated.length) : '—';
  const complete = data.physicalProfiles.filter((p) => p.status === 'Полный профиль').length;

  return (
    <>
      <header className="page-header">
        <div>
          <span className="kicker">FUTSAL COACH</span>
          <h1>Панель тренера</h1>
          <p>Игроки, тестирование и рейтинг команды — в одном интерфейсе.</p>
        </div>
        <span className={data.source === 'demo' ? 'source-badge demo' : 'source-badge'}>
          {data.source === 'demo' ? 'Демо-данные' : 'Google Sheets подключён'}
        </span>
      </header>

      <section className="metrics-grid">
        <MetricCard title="Активные игроки" value={active.length} detail="в текущем составе" icon={Users}/>
        <MetricCard title="Средний рейтинг" value={avg} detail="по игрокам с данными" icon={Gauge}/>
        <MetricCard title="Физический профиль" value={complete} detail="полных профилей F1–F6" icon={Activity}/>
        <MetricCard title="Система тестов" value="F1–F6" detail="утверждённая батарея" icon={ClipboardCheck}/>
      </section>

      <section className="content-grid two">
        <article className="panel">
          <div className="panel-head">
            <div><h2>Рейтинг команды</h2><p>Текущие лидеры</p></div>
            <Link to="/rating">Все игроки</Link>
          </div>
          <div className="ranking-list">
            {[...rated].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,5).map((p,i)=>(
              <Link to={'/players/'+p.id} className="ranking-row" key={p.id}>
                <span className="rank-no">{i+1}</span>
                <div className="player-avatar">{p.name.slice(0,1)}</div>
                <div className="grow"><strong>{p.name}</strong><span>{p.position}</span></div>
                <b>{Math.round(p.rating || 0)}</b>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel accent-panel">
          <span className="kicker">БЫСТРОЕ ДЕЙСТВИЕ</span>
          <h2>Начать физическое тестирование</h2>
          <p>Выбери игрока и тест. Вводишь только измеренные результаты — служебные поля и расчёты выполняются автоматически.</p>
          <Link className="primary-button" to="/testing">Открыть тестирование</Link>
        </article>
      </section>
    </>
  );
}
