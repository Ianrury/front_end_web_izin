import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

const SearchFilter = ({ onSearchChange, onFilterChange, searchPlaceholder = "Cari...", filterOptions = [], defaultFilter = "all", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState(defaultFilter);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange]);

  const handleFilterChange = (value) => {
    setFilterValue(value);
    onFilterChange(value);
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {filterOptions.length > 0 && (
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterValue}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px] transition-all duration-200"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
