import './Steps.css';

interface Step {
  label: string;
  icon: 'user' | 'card' | 'payment';
}

interface Props {
  steps: Step[];
  current: number;
}

const icons: Record<Step['icon'], React.ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 11h20" />
    </>
  ),
  payment: (
    <>
      <rect x="3" y="7" width="14" height="11" rx="2" />
      <path d="M17 11h3l1 3v4h-4" />
      <circle cx="8" cy="18" r="1.5" />
    </>
  ),
};

const Steps = ({ steps, current }: Props) => (
  <div className="steps">
    {steps.map((step, i) => {
      const state = i === current ? 'active' : i < current ? 'done' : 'todo';

      return (
        <div key={step.label} style={{ display: 'contents' }}>
          {i > 0 && (
            <span className={`steps__line${i <= current ? ' steps__line--done' : ''}`} />
          )}
          <div className={`steps__item${state !== 'todo' ? ` steps__item--${state}` : ''}`}>
            <svg
              className="steps__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {icons[step.icon]}
            </svg>
            <span>{step.label}</span>
          </div>
        </div>
      );
    })}
  </div>
);

export default Steps;