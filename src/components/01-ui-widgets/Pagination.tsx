import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showPageSizeSelector?: boolean;
  showJumpToPage?: boolean;
  showPageInfo?: boolean;
  maxVisiblePages?: number;
  variant?: 'default' | 'simple' | 'compact';
  disabled?: boolean;
}

/**
 * Pagination Component
 * 
 * Features:
 * - Page size control
 * - Jump to specific page
 * - Responsive design
 * - Multiple variants (default, simple, compact)
 * - First/Last page navigation
 * - Page range display
 * - Disabled states
 * - Keyboard navigation
 * - Customizable visible page numbers
 */
const PaginationDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems] = useState(247); // Fixed total for demo
  const [variant, setVariant] = useState<'default' | 'simple' | 'compact'>('default');
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showJumpToPage, setShowJumpToPage] = useState(true);
  const [showPageInfo, setShowPageInfo] = useState(true);
  const [maxVisiblePages, setMaxVisiblePages] = useState(5);

  // Generate sample data for demonstration
  const sampleData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    return Array.from({ length: endIndex - startIndex }, (_, index) => ({
      id: startIndex + index + 1,
      name: `Item ${startIndex + index + 1}`,
      description: `This is a sample item for pagination demonstration`,
      category: ['Technology', 'Design', 'Business', 'Science'][Math.floor(Math.random() * 4)]
    }));
  }, [currentPage, itemsPerPage, totalItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Pagination Component</h1>
          <p className="text-gray-600">
            Comprehensive pagination with page size control and jump navigation
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Variant:</span>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as 'default' | 'simple' | 'compact')}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="simple">Simple</option>
              <option value="compact">Compact</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Max Pages:</span>
            <select
              value={maxVisiblePages}
              onChange={(e) => setMaxVisiblePages(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={10}>10</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPageSizeSelector}
              onChange={(e) => setShowPageSizeSelector(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Page Size Selector</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showJumpToPage}
              onChange={(e) => setShowJumpToPage(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Jump to Page</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPageInfo}
              onChange={(e) => setShowPageInfo(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Page Info</span>
          </label>
        </div>

        {/* Sample Data Display */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Sample Data ({totalItems} items)</h2>
          <div className="grid gap-3">
            {sampleData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showPageSizeSelector={showPageSizeSelector}
          showJumpToPage={showJumpToPage}
          showPageInfo={showPageInfo}
          maxVisiblePages={maxVisiblePages}
          variant={variant}
        />
      </div>
    </div>
  );
};

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showPageSizeSelector = true,
  showJumpToPage = true,
  showPageInfo = true,
  maxVisiblePages = 5,
  variant = 'default',
  disabled = false
}) => {
  const [jumpToPageValue, setJumpToPageValue] = useState('');

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate visible page numbers
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPageValue);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPageValue('');
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    onItemsPerPageChange?.(newSize);
  };

  if (totalPages <= 1 && variant !== 'default') {
    return null;
  }

  const buttonClass = (isActive: boolean = false, isDisabled: boolean = false) => {
    const baseClass = "px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    
    if (isDisabled) {
      return `${baseClass} text-gray-400 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'simple':
        return `${baseClass} text-gray-700 hover:text-gray-900 ${isActive ? 'text-blue-600 font-semibold' : ''}`;
      case 'compact':
        return `${baseClass} text-gray-600 hover:text-gray-800 ${isActive ? 'text-blue-600 bg-blue-50' : ''}`;
      default:
        return `${baseClass} border rounded-md ${
          isActive 
            ? 'bg-blue-500 text-white border-blue-500' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Info */}
      {showPageInfo && (
        <div className="text-sm text-gray-600 text-center">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}

      {/* Main Pagination */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-1">
          {/* First Page Button (for default variant) */}
          {variant === 'default' && totalPages > maxVisiblePages && (
            <button
              onClick={() => onPageChange(1)}
              disabled={disabled || currentPage === 1}
              className={buttonClass(false, disabled || currentPage === 1)}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}

          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className={buttonClass(false, disabled || currentPage === 1)}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          {variant !== 'compact' && getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  disabled={disabled}
                  className={buttonClass(page === currentPage, disabled)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Current Page Display (for compact variant) */}
          {variant === 'compact' && (
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              {currentPage} of {totalPages}
            </span>
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className={buttonClass(false, disabled || currentPage === totalPages)}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last Page Button (for default variant) */}
          {variant === 'default' && totalPages > maxVisiblePages && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={disabled || currentPage === totalPages}
              className={buttonClass(false, disabled || currentPage === totalPages)}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Page Size Selector */}
        {showPageSizeSelector && onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              disabled={disabled}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {[5, 10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        )}

        {/* Jump to Page */}
        {showJumpToPage && (
          <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPageValue}
              onChange={(e) => setJumpToPageValue(e.target.value)}
              placeholder="Page"
              disabled={disabled}
              className="w-20 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={disabled || !jumpToPageValue}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Go
            </button>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-center">
        <div>
          <div className="text-lg font-semibold text-gray-900">{currentPage}</div>
          <div className="text-xs text-gray-500">Current Page</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{totalPages}</div>
          <div className="text-xs text-gray-500">Total Pages</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{itemsPerPage}</div>
          <div className="text-xs text-gray-500">Per Page</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900">{totalItems}</div>
          <div className="text-xs text-gray-500">Total Items</div>
        </div>
      </div>
    </div>
  );
};

export default PaginationDemo; 