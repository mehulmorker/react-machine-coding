import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Star,
  Layers,
  Image,
  List,
  ToggleLeft,
  MessageCircle,
  Grid3X3,
  Bell,
  Square,
  ChevronDown,
  Calendar,
  Upload,
  Search,
  BarChart3,
  Palette,
  Power
} from 'lucide-react';

interface UIComponent {
  title: string;
  description: string;
  path: string;
  status: 'completed' | 'coming-soon';
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const UIWidgets: React.FC = () => {
  const uiComponents: UIComponent[] = [
    {
      title: 'Counter App',
      description: 'Interactive counter with step controls, keyboard shortcuts, and statistics tracking',
      path: '/counter',
      status: 'completed',
      icon: ToggleLeft,
      features: ['Increment/Decrement', 'Custom Step Values', 'Keyboard Shortcuts', 'Statistics']
    },
    {
      title: 'Todo List',
      description: 'Complete task management with CRUD operations, priorities, and filtering',
      path: '/todo-list',
      status: 'completed',
      icon: List,
      features: ['CRUD Operations', 'Priority Levels', 'Filtering & Sorting', 'Local Storage']
    },
    {
      title: 'Accordion',
      description: 'Expandable content panels with smooth animations and flexible configuration',
      path: '/accordion',
      status: 'completed',
      icon: Layers,
      features: ['Single/Multi Expand', 'Smooth Animations', 'Keyboard Navigation', 'Icons Support']
    },
    {
      title: 'Tabs System',
      description: 'Dynamic tabbed interface with closeable tabs and multiple orientations',
      path: '/tabs',
      status: 'completed',
      icon: Grid3X3,
      features: ['Dynamic Tabs', 'Closeable Tabs', 'Multiple Orientations', 'Three Variants']
    },
    {
      title: 'Image Carousel',
      description: 'Interactive carousel with auto-play, thumbnails, zoom, and touch support',
      path: '/carousel',
      status: 'completed',
      icon: Image,
      features: ['Auto-play Control', 'Thumbnail Navigation', 'Zoom & Rotation', 'Touch Support']
    },
    {
      title: 'Pagination',
      description: 'Comprehensive pagination with page size control and jump navigation',
      path: '/pagination',
      status: 'completed',
      icon: ArrowRight,
      features: ['Page Size Control', 'Jump Navigation', 'Multiple Variants', 'Responsive Design']
    },
    {
      title: 'Star Rating',
      description: 'Interactive star rating with half-star support and hover effects',
      path: '/star-rating',
      status: 'completed',
      icon: Star,
      features: ['Half-star Support', 'Hover Effects', 'Multiple Sizes', 'Custom Colors']
    },
    {
      title: 'Tooltip',
      description: 'Contextual tooltips with multiple positions and trigger options',
      path: '/tooltip',
      status: 'completed',
      icon: MessageCircle,
      features: ['Multiple Positions', 'Hover/Click Triggers', 'Custom Styling', 'Animation']
    },
    {
      title: 'Toast Notification',
      description: 'Non-blocking notifications with multiple types and positioning',
      path: '/toast',
      status: 'completed',
      icon: Bell,
      features: ['Multiple Types', 'Auto Dismiss', 'Position Control', 'Action Buttons']
    },
    {
      title: 'Modal Dialog',
      description: 'Overlay dialogs with backdrop, animations, and accessibility features',
      path: '/modal',
      status: 'completed',
      icon: Square,
      features: ['Backdrop Control', 'Animations', 'Accessibility', 'Multiple Sizes']
    },
    {
      title: 'Dropdown Menu',
      description: 'Versatile dropdown menus with search, multi-select, nested options, and keyboard navigation',
      path: '/dropdown',
      status: 'completed',
      icon: ChevronDown,
      features: ['Multi-select Support', 'Nested Options', 'Search Filter', 'Keyboard Navigation']
    },
    {
      title: 'Date Picker',
      description: 'Flexible date selection with calendar view, range selection, and multiple formats',
      path: '/date-picker',
      status: 'completed',
      icon: Calendar,
      features: ['Single/Range/Multi Selection', 'Calendar View', 'Time Support', 'Format Options']
    },
    {
      title: 'File Upload',
      description: 'Drag & drop file upload with progress tracking, validation, and preview',
      path: '/file-upload',
      status: 'completed',
      icon: Upload,
      features: ['Drag & Drop', 'Progress Tracking', 'File Validation', 'Preview Support']
    },
    {
      title: 'Search Autocomplete',
      description: 'Intelligent search with suggestions, categories, and keyboard navigation',
      path: '/search-autocomplete',
      status: 'completed',
      icon: Search,
      features: ['Real-time Suggestions', 'Category Grouping', 'Keyboard Navigation', 'Debounced Search']
    },
    {
      title: 'Progress Indicator',
      description: 'Progress bars with linear, circular, and step-based variants',
      path: '/progress-indicator',
      status: 'completed',
      icon: BarChart3,
      features: ['Linear/Circular/Steps', 'Multiple Sizes', 'Animated Variants', 'Custom Labels']
    },
    {
      title: 'Color Picker',
      description: 'Comprehensive color selection with multiple formats and alpha support',
      path: '/color-picker',
      status: 'completed',
      icon: Palette,
      features: ['HSV Color Space', 'Multiple Formats', 'Alpha Support', 'Preset Colors']
    },
    {
      title: 'Toggle Switch',
      description: 'Boolean input controls with multiple variants, sizes, and loading states',
      path: '/toggle-switch',
      status: 'completed',
      icon: Power,
      features: ['Multiple Variants', 'Icon Support', 'Loading States', 'Custom Animations']
    }
  ];

  const completedComponents = uiComponents.filter(c => c.status === 'completed');
  const upcomingComponents = uiComponents.filter(c => c.status === 'coming-soon');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">UI Widgets & Core Components</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential UI building blocks for modern React applications
          </p>
          
          {/* Progress Stats */}
          <div className="flex justify-center space-x-8 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedComponents.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{upcomingComponents.length}</div>
              <div className="text-sm text-gray-600">Coming Soon</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{Math.round((completedComponents.length / uiComponents.length) * 100)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </div>

        {/* Completed Components */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Completed Components</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <Link
                  key={index}
                  to={component.path}
                  className="group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {component.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {component.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Features
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {component.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-green-600 font-medium">Ready to explore</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Components */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border opacity-75"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {component.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {component.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Planned Features
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {component.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-orange-600 font-medium">In development</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {completedComponents.map((component) => (
              <Link
                key={component.path}
                to={component.path}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-center"
              >
                <component.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{component.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIWidgets; 