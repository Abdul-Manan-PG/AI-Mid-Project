import Head from 'next/head';
import SlidingPuzzle from '@/app/components/SlidingPuzzle'; // Adjust this path based on where you saved the component

export default function Home() {
  const teamMembers = [
    { name: "Ali Husnain", role: "Developer" },
    { name: "Abdul Hanan", role: "Developer" },
    { name: "Saif", role: "Developer" },
    { name: "Abdul Manan", role: "Full-Stack Developer" }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-blue-500/30">
      <Head>
        <title>AI Sliding Puzzle | Graph Search Solver</title>
        <meta name="description" content="AI-powered sliding puzzle solver using A* and other graph search algorithms." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        
        {/* --- Project Introduction Section --- */}
        <section className="text-center max-w-3xl mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400">
            Intelligent Puzzle Solver
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            An interactive exploration of artificial intelligence and graph search algorithms. 
            Upload an image, shuffle the board, and watch as algorithms like A* (A-Star) navigate 
            thousands of potential states to calculate the most optimal solution path in milliseconds.
          </p>
        </section>

        {/* --- Team Members Section --- */}
        <section className="w-full max-w-4xl mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-300 border-b border-gray-800 pb-4">
            Project Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                  <span className="text-xl font-bold text-gray-300">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-200">{member.name}</h3>
                <p className="text-xs text-blue-400 mt-1 uppercase tracking-wider font-medium">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

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