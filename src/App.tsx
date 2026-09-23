import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PlayersPage from './pages/PlayersPage';
import AddPlayerPage from './pages/AddPlayerPage';
import PlayerPage from './pages/PlayerPage';
import TestingPage from './pages/TestingPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { loadAppData } from './lib/api';
import type { AppData } from './types';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppData()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Ошибка загрузки'));

    const handleRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<AppData>;
      if (customEvent.detail) setData(customEvent.detail);
    };

    window.addEventListener('futsal-data-refresh', handleRefresh);
    return () => window.removeEventListener('futsal-data-refresh', handleRefresh);
  }, []);

  if (error) {
    return <div className="boot-screen"><h2>Не удалось загрузить данные</h2><p>{error}</p></div>;
  }

  if (!data) {
    return <div className="boot-screen"><div className="loader"/><b>Futsal Coach</b><span>Загрузка системы...</span></div>;
  }

  return (
    <Routes>
      <Route element={<Layout data={data}/>}>
        <Route index element={<DashboardPage/>}/>
        <Route path="players" element={<PlayersPage/>}/>
        <Route path="players/new" element={<AddPlayerPage/>}/>
        <Route path="players/:id" element={<PlayerPage/>}/>
        <Route path="testing" element={<TestingPage/>}/>
        <Route path="trainings" element={<PlaceholderPage title="Тренировки" text="Планирование, текущая тренировка, посещаемость и RPE."/>}/>
        <Route path="matches" element={<PlaceholderPage title="Матчи" text="Матчи, статистика и игровые оценки."/>}/>
        <Route path="lineups" element={<PlaceholderPage title="Составы" text="Подбор состава с учётом рейтинга, позиции и доступности."/>}/>
        <Route path="rating" element={<PlaceholderPage title="Рейтинг" text="Общий, позиционный и внутренний рейтинг игроков."/>}/>
        <Route path="progress" element={<PlaceholderPage title="Прогресс" text="История тестов и динамика игроков."/>}/>
      </Route>
    </Routes>
  );
}
