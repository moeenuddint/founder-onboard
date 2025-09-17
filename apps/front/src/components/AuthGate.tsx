"use client";

import { useState, useEffect } from "react";
import EmailAuth from "./EmailAuth";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const authFlag = localStorage.getItem('isAuthenticated');
      const authTimestamp = localStorage.getItem('authTimestamp');
      
      // Check if user is authenticated and session is still valid (24 hours)
      if (userEmail && authFlag === 'true' && authTimestamp) {
        const now = Date.now();
        const sessionAge = now - parseInt(authTimestamp);
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (sessionAge < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear auth data
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <EmailAuth onAuthSuccess={() => {}} />;
  }

  return <>{children}</>;
}
