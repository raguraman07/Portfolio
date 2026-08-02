"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  Award,
  Layers,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

interface RecentProjectItem {
  id?: string;
  title: string;
  description: string;
  created_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    techStack: 0,
  });

  const [recentProjects, setRecentProjects] = useState<RecentProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [
        projectsRes,
        certificatesRes,
        techStackRes,
        recentProjectsRes,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("certificates")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("tech_stack")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("projects")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(10),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        certificates: certificatesRes.count || 0,
        techStack: techStackRes.count || 0,
      });

      setRecentProjects(recentProjectsRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }

    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    setAuthorized(true);
    fetchDashboard();
  }, [router, fetchDashboard]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const cards = [
    {
      icon: Eye,
      title: "Total Projects",
      value: stats.projects,
    },
    {
      icon: Award,
      title: "Certificates",
      value: stats.certificates,
    },
    {
      icon: Layers,
      title: "Tech Stack",
      value: stats.techStack,
    },
  ];

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Sidebar />

      <main className="lg:ml-[250px] pt-[95px] lg:pt-6 min-h-screen px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">
                Dashboard
              </h1>

              <p className="text-sm text-white/40 mt-1">
                Welcome back, Admin
              </p>
            </div>

            <button
              onClick={fetchDashboard}
              className="h-11 px-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm group"
            >
              <RefreshCcw
                size={14}
                className="group-hover:rotate-180 transition duration-500"
              />
              Refresh
            </button>
          </div>

          {/* TOP CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {cards.map((card, i) => {
              const Icon = card.icon;

              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 px-5 py-4 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-white/45 mb-2">
                        {card.title}
                      </p>

                      <h2 className="text-[24px] sm:text-[26px] font-bold leading-none">
                        {loading ? "..." : card.value}
                      </h2>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition">
                      <Icon size={15} />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[10px] text-white/25">
                      Database synced
                    </p>

                    <TrendingUp
                      size={12}
                      className="text-white/25"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* RECENT PROJECTS */}
            <div className="xl:col-span-2 rounded-2xl border border-white/10 p-5 sm:p-6 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/15 transition">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-medium">
                    Recent Projects
                  </h2>

                  <p className="text-xs text-white/35 mt-1">
                    Latest portfolio showcase items
                  </p>
                </div>

                <span className="text-xs text-white/35">
                  Live DB
                </span>
              </div>

              <div className="max-h-[580px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {loading ? (
                  <div className="text-sm text-white/30">
                    Loading projects...
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="text-sm text-white/30">
                    No projects added yet
                  </div>
                ) : (
                  recentProjects.map((project, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-medium truncate text-white">
                            {project.title}
                          </p>

                          <p className="text-[12px] text-white/45 mt-1 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SIDE PANEL */}
            <div className="space-y-4">
              {[
                {
                  title: "Projects",
                  desc: `${stats.projects} total projects`,
                },
                {
                  title: "Certificates",
                  desc: `${stats.certificates} certificates`,
                },
                {
                  title: "Tech Stack",
                  desc: `${stats.techStack} tech items`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 p-5 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="text-sm font-medium">
                    {item.title}
                  </p>

                  <p className="text-xs text-white/40 mt-2">
                    {loading ? "Loading..." : item.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/30">
                      Synced
                    </span>

                    <span className="text-[11px] text-green-300">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}