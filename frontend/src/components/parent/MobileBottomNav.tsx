"use client";

import { House, ClipboardText, BookOpen, ChartBar } from "@phosphor-icons/react";
import { DashboardTheme } from "../../types/theme";
import { MenuKey, AcademicTab } from "../../types/dashboard";

/**
 * Mobile bottom navigation.
 *
 * Button placement is taken 1:1 from the Figma mobile frames (STUDENT FLOW /
 * PARENT FLOW, 430px wide):
 *
 *   bar            430 x 99 in Figma (70px tab row + 29px iOS home-indicator).
 *                  On the web the 29px OS strip is dropped — see below — so the
 *                  bar is 70px + env(safe-area-inset-bottom).
 *   tab row        padding 0 24px, 4 tabs of 81px, space-between
 *                  -> x = 24, 125, 225, 326  (gap ≈ 19.3px)
 *   tab            paddingTop 10, 28px icon box (icons bottom-aligned at y=38),
 *                  5px gap, 19px label (y=43..62)
 *
 * Only the *placement* is copied — colours, fonts and icons come from the
 * project's own theme, not from Figma.
 */

export type BottomNavId = "home" | "timetable" | "homework" | "performance";

interface Props {
  activeMenu: MenuKey;
  academicTab: AcademicTab | "timetable";
  theme: DashboardTheme;
  onNavigate: (menu: MenuKey, tab?: AcademicTab | "timetable") => void;
}

interface NavItem {
  id: BottomNavId;
  label: string;
  icon: typeof House;
  menu: MenuKey;
  tab?: AcademicTab | "timetable";
}

const ITEMS: NavItem[] = [
  { id: "home",       label: "Home",        icon: House,        menu: "dashboard" },
  { id: "timetable",  label: "Time Table",  icon: ClipboardText, menu: "academic", tab: "timetable" },
  { id: "homework",   label: "Homework",    icon: BookOpen,     menu: "diary" },
  { id: "performance",label: "Performance", icon: ChartBar,     menu: "academic", tab: "exam" },
];

function isItemActive(item: NavItem, activeMenu: MenuKey, academicTab: AcademicTab | "timetable") {
  switch (item.id) {
    case "home":        return activeMenu === "dashboard";
    case "homework":    return activeMenu === "diary";
    case "timetable":   return activeMenu === "academic" && academicTab !== "exam";
    case "performance": return activeMenu === "academic" && academicTab === "exam";
    default:            return false;
  }
}

export default function MobileBottomNav({ activeMenu, academicTab, theme, onNavigate }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{
        background: theme.cardBg,
        borderTop: `1px solid ${theme.border}`,
        boxShadow: "0 -6px 24px rgba(0,0,0,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Tab row — 70px tall, 24px side padding, 81px tabs, space-between */}
      <div
        style={{
          height: 70,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item, activeMenu, academicTab);
          return (
            <button
              key={item.id}
              type="button"
              className="mobile-tab"
              onClick={() => onNavigate(item.menu, item.tab)}
              aria-current={isActive ? "page" : undefined}
              style={{
                flex: "0 1 81px",
                width: 81,
                minWidth: 64,
                height: 70,
                paddingTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? theme.accent : theme.textMuted,
                transition: "color 0.2s ease",
              }}
            >
              {/* 28px icon box, icons bottom-aligned at y=38 like Figma */}
              <span
                style={{
                  height: 28,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Icon size={item.id === "home" ? 26 : 24} weight={isActive ? "fill" : "regular"} />
              </span>
              <span
                style={{
                  marginTop: 5,
                  // 12px matches the Figma label height (19px box); scales down only
                  // on very narrow phones so neighbouring labels never collide.
                  fontSize: "clamp(10px, 2.8vw, 12px)",
                  lineHeight: "19px",
                  fontWeight: isActive ? 700 : 600,
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safe-area / breathing room below the tabs. Figma reserves 29px here for
          the iOS home indicator; on the web that reads as an empty void, so the
          strip collapses to 8px and only grows when a real safe-area inset exists. */}
      <div style={{ height: 8 }} />
    </nav>
  );
}
