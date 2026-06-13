'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-white text-[#0c0a0a] flex items-center justify-center font-display font-black text-xl mb-4 mx-auto">
          Y
        </div>
        <h1 className="text-2xl font-display font-bold text-white">yourpreneur canvas</h1>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-[#111111] border border-white/8 rounded-2xl p-10 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
