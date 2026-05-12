import Head from 'next/head';
import SlidingPuzzle from '@/app/components/SlidingPuzzle'; // Adjust this path based on where you saved the component

export default function Home() {
  const teamMembers = [
    { name: "Ali Husnain"},
    { name: "Abdul Hanan"},
    { name: "Saif"},
    { name: "Abdul Manan" }
  ];

  return (
    <div className="min-h-screen align-middle bg-gray-950 text-gray-200 font-sans selection:bg-blue-500/30">
      <Head>
        <title>AI Sliding Puzzle | Graph Search Solver</title>
        <meta name="description" content="AI-powered sliding puzzle solver using A* and other graph search algorithms." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">

        {/* --- Game Component Section --- */}
        <section className="w-full flex justify-center border-t border-gray-800/50 pt-16">
          {/* We wrap it in a div to ensure the component scales nicely on this page */}
          <div className="w-full max-w-5xl bg-gray-900/30 rounded-3xl border border-gray-800/50 p-4 md:p-8 backdrop-blur-sm shadow-2xl">
            <SlidingPuzzle />
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="w-full py-6 text-center text-gray-600 text-sm border-t border-gray-900 mt-20">
        <p>Built with Next.js, Tailwind CSS, and FastAPI.</p>
      </footer>
    </div>
  );
}