import dynamic from 'next/dynamic';

const DynamicTrekMap = dynamic(() => import('@/components/TrekMap'), {
  ssr: false,
  loading: () => <p className="text-center">Loading map...</p>
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-center">Langtang Trek Map</h1>
      <div className="w-full max-w-4xl h-[400px] md:h-[600px]">
        <DynamicTrekMap />
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Click on markers to see details. Main destinations are in blue, sub-destinations in orange.
      </p>
    </main>
  );
}