"use client";

import { useCallback } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getTimetable } from "../../services/mock-data-service";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";

export function TimetablePage() {
  const loadTimetable = useCallback(
    (accessToken: string) => getTimetable(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadTimetable);

  // Define headers for the periods
  const periodHeaders = ["I", "II", "III", "LUNCH", "IV", "V", "VI", "VII"];

  const getDaySchedule = (dayName: string) => {
    return data?.schedule.find(s => s.day === dayName);
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <PageSection
      eyebrow="Academic Schedule"
      title="Master Timetable"
      description="Weekly academic period allocations and lab sessions."
    >
      {isLoading ? <ResourceLoading label="timetable" /> : null}
      {error ? <ResourceError label="timetable" message={error} /> : null}
      {data ? (
        <div className="w-full overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 text-left font-extrabold text-slate-500 uppercase tracking-widest border-r border-slate-200 min-w-[140px]">Day/Period</th>
                {periodHeaders.map((header, i) => (
                  <th key={i} className="p-5 text-center font-extrabold text-slate-900 uppercase tracking-widest border-r border-slate-200 last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const schedule = getDaySchedule(day);
                return (
                  <tr key={day} className="border-b border-slate-100 last:border-b-0 group hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-black text-slate-900 border-r border-slate-200 bg-slate-50/30">{day}</td>
                    
                    {/* Period I-III */}
                    {day === "Tuesday" || day === "Friday" ? (
                      <td colSpan={3} className="p-5 text-center bg-slate-100/50 font-bold text-slate-600 uppercase tracking-[0.3em]">LAB</td>
                    ) : (
                      <>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[0]?.subject.split(' ')[0] || '-'}</td>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[1]?.subject.split(' ')[0] || '-'}</td>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[2]?.subject.split(' ')[0] || '-'}</td>
                      </>
                    )}

                    {/* LUNCH - Vertically merged in spirit across rows */}
                    <td className="p-5 text-center border-r border-slate-200 font-black text-slate-400 bg-slate-50/30 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 md:[writing-mode:horizontal-tb] md:rotate-0">
                      LUNCH
                    </td>

                    {/* Period IV-VII */}
                    {day === "Monday" || day === "Thursday" ? (
                      <td colSpan={3} className="p-5 text-center border-r border-slate-100 bg-slate-100/50 font-bold text-slate-600 uppercase tracking-[0.3em]">LAB</td>
                    ) : day === "Saturday" ? (
                      <td colSpan={3} className="p-5 text-center border-r border-slate-100 bg-slate-100/50 font-bold text-slate-600 uppercase tracking-[0.3em]">SEMINAR</td>
                    ) : day === "Wednesday" ? (
                      <>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[3]?.subject.split(' ')[0] || 'Che'}</td>
                        <td colSpan={2} className="p-5 text-center border-r border-slate-100 bg-slate-100/50 font-bold text-slate-600 uppercase tracking-[0.3em]">LIBRARY</td>
                      </>
                    ) : (
                      <>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[3]?.subject.split(' ')[0] || 'Eng'}</td>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[4]?.subject.split(' ')[0] || 'Che'}</td>
                        <td className="p-5 text-center border-r border-slate-100 font-bold text-slate-700">{schedule?.periods[5]?.subject.split(' ')[0] || 'Mat'}</td>
                      </>
                    )}

                    {/* Last Period - Sports check */}
                    <td className="p-5 text-center font-bold text-slate-700 last:border-r-0">
                      {day === "Tuesday" || day === "Saturday" ? (
                        <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-500 text-[10px] uppercase tracking-widest font-black">SPORTS</span>
                      ) : (
                        schedule?.periods[6]?.subject.split(' ')[0] || 'Phy'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </PageSection>
  );
}

