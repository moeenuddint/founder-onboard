"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient, Company } from "@/lib/api";
import {
  Building2,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Award,
  Edit,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated
      const userEmail = localStorage.getItem('userEmail');
      const authFlag = localStorage.getItem('isAuthenticated');
      
      if (userEmail && authFlag === 'true') {
        setIsAuthenticated(true);
        
        // Try to load company data for authenticated users
        try {
          const companyData = await apiClient.getCompany();
          setCompany(companyData);
        } catch (error) {
          // Company not found, user needs to complete onboarding
        }
      }
    } catch (error) {
      console.error('Error checking auth or loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAndRedirect = () => {
    router.push("/onboarding");
  };

  const handleStartOnboarding = () => {
    router.push("/onboarding");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleEditCompany = () => {
    router.push("/onboarding");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FounderBoard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your investment readiness platform for startups and founders
          </p>
        </div>

        {!isAuthenticated ? (
          /* Not Authenticated - Show generic info with auth button */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-blue-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get Investment Ready
              </h2>

              <p className="text-gray-600 mb-8 text-lg">
                Join thousands of founders who have streamlined their fundraising process with our platform.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left bg-gray-50 rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Calculate Investability Score
                    </p>
                    <p className="text-sm text-gray-600">
                      Get scored on KYC, financials, documents, and revenue scale
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left bg-gray-50 rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Secure Document Management
                    </p>
                    <p className="text-sm text-gray-600">
                      Upload and organize your company documents safely
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left bg-gray-50 rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Connect with Investors
                    </p>
                    <p className="text-sm text-gray-600">
                      Schedule calls and get feedback from investment professionals
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAuthAndRedirect}
                className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : company ? (
          /* Authenticated + Company exists - Show dashboard option with edit */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {company.name}
                    </h2>
                    <p className="text-gray-600 text-lg">{company.sector}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      company.kycVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {company.kycVerified ? "✓ KYC Verified" : "⏳ KYC Pending"}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      company.financialsLinked
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {company.financialsLinked
                      ? "✓ Financials Connected"
                      : "⏳ Financials Pending"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      Target Raise
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    ${(company.targetRaise / 1000000).toFixed(1)}M
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      Annual Revenue
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ${(company.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-purple-600" />
                    <span className="font-semibold text-gray-900">
                      Status
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {company.kycVerified && company.financialsLinked ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="font-bold text-green-600 text-lg">Ready</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                        <span className="font-bold text-yellow-600 text-lg">In Progress</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleGoToDashboard}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  Go to Dashboard
                </button>
                <button
                  onClick={handleEditCompany}
                  className="flex-1 bg-white text-blue-600 py-4 px-6 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Company
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated but no company - Show onboarding button */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome! Let's Get You Started
              </h2>

              <p className="text-gray-600 mb-8 text-lg">
                Complete your company onboarding to unlock your investability score and connect with investors.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Company Profile Setup
                    </p>
                    <p className="text-sm text-gray-600">
                      Basic information, sector, and financial details
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      KYC Verification
                    </p>
                    <p className="text-sm text-gray-600">
                      Secure identity verification for your company
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Financial Integration
                    </p>
                    <p className="text-sm text-gray-600">
                      Connect your financial data through Plaid
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartOnboarding}
                className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                Start Company Onboarding
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Features Grid - Always show */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FounderBoard?
            </h3>
            <p className="text-gray-600 text-lg">
              Everything you need to get investment-ready in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Investability Score
              </h4>
              <p className="text-gray-600">
                Get a comprehensive 0-100 score based on KYC verification, financial data, documents, and revenue scale.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Secure Data Room
              </h4>
              <p className="text-gray-600">
                Upload and manage your company documents in a secure, investor-ready environment with version control.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Investor Network
              </h4>
              <p className="text-gray-600">
                Schedule calls and connect with our network of investors and get real-time support from our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
