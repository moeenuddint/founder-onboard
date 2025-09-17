"use client";

import { useState, useEffect } from "react";
import {
  apiClient,
  Company,
  ScoreResponse,
  Document,
  Notification,
} from "@/lib/api";
import {
  Bell,
  Calendar,
  FileText,
  TrendingUp,
  MessageSquare,
  Home,
  BarChart3,
  Menu,
  X,
  Upload,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import FileUpload from "./FileUpload";
import ScheduleCall from "./ScheduleCall";
import SupportChat from "./SupportChat";
import DocumentList from "./DocumentList";
import CapTable from "./CapTable";

export default function Dashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    // Clear localStorage - both old and new auth data
    localStorage.removeItem('companyAuth');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');

    // Show success message
    toast.success('Logged out successfully');

    // Redirect to home page after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const loadDashboardData = async () => {
    try {
      const [companyData, scoreData, docsData, notifsData] = await Promise.all([
        apiClient.getCompany(),
        apiClient.getScore(),
        apiClient.getFiles(),
        apiClient.getNotifications(),
      ]);
      debugger

      const newDocs = docsData?.filter((e) => {
        return e?.name?.split("_")?.[0] === localStorage.getItem("userId");
      });

      setCompany(companyData);
      setScore(scoreData);
      setDocuments(newDocs);
      setNotifications(notifsData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateScoreBreakdown = () => {
    let breakdown = {
      kyc: company?.kycVerified ? 30 : 0,
      financials: company?.financialsLinked ? 20 : 0,
      documents: documents.length >= 3 ? 25 : 0,
      revenue: Math.min(25, Math.floor((company?.revenue || 0) / 40000))
    };
    return breakdown;
  };

  const getRecommendation = () => {
    if (!score) return "";

    if (score.score >= 80) {
      return "Excellent! Your startup is highly investment-ready. Consider scheduling a call with investors.";
    } else if (score.score >= 60) {
      return "Good progress! Complete the remaining requirements to become fully investment-ready.";
    } else if (score.score >= 40) {
      return "Keep going! Focus on completing KYC verification and uploading more documents.";
    } else {
      return "Getting started! Complete KYC verification first, then link your financials.";
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">
                    Welcome back, {company?.name ? `${company.name} team` : 'Founder'}!
                  </h1>
                  <p className="text-lg text-blue-100">
                    Here's your company's investment readiness overview
                  </p>
                </div>
                <div className="hidden md:block">
                  <Award className="w-16 h-16 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Company Profile Card */}
              <div className="p-8 bg-white shadow-xl rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <BarChart3 className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                    <p className="text-gray-600">Your startup information & status</p>
                  </div>
                </div>

                {company && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900">{company.name}</h3>
                      <p className="mb-1 text-lg text-gray-600">{company.sector}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Target Raise: ${company.targetRaise.toLocaleString()}</span>
                        <span>•</span>
                        <span>Revenue: ${company.revenue.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Verification Status</h4>
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${company.kycVerified
                          ? 'bg-green-50 border-green-200'
                          : 'bg-yellow-50 border-yellow-200'
                          }`}>
                          <div className="flex items-center gap-3">
                            {company.kycVerified ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                            )}
                            <span className="font-medium">KYC Verification</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${company.kycVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {company.kycVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${company.financialsLinked
                          ? 'bg-green-50 border-green-200'
                          : 'bg-yellow-50 border-yellow-200'
                          }`}>
                          <div className="flex items-center gap-3">
                            {company.financialsLinked ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                            )}
                            <span className="font-medium">Financials Linked</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${company.financialsLinked
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {company.financialsLinked ? 'Connected' : 'Pending'}
                          </span>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${documents.length >= 3
                          ? 'bg-green-50 border-green-200'
                          : 'bg-yellow-50 border-yellow-200'
                          }`}>
                          <div className="flex items-center gap-3">
                            {documents.length >= 3 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                            )}
                            <span className="font-medium">Documents Uploaded</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${documents.length >= 3
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {documents.length}/3 Required
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Investability Score Card */}
              <div className="p-8 bg-white shadow-xl rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <TrendingUp className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Investability Score</h2>
                    <p className="text-gray-600">Your investment readiness rating</p>
                  </div>
                </div>

                {score ? (
                  <div className="space-y-6">
                    {/* Score Display */}
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${score.score >= 80 ? 'text-green-600' :
                        score.score >= 60 ? 'text-blue-600' :
                          score.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {score.score}
                      </div>
                      <div className="mb-4 text-2xl font-medium text-gray-500">/100</div>

                      {/* Progress Bar */}
                      <div className="w-full h-4 bg-gray-200 rounded-full">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ${score.score >= 80 ? 'bg-green-500' :
                            score.score >= 60 ? 'bg-blue-500' :
                              score.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${score.score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h4 className="mb-4 font-semibold text-gray-900">Score Breakdown</h4>
                      <div className="space-y-3">
                        {(() => {
                          const breakdown = calculateScoreBreakdown();
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">KYC Verification</span>
                                <span className={`font-semibold ${breakdown.kyc > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                  +{breakdown.kyc}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Financials Linked</span>
                                <span className={`font-semibold ${breakdown.financials > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                  +{breakdown.financials}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Documents (3+)</span>
                                <span className={`font-semibold ${breakdown.documents > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                  +{breakdown.documents}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Revenue Scale</span>
                                <span className="font-semibold text-blue-600">
                                  +{breakdown.revenue}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-6 border border-blue-200 bg-blue-50 rounded-xl">
                      <h4 className="flex items-center gap-2 mb-2 font-semibold text-blue-900">
                        <TrendingUp className="w-5 h-5" />
                        Recommendation
                      </h4>
                      <p className="text-sm leading-relaxed text-blue-800">
                        {getRecommendation()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500">Calculating your score...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <button
                onClick={() => setActiveSection('schedule')}
                className="p-6 text-left transition-all bg-white shadow-xl cursor-pointer rounded-2xl hover:shadow-2xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-blue-100 rounded-xl group-hover:bg-blue-200">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 transition-colors group-hover:text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Schedule Call</h3>
                <p className="text-sm text-gray-600">Book time with our investment team</p>
              </button>

              <button
                onClick={() => setActiveSection('upload')}
                className="p-6 text-left transition-all bg-white shadow-xl cursor-pointer rounded-2xl hover:shadow-2xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-green-100 rounded-xl group-hover:bg-green-200">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 transition-colors group-hover:text-green-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Upload Documents</h3>
                <p className="text-sm text-gray-600">Add files to your data room</p>
              </button>

              <button
                onClick={() => setActiveSection('chat')}
                className="p-6 text-left transition-all bg-white shadow-xl cursor-pointer rounded-2xl hover:shadow-2xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-purple-100 rounded-xl group-hover:bg-purple-200">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 transition-colors group-hover:text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Get Support</h3>
                <p className="text-sm text-gray-600">Chat with our team</p>
              </button>
            </div>
          </div>
        );

      case "data room":
        return (
          <>
            <FileUpload onUploadSuccess={loadDashboardData} />
            <DocumentList documents={documents} />;
          </>
        );

      case "schedule":
        return <ScheduleCall />;

      case "chat":
        return <SupportChat />;

      case "documents":
        return <DocumentList documents={documents} />;

      case "captable":
        return <CapTable />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <p className="mb-4 text-center">No company found. Please complete onboarding first.</p>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FounderBoard</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="items-center hidden ml-10 space-x-1 md:flex">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Home className="inline w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveSection('data room')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'upload'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Upload className="inline w-4 h-4 mr-2" />
                  Data Room
                </button>
                {/* <button
                  onClick={() => setActiveSection('documents')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'documents'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <FileText className="inline w-4 h-4 mr-2" />
                  Documents
                </button> */}
                <button
                  onClick={() => setActiveSection('schedule')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'schedule'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Schedule
                </button>
                <button
                  onClick={() => setActiveSection('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'chat'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Support
                </button>
                <button
                  onClick={() => setActiveSection('captable')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'captable'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <BarChart3 className="inline w-4 h-4 mr-2" />
                  Cap Table
                </button>
              </nav>
            </div>

            {/* Right side - Profile & Notifications */}
            <div className="flex items-center gap-4">
              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 transition-colors rounded-full bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden text-sm font-medium text-gray-700 md:block">
                    {company?.name || 'Founder'}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 z-10 w-48 mt-2 bg-white border shadow-xl top-full rounded-xl">
                    <div className="p-4 border-b">
                      <p className="font-medium text-gray-900">{company?.name || 'Company'}</p>
                      <p className="text-sm text-gray-500">{company?.sector || 'Sector'}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-3 px-3 py-2 text-left text-red-600 transition-colors rounded-lg hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 transition-colors rounded-full bg-gray-50 hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 z-10 mt-2 overflow-y-auto bg-white border shadow-xl top-full w-80 rounded-xl max-h-96">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 transition-colors border-b hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg md:hidden hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="fixed top-0 right-0 w-64 h-full transition-transform transform bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  setActiveSection('dashboard');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
              >
                <Home className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveSection('upload');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
              >
                <Upload className="w-5 h-5" />
                Upload
              </button>
              <button
                onClick={() => {
                  setActiveSection('documents');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
              >
                <FileText className="w-5 h-5" />
                Documents
              </button>
              <button
                onClick={() => {
                  setActiveSection('schedule');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
              >
                <Calendar className="w-5 h-5" />
                Schedule
              </button>
              <button
                onClick={() => {
                  setActiveSection('chat');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
              >
                <MessageSquare className="w-5 h-5" />
                Support
              </button>

              <button
                onClick={() => {
                  setActiveSection('captable');
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-100"
              >
                <BarChart3 className="w-5 h-5" />
                Cap Table
              </button>

              {/* Mobile Logout */}
              <div className="pt-4 mt-4 border-t">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full gap-3 px-4 py-3 text-left text-red-600 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {renderMainContent()}
      </main>
    </div>
  );
}