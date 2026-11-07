interface ISectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Section = ({ children, className = "" }: ISectionProps) => {
  return (
    <div className={`card bg-base-100 shadow-md ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  );
};
