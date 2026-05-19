"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Trash2, Plus } from "lucide-react";

type TableARow = { school: string; male: string; female: string; total: string; time: string };
type TableBRow = { date: string; school: string; activity: string; attendance: string; spent: string };
type TableCRow = { date: string; loc: string; activity: string; attendance: string; achievement: string; spent: string };
type TableDRow = { school: string; wk1: boolean; wk2: boolean; wk3: boolean; wk4: boolean; wk5: boolean; total: string; remark: string };
type TableERow = { school: string; wk1: boolean; wk2: boolean; wk3: boolean; wk4: boolean; wk5: boolean; remark: string };
type TableGRow = { date: string; title: string; venue: string; spent: string; pilgrims: string; students: string; teachers: string };
type TableHRow = { school: string; loc: string; contact: string; phone: string };

type ReportFormValues = {
  monthYear: string;
  zone: string;
  tableA: TableARow[];
  tableB: TableBRow[];
  tableC: TableCRow[];
  tableD: TableDRow[];
  tableE: TableERow[];
  statsF: {
    totalSec: string;
    totalPri: string;
    totalVisits: string;
    totalVisitor: string;
    totalDevotion: string;
    totalClub: string;
  };
  tableG: TableGRow[];
  tableH: TableHRow[];
  pubsI: { guide: string; power: string; search: string };
  challengesJ: string;
  recommendationsK: string;
  prayersL: string;
};

