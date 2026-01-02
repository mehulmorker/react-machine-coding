import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, Info, HelpCircle, Shield, Zap, Users } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

/**
 * Accordion Component
 * 
 * Features:
 * - Single or multiple panel expansion
 * - Smooth animations
 * - Icons support
 * - Disabled states
 * - Keyboard navigation
 * - Customizable styling
 */
const AccordionDemo: React.FC = () => {
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('normal');

  const accordionItems: AccordionItem[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: `Welcome to our platform! This section covers the basics of getting started. You'll learn how to set up your account, navigate the interface, and begin using our core features. We've designed this guide to be comprehensive yet easy to follow, ensuring you can quickly become productive with our tools.`
    },
    {
      id: 'account-settings',
      title: 'Account Settings',
      icon: Settings,
      content: `Manage your account preferences, including profile information, notification settings, and privacy controls. You can update your personal details, change your password, configure two-factor authentication, and customize how you receive notifications. All changes are saved automatically and take effect immediately.`
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      content: `Your security and privacy are our top priorities. Learn about our security measures, including data encryption, secure connections, and privacy controls. We follow industry best practices to protect your information and provide you with tools to control your privacy settings. This section also covers how to report security concerns.`
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      icon: Users,
      content: `Collaborate effectively with your team members using our built-in collaboration tools. Share projects, assign tasks, leave comments, and track progress in real-time. You can invite team members, set permissions, and manage workspace settings to create an optimal collaborative environment.`
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      icon: HelpCircle,
      content: `Need assistance? Our comprehensive help center is here to support you. Browse our FAQ section, submit support tickets, or contact our customer service team. We offer multiple support channels including live chat, email support, and phone assistance during business hours.`
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      icon: Info,
      disabled: true,
      content: `Explore advanced features and integrations. This section covers API access, webhook configurations, custom integrations, and advanced automation workflows. Please note that some features may require a premium subscription and additional setup.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Accordion Component</h1>
          <p className="text-gray-600">
            Expandable content panels with smooth animations and flexible configuration
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Allow Multiple Open</span>
          </label>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Animation:</span>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fast">Fast</option>
              <option value="normal">Normal</option>
              <option value="slow">Slow</option>
            </select>
          </div>
        </div>

        {/* Accordion */}
        <AccordionComponent
          items={accordionItems}
          allowMultiple={allowMultiple}
          animationSpeed={animationSpeed}
          defaultOpen={['getting-started']}
        />
      </div>
    </div>
  );
};

const AccordionComponent: React.FC<AccordionProps & { animationSpeed?: string }> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  animationSpeed = 'normal'
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item?.disabled) return;

    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isOpen = (id: string) => openItems.includes(id);

  const getAnimationClass = () => {
    switch (animationSpeed) {
      case 'fast': return 'duration-150';
      case 'slow': return 'duration-500';
      default: return 'duration-300';
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const IconComponent = item.icon;
        const itemIsOpen = isOpen(item.id);

        return (
          <div
            key={item.id}
            className={`border rounded-lg overflow-hidden transition-all ${getAnimationClass()} ${
              item.disabled ? 'opacity-50' : 'hover:border-gray-400'
            }`}
          >
            {/* Header */}
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              className={`w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors ${getAnimationClass()} ${
                item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${itemIsOpen ? 'border-b' : ''}`}
              aria-expanded={itemIsOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {IconComponent && (
                    <IconComponent className={`h-5 w-5 ${
                      item.disabled ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  )}
                  <span className={`font-medium ${
                    item.disabled ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </span>
                  {item.disabled && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {allowMultiple ? (
                    <ChevronDown className={`h-5 w-5 transition-transform ${getAnimationClass()} ${
                      itemIsOpen ? 'rotate-180' : ''
                    } ${item.disabled ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <ChevronRight className={`h-5 w-5 transition-transform ${getAnimationClass()} ${
                      itemIsOpen ? 'rotate-90' : ''
                    } ${item.disabled ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </div>
              </div>
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              className={`overflow-hidden transition-all ${getAnimationClass()} ${
                itemIsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 py-4 bg-gray-50 text-gray-700 text-sm leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Status:</strong> {openItems.length} of {items.filter(item => !item.disabled).length} panels open
          {allowMultiple ? ' (Multiple allowed)' : ' (Single mode)'}
        </div>
        {openItems.length > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            Open panels: {openItems.map(id => items.find(item => item.id === id)?.title).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionDemo; 