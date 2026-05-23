import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

type Props = {
  title: string;
  themeClass: string;
  children: ReactNode;
};

export default function DashboardLayout({ title, themeClass, children }: Props) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.layout} ${themeClass}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <button type="button" className={styles.back} onClick={() => navigate('/')}>
          ← Home
        </button>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.card} ${className}`}>
      <h2>{title}</h2>
      {subtitle && <p className="sub">{subtitle}</p>}
      {children}
    </section>
  );
}
