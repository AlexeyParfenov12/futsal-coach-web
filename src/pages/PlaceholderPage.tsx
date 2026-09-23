export default function PlaceholderPage({ title, text }: { title: string; text: string }) {
  return (
    <>
      <header className="page-header">
        <div><span className="kicker">FUTSAL COACH</span><h1>{title}</h1><p>{text}</p></div>
      </header>
      <section className="panel empty-state">
        <h2>Раздел подготовлен</h2>
        <p>Функциональность будет подключаться к существующим листам Futsal Coach System по мере переноса.</p>
      </section>
    </>
  );
}
