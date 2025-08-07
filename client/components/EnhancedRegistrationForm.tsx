import { useState } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { enhancedAuth } from "@/lib/enhanced-auth";
import { dualDb } from "@/lib/dual-database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "+385", name: "Croatia", flag: "🇭🇷" },
  { code: "+386", name: "Slovenia", flag: "🇸🇮" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰" },
  { code: "+370", name: "Lithuania", flag: "🇱🇹" },
  { code: "+371", name: "Latvia", flag: "🇱🇻" },
  { code: "+372", name: "Estonia", flag: "🇪🇪" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+356", name: "Malta", flag: "🇲🇹" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾" },
  { code: "+359", name: "Bulgaria", flag: "🇧🇬" },
  { code: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+375", name: "Belarus", flag: "🇧🇾" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", flag: "��🇷" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨" },
  { code: "+591", name: "Bolivia", flag: "🇧🇴" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾" },
];

interface RegistrationFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  countryCode: string;
  country: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  occupation: string;
  experienceLevel: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EnhancedRegistrationForm({
  onSuccess,
  onCancel,
}: Props) {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    countryCode: "",
    country: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    city: "",
    postalCode: "",
    occupation: "",
    experienceLevel: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const updateFormData = (
    field: keyof RegistrationFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountrySelect = (countryName: string) => {
    const selectedCountry = countries.find((c) => c.name === countryName);
    if (selectedCountry) {
      updateFormData("country", selectedCountry.name);
      updateFormData("countryCode", selectedCountry.code);
    }
  };

  const validateStep1 = () => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fullName
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(formData.username)) {
      toast({
        title: "Invalid Username",
        description:
          "Username must be 3-20 characters and contain only letters, numbers, and underscores.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (
      !formData.countryCode ||
      !formData.country ||
      !formData.phoneNumber ||
      !formData.dateOfBirth
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required contact information.",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return false;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const minAge = new Date();
    minAge.setFullYear(minAge.getFullYear() - 18);

    if (birthDate > minAge) {
      toast({
        title: "Age Requirement",
        description: "You must be at least 18 years old to register.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (
      !formData.address ||
      !formData.city ||
      !formData.occupation ||
      !formData.experienceLevel
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required personal information.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "You must agree to the terms and conditions to register.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) return;

    setLoading(true);
    try {
      // Check if username and email are available
      const [usernameAvailable, emailAvailable] = await Promise.all([
        enhancedAuth.validateUsername(formData.username),
        enhancedAuth.validateEmail(formData.email)
      ]);

      if (!usernameAvailable) {
        toast({
          title: "Username Taken",
          description: "This username is already in use. Please choose another.",
          variant: "destructive",
        });
        setStep(1);
        return;
      }

      if (!emailAvailable) {
        toast({
          title: "Email Already Registered",
          description: "This email is already registered. Please use a different email or sign in.",
          variant: "destructive",
        });
        setStep(1);
        return;
      }

      // Use enhanced authentication for registration
      const result = await enhancedAuth.enhancedSignUp(formData.email, formData.password, {
        fullName: formData.fullName,
        username: formData.username,
        countryCode: formData.countryCode,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        occupation: formData.occupation,
        experienceLevel: formData.experienceLevel,
      });

      if (result.error) {
        toast({
          title: "Registration Failed",
          description: result.error.message || "An unexpected error occurred",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration Successful!",
        description: `Account created successfully using ${enhancedAuth.getActiveDatabase()} database. ${enhancedAuth.getActiveDatabase() === 'Supabase' ? 'Please check your email to verify your account.' : 'You can now sign in to your account.'}`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Registration error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: { ...formData, password: '[REDACTED]', confirmPassword: '[REDACTED]' }
      });

      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <span>Create Your Account</span>
        </CardTitle>
        <div className="flex justify-center space-x-2 mt-4">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? "bg-forex-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">
          Step {step} of 3:{" "}
          {step === 1
            ? "Account Details"
            : step === 2
              ? "Contact Information"
              : "Personal Information"}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Username *</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => updateFormData("username", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password (min. 8 characters)"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Country *</span>
                </Label>
                <Select
                  onValueChange={handleCountrySelect}
                  value={formData.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.name} value={country.name}>
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="text-gray-500">
                            ({country.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone Number *</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="w-20">
                    <Input
                      value={formData.countryCode}
                      placeholder="+1"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      updateFormData("phoneNumber", e.target.value)
                    }
                    required
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Date of Birth *</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    updateFormData("dateOfBirth", e.target.value)
                  }
                  required
                  max={
                    new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                />
                <p className="text-sm text-gray-500">
                  You must be at least 18 years old
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="Enter postal code"
                    value={formData.postalCode}
                    onChange={(e) =>
                      updateFormData("postalCode", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="occupation"
                  className="flex items-center space-x-2"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Occupation *</span>
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="Enter your occupation"
                  value={formData.occupation}
                  onChange={(e) => updateFormData("occupation", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trading Experience Level *</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateFormData("experienceLevel", value)
                  }
                  value={formData.experienceLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      Beginner (0-1 years)
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate (1-5 years)
                    </SelectItem>
                    <SelectItem value="advanced">
                      Advanced (5+ years)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      updateFormData("agreeToTerms", checked as boolean)
                    }
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <a href="/terms" className="text-forex-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-forex-600 hover:underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    *
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) =>
                      updateFormData("agreeToMarketing", checked as boolean)
                    }
                  />
                  <Label htmlFor="agreeToMarketing" className="text-sm">
                    I agree to receive marketing communications and forex
                    signals
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>

            <div className="space-x-2">
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-forex-600 hover:bg-forex-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-forex-600 hover:bg-forex-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
