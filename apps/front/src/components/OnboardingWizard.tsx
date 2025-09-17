"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api";
import {
  CheckCircle,
  Circle,
  Loader2,
  Building2,
  TrendingUp,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  targetRaise: z.number().min(0, "Target raise must be positive"),
  revenue: z.number().min(0, "Revenue must be positive"),
});

type CompanyForm = z.infer<typeof companySchema>;

const steps = [
  { id: 1, title: "Company Basics", description: "Tell us about your company" },
  { id: 2, title: "KYC Verification", description: "Verify your identity" },
  { id: 3, title: "Bank Link", description: "Connect your financials" },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [kycVerified, setKycVerified] = useState(false);
  const [financialsLinked, setFinancialsLinked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema as any),
  });

  const onCompanySubmit = async (data: CompanyForm) => {
    setIsLoading(true);
    try {
      const result = await apiClient.createCompany(data);
      setCompany(result);
      setCurrentStep(2);
      toast.success("Company information saved!");
    } catch (error) {
      toast.error("Failed to save company information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKYCVerification = async () => {
    setIsLoading(true);
    try {
      const result = await apiClient.verifyKYC();
      setKycVerified(result.verified);
      setCurrentStep(3);
      toast.success("KYC verification completed!");
    } catch (error) {
      toast.error("KYC verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankLink = async () => {
    setIsLoading(true);
    try {
      // Mock token for demo
      const result = await apiClient.linkFinancials("mock_token_123");
      setFinancialsLinked(true);
      toast.success("Bank account linked successfully!");
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Failed to link bank account");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Company Onboarding
          </h1>
          <p className="text-gray-600">
            Let's get your company ready for investors
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 rounded transition-all duration-300 ${
                      step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Company Information
                </h3>
                <p className="text-gray-600">Tell us about your company</p>
              </div>

              <form
                onSubmit={handleSubmit(onCompanySubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Company Name
                    </label>
                    <input
                      id="name"
                      {...register("name")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your company name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="sector"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Industry Sector
                    </label>
                    <select
                      id="sector"
                      {...register("sector")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select your sector</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.sector && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sector.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="targetRaise"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Target Raise Amount ($)
                    </label>
                    <input
                      id="targetRaise"
                      type="number"
                      {...register("targetRaise", { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="5000000"
                    />
                    {errors.targetRaise && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.targetRaise.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="revenue"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Annual Revenue ($)
                    </label>
                    <input
                      id="revenue"
                      type="number"
                      {...register("revenue", { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="1000000"
                    />
                    {errors.revenue && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.revenue.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all font-medium flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  Continue to Verification
                </button>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Identity Verification
              </h3>
              <p className="text-gray-600 text-lg">
                We'll use Persona to verify your identity securely. This process
                ensures compliance and builds trust with investors.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Secure Process</p>
                    <p className="text-sm text-gray-600">
                      Bank-level security standards
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Quick & Easy</p>
                    <p className="text-sm text-gray-600">
                      Complete in just a few minutes
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleKYCVerification}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all font-medium flex items-center justify-center max-w-md mx-auto"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                Start KYC Verification
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Financial Integration
              </h3>
              <p className="text-gray-600 text-lg">
                Connect your bank account to share financial information
                securely with potential investors.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Secure Connection
                    </p>
                    <p className="text-sm text-gray-600">
                      Your data is encrypted and protected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Read-Only Access
                    </p>
                    <p className="text-sm text-gray-600">
                      We only view your financial data
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bank Connection Token
                </label>
                <input
                  id="token"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
                  placeholder="Enter connection token"
                  defaultValue="demo_token_123"
                />
              </div>

              <button
                onClick={handleBankLink}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all font-medium flex items-center justify-center max-w-md mx-auto"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                Connect Bank Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
