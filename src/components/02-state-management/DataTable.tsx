import React, { useState, useMemo, useCallback } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  Download, 
  Upload,
  CheckSquare,
  Square,
  MoreVertical,
  ArrowUpDown,
  Eye,
  Copy
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  location: string;
  manager: string;
}

interface Column {
  key: keyof Employee;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, record: Employee) => React.ReactNode;
}

interface SortConfig {
  key: keyof Employee | null;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  [key: string]: string;
}

const DataTable: React.FC = () => {
  // Sample data
  const [data, setData] = useState<Employee[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      joinDate: '2022-01-15',
      status: 'active',
      location: 'New York',
      manager: 'Sarah Wilson'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      salary: 78000,
      joinDate: '2021-03-22',
      status: 'active',
      location: 'Los Angeles',
      manager: 'Mike Johnson'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      department: 'Engineering',
      position: 'Frontend Developer',
      salary: 72000,
      joinDate: '2023-06-10',
      status: 'on-leave',
      location: 'Chicago',
      manager: 'Sarah Wilson'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      department: 'HR',
      position: 'HR Specialist',
      salary: 58000,
      joinDate: '2020-11-08',
      status: 'active',
      location: 'Houston',
      manager: 'David Lee'
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@company.com',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 65000,
      joinDate: '2022-09-12',
      status: 'inactive',
      location: 'Miami',
      manager: 'Lisa Chen'
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana.prince@company.com',
      department: 'Engineering',
      position: 'Backend Developer',
      salary: 88000,
      joinDate: '2021-12-03',
      status: 'active',
      location: 'Seattle',
      manager: 'Sarah Wilson'
    },
    {
      id: 7,
      name: 'Frank Miller',
      email: 'frank.miller@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 71000,
      joinDate: '2023-02-28',
      status: 'active',
      location: 'Boston',
      manager: 'Robert Kim'
    },
    {
      id: 8,
      name: 'Grace Lee',
      email: 'grace.lee@company.com',
      department: 'Marketing',
      position: 'Content Creator',
      salary: 55000,
      joinDate: '2023-08-15',
      status: 'active',
      location: 'Austin',
      manager: 'Mike Johnson'
    }
  ]);

  // State management
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Employee>>({});

  // Column configuration
  const columns: Column[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterable: true,
      width: '200px'
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      filterable: true,
      width: '250px'
    },
    {
      key: 'department',
      title: 'Department',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Engineering' ? 'bg-blue-100 text-blue-800' :
          value === 'Marketing' ? 'bg-green-100 text-green-800' :
          value === 'HR' ? 'bg-purple-100 text-purple-800' :
          value === 'Sales' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'position',
      title: 'Position',
      sortable: true,
      width: '180px'
    },
    {
      key: 'salary',
      title: 'Salary',
      sortable: true,
      width: '120px',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'location',
      title: 'Location',
      sortable: true,
      filterable: true,
      width: '120px'
    }
  ];

  // Sorting logic
  const handleSort = useCallback((key: keyof Employee) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Filtering logic
  const handleFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Row selection
  const handleRowSelect = useCallback((id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = filteredAndSortedData.map(item => item.id);
    setSelectedRows(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  }, []);

  // CRUD operations
  const handleEdit = useCallback((employee: Employee) => {
    setEditingId(employee.id);
    setEditForm(employee);
  }, []);

  const handleSave = useCallback(() => {
    if (editingId && editForm) {
      setData(prev => prev.map(item => 
        item.id === editingId ? { ...item, ...editForm } as Employee : item
      ));
      setEditingId(null);
      setEditForm({});
    }
  }, [editingId, editForm]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditForm({});
  }, []);

  const handleDelete = useCallback((id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));
  }, []);

  const handleBulkDelete = useCallback(() => {
    setData(prev => prev.filter(item => !selectedRows.includes(item.id)));
    setSelectedRows([]);
  }, [selectedRows]);

  // Data processing
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item =>
          item[key as keyof Employee].toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  // Get unique values for filters
  const getUniqueValues = useCallback((key: keyof Employee) => {
    return Array.from(new Set(data.map(item => item[key]))).sort();
  }, [data]);

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Data Table</h1>
        <p className="text-gray-600">
          Comprehensive data table with sorting, filtering, pagination, and CRUD operations
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 space-y-4">
        {/* Search and Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            {(Object.keys(filters).length > 0 || searchTerm) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {selectedRows.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedRows.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {columns.filter(col => col.filterable).map(column => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.title}
                  </label>
                  <select
                    value={filters[column.key] || ''}
                    onChange={(e) => handleFilter(column.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All {column.title}</option>
                    {getUniqueValues(column.key).map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {selectedRows.length === filteredAndSortedData.length ? 
                    <CheckSquare className="w-4 h-4" /> : 
                    <Square className="w-4 h-4" />
                  }
                </button>
              </th>
              {columns.map(column => (
                <th 
                  key={column.key}
                  style={{ width: column.width }}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-24 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map(employee => (
              <tr 
                key={employee.id}
                className={`hover:bg-gray-50 ${selectedRows.includes(employee.id) ? 'bg-blue-50' : ''}`}
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRowSelect(employee.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedRows.includes(employee.id) ? 
                      <CheckSquare className="w-4 h-4 text-blue-600" /> : 
                      <Square className="w-4 h-4" />
                    }
                  </button>
                </td>
                {columns.map(column => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {editingId === employee.id && ['name', 'email', 'position', 'salary'].includes(column.key) ? (
                      <input
                        type={column.key === 'salary' ? 'number' : 'text'}
                        value={editForm[column.key] || ''}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          [column.key]: column.key === 'salary' ? Number(e.target.value) : e.target.value
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      column.render ? column.render(employee[column.key], employee) : employee[column.key]
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right text-sm">
                  {editingId === employee.id ? (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.length}</div>
          <div className="text-blue-600">Total Employees</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {data.filter(e => e.status === 'active').length}
          </div>
          <div className="text-green-600">Active</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {data.filter(e => e.status === 'on-leave').length}
          </div>
          <div className="text-yellow-600">On Leave</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {data.filter(e => e.status === 'inactive').length}
          </div>
          <div className="text-red-600">Inactive</div>
        </div>
      </div>
    </div>
  );
};

export default DataTable; 