import { useState, useRef, useEffect } from 'react';
import { Check, Plus } from 'lucide-react';

interface ComboBoxProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ComboBox({
  name,
  value,
  onChange,
  options,
  placeholder = 'Type to search or add new...',
  label,
  required = false,
  className = ''
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Filter options based on input
    const filtered = options.filter(option =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    setFilteredOptions(options);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && filteredOptions.length === 0) {
      e.preventDefault();
      handleCreateNew();
    }
  };

  const showCreateOption = inputValue.trim() && 
    !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase()) &&
    filteredOptions.length === 0;

  // Sort options by usage frequency (simulated - in production this would be from database)
  const sortedOptions = [...filteredOptions].sort((a, b) => {
    // Most common options first (simulated)
    const popularOptions = ['World War II', 'Vietnam War', 'Korean War', 'Iraq War', 'Afghanistan War', 
                           'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard',
                           'United States', 'United Kingdom', 'Germany', 'France', 'Canada'];
    const aIndex = popularOptions.indexOf(a);
    const bIndex = popularOptions.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-neutral-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors ${className}`}
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {sortedOptions.length > 0 ? (
            <div className="py-1">
              <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-200">
                {sortedOptions.length === options.length ? 'Popular options' : `${sortedOptions.length} match${sortedOptions.length !== 1 ? 'es' : ''}`}
              </div>
              {sortedOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 flex items-center justify-between group transition-colors"
                >
                  <span className="text-black">{option}</span>
                  {value === option && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          ) : showCreateOption ? (
            <button
              type="button"
              onClick={handleCreateNew}
              className="w-full px-4 py-2.5 text-left hover:bg-green-50 flex items-center gap-2 transition-colors text-black"
            >
              <Plus className="w-4 h-4 text-green-600" />
              <span>Create new: <strong>"{inputValue}"</strong></span>
            </button>
          ) : (
            <div className="px-4 py-3 text-sm text-neutral-500 text-center">
              No matches found. Keep typing to create new entry.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
