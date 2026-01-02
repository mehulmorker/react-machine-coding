import React, { useState, useCallback, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText,
  Save,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Step 2: Address Information
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Step 3: Account Information
  username: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  
  // Step 4: Preferences
  newsletter: boolean;
  notifications: boolean;
  theme: string;
  language: string;
  timezone: string;
  
  // Step 5: Payment Information
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface StepConfig {
  title: string;
  icon: React.ReactNode;
  fields: (keyof FormData)[];
  description: string;
}

const MultiStepForm: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    newsletter: false,
    notifications: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: ''
  });

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Step configuration
  const steps: StepConfig[] = [
    {
      title: 'Personal Information',
      icon: <User className="w-5 h-5" />,
      fields: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'],
      description: 'Tell us about yourself'
    },
    {
      title: 'Address Details',
      icon: <MapPin className="w-5 h-5" />,
      fields: ['street', 'city', 'state', 'zipCode', 'country'],
      description: 'Where do you live?'
    },
    {
      title: 'Account Setup',
      icon: <Mail className="w-5 h-5" />,
      fields: ['username', 'password', 'confirmPassword', 'securityQuestion', 'securityAnswer'],
      description: 'Create your account'
    },
    {
      title: 'Preferences',
      icon: <FileText className="w-5 h-5" />,
      fields: ['newsletter', 'notifications', 'theme', 'language', 'timezone'],
      description: 'Customize your experience'
    },
    {
      title: 'Payment Information',
      icon: <CreditCard className="w-5 h-5" />,
      fields: ['cardNumber', 'expiryDate', 'cvv', 'cardholderName', 'billingAddress'],
      description: 'Secure payment details'
    }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('multiStepFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem('multiStepFormData', JSON.stringify(formData));
  }, [formData]);

  // Validation functions
  const validateField = useCallback((field: keyof FormData, value: string | boolean): string => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return typeof value === 'string' && value.trim().length < 2 ? 'Must be at least 2 characters' : '';
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return typeof value === 'string' && !emailRegex.test(value) ? 'Invalid email address' : '';
      
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return typeof value === 'string' && !phoneRegex.test(value) ? 'Invalid phone number' : '';
      
      case 'dateOfBirth':
        if (typeof value === 'string' && value) {
          const date = new Date(value);
          const now = new Date();
          const age = now.getFullYear() - date.getFullYear();
          return age < 13 ? 'Must be at least 13 years old' : '';
        }
        return typeof value === 'string' && !value ? 'Date of birth is required' : '';
      
      case 'zipCode':
        return typeof value === 'string' && value.length < 5 ? 'Invalid zip code' : '';
      
      case 'username':
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return typeof value === 'string' && !usernameRegex.test(value) ? 'Username must be 3-20 characters, alphanumeric and underscores only' : '';
      
      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return typeof value === 'string' && !passwordRegex.test(value) ? 'Password must be 8+ characters with uppercase, lowercase, number, and special character' : '';
      
      case 'confirmPassword':
        return typeof value === 'string' && value !== formData.password ? 'Passwords do not match' : '';
      
      case 'cardNumber':
        const cardRegex = /^\d{16}$/;
        return typeof value === 'string' && !cardRegex.test(value.replace(/\s/g, '')) ? 'Invalid card number' : '';
      
      case 'expiryDate':
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (typeof value === 'string' && !expiryRegex.test(value)) return 'Invalid expiry date (MM/YY)';
        if (typeof value === 'string' && value) {
          const [month, year] = value.split('/');
          const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const now = new Date();
          return expiry < now ? 'Card has expired' : '';
        }
        return '';
      
      case 'cvv':
        const cvvRegex = /^\d{3,4}$/;
        return typeof value === 'string' && !cvvRegex.test(value) ? 'Invalid CVV' : '';
      
      default:
        return typeof value === 'string' && value.trim() === '' ? 'This field is required' : '';
    }
  }, [formData.password]);

  // Validate current step
  const validateStep = useCallback((stepNumber: number): boolean => {
    const stepFields = steps[stepNumber - 1].fields;
    const newErrors: ValidationErrors = {};
    let isValid = true;

    stepFields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  }, [formData, steps, validateField]);

  // Handle input change
  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  }, [currentStep, validateStep, steps.length]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Handle step click
  const handleStepClick = useCallback((stepNumber: number) => {
    // Can only go to completed steps or next step
    if (completedSteps.has(stepNumber) || stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  }, [completedSteps, currentStep]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      localStorage.removeItem('multiStepFormData'); // Clear saved data on success
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, validateStep]);

  // Reset form
  const handleReset = useCallback(() => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '',
      street: '', city: '', state: '', zipCode: '', country: '',
      username: '', password: '', confirmPassword: '', securityQuestion: '', securityAnswer: '',
      newsletter: false, notifications: true, theme: 'light', language: 'en', timezone: 'UTC',
      cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', billingAddress: ''
    });
    setCurrentStep(1);
    setErrors({});
    setCompletedSteps(new Set());
    setSubmitSuccess(false);
    localStorage.removeItem('multiStepFormData');
  }, []);

  // Format card number
  const formatCardNumber = useCallback((value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }, []);

  // Render form field
  const renderField = useCallback((field: keyof FormData) => {
    const value = formData[field];
    const error = errors[field];
    const isRequired = !['newsletter', 'notifications'].includes(field);

    const baseInputClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field) {
      case 'gender':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClass}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'country':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClass}
            >
              <option value="">Select country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="in">India</option>
              <option value="jp">Japan</option>
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'securityQuestion':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Question {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClass}
            >
              <option value="">Select a question</option>
              <option value="pet">What was the name of your first pet?</option>
              <option value="school">What was the name of your elementary school?</option>
              <option value="city">In what city were you born?</option>
              <option value="mother">What is your mother's maiden name?</option>
              <option value="car">What was your first car?</option>
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'password':
      case 'confirmPassword':
        const isPassword = field === 'password';
        const showPasswordState = isPassword ? showPassword : showConfirmPassword;
        const setShowPasswordState = isPassword ? setShowPassword : setShowConfirmPassword;
        
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isPassword ? 'Password' : 'Confirm Password'} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPasswordState ? 'text' : 'password'}
                value={value as string}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={baseInputClass}
                placeholder={isPassword ? 'Enter password' : 'Confirm password'}
              />
              <button
                type="button"
                onClick={() => setShowPasswordState(!showPasswordState)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordState ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'newsletter':
      case 'notifications':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field}
              checked={value as boolean}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field} className="ml-2 block text-sm text-gray-900">
              {field === 'newsletter' ? 'Subscribe to newsletter' : 'Enable notifications'}
            </label>
          </div>
        );

      case 'theme':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {['light', 'dark', 'auto'].map(theme => (
                <label key={theme} className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={value === theme}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-900 capitalize">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'cardNumber':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={formatCardNumber(value as string)}
              onChange={(e) => handleInputChange(field, e.target.value.replace(/\s/g, ''))}
              className={baseInputClass}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'expiryDate':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length >= 2) {
                  val = val.substring(0, 2) + '/' + val.substring(2, 4);
                }
                handleInputChange(field, val);
              }}
              className={baseInputClass}
              placeholder="MM/YY"
              maxLength={5}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        const fieldLabels: { [key: string]: string } = {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email Address',
          phone: 'Phone Number',
          dateOfBirth: 'Date of Birth',
          street: 'Street Address',
          city: 'City',
          state: 'State/Province',
          zipCode: 'ZIP/Postal Code',
          username: 'Username',
          securityAnswer: 'Security Answer',
          language: 'Language',
          timezone: 'Timezone',
          cvv: 'CVV',
          cardholderName: 'Cardholder Name',
          billingAddress: 'Billing Address'
        };

        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldLabels[field]} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field === 'email' ? 'email' : field === 'dateOfBirth' ? 'date' : 'text'}
              value={value as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={baseInputClass}
              placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
    }
  }, [formData, errors, handleInputChange, showPassword, showConfirmPassword, formatCardNumber]);

  if (submitSuccess) {
    return (
      <div className="p-6 bg-white">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Welcome aboard!
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register Another User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Step Registration</h1>
          <p className="text-gray-600">Complete the registration process step by step</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.has(stepNumber);
              const isCurrent = currentStep === stepNumber;
              const isAccessible = isCompleted || isCurrent;

              return (
                <div key={stepNumber} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(stepNumber)}
                    disabled={!isAccessible}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : isAccessible
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
              {steps[currentStep - 1].icon}
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps[currentStep - 1].fields.map(field => (
              <div key={field} className={
                ['newsletter', 'notifications', 'theme'].includes(field) ? 'md:col-span-2' : ''
              }>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Form Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Registration Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.has(stepNumber);
              const isCurrent = currentStep === stepNumber;

              return (
                <div key={stepNumber} className={`p-2 rounded ${
                  isCompleted ? 'bg-green-100 text-green-800' :
                  isCurrent ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs">
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm; 