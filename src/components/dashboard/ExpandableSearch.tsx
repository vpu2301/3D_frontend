
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ExpandableSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCollapse();
    }
  };

  return (
    <div className="flex items-center">
      {!isExpanded ? (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleExpand}
          className="text-gray-600 hover:text-gray-900"
        >
          <Search className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center space-x-2 animate-in slide-in-from-right-2 duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-64 pl-10 pr-4 h-9"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCollapse}
            className="text-gray-600 hover:text-gray-900 h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableSearch;
