"use client";
 
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import {
  Users,
  TrendingUp,
  PieChart,
  Building,
  Award,
  Percent,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
 
interface Shareholder {
  id: string;
  name: string;
  type: "founder" | "employee" | "investor" | "advisor";
  shares: number;
  percentage: number;
  shareClass: string;
  vestingSchedule?: string;
}
 
interface CapTableData {
  company: {
    name: string;
    totalShares: number;
    outstandingShares: number;
    fullyDilutedShares: number;
  };
  shareholders: Shareholder[];
  valuationData?: {
    preMoney: number;
    postMoney: number;
    sharePrice: number;
  };
}
 
export default function CapTable() {
  const [capTableData, setCapTableData] = useState<CapTableData | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    loadCapTableData();
  }, []);
 
  const loadCapTableData = async () => {
    try {
      const data = await apiClient.getCapTable();
      setCapTableData(data);
    } catch (error) {
      toast.error("Failed to load cap table data");
      console.error("Cap table error:", error);
    } finally {
      setLoading(false);
    }
  };
 
  const getShareholderTypeColor = (type: string) => {
    switch (type) {
      case "founder":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      case "investor":
        return "bg-purple-100 text-purple-800";
      case "advisor":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
 
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };
 
  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };
 
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading cap table...</span>
        </div>
      </div>
    );
  }
 
  if (!capTableData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Cap Table Data
          </h3>
          <p className="text-gray-600">
            Cap table information is not available at this time.
          </p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Cap Table
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                {capTableData.company.name} • Ownership Structure
              </p>
            </div>
          </div>
        </div>
 
        {/* Company Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <Building className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              <span className="font-semibold text-gray-900 text-sm lg:text-base">
                Total Shares
              </span>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-blue-600">
              {formatNumber(capTableData.company.totalShares)}
            </p>
          </div>
 
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              <span className="font-semibold text-gray-900 text-sm lg:text-base">
                Outstanding
              </span>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-green-600">
              {formatNumber(capTableData.company.outstandingShares)}
            </p>
          </div>
 
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <Award className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm lg:text-base">
                Fully Diluted
              </span>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-purple-600">
              {formatNumber(capTableData.company.fullyDilutedShares)}
            </p>
          </div>
 
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              <span className="font-semibold text-gray-900 text-sm lg:text-base">
                Shareholders
              </span>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-yellow-600">
              {capTableData.shareholders.length}
            </p>
          </div>
        </div>
      </div>
 
      {/* Main Content - Table View */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Shareholder
                </th>
                <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-4 lg:px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Shares
                </th>
                <th className="px-4 lg:px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Percentage
                </th>
                <th className="hidden md:table-cell px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Share Class
                </th>
                <th className="hidden lg:table-cell px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Vesting
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {capTableData.shareholders.map((shareholder) => (
                <tr
                  key={shareholder.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm lg:text-base">
                          {shareholder.name}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500">
                          ID: {shareholder.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`inline-flex px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize ${getShareholderTypeColor(
                        shareholder.type
                      )}`}
                    >
                      {shareholder.type}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">
                      {formatNumber(shareholder.shares)}
                    </p>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                      <Percent className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900 text-sm lg:text-base">
                        {formatPercentage(shareholder.percentage)}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 lg:px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                      {shareholder.shareClass}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 lg:px-6 py-4">
                    <p className="text-xs lg:text-sm text-gray-600">
                      {shareholder.vestingSchedule || "No vesting"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        {/* Summary Footer */}
        <div className="bg-gray-50 px-4 lg:px-6 py-4 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <div className="text-xs lg:text-sm text-gray-600">
              Total Ownership:{" "}
              {formatPercentage(
                capTableData.shareholders.reduce(
                  (sum, sh) => sum + sh.percentage,
                  0
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 