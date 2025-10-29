// composables/useNavigation.ts
import type { Component } from "vue";
import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarClock,
  MessageSquare,
  Stethoscope,
  FileText,
  Activity,
  Braces,
  Plug,
  Languages,
  Bell,
  BadgePercent,
  Shield,
  HelpCircle,
  Calendar,
  Image,
  ReceiptText,
} from "lucide-vue-next";

export interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: Component;
}

export const useNavigation = () => {
  const adminMenu: NavItem[] = [
    {
      id: "admin-dashboard",
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "admin-patients",
      name: "Patients",
      path: "/patient/list",
      icon: Users,
    },
    {
      id: "admin-doctor",
      name: "Doctors",
      path: "/doctor/list",
      icon: UserRound,
    },
    {
      id: "admin-appointment",
      name: "Appointments",
      path: "/appointment",
      icon: CalendarClock,
    },
    {
      id: "admin-support",
      name: "Support",
      path: "/support",
      icon: MessageSquare,
    },
    {
      id: "admin-records",
      name: "Medical Records",
      path: "/records",
      icon: Stethoscope,
    },
    { id: "admin-settings", name: "Settings", path: "/settings", icon: Braces },
  ];

  const websiteMenu: NavItem[] = [
    {
      id: "site-coupons",
      name: "Coupons",
      path: "/website/coupons",
      icon: BadgePercent,
    },
    {
      id: "site-treatments",
      name: "Treatments",
      path: "/website/treatments",
      icon: Stethoscope,
    },
    {
      id: "site-packages",
      name: "Tour Packages",
      path: "/website/packages",
      icon: Calendar,
    },
    {
      id: "site-terms",
      name: "Terms & Service",
      path: "/website/terms",
      icon: FileText,
    },
    {
      id: "site-privacy",
      name: "Privacy Policy",
      path: "/website/privacy",
      icon: Shield,
    },
    {
      id: "site-faqs",
      name: "FAQs & Help",
      path: "/website/faqs",
      icon: HelpCircle,
    },
    {
      id: "site-media",
      name: "Media Library",
      path: "/website/media",
      icon: Image,
    },
    {
      id: "site-payments",
      name: "Payments/Invoices",
      path: "/website/payments",
      icon: ReceiptText,
    },
  ];

  const toolsMenu: NavItem[] = [
    {
      id: "tools-staff",
      name: "Staff & Roles",
      path: "/admin/staff",
      icon: Users,
    },
    {
      id: "tools-audit",
      name: "Audit Logs",
      path: "/admin/audit",
      icon: FileText,
    },
    {
      id: "tools-api",
      name: "API & Webhooks",
      path: "/admin/api",
      icon: Braces,
    },
    {
      id: "tools-integr",
      name: "Integrations",
      path: "/integrations",
      icon: Plug,
    },
    {
      id: "tools-i18n",
      name: "Localization",
      path: "/admin/localization",
      icon: Languages,
    },
    {
      id: "tools-notify",
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      id: "tools-system",
      name: "System Health",
      path: "/admin/system",
      icon: Activity,
    },
    {
      id: "tools-data",
      name: "Import/Export",
      path: "/admin/data",
      icon: FileText,
    },
  ];

  return {
    adminMenu,
    websiteMenu,
    toolsMenu,
  };
};

// Backward compatibility exports
export const useAdminNav = () => useNavigation().adminMenu;
export const useWebsiteNav = () => useNavigation().websiteMenu;
export const useAdminToolsNav = () => useNavigation().toolsMenu;
