const Card = ({ title, children, className = '' }) => (
  <div className={`bg-[var(--b1)] text-[var(--bc)] shadow rounded-xl p-6 ${className}`}>
    {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
    {children}
  </div>
);

export default Card ;