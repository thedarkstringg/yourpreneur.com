export default function ChronicleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-6 relative z-10 flex flex-col h-full">
      {children}
    </div>
  );
}
