import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { savePlayer } from '../lib/api';
import type { NewPlayerPayload } from '../types';

const positions = ['GK', 'Cierre', 'Ala', 'Pivot', 'Универсал'] as const;

export default function AddPlayerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<NewPlayerPayload>({
    name: '',
    sex: 'м',
    birthDate: '',
    group: 'Футзал',
    position: 'Ala',
    secondaryPosition: '',
    email: '',
    comment: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof NewPlayerPayload>(key: K, value: NewPlayerPayload[K]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const result = await savePlayer(form);
      navigate('/players/' + result.playerId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось добавить игрока');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Link to="/players" className="back-link"><ArrowLeft size={17}/> Игроки</Link>

      <header className="page-header">
        <div>
          <span className="kicker">НОВЫЙ ИГРОК</span>
          <h1>Добавить игрока</h1>
          <p>Заполни только основные данные. PlayerID, возраст, статус и дата добавления создаются автоматически.</p>
        </div>
      </header>

      <form className="panel player-form" onSubmit={submit}>
        <div className="form-section-title">Основные данные</div>

        <label className="field">
          <span>ФИО *</span>
          <input required value={form.name} onChange={e=>set('name', e.target.value)} placeholder="Иванов Иван Иванович"/>
        </label>

        <div className="form-row">
          <label className="field">
            <span>Пол *</span>
            <select value={form.sex} onChange={e=>set('sex', e.target.value as 'м'|'ж')}>
              <option value="м">Мужской</option>
              <option value="ж">Женский</option>
            </select>
          </label>

          <label className="field">
            <span>Дата рождения *</span>
            <input required type="date" value={form.birthDate} onChange={e=>set('birthDate', e.target.value)}/>
          </label>
        </div>

        <label className="field">
          <span>Группа</span>
          <input value={form.group || ''} onChange={e=>set('group', e.target.value)} placeholder="Например, Футзал"/>
        </label>

        <div className="form-row">
          <label className="field">
            <span>Основная позиция *</span>
            <select value={form.position} onChange={e=>set('position', e.target.value as NewPlayerPayload['position'])}>
              {positions.map(position=><option key={position}>{position}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Дополнительная позиция</span>
            <select value={form.secondaryPosition || ''} onChange={e=>set('secondaryPosition', e.target.value as NewPlayerPayload['secondaryPosition'])}>
              <option value="">Нет</option>
              {positions.map(position=><option key={position}>{position}</option>)}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Email — необязательно</span>
          <input type="email" value={form.email || ''} onChange={e=>set('email', e.target.value)} placeholder="player@example.com"/>
        </label>

        <label className="field">
          <span>Комментарий — необязательно</span>
          <textarea value={form.comment || ''} onChange={e=>set('comment', e.target.value)} placeholder="Любая полезная информация об игроке"/>
        </label>

        <p className="field-hint">Стартовый уровень не заполняется вручную: спортивный уровень позже определяется системой по тестам.</p>

        <div className="form-actions">
          <button className="primary-button" disabled={saving}>
            {saving ? <><Save size={18}/> Сохраняю...</> : <><UserPlus size={18}/> Добавить игрока</>}
          </button>
          <Link className="secondary-button" to="/players">Отмена</Link>
        </div>

        {error && <div className="form-error">{error}</div>}
      </form>
    </>
  );
}
