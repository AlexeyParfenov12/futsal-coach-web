import { CheckCircle2, Save, UserPlus } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { savePhysicalTest } from '../lib/api';
import type { AppData, PhysicalTestPayload } from '../types';

const tests = [
  { code:'F1', name:'Спринт 5 м', count:3, unit:'сек' },
  { code:'F2', name:'Спринт 15 м', count:3, unit:'сек' },
  { code:'F3-R', name:'505 — правая сторона', count:3, unit:'сек' },
  { code:'F3-L', name:'505 — левая сторона', count:3, unit:'сек' },
  { code:'F4', name:'RSA 6×30 м', count:6, unit:'сек' },
  { code:'F5', name:'FIET Peak Speed', count:1, unit:'км/ч' },
  { code:'F6', name:'Прыжок в длину', count:3, unit:'см' }
] as const;

export default function TestingPage() {
  const data = useOutletContext<AppData>();
  const activePlayers = data.players.filter(p => p.status === 'Активен');
  const [params] = useSearchParams();
  const [playerId, setPlayerId] = useState(params.get('player') || activePlayers[0]?.id || '');
  const [code, setCode] = useState<(typeof tests)[number]['code']>('F1');
  const selected = useMemo(()=>tests.find(t=>t.code===code)!,[code]);
  const [attempts, setAttempts] = useState<string[]>(['','','','','','']);
  const [rsa5m, setRsa5m] = useState<string[]>(['','','','','','']);
  const [fietDistance, setFietDistance] = useState('');
  const [type, setType] = useState<'Контрольное'|'Мониторинг'>('Контрольное');
  const [method, setMethod] = useState('Видео 240 fps');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const resetValues = () => {
    setAttempts(['','','','','','']);
    setRsa5m(['','','','','','']);
    setFietDistance('');
    setSaved(false);
    setError('');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    const payload: PhysicalTestPayload = {
      playerId,
      code,
      attempts: attempts.slice(0,selected.count).map(Number),
      testType: type,
      method,
      comment,
      ...(code==='F4' ? { rsa5m: rsa5m.filter(Boolean).map(Number) } : {}),
      ...(code==='F5' && fietDistance ? { fietDistance:Number(fietDistance) } : {})
    };

    try {
      await savePhysicalTest(payload);
      resetValues();
      setSaved(true);
      setTimeout(()=>setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось сохранить результат');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <span className="kicker">ВВОД РЕЗУЛЬТАТОВ</span>
          <h1>Физическое тестирование</h1>
          <p>Заполняй только то, что реально измерил. Остальные поля рассчитываются автоматически.</p>
        </div>
      </header>

      {activePlayers.length === 0 ? (
        <section className="panel empty-state">
          <div className="empty-icon"><UserPlus size={26}/></div>
          <h2>Сначала нужен игрок</h2>
          <p>В Futsal Coach System пока нет активных игроков. После добавления игрока он автоматически появится в форме тестирования.</p>
        </section>
      ) : (
        <form className="testing-layout" onSubmit={submit}>
          <section className="panel test-config">
            <h2>1. Выбери игрока</h2>
            <label className="field">
              <span>Игрок</span>
              <select value={playerId} onChange={e=>setPlayerId(e.target.value)}>
                {activePlayers.map(p=><option key={p.id} value={p.id}>{p.name} · {p.position}</option>)}
              </select>
            </label>

            <h2>2. Выбери тест</h2>
            <div className="test-list">
              {tests.map(t=>(
                <button type="button" onClick={()=>{setCode(t.code);resetValues();}} className={code===t.code?'test-choice active':'test-choice'} key={t.code}>
                  <b>{t.code}</b><span>{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel test-entry">
            <div className="panel-head">
              <div><span className="kicker">{selected.code}</span><h2>{selected.name}</h2></div>
              <span className="unit-pill">{selected.unit}</span>
            </div>

            <div className="attempt-grid">
              {Array.from({length:selected.count},(_,i)=>(
                <label className="field" key={i}>
                  <span>{code==='F5'?'Peak Speed':'Попытка '+(i+1)}</span>
                  <input required min="0" step="0.01" inputMode="decimal" value={attempts[i]} onChange={e=>{const a=[...attempts];a[i]=e.target.value;setAttempts(a);}} placeholder="0.00"/>
                </label>
              ))}
            </div>

            {code==='F4' && (
              <>
                <h3>Сплиты 5 м</h3>
                <div className="attempt-grid">
                  {rsa5m.map((v,i)=>(
                    <label className="field compact" key={i}>
                      <span>Спринт {i+1}</span>
                      <input min="0" step="0.01" inputMode="decimal" value={v} onChange={e=>{const a=[...rsa5m];a[i]=e.target.value;setRsa5m(a);}} placeholder="0.00"/>
                    </label>
                  ))}
                </div>
              </>
            )}

            {code==='F5' && (
              <label className="field">
                <span>Общая дистанция, м</span>
                <input min="0" step="1" inputMode="numeric" value={fietDistance} onChange={e=>setFietDistance(e.target.value)} placeholder="Например, 1260"/>
              </label>
            )}

            <div className="form-divider"/>
            <div className="form-row">
              <label className="field">
                <span>Тип</span>
                <select value={type} onChange={e=>setType(e.target.value as 'Контрольное'|'Мониторинг')}>
                  <option>Контрольное</option>
                  <option>Мониторинг</option>
                </select>
              </label>
              <label className="field">
                <span>Метод измерения</span>
                <select value={method} onChange={e=>setMethod(e.target.value)}>
                  <option>Видео 240 fps</option>
                  <option>Видео 120 fps</option>
                  <option>Фотоэлементы</option>
                  <option>Другое</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Комментарий — необязательно</span>
              <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Условия, замечания, причина переноса..."/>
            </label>

            <button className="primary-button submit" disabled={saving || !playerId}>
              <Save size={18}/>{saving?'Сохраняю...':'Сохранить результат'}
            </button>
            {saved && <div className="success"><CheckCircle2 size={18}/> Результат сохранён</div>}
            {error && <div className="error-message">{error}</div>}
          </section>
        </form>
      )}
    </>
  );
}
