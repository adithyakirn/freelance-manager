export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Override the parent layout - render only children without sidebar wrapper */}
      {children}
    </div>
  );
}
