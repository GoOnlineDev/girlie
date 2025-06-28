interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <svg 
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md"
          placeholder="Search products..."
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Clear button when there's text */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