export default function MissionaryReportPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, watch } = useForm<ReportFormValues>({
    defaultValues: {
      monthYear: "2026-04",
      zone: "Nchia",
      tableA: [{ school: "", male: "", female: "", total: "", time: "" }],
      tableB: [{ date: "", school: "", activity: "", attendance: "", spent: "" }],
      tableC: [{ date: "", loc: "", activity: "", attendance: "", achievement: "", spent: "" }],
      tableD: [{ school: "", wk1: false, wk2: false, wk3: false, wk4: false, wk5: false, total: "", remark: "" }],
      tableE: [{ school: "", wk1: false, wk2: false, wk3: false, wk4: false, wk5: false, remark: "" }],
      statsF: { totalSec: "", totalPri: "", totalVisits: "", totalVisitor: "", totalDevotion: "", totalClub: "" },
      tableG: [{ date: "", title: "", venue: "", spent: "", pilgrims: "", students: "", teachers: "" }],
      tableH: [{ school: "", loc: "", contact: "", phone: "" }],
      pubsI: { guide: "", power: "", search: "" },
      challengesJ: "",
      recommendationsK: "",
      prayersL: ""
    }
  });

  const { fields: fieldsA, append: appendA, remove: removeA } = useFieldArray({ control, name: "tableA" });
  const { fields: fieldsB, append: appendB, remove: removeB } = useFieldArray({ control, name: "tableB" });
  const { fields: fieldsC, append: appendC, remove: removeC } = useFieldArray({ control, name: "tableC" });
  const { fields: fieldsD, append: appendD, remove: removeD } = useFieldArray({ control, name: "tableD" });
  const { fields: fieldsE, append: appendE, remove: removeE } = useFieldArray({ control, name: "tableE" });
  const { fields: fieldsG, append: appendG, remove: removeG } = useFieldArray({ control, name: "tableG" });
  const { fields: fieldsH, append: appendH, remove: removeH } = useFieldArray({ control, name: "tableH" });

  const onSubmit = async (data: ReportFormValues, status: "draft" | "submitted") => {
    if (!auth.currentUser) return alert("You must be logged in!");
    
    status === "draft" ? setIsSaving(true) : setIsSubmitting(true);
    
    try {
      const reportId = `report_${auth.currentUser.uid}_${Date.now()}`;
      
      // Compute aggregates for easy dashboard access
      const totalDecisions = data.tableB.reduce((sum, row) => sum + (parseInt(row.attendance) || 0), 0);
      const totalSchools = (parseInt(data.statsF.totalSec) || 0) + (parseInt(data.statsF.totalPri) || 0);

      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Missionary",
        reportType: "Missionary Report",
        status: status,
        data: data,
        month: data.monthYear,
        year: parseInt(data.monthYear.split('-')[0]),
        decisions: totalDecisions,
        schoolsVisited: totalSchools,
        createdAt: serverTimestamp(),
        submittedAt: status === "submitted" ? serverTimestamp() : null,
      });
      alert(status === "draft" ? "Draft saved successfully!" : "Report submitted officially!");
      if (status === "submitted") router.push("/dashboard");
    } catch (error: any) {
      alert("Error saving report: " + error.message);
    } finally {
      setIsSaving(false);
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full p-2 text-sm border-none focus:ring-1 focus:ring-[#1b5e20] bg-transparent outline-none";
  const selectClass = "px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm bg-white";
  const thClass = "bg-[#fffdf7] text-gray-700 p-3 text-sm font-bold border border-gray-200 text-left";
  const tdClass = "p-0 border border-gray-200 bg-white min-w-[80px]";
  const addBtnClass = "mt-3 text-sm text-[#1b5e20] border-2 border-[#1b5e20] hover:bg-[#1b5e20] hover:text-white px-4 py-2 rounded-md font-bold flex items-center gap-1 transition-colors";

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b-2 border-[#1b5e20] pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b5e20]">Missionary's Monthly Report</h2>
          <p className="text-gray-600 font-medium">Scripture Union (Nigeria) Port Harcourt Region, Eleme Area</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Month/Year:</label>
            <input type="month" {...register("monthYear")} className={selectClass} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Zone:</label>
            <select {...register("zone")} className={selectClass}>
              <option>Nchia</option><option>Gokana</option><option>Bori</option><option>Andoni</option>
              <option>Etche</option><option>Afam</option><option>Odido/Tai</option><option>Omuma</option>
            </select>
          </div>
        </div>
      </div>

      <form className="space-y-8 pb-20">
        
        {/* Section A */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">A. Statistics of Schools</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thClass}>School Name</th>
                  <th className={thClass}>Male</th>
                  <th className={thClass}>Female</th>
                  <th className={thClass}>Total</th>
                  <th className={thClass}>Day/Time</th>
                  <th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                {fieldsA.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input {...register(`tableA.${index}.school`)} className={inputClass} placeholder="School name" /></td>
                    <td className={tdClass}><input type="number" {...register(`tableA.${index}.male`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableA.${index}.female`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableA.${index}.total`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableA.${index}.time`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeA(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendA({ school: "", male: "", female: "", total: "", time: "" })} className={addBtnClass}><Plus size={16}/> Add School</button>
        </section>

        {/* Section B */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-1">B. Daily Visitation Log</h3>
          <p className="text-gray-500 text-sm mb-4">Log your activities for each visit during the month.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>School Visited</th>
                  <th className={thClass}>Purpose/Activity</th>
                  <th className={thClass}>Attendance</th>
                  <th className={thClass}>Amount Spent</th>
                  <th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                {fieldsB.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input type="date" {...register(`tableB.${index}.date`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableB.${index}.school`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableB.${index}.activity`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableB.${index}.attendance`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableB.${index}.spent`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeB(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendB({ date: "", school: "", activity: "", attendance: "", spent: "" })} className={addBtnClass}><Plus size={16}/> Add Daily Entry</button>
        </section>

        {/* Section C */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-[#ffca28]">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">C. Neighbourhood Bible Club & Youth Life Skill Club</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Location</th>
                  <th className={thClass}>Activity/Purpose</th>
                  <th className={thClass}>Attendance</th>
                  <th className={thClass}>Achievement</th>
                  <th className={thClass}>Amount Spent</th>
                  <th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                {fieldsC.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input type="date" {...register(`tableC.${index}.date`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableC.${index}.loc`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableC.${index}.activity`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableC.${index}.attendance`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableC.${index}.achievement`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableC.${index}.spent`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeC(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendC({ date: "", loc: "", activity: "", attendance: "", achievement: "", spent: "" })} className={addBtnClass}><Plus size={16}/> Add Club Entry</button>
        </section>

        {/* Section D Checkboxes Table */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">D. Secondary School Visitation Weekly Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className={thClass}>School Name</th>
                  <th className={thClass + " text-center"}>Wk 1</th>
                  <th className={thClass + " text-center"}>Wk 2</th>
                  <th className={thClass + " text-center"}>Wk 3</th>
                  <th className={thClass + " text-center"}>Wk 4</th>
                  <th className={thClass + " text-center"}>Wk 5</th>
                  <th className={thClass + " text-center"}>Total Visits</th>
                  <th className={thClass}>Remark</th>
                  <th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                {fieldsD.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input {...register(`tableD.${index}.school`)} className={inputClass} placeholder="School name..." /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableD.${index}.wk1`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableD.${index}.wk2`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableD.${index}.wk3`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableD.${index}.wk4`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableD.${index}.wk5`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="number" {...register(`tableD.${index}.total`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableD.${index}.remark`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeD(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendD({ school: "", wk1: false, wk2: false, wk3: false, wk4: false, wk5: false, total: "", remark: "" })} className={addBtnClass}><Plus size={16}/> Add School Analysis</button>
        </section>

        {/* Section E Checkboxes Table */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">E. Primary School Visitation Weekly Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className={thClass}>School Name</th>
                  <th className={thClass + " text-center"}>Wk 1</th>
                  <th className={thClass + " text-center"}>Wk 2</th>
                  <th className={thClass + " text-center"}>Wk 3</th>
                  <th className={thClass + " text-center"}>Wk 4</th>
                  <th className={thClass + " text-center"}>Wk 5</th>
                  <th className={thClass}>Remark</th>
                  <th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                {fieldsE.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input {...register(`tableE.${index}.school`)} className={inputClass} placeholder="School name..." /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableE.${index}.wk1`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableE.${index}.wk2`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableE.${index}.wk3`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableE.${index}.wk4`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input type="checkbox" {...register(`tableE.${index}.wk5`)} className="w-5 h-5 accent-[#1b5e20]" /></td>
                    <td className={tdClass}><input {...register(`tableE.${index}.remark`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeE(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendE({ school: "", wk1: false, wk2: false, wk3: false, wk4: false, wk5: false, remark: "" })} className={addBtnClass}><Plus size={16}/> Add Primary School Analysis</button>
        </section>

        {/* Section F Summary Analysis */}
        <section className="bg-[#1b5e20]/5 p-6 rounded-lg shadow-sm border border-[#1b5e20]/20">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">F. Monthly Summary Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-gray-700">Total Secondary Schools</label><input type="number" {...register("statsF.totalSec")} className={selectClass} /></div>
            <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-gray-700">Total Primary Schools</label><input type="number" {...register("statsF.totalPri")} className={selectClass} /></div>
            <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-gray-700">Total School Visits</label><input type="number" {...register("statsF.totalVisits")} className={selectClass} /></div>
            <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-gray-700">Total School Visitor</label><input type="number" {...register("statsF.totalVisitor")} className={selectClass} /></div>
            <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-gray-700">Schools with Morning Devotion</label><input type="number" {...register("statsF.totalDevotion")} className={selectClass} /></div>
            <div className="flex flex-col gap-1.5"><label className="text-sm font-bold text-gray-700">Schools with Bible Club/Fellowship</label><input type="number" {...register("statsF.totalClub")} className={selectClass} /></div>
          </div>
        </section>

        {/* Section G Programmes Held */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">G. Major School/Youth Programmes Held</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className={thClass}>Date</th><th className={thClass}>Title of Programme</th><th className={thClass}>Venue</th>
                  <th className={thClass}>Amount Spent</th><th className={thClass}>Pilgrims</th><th className={thClass}>Students</th><th className={thClass}>Teachers</th><th className={thClass}></th>
                </tr>
              </thead>
              <tbody>
                {fieldsG.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input type="date" {...register(`tableG.${index}.date`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableG.${index}.title`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableG.${index}.venue`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableG.${index}.spent`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableG.${index}.pilgrims`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableG.${index}.students`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="number" {...register(`tableG.${index}.teachers`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeG(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendG({ date: "", title: "", venue: "", spent: "", pilgrims: "", students: "", teachers: "" })} className={addBtnClass}><Plus size={16}/> Add Programme</button>
        </section>

        {/* Section H New Groups */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-[#1b5e20] mb-4">H. New School Groups Opened</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr><th className={thClass}>Name of School</th><th className={thClass}>Location</th><th className={thClass}>Contact Person</th><th className={thClass}>Phone</th><th className={thClass}></th></tr>
              </thead>
              <tbody>
                {fieldsH.map((field, index) => (
                  <tr key={field.id}>
                    <td className={tdClass}><input {...register(`tableH.${index}.school`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableH.${index}.loc`)} className={inputClass} /></td>
                    <td className={tdClass}><input {...register(`tableH.${index}.contact`)} className={inputClass} /></td>
                    <td className={tdClass}><input type="tel" {...register(`tableH.${index}.phone`)} className={inputClass} /></td>
                    <td className="p-1 border border-gray-200 text-center"><button type="button" onClick={() => removeH(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => appendH({ school: "", loc: "", contact: "", phone: "" })} className={addBtnClass}><Plus size={16}/> Add New Group</button>
        </section>

        {/* Sections I-L Textareas and Feedback */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-[1] space-y-4">
              <h3 className="text-lg font-bold text-[#1b5e20]">I. Publications & Feedback</h3>
              <p className="text-sm font-bold text-gray-700">Ministry Publications Sold:</p>
              <div className="space-y-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center"><span className="text-sm font-medium">Daily Guide:</span><input type="number" {...register("pubsI.guide")} className="w-24 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#1b5e20] outline-none" /></div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium">Daily Power:</span><input type="number" {...register("pubsI.power")} className="w-24 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#1b5e20] outline-none" /></div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium">Search:</span><input type="number" {...register("pubsI.search")} className="w-24 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#1b5e20] outline-none" /></div>
              </div>
            </div>
            <div className="flex-[2] space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">J. Major Challenges</label>
                <textarea {...register("challengesJ")} rows={3} placeholder="List the challenges encountered during the month..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b5e20] outline-none resize-none text-sm"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">K. Recommendation</label>
                <textarea {...register("recommendationsK")} rows={3} placeholder="Your recommendations for improvement..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b5e20] outline-none resize-none text-sm"></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">L. Prayer Requests</label>
                <textarea {...register("prayersL")} rows={3} placeholder="Ministry and personal prayer points..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b5e20] outline-none resize-none text-sm"></textarea>
              </div>
            </div>
          </div>
        </section>

        {/* Action Panel Footer */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_10px_rgb(0,0,0,0.05)] flex justify-end gap-4 z-50">
          <button 
            type="button" 
            onClick={() => handleSubmit((data) => onSubmit(data, "draft"))()}
            disabled={isSaving || isSubmitting}
            className="px-6 py-2 border-2 border-[#1b5e20] text-[#1b5e20] font-bold rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Draft Progress"}
          </button>
          
          <button 
            type="button" 
            onClick={() => handleSubmit((data) => onSubmit(data, "submitted"))()}
            disabled={isSaving || isSubmitting}
            className="px-6 py-2 bg-[#1b5e20] text-white font-bold rounded shadow-lg hover:bg-[#2e7d32] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Official Monthly Report"}
          </button>
        </div>

      </form>
    </div>
  );
}
