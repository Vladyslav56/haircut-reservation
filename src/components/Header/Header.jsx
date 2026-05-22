export default function Header() {
  return (
    <header className="bg-[#141414] border-b border-[#2a2a2a] mb-8 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black text-sm">✂️</span>
          </div>
          <h1 className="font-bold text-lg tracking-tight">Premium Heircut</h1>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] hover:border-gray-500 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 group-hover:text-white transition-colors"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
            Instagram
          </span>
        </a>
      </div>
    </header>
  )
}
