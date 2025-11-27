'use client';

export default function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] mix-blend-overlay hidden md:block">
      <div 
        className="absolute inset-0 bg-repeat w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

