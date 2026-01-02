import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Sun,
  Moon,
  Settings,
  Palette,
  Globe,
  Bell
} from 'lucide-react';

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// User Preferences Context
interface UserPreferences {
  language: string;
  notifications: boolean;
  fontSize: number;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    notifications: true,
    fontSize: 16
  });

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom Hooks for using contexts
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors ${
        theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'
      }`}
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-300" />
      )}
    </button>
  );
};

// User Preferences Component
const UserPreferencesPanel: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Language</span>
        </div>
        <select
          value={preferences.language}
          onChange={(e) => updatePreferences({ language: e.target.value })}
          className="px-3 py-1 border rounded"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={(e) => updatePreferences({ notifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Font Size</span>
        </div>
        <input
          type="range"
          min="12"
          max="24"
          value={preferences.fontSize}
          onChange={(e) => updatePreferences({ fontSize: Number(e.target.value) })}
          className="w-32"
        />
        <span className="w-8 text-right">{preferences.fontSize}px</span>
      </div>
    </div>
  );
};

const ContextAPIDemo: React.FC = () => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Context API Demo</h1>
              <p className="text-lg text-gray-600">
                Explore React's Context API for global state management
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Theme Demo */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                Theme Context
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Toggle between light and dark theme</p>
                <ThemeToggle />
              </div>
            </div>

            {/* User Preferences Demo */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-500" />
                User Preferences Context
              </h2>
              <UserPreferencesPanel />
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Context API Documentation</h2>
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What is Context API?</h3>
                <p className="text-gray-600 mb-4">
                  Context provides a way to pass data through the component tree without having to pass props manually at every level. It's designed to share data that can be considered "global" for a tree of React components.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>Avoids prop drilling</li>
                  <li>Simplifies state management</li>
                  <li>Enables global state access</li>
                  <li>Improves code organization</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Split contexts by domain</li>
                  <li>Use custom hooks for context consumption</li>
                  <li>Consider performance implications</li>
                  <li>Provide fallback values</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default ContextAPIDemo; 