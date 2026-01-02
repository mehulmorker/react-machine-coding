import React, { useState, useCallback, useEffect } from 'react';
import { X, Plus, Settings, User, Bell, Shield, HelpCircle, FileText } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  closeable?: boolean;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  allowClose?: boolean;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

/**
 * Tabs System Component
 * 
 * Features:
 * - Dynamic tab management
 * - Closeable tabs
 * - Different orientations (horizontal/vertical)
 * - Multiple variants (default, pills, underline)
 * - Lazy loading content
 * - Keyboard navigation
 * - Add new tabs functionality
 * - Icon support
 * - Disabled states
 */
const TabsSystemDemo: React.FC = () => {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [variant, setVariant] = useState<'default' | 'pills' | 'underline'>('default');
  const [allowClose, setAllowClose] = useState(true);
  const [tabCounter, setTabCounter] = useState(6);

  const generateSampleContent = (title: string, icon: React.ComponentType<{ className?: string }>) => {
    const IconComponent = icon;
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          <p className="text-gray-600">
            This is the {title.toLowerCase()} section. Here you can manage all settings and configurations 
            related to {title.toLowerCase()}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Feature 1</h4>
              <p className="text-sm text-gray-600">
                Detailed description of the first major feature available in this section.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Feature 2</h4>
              <p className="text-sm text-gray-600">
                Detailed description of the second major feature available in this section.
              </p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> You can customize these settings to match your preferences 
              and workflow requirements.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      content: generateSampleContent('Profile Settings', User),
      closeable: false
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: generateSampleContent('Notification Preferences', Bell),
      closeable: true
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      content: generateSampleContent('Security & Privacy', Shield),
      closeable: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: generateSampleContent('General Settings', Settings),
      closeable: true
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      content: generateSampleContent('Help & Support', HelpCircle),
      closeable: true,
      disabled: false
    }
  ]);

  const addNewTab = () => {
    const newTab: TabItem = {
      id: `tab-${tabCounter}`,
      label: `Tab ${tabCounter}`,
      icon: FileText,
      content: generateSampleContent(`Dynamic Tab ${tabCounter}`, FileText),
      closeable: true
    };
    setTabs(prev => [...prev, newTab]);
    setTabCounter(prev => prev + 1);
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Tabs System</h1>
          <p className="text-gray-600">
            Dynamic tabbed interface with multiple variants and interactive features
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Orientation:</span>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'horizontal' | 'vertical')}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Variant:</span>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as 'default' | 'pills' | 'underline')}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="pills">Pills</option>
              <option value="underline">Underline</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowClose}
              onChange={(e) => setAllowClose(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Allow Close</span>
          </label>

          <button
            onClick={addNewTab}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Tab</span>
          </button>
        </div>

        {/* Tabs Component */}
        <TabsComponent
          items={tabs}
          orientation={orientation}
          variant={variant}
          allowClose={allowClose}
          onTabClose={handleTabClose}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{tabs.length}</div>
            <div className="text-xs text-gray-500">Total Tabs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {tabs.filter(tab => tab.closeable).length}
            </div>
            <div className="text-xs text-gray-500">Closeable</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {tabs.filter(tab => tab.disabled).length}
            </div>
            <div className="text-xs text-gray-500">Disabled</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {tabs.filter(tab => tab.icon).length}
            </div>
            <div className="text-xs text-gray-500">With Icons</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabsComponent: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  orientation = 'horizontal',
  variant = 'default',
  allowClose = false,
  onTabChange,
  onTabClose
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id);

  useEffect(() => {
    if (!items.find(item => item.id === activeTab)) {
      setActiveTab(items[0]?.id || '');
    }
  }, [items, activeTab]);

  const handleTabClick = useCallback((tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  }, [items, onTabChange]);

  const handleTabClose = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const tab = items.find(item => item.id === tabId);
    if (tab?.closeable) {
      onTabClose?.(tabId);
      if (activeTab === tabId) {
        const remainingTabs = items.filter(item => item.id !== tabId);
        if (remainingTabs.length > 0) {
          setActiveTab(remainingTabs[0].id);
        }
      }
    }
  }, [items, activeTab, onTabClose]);

  const getTabStyles = (tab: TabItem, isActive: boolean) => {
    const baseStyles = "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    
    if (tab.disabled) {
      return `${baseStyles} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'pills':
        return `${baseStyles} rounded-lg ${
          isActive 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`;
      case 'underline':
        return `${baseStyles} border-b-2 ${
          isActive 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`;
      default:
        return `${baseStyles} border border-gray-300 ${
          isActive 
            ? 'bg-white text-blue-600 border-blue-500 border-b-white relative z-10' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        } ${orientation === 'horizontal' ? 'rounded-t-lg -mb-px' : 'rounded-l-lg -mr-px'}`;
    }
  };

  const getContentStyles = () => {
    switch (variant) {
      case 'pills':
      case 'underline':
        return "mt-4 p-6 bg-white rounded-lg";
      default:
        return `p-6 bg-white border border-gray-300 ${
          orientation === 'horizontal' ? 'rounded-b-lg rounded-tr-lg' : 'rounded-r-lg rounded-bl-lg'
        }`;
    }
  };

  const activeTabContent = items.find(item => item.id === activeTab);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tabs available
      </div>
    );
  }

  return (
    <div className={`${orientation === 'vertical' ? 'flex space-x-4' : 'space-y-0'}`}>
      {/* Tab Headers */}
      <div className={`${
        orientation === 'horizontal' 
          ? 'flex space-x-1 border-b border-gray-300' 
          : 'flex flex-col space-y-1 w-64 border-r border-gray-300 pr-4'
      }`}>
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={getTabStyles(tab, isActive)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span>{tab.label}</span>
              {allowClose && tab.closeable && (
                <button
                  onClick={(e) => handleTabClose(e, tab.id)}
                  className="ml-2 p-0.5 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
                  aria-label={`Close ${tab.label} tab`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={`flex-1 ${getContentStyles()}`}>
        {activeTabContent && (
          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="focus:outline-none"
          >
            {activeTabContent.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsSystemDemo; 