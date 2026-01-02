import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Move, 
  Eye, 
  Code, 
  Save, 
  Download, 
  Upload, 
  RotateCcw,
  Settings,
  Type,
  Hash,
  Mail,
  Phone,
  Calendar,
  Clock,
  ToggleLeft,
  CheckSquare,
  Circle,
  List,
  Image,
  FileText,
  Star,
  MapPin,
  CreditCard,
  Link,
  Palette,
  GripVertical,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Types
interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation: ValidationRule[];
  options?: FieldOption[];
  defaultValue?: any;
  description?: string;
  order: number;
  style: FieldStyle;
  conditional?: ConditionalLogic;
}

interface FieldOption {
  id: string;
  label: string;
  value: string;
}

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

interface FieldStyle {
  width: 'full' | 'half' | 'third' | 'quarter';
  className?: string;
  inline?: boolean;
}

interface ConditionalLogic {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'textarea' 
  | 'select' 
  | 'multiselect'
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'time' 
  | 'datetime-local'
  | 'file' 
  | 'image' 
  | 'range' 
  | 'color' 
  | 'rating'
  | 'address'
  | 'signature'
  | 'divider'
  | 'heading'
  | 'paragraph';

interface FormBuilderState {
  fields: FormField[];
  formSettings: FormSettings;
  selectedField: string | null;
  previewMode: boolean;
  validationErrors: Record<string, string[]>;
  formData: Record<string, any>;
}

interface FormSettings {
  title: string;
  description: string;
  submitText: string;
  submitUrl?: string;
  redirectUrl?: string;
  theme: 'default' | 'modern' | 'minimal' | 'colorful';
  layout: 'single-column' | 'two-column' | 'auto';
  showProgress: boolean;
  allowSave: boolean;
  requireAuth: boolean;
}

// Field Type Definitions
const FIELD_TYPES: Array<{
  type: FieldType;
  label: string;
  icon: React.ComponentType<any>;
  category: string;
}> = [
  { type: 'text', label: 'Text Input', icon: Type, category: 'Basic' },
  { type: 'email', label: 'Email', icon: Mail, category: 'Basic' },
  { type: 'password', label: 'Password', icon: Type, category: 'Basic' },
  { type: 'number', label: 'Number', icon: Hash, category: 'Basic' },
  { type: 'tel', label: 'Phone', icon: Phone, category: 'Basic' },
  { type: 'url', label: 'URL', icon: Link, category: 'Basic' },
  { type: 'textarea', label: 'Text Area', icon: FileText, category: 'Basic' },
  
  { type: 'select', label: 'Dropdown', icon: List, category: 'Choice' },
  { type: 'multiselect', label: 'Multi Select', icon: CheckSquare, category: 'Choice' },
  { type: 'radio', label: 'Radio Button', icon: Circle, category: 'Choice' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, category: 'Choice' },
  { type: 'rating', label: 'Rating', icon: Star, category: 'Choice' },
  
  { type: 'date', label: 'Date', icon: Calendar, category: 'Date & Time' },
  { type: 'time', label: 'Time', icon: Clock, category: 'Date & Time' },
  { type: 'datetime-local', label: 'Date & Time', icon: Calendar, category: 'Date & Time' },
  
  { type: 'file', label: 'File Upload', icon: Upload, category: 'Advanced' },
  { type: 'image', label: 'Image Upload', icon: Image, category: 'Advanced' },
  { type: 'range', label: 'Range Slider', icon: ToggleLeft, category: 'Advanced' },
  { type: 'color', label: 'Color Picker', icon: Palette, category: 'Advanced' },
  { type: 'address', label: 'Address', icon: MapPin, category: 'Advanced' },
  
  { type: 'heading', label: 'Heading', icon: Type, category: 'Layout' },
  { type: 'paragraph', label: 'Paragraph', icon: FileText, category: 'Layout' },
  { type: 'divider', label: 'Divider', icon: Type, category: 'Layout' }
];

// Default field configurations
const getDefaultField = (type: FieldType): Omit<FormField, 'id' | 'order'> => {
  const baseField = {
    type,
    label: '',
    required: false,
    validation: [],
    style: { width: 'full' as const },
    defaultValue: null
  };

  switch (type) {
    case 'text':
      return { ...baseField, label: 'Text Input', placeholder: 'Enter text...' };
    case 'email':
      return { ...baseField, label: 'Email Address', placeholder: 'Enter email...', validation: [{ type: 'pattern' as const, value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email format' }] };
    case 'number':
      return { ...baseField, label: 'Number', placeholder: 'Enter number...' };
    case 'select':
      return { ...baseField, label: 'Dropdown', options: [{ id: '1', label: 'Option 1', value: 'option1' }] };
    case 'radio':
      return { ...baseField, label: 'Radio Group', options: [{ id: '1', label: 'Option 1', value: 'option1' }, { id: '2', label: 'Option 2', value: 'option2' }] };
    case 'checkbox':
      return { ...baseField, label: 'Checkbox', defaultValue: false };
    case 'textarea':
      return { ...baseField, label: 'Text Area', placeholder: 'Enter text...' };
    case 'date':
      return { ...baseField, label: 'Date' };
    case 'rating':
      return { ...baseField, label: 'Rating', defaultValue: 0 };
    case 'heading':
      return { ...baseField, label: 'Heading Text', defaultValue: 'Section Heading' };
    case 'paragraph':
      return { ...baseField, label: 'Paragraph Text', defaultValue: 'This is a paragraph of text.' };
    default:
      return { ...baseField, label: type.charAt(0).toUpperCase() + type.slice(1) };
  }
};

// Field Editor Component
const FieldEditor: React.FC<{
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
  allFields: FormField[];
}> = ({ field, onUpdate, onDelete, allFields }) => {
  
  const [localField, setLocalField] = useState(field);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleUpdate = (updates: Partial<FormField>) => {
    const updated = { ...localField, ...updates };
    setLocalField(updated);
    onUpdate(updated);
  };

  const addOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      label: `Option ${(localField.options?.length || 0) + 1}`,
      value: `option${(localField.options?.length || 0) + 1}`
    };
    handleUpdate({ options: [...(localField.options || []), newOption] });
  };

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const newOptions = [...(localField.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    handleUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = localField.options?.filter((_, i) => i !== index) || [];
    handleUpdate({ options: newOptions });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required'
    };
    handleUpdate({ validation: [...localField.validation, newRule] });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...localField.validation];
    newRules[index] = { ...newRules[index], ...updates };
    handleUpdate({ validation: newRules });
  };

  const removeValidationRule = (index: number) => {
    const newRules = localField.validation.filter((_, i) => i !== index);
    handleUpdate({ validation: newRules });
  };

  const needsOptions = ['select', 'multiselect', 'radio'].includes(localField.type);
  const isLayoutField = ['heading', 'paragraph', 'divider'].includes(localField.type);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Field Settings</h3>
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Basic Settings */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            value={localField.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {!isLayoutField && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                type="text"
                value={localField.placeholder || ''}
                onChange={(e) => handleUpdate({ placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={localField.description || ''}
                onChange={(e) => handleUpdate({ description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        {isLayoutField && localField.type !== 'divider' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={localField.defaultValue || ''}
              onChange={(e) => handleUpdate({ defaultValue: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Field Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <select
            value={localField.style.width}
            onChange={(e) => handleUpdate({ style: { ...localField.style, width: e.target.value as any } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="full">Full Width</option>
            <option value="half">Half Width</option>
            <option value="third">One Third</option>
            <option value="quarter">One Quarter</option>
          </select>
        </div>

        {!isLayoutField && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={localField.required}
              onChange={(e) => handleUpdate({ required: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 text-sm text-gray-700">Required field</label>
          </div>
        )}
      </div>

      {/* Options for select/radio fields */}
      {needsOptions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Options</h4>
            <button
              onClick={addOption}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Add Option
            </button>
          </div>
          <div className="space-y-2">
            {localField.options?.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="Option label"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Rules */}
      {!isLayoutField && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Validation Rules</h4>
            <button
              onClick={addValidationRule}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Add Rule
            </button>
          </div>
          <div className="space-y-2">
            {localField.validation.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={rule.type}
                  onChange={(e) => updateValidationRule(index, { type: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="required">Required</option>
                  <option value="min">Minimum Length</option>
                  <option value="max">Maximum Length</option>
                  <option value="pattern">Pattern</option>
                </select>
                {rule.type !== 'required' && (
                  <input
                    type="text"
                    value={rule.value || ''}
                    onChange={(e) => updateValidationRule(index, { value: e.target.value })}
                    placeholder={rule.type === 'pattern' ? 'Regex pattern' : 'Value'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                <input
                  type="text"
                  value={rule.message}
                  onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                  placeholder="Error message"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeValidationRule(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Form Preview Component
const FormPreview: React.FC<{
  fields: FormField[];
  formData: Record<string, any>;
  validationErrors: Record<string, string[]>;
  onDataChange: (fieldId: string, value: any) => void;
  settings: FormSettings;
}> = ({ fields, formData, validationErrors, onDataChange, settings }) => {
  
  const renderField = (field: FormField) => {
    const error = validationErrors[field.id];
    const value = formData[field.id] ?? field.defaultValue ?? '';

    // Layout fields
    if (field.type === 'heading') {
      return (
        <div className={`${getWidthClass(field.style.width)}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{field.defaultValue}</h2>
        </div>
      );
    }

    if (field.type === 'paragraph') {
      return (
        <div className={`${getWidthClass(field.style.width)}`}>
          <p className="text-gray-700 mb-4">{field.defaultValue}</p>
        </div>
      );
    }

    if (field.type === 'divider') {
      return (
        <div className={`${getWidthClass(field.style.width)}`}>
          <hr className="border-gray-300 my-6" />
        </div>
      );
    }

    const baseClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorClassName = error ? "border-red-300 ring-1 ring-red-200" : "";

    return (
      <div className={`${getWidthClass(field.style.width)}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.description && (
          <p className="text-sm text-gray-500 mb-2">{field.description}</p>
        )}
        
        {/* Text inputs */}
        {['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'color'].includes(field.type) && (
          <input
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onDataChange(field.id, e.target.value)}
            className={`${baseClassName} ${errorClassName}`}
          />
        )}

        {/* Textarea */}
        {field.type === 'textarea' && (
          <textarea
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onDataChange(field.id, e.target.value)}
            rows={4}
            className={`${baseClassName} ${errorClassName}`}
          />
        )}

        {/* Select */}
        {field.type === 'select' && (
          <select
            value={value}
            onChange={(e) => onDataChange(field.id, e.target.value)}
            className={`${baseClassName} ${errorClassName}`}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Radio buttons */}
        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.id} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onDataChange(field.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Checkbox */}
        {field.type === 'checkbox' && (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onDataChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{field.placeholder || 'Check this box'}</span>
          </label>
        )}

        {/* File upload */}
        {field.type === 'file' && (
          <input
            type="file"
            onChange={(e) => onDataChange(field.id, e.target.files?.[0])}
            className={`${baseClassName} ${errorClassName}`}
          />
        )}

        {/* Range */}
        {field.type === 'range' && (
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => onDataChange(field.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center text-sm text-gray-600 mt-1">Value: {value}</div>
          </div>
        )}

        {/* Rating */}
        {field.type === 'rating' && (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => onDataChange(field.id, rating)}
                className={`p-1 ${rating <= (value || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="h-5 w-5 fill-current" />
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {error[0]}
          </div>
        )}
      </div>
    );
  };

  const getWidthClass = (width: string) => {
    switch (width) {
      case 'half': return 'w-full md:w-1/2';
      case 'third': return 'w-full md:w-1/3';
      case 'quarter': return 'w-full md:w-1/4';
      default: return 'w-full';
    }
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{settings.title}</h1>
        {settings.description && (
          <p className="text-gray-600">{settings.description}</p>
        )}
      </div>

      <form className="space-y-6">
        <div className={`flex flex-wrap gap-6 ${settings.layout === 'two-column' ? 'md:gap-x-8' : ''}`}>
          {sortedFields.map(field => (
            <React.Fragment key={field.id}>
              {renderField(field)}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {settings.submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Form Builder Component
const FormBuilder: React.FC = () => {
  const [state, setState] = useState<FormBuilderState>({
    fields: [],
    formSettings: {
      title: 'Untitled Form',
      description: '',
      submitText: 'Submit Form',
      theme: 'default',
      layout: 'single-column',
      showProgress: false,
      allowSave: false,
      requireAuth: false
    },
    selectedField: null,
    previewMode: false,
    validationErrors: {},
    formData: {}
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('form-builder-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading form builder state:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('form-builder-state', JSON.stringify({
      fields: state.fields,
      formSettings: state.formSettings
    }));
  }, [state.fields, state.formSettings]);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: state.fields.length,
      ...getDefaultField(type)
    };

    setState(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
      selectedField: newField.id
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setState(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId: string) => {
    setState(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
      selectedField: prev.selectedField === fieldId ? null : prev.selectedField
    }));
  };

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = state.fields.find(f => f.id === fieldId);
    if (fieldToDuplicate) {
      const newField: FormField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: `${fieldToDuplicate.label} (Copy)`,
        order: state.fields.length
      };
      setState(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = state.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    const newFields = [...state.fields];
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;

    if (targetIndex >= 0 && targetIndex < newFields.length) {
      [newFields[fieldIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[fieldIndex]];
      // Update order
      newFields.forEach((field, index) => {
        field.order = index;
      });
      setState(prev => ({ ...prev, fields: newFields }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    
    state.fields.forEach(field => {
      const fieldErrors: string[] = [];
      const value = state.formData[field.id];

      field.validation.forEach(rule => {
        switch (rule.type) {
          case 'required':
            if (field.required && (!value || value === '')) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'min':
            if (value && value.length < parseInt(rule.value)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'max':
            if (value && value.length > parseInt(rule.value)) {
              fieldErrors.push(rule.message);
            }
            break;
          case 'pattern':
            if (value && !new RegExp(rule.value).test(value)) {
              fieldErrors.push(rule.message);
            }
            break;
        }
      });

      if (fieldErrors.length > 0) {
        errors[field.id] = fieldErrors;
      }
    });

    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const exportForm = () => {
    const formSchema = {
      settings: state.formSettings,
      fields: state.fields,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(formSchema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.formSettings.title.toLowerCase().replace(/\s+/g, '-')}-form.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const formSchema = JSON.parse(e.target?.result as string);
        setState(prev => ({
          ...prev,
          fields: formSchema.fields || [],
          formSettings: formSchema.settings || prev.formSettings,
          selectedField: null
        }));
      } catch (error) {
        alert('Invalid form file');
      }
    };
    reader.readAsText(file);
  };

  const selectedField = state.fields.find(f => f.id === state.selectedField);
  const groupedFieldTypes = FIELD_TYPES.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof FIELD_TYPES>);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dynamic Form Builder</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create sophisticated forms with dynamic validation, conditional logic, and real-time preview
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setState(prev => ({ ...prev, previewMode: !prev.previewMode }))}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              state.previewMode 
                ? 'bg-blue-600 text-white' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye className="h-4 w-4" />
            {state.previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          
          <button
            onClick={validateForm}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Validate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportForm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          
          <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importForm}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => setState(prev => ({ ...prev, fields: [], formData: {}, validationErrors: {} }))}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Field Types Panel */}
        {!state.previewMode && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Field Types</h3>
              <div className="space-y-4">
                {Object.entries(groupedFieldTypes).map(([category, fields]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {fields.map(fieldType => {
                        const Icon = fieldType.icon;
                        return (
                          <button
                            key={fieldType.type}
                            onClick={() => addField(fieldType.type)}
                            className="flex items-center gap-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            {fieldType.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={state.previewMode ? 'lg:col-span-4' : 'lg:col-span-2'}>
          {state.previewMode ? (
            <FormPreview
              fields={state.fields}
              formData={state.formData}
              validationErrors={state.validationErrors}
              onDataChange={(fieldId, value) => 
                setState(prev => ({
                  ...prev,
                  formData: { ...prev.formData, [fieldId]: value }
                }))
              }
              settings={state.formSettings}
            />
          ) : (
            <div className="space-y-4">
              {/* Form Settings */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                    <input
                      type="text"
                      value={state.formSettings.title}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        formSettings: { ...prev.formSettings, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
                    <input
                      type="text"
                      value={state.formSettings.submitText}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        formSettings: { ...prev.formSettings, submitText: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={state.formSettings.description}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        formSettings: { ...prev.formSettings, description: e.target.value }
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                {state.fields.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-4">No fields added yet</p>
                    <p className="text-sm text-gray-400">Click on field types from the left panel to add them to your form</p>
                  </div>
                ) : (
                  state.fields
                    .sort((a, b) => a.order - b.order)
                    .map(field => (
                      <div
                        key={field.id}
                        className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all ${
                          state.selectedField === field.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                        }`}
                        onClick={() => setState(prev => ({ ...prev, selectedField: field.id }))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            <div>
                              <h4 className="font-medium text-gray-900">{field.label}</h4>
                              <p className="text-sm text-gray-500 capitalize">{field.type.replace('-', ' ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, 'up');
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={field.order === 0}
                            >
                              ↑
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, 'down');
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              disabled={field.order === state.fields.length - 1}
                            >
                              ↓
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateField(field.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteField(field.id);
                              }}
                              className="p-1 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Field Editor Panel */}
        {!state.previewMode && selectedField && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <FieldEditor
                field={selectedField}
                onUpdate={(field) => updateField(field.id, field)}
                onDelete={() => deleteField(selectedField.id)}
                allFields={state.fields}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder; 