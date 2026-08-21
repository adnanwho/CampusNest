"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Eye,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Building2,
  Activity,
  FileText,
  Lock,
  Search,
  RefreshCw,
  Database,
  Server,
  Layers,
  BarChart3,
  ChevronRight
} from "lucide-react";
import {
  approveVerification,
  getPendingVerifications,
  rejectVerification,
  reviewVerification,
  getAdminDashboard,
  getAdminUsers,
  getAdminProperties,
  getAdminPrivacy,
  getAdminConsents,
  getAdminAuditLogs,
  getAdminReports,
  getAdminSystemHealth
} from "@/lib/api";
import type {
  Property,
  AdminDashboardData,
  AdminUserData,
  AdminPropertyData,
  AdminPrivacyData,
  AdminConsentData,
  AdminAuditLogData,
  AdminReportsData,
  AdminSystemHealthData
} from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { getEffectiveMonthlyCost } from "@/lib/scoring";
import { motion, AnimatePresence } from "framer-motion";

type AdminTab =
  | "dashboard"
  | "verification"
  | "properties"
  | "users"
  | "privacy"
  | "consent"
  | "audit"
  | "reports"
  | "system";

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [verificationProperties, setVerificationProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<AdminPropertyData[]>([]);
  const [usersList, setUsersList] = useState<AdminUserData[]>([]);
  const [privacyData, setPrivacyData] = useState<AdminPrivacyData | null>(null);
  const [consentList, setConsentList] = useState<AdminConsentData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogData[]>([]);
  const [reportsData, setReportsData] = useState<AdminReportsData | null>(null);
  const [systemHealth, setSystemHealth] = useState<AdminSystemHealthData | null>(null);

  // Filter States
  const [selectedProperty, setSelectedProperty] = useState<Property | AdminPropertyData | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<string>("PENDING");
  const [propertySearch, setPropertySearch] = useState("");
  const [propertyStatusFilter, setPropertyStatusFilter] = useState("ALL");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [auditSearch, setAuditSearch] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllAdminData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [
        dash,
        pendingVerifs,
        allProps,
        users,
        priv,
        consents,
        logs,
        reports,
        health
      ] = await Promise.all([
        getAdminDashboard().catch(() => null),
        getPendingVerifications().catch(() => []),
        getAdminProperties().catch(() => []),
        getAdminUsers().catch(() => []),
        getAdminPrivacy().catch(() => null),
        getAdminConsents().catch(() => []),
        getAdminAuditLogs().catch(() => []),
        getAdminReports().catch(() => null),
        getAdminSystemHealth().catch(() => null),
      ]);

      setDashboardData(dash);
      setVerificationProperties(pendingVerifs);
      setAllProperties(allProps);
      setUsersList(users);
      setPrivacyData(priv);
      setConsentList(consents);
      setAuditLogs(logs);
      setReportsData(reports);
      setSystemHealth(health);
    } catch {
      showToast("Unable to load all admin data from backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadAllAdminData();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadAllAdminData]);

  // Verification Actions
  const handleApprove = async (propertyId: string) => {
    try {
      await approveVerification(propertyId);
      setVerificationProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedProperty(null);
      showToast("Property approved & cryptographic verification record stamped!");
      loadAllAdminData(true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Approval failed");
    }
  };

  const handleReview = async (propertyId: string) => {
    try {
      await reviewVerification(propertyId);
      showToast("Property status updated to UNDER_REVIEW");
      loadAllAdminData(true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Review status update failed");
    }
  };

  const handleReject = async (propertyId: string) => {
    try {
      await rejectVerification(propertyId, "Listing does not meet CampusNest verification standards.");
      setVerificationProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedProperty(null);
      showToast("Property verification rejected & audit record logged.");
      loadAllAdminData(true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Rejection failed");
    }
  };

  // Filtered properties for property tab
  const filteredProperties = useMemo(() => {
    return allProperties.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.locality.toLowerCase().includes(propertySearch.toLowerCase()) ||
        p.address.toLowerCase().includes(propertySearch.toLowerCase());
      const matchStatus =
        propertyStatusFilter === "ALL" || p.verificationStatus === propertyStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [allProperties, propertySearch, propertyStatusFilter]);

  // Filtered users for user tab
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.maskedEmail.toLowerCase().includes(userSearch.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [usersList, userRoleFilter, userSearch]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (!auditSearch) return true;
      const q = auditSearch.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.result.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    });
  }, [auditLogs, auditSearch]);

  const navTabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: "Overview", icon: <Activity className="w-4 h-4" /> },
    {
      id: "verification",
      label: "Verification Queue",
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: dashboardData?.pendingVerifications || verificationProperties.length || undefined,
    },
    { id: "properties", label: "Properties", icon: <Building2 className="w-4 h-4" />, badge: allProperties.length || undefined },
    { id: "users", label: "User Accounts", icon: <Users className="w-4 h-4" />, badge: usersList.length || undefined },
    { id: "privacy", label: "Data & Privacy", icon: <Lock className="w-4 h-4" /> },
    { id: "consent", label: "User Consent", icon: <CheckCircle2 className="w-4 h-4" />, badge: consentList.length || undefined },
    { id: "audit", label: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "reports", label: "Analytics & Reports", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "system", label: "System Health", icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17202A] text-white text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39B86B]" />
            Administrator Operations Center
          </div>
          <h1 className="text-3xl font-extrabold text-[#17202A] tracking-tight">
            CampusNest Platform Control
          </h1>
          <p className="text-sm text-[#596573] mt-1">
            Real-time operations management, tamper-evident verification audits, and privacy governance.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => loadAllAdminData(true)}
            disabled={refreshing}
            className="btn-secondary text-xs py-2.5 px-4 font-bold flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Sync Live Data"}
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E0D8] scrollbar-none">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                isActive
                  ? "bg-[#17202A] text-white shadow-sm"
                  : "bg-white text-[#596573] hover:text-[#17202A] hover:bg-[#FAF8F5] border border-[#E5E0D8]"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-extrabold",
                    isActive ? "bg-[#39B86B] text-white" : "bg-[#EBF8F0] text-[#2A8C50]"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-10 h-10 border-3 border-[#39B86B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-[#596573]">Loading administrative records from Spring Boot backend...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: OPERATIONS DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider">
                      Student Accounts
                    </span>
                    <Users className="w-4 h-4 text-[#39B86B]" />
                  </div>
                  <div className="text-3xl font-black text-[#17202A]">
                    {dashboardData?.totalStudents ?? 0}
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Verified student profiles</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#8A96A3] uppercase tracking-wider">
                      Lister Accounts
                    </span>
                    <Building2 className="w-4 h-4 text-[#D49B24]" />
                  </div>
                  <div className="text-3xl font-black text-[#17202A]">
                    {dashboardData?.totalListers ?? 0}
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Property managers</div>
                </div>

                <div className="campus-card p-5 bg-[#EBF8F0] border border-[#39B86B]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#2A8C50] uppercase tracking-wider">
                      Verified Listings
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#2A8C50]" />
                  </div>
                  <div className="text-3xl font-black text-[#2A8C50]">
                    {dashboardData?.verifiedProperties ?? 0}
                  </div>
                  <div className="text-[11px] text-[#2A8C50]/80 mt-1">
                    of {dashboardData?.totalProperties ?? 0} total properties
                  </div>
                </div>

                <div className="campus-card p-5 bg-[#FFF8E7] border border-[#FFC857]/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#D49B24] uppercase tracking-wider">
                      Pending In Queue
                    </span>
                    <Clock className="w-4 h-4 text-[#D49B24]" />
                  </div>
                  <div className="text-3xl font-black text-[#17202A]">
                    {(dashboardData?.pendingVerifications ?? 0) + (dashboardData?.underReviewVerifications ?? 0)}
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Awaiting physical audit</div>
                </div>
              </div>

              {/* Occupancy & Live Capacity Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="campus-card p-6 bg-white border border-[#E5E0D8] lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#17202A] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#39B86B]" />
                      Marketplace Bed Capacity & Live Occupancy
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF8F0] text-[#2A8C50]">
                      Real Database Counts
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E0D8] text-center">
                      <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Total Capacity</div>
                      <div className="text-2xl font-black text-[#17202A] mt-1">
                        {dashboardData?.totalCapacity ?? 0}
                      </div>
                      <div className="text-[10px] text-[#596573]">Total student beds</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FFC857]/40 text-center">
                      <div className="text-[10px] font-bold text-[#D49B24] uppercase">Occupied Beds</div>
                      <div className="text-2xl font-black text-[#17202A] mt-1">
                        {dashboardData?.totalOccupied ?? 0}
                      </div>
                      <div className="text-[10px] text-[#596573]">Current tenants</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#39B86B]/30 text-center">
                      <div className="text-[10px] font-bold text-[#2A8C50] uppercase">Available Beds</div>
                      <div className="text-2xl font-black text-[#2A8C50] mt-1">
                        {dashboardData?.totalAvailable ?? 0}
                      </div>
                      <div className="text-[10px] text-[#2A8C50]/80">Live vacancies</div>
                    </div>
                  </div>

                  {dashboardData && dashboardData.totalCapacity > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-[#596573]">
                        <span>Platform Occupancy Rate</span>
                        <span>
                          {Math.round(
                            (dashboardData.totalOccupied / dashboardData.totalCapacity) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#E5E0D8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#39B86B] rounded-full transition-all"
                          style={{
                            width: `${(dashboardData.totalOccupied / dashboardData.totalCapacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* System Operational Badge Card */}
                <div className="campus-card p-6 bg-white border border-[#E5E0D8] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#17202A] mb-3 flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#39B86B]" />
                      Core Subsystem Status
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8]">
                        <span className="font-semibold text-[#596573]">Spring Boot Backend</span>
                        <span className="font-bold text-[#2A8C50] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
                          Online (8080)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8]">
                        <span className="font-semibold text-[#596573]">PostgreSQL Database</span>
                        <span className="font-bold text-[#2A8C50] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
                          Connected (5433)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8]">
                        <span className="font-semibold text-[#596573]">Stateless JWT Security</span>
                        <span className="font-bold text-[#2A8C50] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8]">
                        <span className="font-semibold text-[#596573]">Audit Hash Registry</span>
                        <span className="font-bold text-[#2A8C50] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
                          SHA-256 Stamped
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("system")}
                    className="mt-4 text-xs font-bold text-[#39B86B] hover:text-[#2A8C50] flex items-center justify-center gap-1 py-2 rounded-xl bg-[#EBF8F0] border border-[#39B86B]/30"
                  >
                    View System Diagnostics
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="campus-card p-6 bg-white border border-[#E5E0D8]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#17202A] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8A96A3]" />
                    Recent Administrative & System Activity
                  </h3>
                  <button
                    onClick={() => setActiveTab("audit")}
                    className="text-xs font-bold text-[#39B86B] hover:text-[#2A8C50]"
                  >
                    View All Logs ({auditLogs.length}) →
                  </button>
                </div>

                <div className="divide-y divide-[#E5E0D8]">
                  {(dashboardData?.recentActivities || []).map((activity) => (
                    <div key={activity.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#17202A]">{activity.action}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#F7F5EF] text-[#596573] border border-[#E5E0D8]">
                            {activity.result}
                          </span>
                        </div>
                        <p className="text-[#596573]">{activity.target}</p>
                        <p className="text-[10px] text-[#8A96A3] font-mono">{activity.details}</p>
                      </div>
                      <div className="text-right text-[11px] text-[#8A96A3] flex-shrink-0 font-medium">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : "Recently"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFICATION CENTER */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E5E0D8]">
                <div>
                  <h2 className="text-lg font-extrabold text-[#17202A]">Listing Verification Queue</h2>
                  <p className="text-xs text-[#596573] mt-0.5">
                    Review physical audit claims, verify pricing transparency, and stamp SHA-256 cryptographic records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {["PENDING", "ALL"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setVerificationFilter(filter)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                        verificationFilter === filter
                          ? "bg-[#17202A] text-white"
                          : "bg-[#F7F5EF] text-[#596573] hover:bg-[#E5E0D8]"
                      )}
                    >
                      {filter === "PENDING" ? "Pending Queue" : "All Properties"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Queue List */}
              <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <div className="divide-y divide-[#E5E0D8]">
                  {(verificationFilter === "PENDING"
                    ? verificationProperties
                    : allProperties.map((p) => ({
                        id: String(p.id),
                        listerId: String(p.listerId),
                        name: p.name,
                        type: p.type,
                        address: p.address,
                        locality: p.locality,
                        description: "",
                        latitude: 0,
                        longitude: 0,
                        rent: p.rent,
                        deposit: p.deposit,
                        foodCost: 0,
                        electricityCost: 0,
                        wifiCost: 0,
                        maintenanceCost: 0,
                        effectiveMonthlyCost: p.effectiveMonthlyCost,
                        facilities: p.facilities,
                        distanceKm: 0,
                        commuteTimeMin: 0,
                        commuteMode: "",
                        capacity: p.capacity,
                        occupied: p.occupied,
                        available: p.available,
                        availabilityStatus: "",
                        rating: p.rating,
                        verificationStatus: p.verificationStatus,
                        verificationHash: p.verificationHash,
                        blockchainTx: p.blockchainTx,
                        createdAt: p.createdAt,
                        updatedAt: p.updatedAt,
                      }))
                  ).length === 0 ? (
                    <div className="p-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#EBF8F0] flex items-center justify-center text-[#2A8C50] mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-[#39B86B]" />
                      </div>
                      <h3 className="text-base font-bold text-[#17202A]">No Submissions Pending</h3>
                      <p className="text-xs text-[#596573] mt-1">
                        All listing verification requests have been audited and resolved.
                      </p>
                    </div>
                  ) : (
                    (verificationFilter === "PENDING"
                      ? verificationProperties
                      : allProperties.map((p) => ({
                          id: String(p.id),
                          listerId: String(p.listerId),
                          name: p.name,
                          type: p.type,
                          address: p.address,
                          locality: p.locality,
                          description: "",
                          latitude: 0,
                          longitude: 0,
                          rent: p.rent,
                          deposit: p.deposit,
                          foodCost: 0,
                          electricityCost: 0,
                          wifiCost: 0,
                          maintenanceCost: 0,
                          effectiveMonthlyCost: p.effectiveMonthlyCost,
                          facilities: p.facilities,
                          distanceKm: 0,
                          commuteTimeMin: 0,
                          commuteMode: "",
                          capacity: p.capacity,
                          occupied: p.occupied,
                          available: p.available,
                          availabilityStatus: "",
                          rating: p.rating,
                          verificationStatus: p.verificationStatus,
                          verificationHash: p.verificationHash,
                          blockchainTx: p.blockchainTx,
                          createdAt: p.createdAt,
                          updatedAt: p.updatedAt,
                        }))
                    ).map((prop) => {
                      const effective = getEffectiveMonthlyCost(prop as Property);
                      const isPending =
                        prop.verificationStatus === "SUBMITTED_FOR_VERIFICATION" ||
                        prop.verificationStatus === "UNDER_REVIEW";

                      return (
                        <div
                          key={prop.id}
                          className="p-6 hover:bg-[#F7F5EF]/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#17202A] text-white">
                                #{prop.id}
                              </span>
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#E5E0D8] text-[#596573]">
                                {prop.type}
                              </span>
                              <span
                                className={cn(
                                  "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                                  prop.verificationStatus === "VERIFIED"
                                    ? "bg-[#EBF8F0] text-[#2A8C50] border-[#39B86B]/30"
                                    : prop.verificationStatus === "REJECTED"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-[#FFF8E7] text-[#D49B24] border-[#FFC857]/40"
                                )}
                              >
                                {String(prop.verificationStatus).replace(/_/g, " ")}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-[#17202A]">{prop.name}</h3>

                            <div className="flex items-center gap-1 text-xs text-[#596573]">
                              <MapPin className="w-3.5 h-3.5 text-[#8A96A3]" />
                              <span>{prop.address} ({prop.locality})</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                              <span className="font-bold text-[#17202A]">Base: {formatCurrency(prop.rent)}</span>
                              <span className="font-extrabold text-[#2A8C50]">
                                Effective: {formatCurrency(effective)}/mo
                              </span>
                              <span className="text-[#596573]">
                                Capacity: {prop.capacity} beds ({prop.occupied} occupied, {prop.available} available)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E0D8]">
                            <button
                              onClick={() => setSelectedProperty(prop as Property)}
                              className="btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Inspect
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleReview(prop.id)}
                                  className="text-xs py-2 px-3 font-bold rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                                  title="Mark under review"
                                >
                                  Under Review
                                </button>
                                <button
                                  onClick={() => handleApprove(prop.id)}
                                  className="btn-primary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5"
                                  title="Approve verification"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(prop.id)}
                                  className="text-xs font-bold text-[#E63946] hover:bg-red-50 p-2 rounded-xl border border-red-200 transition-colors"
                                  title="Reject listing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTY MANAGEMENT */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E5E0D8]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    placeholder="Search by property name, locality, address..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-xs font-medium text-[#17202A] outline-none focus:border-[#39B86B]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={propertyStatusFilter}
                    onChange={(e) => setPropertyStatusFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF] text-xs font-bold text-[#17202A] outline-none"
                  >
                    <option value="ALL">All Statuses ({allProperties.length})</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="SUBMITTED_FOR_VERIFICATION">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="DRAFT">Draft</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table of Properties */}
              <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#8A96A3] uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">ID</th>
                        <th className="px-5 py-3.5">Property & Locality</th>
                        <th className="px-5 py-3.5">Type</th>
                        <th className="px-5 py-3.5">Lister</th>
                        <th className="px-5 py-3.5">Base Rent</th>
                        <th className="px-5 py-3.5">Effective Total</th>
                        <th className="px-5 py-3.5">Live Vacancy</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {filteredProperties.map((p) => (
                        <tr key={p.id} className="hover:bg-[#F7F5EF]/50 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-[#17202A]">#{p.id}</td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-[#17202A]">{p.name}</div>
                            <div className="text-[11px] text-[#596573]">{p.locality}</div>
                          </td>
                          <td className="px-5 py-4 font-semibold text-[#596573]">{p.type}</td>
                          <td className="px-5 py-4 font-semibold text-[#17202A]">{p.listerName}</td>
                          <td className="px-5 py-4 font-bold text-[#17202A]">{formatCurrency(p.rent)}</td>
                          <td className="px-5 py-4 font-extrabold text-[#2A8C50]">
                            {formatCurrency(p.effectiveMonthlyCost)}/mo
                          </td>
                          <td className="px-5 py-4 font-semibold text-[#17202A]">
                            {p.available} of {p.capacity} beds
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                                p.verificationStatus === "VERIFIED"
                                  ? "bg-[#EBF8F0] text-[#2A8C50] border-[#39B86B]/30"
                                  : p.verificationStatus === "REJECTED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-[#FFF8E7] text-[#D49B24] border-[#FFC857]/40"
                              )}
                            >
                              {p.verificationStatus.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setSelectedProperty(p)}
                              className="btn-secondary text-[11px] py-1.5 px-3 font-bold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E5E0D8]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-xs font-medium text-[#17202A] outline-none focus:border-[#39B86B]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {["ALL", "STUDENT", "LISTER", "ADMIN"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                        userRoleFilter === role
                          ? "bg-[#17202A] text-white"
                          : "bg-[#F7F5EF] text-[#596573] hover:bg-[#E5E0D8]"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#8A96A3] uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">ID</th>
                        <th className="px-5 py-3.5">Name</th>
                        <th className="px-5 py-3.5">Masked Email</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Profile Attributes</th>
                        <th className="px-5 py-3.5">Security Status</th>
                        <th className="px-5 py-3.5">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#F7F5EF]/50 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-[#17202A]">#{u.id}</td>
                          <td className="px-5 py-4 font-bold text-[#17202A]">{u.name}</td>
                          <td className="px-5 py-4 font-mono text-[#596573]">{u.maskedEmail}</td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                                u.role === "STUDENT"
                                  ? "bg-[#EBF8F0] text-[#2A8C50] border-[#39B86B]/30"
                                  : u.role === "LISTER"
                                  ? "bg-[#FFF8E7] text-[#D49B24] border-[#FFC857]/40"
                                  : "bg-[#17202A] text-white border-[#17202A]"
                              )}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#596573]">
                            {u.details ? (
                              <div className="space-y-0.5 text-[11px]">
                                {u.details.college ? <div>College: {String(u.details.college)}</div> : null}
                                {u.details.budgetRange ? <div>Budget: {String(u.details.budgetRange)}</div> : null}
                                {u.details.organization ? <div>Org: {String(u.details.organization)}</div> : null}
                              </div>
                            ) : (
                              "Standard User"
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[10px] font-bold text-[#2A8C50] bg-[#EBF8F0] px-2 py-0.5 rounded-md border border-[#39B86B]/20">
                              BCrypt Protected
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#8A96A3] text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATA & PRIVACY CENTER */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E5E0D8]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
                  <Lock className="w-3.5 h-3.5" />
                  Data Governance & Classification Architecture
                </div>
                <h2 className="text-xl font-extrabold text-[#17202A]">CampusNest Data Classification</h2>
                <p className="text-xs text-[#596573] mt-1">
                  How CampusNest isolates, classifies, and protects student, lister, and system data across the platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(privacyData?.categories || []).map((cat) => (
                  <div key={cat.categoryName} className="campus-card p-6 bg-white border border-[#E5E0D8] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                      <h3 className="font-extrabold text-sm text-[#17202A]">{cat.categoryName}</h3>
                      <span
                        className={cn(
                          "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border",
                          cat.classification === "PUBLIC DATA"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : cat.classification === "PRIVATE DATA"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : cat.classification === "CONSENTED DATA"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        )}
                      >
                        {cat.classification}
                      </span>
                    </div>

                    <p className="text-xs text-[#596573] leading-relaxed">{cat.description}</p>

                    <div>
                      <span className="text-[10px] font-bold text-[#8A96A3] uppercase block mb-1.5">
                        Sample Data Fields:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.sampleFields.map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#17202A] text-[11px] font-semibold border border-[#E5E0D8]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8] text-[11px] text-[#596573]">
                      <span className="font-bold text-[#17202A]">Protection Policy: </span>
                      {cat.protectionMethod}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONSENT MANAGEMENT */}
          {activeTab === "consent" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E5E0D8]">
                <h2 className="text-xl font-extrabold text-[#17202A]">Active User Consent Registry</h2>
                <p className="text-xs text-[#596573] mt-1">
                  Transparent records of user-granted permissions for algorithmic matching, recommendations, and listing verification.
                </p>
              </div>

              <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#8A96A3] uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Consent ID</th>
                        <th className="px-5 py-3.5">User</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Data Category</th>
                        <th className="px-5 py-3.5">Purpose</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Granted Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {consentList.map((c) => (
                        <tr key={c.id} className="hover:bg-[#F7F5EF]/50 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-[#17202A]">{c.id}</td>
                          <td className="px-5 py-4 font-bold text-[#17202A]">{c.userName}</td>
                          <td className="px-5 py-4 font-semibold text-[#596573]">{c.userRole}</td>
                          <td className="px-5 py-4 font-semibold text-[#17202A]">{c.dataCategory}</td>
                          <td className="px-5 py-4 text-[#596573]">{c.purpose}</td>
                          <td className="px-5 py-4">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF8F0] text-[#2A8C50] border border-[#39B86B]/30">
                              {c.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#8A96A3] text-[11px]">
                            {c.timestamp ? new Date(c.timestamp).toLocaleString() : "Active"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E5E0D8]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8A96A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search logs by action, actor, or target..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E0D8] bg-[#F7F5EF]/40 text-xs font-medium text-[#17202A] outline-none focus:border-[#39B86B]"
                  />
                </div>

                <div className="text-xs font-bold text-[#596573]">
                  Showing {filteredAuditLogs.length} audit entries
                </div>
              </div>

              <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <div className="divide-y divide-[#E5E0D8]">
                  {filteredAuditLogs.map((log) => (
                    <div key={log.id} className="p-5 hover:bg-[#F7F5EF]/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#17202A] text-sm">{log.action}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#17202A] text-white">
                            {log.result}
                          </span>
                          <span className="text-[11px] text-[#596573]">Actor: <strong className="text-[#17202A]">{log.actor}</strong></span>
                        </div>
                        <div className="text-[#17202A] font-semibold">Target: {log.target}</div>
                        <div className="text-[11px] text-[#596573] font-mono break-all">{log.details}</div>
                      </div>

                      <div className="text-right text-[11px] text-[#8A96A3] font-medium flex-shrink-0">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Recently"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ANALYTICS & REPORTS */}
          {activeTab === "reports" && reportsData && (
            <div className="space-y-8">
              {/* Top Reports KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                    Verification Rate
                  </div>
                  <div className="text-3xl font-black text-[#2A8C50]">
                    {reportsData.verificationRatePercent}%
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Platform audited listings</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                    Average Base Rent
                  </div>
                  <div className="text-3xl font-black text-[#17202A]">
                    {formatCurrency(reportsData.averageRent)}
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Across all active rooms</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                    Average Effective Cost
                  </div>
                  <div className="text-3xl font-black text-[#2A8C50]">
                    {formatCurrency(reportsData.averageEffectiveCost)}/mo
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Includes meals, Wi-Fi & utilities</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider mb-1">
                    Bed Occupancy Rate
                  </div>
                  <div className="text-3xl font-black text-[#D49B24]">
                    {reportsData.occupancyRatePercent}%
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Real-time marketplace occupancy</div>
                </div>
              </div>

              {/* Locality Breakdown Table */}
              <div className="campus-card overflow-hidden bg-white border border-[#E5E0D8] shadow-sm">
                <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#E5E0D8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                    Locality & Sub-market Pricing Analysis
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#8A96A3] uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Locality / Zone</th>
                        <th className="px-5 py-3.5">Property Count</th>
                        <th className="px-5 py-3.5">Average Base Rent</th>
                        <th className="px-5 py-3.5">Average Effective Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {reportsData.localityBreakdown.map((loc) => (
                        <tr key={loc.locality} className="hover:bg-[#F7F5EF]/50 transition-colors">
                          <td className="px-5 py-4 font-bold text-[#17202A]">{loc.locality}</td>
                          <td className="px-5 py-4 font-semibold text-[#596573]">{loc.propertyCount} listings</td>
                          <td className="px-5 py-4 font-bold text-[#17202A]">{formatCurrency(loc.averageRent)}</td>
                          <td className="px-5 py-4 font-extrabold text-[#2A8C50]">
                            {formatCurrency(loc.averageEffectiveCost)}/mo
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SYSTEM HEALTH & INTEGRITY */}
          {activeTab === "system" && systemHealth && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E5E0D8]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F0] text-[#2A8C50] text-xs font-bold uppercase tracking-wider mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  Live Operational Diagnostics
                </div>
                <h2 className="text-xl font-extrabold text-[#17202A]">CampusNest System Health Monitor</h2>
                <p className="text-xs text-[#596573] mt-1">
                  Active verification of Spring Boot REST API, PostgreSQL database connectivity, stateless authentication, and cryptographic registry.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#8A96A3] uppercase">Backend Service</span>
                    <Server className="w-4 h-4 text-[#39B86B]" />
                  </div>
                  <div className="text-xl font-black text-[#2A8C50] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39B86B]" />
                    {systemHealth.backendStatus}
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Spring Boot 3.5.16 on port 8080</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#8A96A3] uppercase">PostgreSQL Database</span>
                    <Database className="w-4 h-4 text-[#39B86B]" />
                  </div>
                  <div className="text-xl font-black text-[#2A8C50] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39B86B]" />
                    {systemHealth.databaseStatus}
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">Query Latency: {systemHealth.databaseLatencyMs} ms</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#8A96A3] uppercase">Security Engine</span>
                    <Lock className="w-4 h-4 text-[#39B86B]" />
                  </div>
                  <div className="text-xl font-black text-[#2A8C50] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39B86B]" />
                    Operational
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">BCrypt + Stateless JWT (HMAC-256)</div>
                </div>

                <div className="campus-card p-5 bg-white border border-[#E5E0D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#8A96A3] uppercase">Cryptographic Registry</span>
                    <ShieldCheck className="w-4 h-4 text-[#39B86B]" />
                  </div>
                  <div className="text-xl font-black text-[#2A8C50] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39B86B]" />
                    Active
                  </div>
                  <div className="text-[11px] text-[#596573] mt-1">{systemHealth.blockchainStatus}</div>
                </div>
              </div>

              {/* Database Entity Row Counts */}
              <div className="campus-card p-6 bg-white border border-[#E5E0D8]">
                <h3 className="text-sm font-bold text-[#17202A] mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#8A96A3]" />
                  Live Persistence Entity Table Counts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E0D8]">
                    <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Users Table</div>
                    <div className="text-2xl font-black text-[#17202A] mt-1">{systemHealth.totalUsers} rows</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E0D8]">
                    <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Properties Table</div>
                    <div className="text-2xl font-black text-[#17202A] mt-1">{systemHealth.totalProperties} rows</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E0D8]">
                    <div className="text-[10px] font-bold text-[#8A96A3] uppercase">Verification Records</div>
                    <div className="text-2xl font-black text-[#17202A] mt-1">{systemHealth.totalVerificationRecords} records</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inspect & Audit Property Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-[#E5E0D8] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#8A96A3] uppercase tracking-wider">
                    Property Audit Inspector #{selectedProperty.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#17202A]">{selectedProperty.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1.5 rounded-xl bg-[#F7F5EF] border border-[#E5E0D8] text-[#596573] hover:text-[#17202A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inspector Content */}
              <div className="space-y-4 text-xs">
                <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#E5E0D8] space-y-2">
                  <div>
                    <span className="font-bold text-[#596573]">Locality & Address:</span>
                    <p className="text-[#17202A] font-semibold mt-0.5">
                      {selectedProperty.address} ({selectedProperty.locality})
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-[#596573]">Verification Status:</span>
                    <p className="text-[#17202A] font-bold mt-0.5">{String(selectedProperty.verificationStatus).replace(/_/g, " ")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] text-center">
                    <div className="font-bold text-[#8A96A3] text-[10px] uppercase">Base Rent</div>
                    <div className="font-extrabold text-sm text-[#17202A] mt-0.5">
                      {formatCurrency(selectedProperty.rent)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EBF8F0] border border-[#39B86B]/30 text-center">
                    <div className="font-bold text-[#2A8C50] text-[10px] uppercase">Effective Total</div>
                    <div className="font-extrabold text-sm text-[#2A8C50] mt-0.5">
                      {formatCurrency(
                        "effectiveMonthlyCost" in selectedProperty && selectedProperty.effectiveMonthlyCost
                          ? selectedProperty.effectiveMonthlyCost
                          : getEffectiveMonthlyCost(selectedProperty as Property)
                      )}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] text-center">
                    <div className="font-bold text-[#8A96A3] text-[10px] uppercase">Capacity</div>
                    <div className="font-extrabold text-sm text-[#17202A] mt-0.5">
                      {selectedProperty.capacity} Beds
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] text-center">
                    <div className="font-bold text-[#8A96A3] text-[10px] uppercase">Deposit</div>
                    <div className="font-extrabold text-sm text-[#17202A] mt-0.5">
                      {formatCurrency(selectedProperty.deposit)}
                    </div>
                  </div>
                </div>

                {selectedProperty.verificationHash && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1 font-mono text-[11px]">
                    <div className="text-[#8A96A3] font-bold text-[10px] uppercase">Cryptographic Audit Hash</div>
                    <div className="text-[#17202A] break-all">{selectedProperty.verificationHash}</div>
                    {selectedProperty.blockchainTx && (
                      <div className="text-[#596573] pt-1">Tx: {selectedProperty.blockchainTx}</div>
                    )}
                  </div>
                )}

                <div>
                  <span className="font-bold text-[#596573] block mb-2">Claimed Facilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProperty.facilities || []).map((fac) => (
                      <span
                        key={fac}
                        className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] text-[#17202A] font-semibold border border-[#E5E0D8]"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal for Pending Properties */}
              {(selectedProperty.verificationStatus === "SUBMITTED_FOR_VERIFICATION" ||
                selectedProperty.verificationStatus === "UNDER_REVIEW") && (
                <div className="flex items-center gap-3 pt-4 border-t border-[#E5E0D8]">
                  <button
                    onClick={() => handleApprove(String(selectedProperty.id))}
                    className="btn-primary flex-1 text-xs py-3 font-bold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Approve & Stamp Cryptographic Certificate
                  </button>
                  <button
                    onClick={() => handleReject(String(selectedProperty.id))}
                    className="btn-secondary flex-1 text-xs py-3 font-bold text-[#E63946] flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    Reject Submission
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-[#17202A] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 text-xs font-bold border border-[#39B86B]/40"
          >
            <CheckCircle2 className="w-4 h-4 text-[#39B86B]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
