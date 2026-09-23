import type { LucideIcon } from 'lucide-react';

export function MetricCard({ title, value, detail, icon: Icon }: {
  title: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon"><Icon size={20}/></div>
      <div>
        <span className="eyebrow">{title}</span>
        <strong className="metric-value">{value}</strong>
        {detail && <span className="muted">{detail}</span>}
      </div>
    </article>
  );
}
