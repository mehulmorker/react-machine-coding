import React, { useState, useEffect } from 'react';
import { Table, Search, Filter, Download, ChevronUp, ChevronDown, Database } from 'lucide-react';

interface TableRow {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  performance: number;
}

const LazyDataTable: React.FC = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof TableRow>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Simulate loading heavy data
  useEffect(() => {
    const timer = setTimeout(() => {
      const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design', 'Operations'];
      const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
      
      const mockData: TableRow[] = Array.from({ length: 100 }, (_, i) => ({
        id: `emp-${i + 1}`,
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@company.com`,
        department: departments[i % departments.length],
        salary: Math.floor(Math.random() * 100000) + 40000,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split('T')[0],
        status: statuses[i % statuses.length],
        performance: Math.floor(Math.random() * 40) + 60
      }));
      
      setData(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    }, 800); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  // Filter data based on search term
  useEffect(() => {
    const filtered = data.filter(row =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // Sort data
  const handleSort = (field: keyof TableRow) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredData(sorted);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Database className="w-8 h-8 animate-pulse text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Table className="w-6 h-6 text-purple-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Employee Data Table</h3>
            <p className="text-sm text-gray-600">Comprehensive employee management system</p>
          </div>
        </div>
        <button className="flex items-center px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
          <Download className="w-4 h-4 mr-1" />
          Export
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} employees
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {[
                { field: 'name' as keyof TableRow, label: 'Name' },
                { field: 'email' as keyof TableRow, label: 'Email' },
                { field: 'department' as keyof TableRow, label: 'Department' },
                { field: 'salary' as keyof TableRow, label: 'Salary' },
                { field: 'joinDate' as keyof TableRow, label: 'Join Date' },
                { field: 'status' as keyof TableRow, label: 'Status' },
                { field: 'performance' as keyof TableRow, label: 'Performance' }
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {label}
                    {sortField === field && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="w-4 h-4 ml-1" />
                        : <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{row.name}</div>
                  <div className="text-sm text-gray-500">{row.id}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {row.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {row.department}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${row.salary.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {new Date(row.joinDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`text-sm font-medium ${getPerformanceColor(row.performance)}`}>
                      {row.performance}%
                    </div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          row.performance >= 90 ? 'bg-green-500' :
                          row.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${row.performance}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{data.length}</div>
          <div className="text-sm text-gray-600">Total Employees</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.filter(emp => emp.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            ${Math.round(data.reduce((sum, emp) => sum + emp.salary, 0) / data.length).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Avg Salary</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(data.reduce((sum, emp) => sum + emp.performance, 0) / data.length)}%
          </div>
          <div className="text-sm text-gray-600">Avg Performance</div>
        </div>
      </div>
    </div>
  );
};

export default LazyDataTable; 