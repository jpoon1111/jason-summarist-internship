export default function ChoosePlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col transition-all duration-300">
      {/* no sidebar — choose-plan is a standalone full-width page */}
      {children}
    </div>
  );
}