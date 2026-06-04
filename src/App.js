import React, { useState } from 'react';
import { Clock, Dumbbell, Activity, Calendar, FileText, CheckCircle } from 'lucide-react';

// ==========================================
// 1. HARDCODED INGREDIENTS & MACROS DATA
// ==========================================
const MACRO_DATA = {
  meals: {
    proteinBar: { name: "Protein Bar", kcal: 170, p: 22.5, f: 5, c: 15, details: "1x Quick saving option" },
    resto: { name: "Company Restaurant Meal", kcal: 650, p: 35, f: 25, c: 50, details: "150g animal meat, 150g vegetables, 1 tbsp olive oil, small sweet dessert" },
    pasta: { name: "Pasta Meal", kcal: 550, p: 16, f: 16, c: 75, details: "100g dry pasta, 30g mozzarella cheese, 1 tbsp butter, choice of sauce" },
    eggsNormal: { name: "Standard Eggs Meal", kcal: 475, p: 28, f: 15, c: 10, details: "3x Eggs fried, 2 slices protein bread, 1 tbsp olive oil" },
    eggsMega: { name: "Mega Eggs Meal", kcal: 590, p: 35.5, f: 17, c: 17, details: "4x Eggs fried, 3 slices protein bread, 1 tbsp olive oil" },
    riceBatch: { name: "Rice & Meat Meal (Batch Cooked)", kcal: 600, p: 45, f: 8, c: 65, details: "Half of daily batch: 80g dry rice + 175g raw meat weight (chicken, beef, or fish)" },
    tunaMeal: { name: "Tuna Meal", kcal: 320, p: 40, f: 8, c: 20, details: "1x Tuna can (140g), 2 slices toast/protein bread, 1 tbsp light spread" },
    pureeMeal: { name: "Purée + Chicken Meal", kcal: 650, p: 35, f: 12, c: 100, details: "125g purée powder mix, 400ml milk, 100g pan-fried chicken/fish filet" },
    shakeLight: { name: "Pre-Sleep Shake (20g Oats)", kcal: 415, p: 31, f: 7, c: 53, details: "200ml milk, 22g whey protein (3 spoons), 1 banana, 20g oats" },
    shakeNormal: { name: "Pre-Sleep Shake (40g Oats)", kcal: 490, p: 34, f: 9, c: 63, details: "200ml milk, 22g whey protein (3 spoons), 1 banana, 40g oats" },
    shakeHeavy: { name: "Pre-Sleep Shake (60g Oats)", kcal: 565, p: 36, f: 10, c: 73, details: "200ml milk, 22g whey protein (3 spoons), 1 banana, 60g oats" },
    shakeHeavyPlus: { name: "Mega Pre-Sleep Shake (60g Oats + Extra Whey)", kcal: 615, p: 43, f: 10, c: 73, details: "200ml milk, 29g whey protein (4 spoons), 1 banana, 60g oats" },
    dates2: { name: "Quick Snack (2 Dates)", kcal: 60, p: 0.4, f: 0, c: 16, details: "2x Dates (avg 10g each) for immediate energy" },
    dates3: { name: "Quick Snack (3 Dates)", kcal: 90, p: 0.6, f: 0, c: 24, details: "3x Dates (avg 10g each) for immediate energy" },
    dates4: { name: "Quick Snack (4 Dates)", kcal: 120, p: 0.8, f: 0, c: 32, details: "4x Dates (avg 10g each) for immediate energy" },
    datesBarCombo: { name: "Massive Snack Combo", kcal: 290, p: 23.3, f: 5, c: 47, details: "1x Protein Bar + 4x Dates consumed with a large glass of milk" },
    pastaTuna: { name: "Tuna-Infused Pasta Dinner", kcal: 710, p: 53, f: 18, c: 85, details: "100g dry pasta, sauce, and 1 full can of tuna mixed directly into it" }
  }
};

// ==========================================
// 2. MAPPING THE 7 DAYS OF THE WEEK
// ==========================================
const DAYS_CONFIG = [
  {
    id: "monday",
    name: "Monday",
    type: "Office Day",
    notes: "High-carb pasta day. Perfect night to hit the gym right after work!",
    shouldTrain: true,
    schedule: [
      { time: "08:00 AM", type: "meal", key: "proteinBar" },
      { time: "12:00 PM", type: "meal", key: "resto" },
      { time: "06:30 PM", type: "meal", key: "dates3" },
      { time: "08:30 PM", type: "meal", key: "pasta" },
      { time: "09:30 PM", type: "workout", label: "Recommended Gym Session (9:30 PM - 11:00 PM)" },
      { time: "11:00 PM", type: "meal", key: "shakeNormal" }
    ]
  },
  {
    id: "tuesday",
    name: "Tuesday",
    type: "Office Day",
    notes: "High-carb pasta day. High energy available for training or rest recovery.",
    shouldTrain: true,
    schedule: [
      { time: "08:00 AM", type: "meal", key: "proteinBar" },
      { time: "12:00 PM", type: "meal", key: "resto" },
      { time: "06:30 PM", type: "meal", key: "dates3" },
      { time: "08:30 PM", type: "meal", key: "pasta" },
      { time: "11:00 PM", type: "meal", key: "shakeNormal" }
    ]
  },
  {
    id: "wednesday",
    name: "Wednesday",
    type: "Home Office (Rice Batch)",
    notes: "Batch-cooked rice meals split cleanly between Lunch and Dinner.",
    shouldTrain: false,
    schedule: [
      { time: "09:00 AM", type: "meal", key: "eggsNormal" },
      { time: "12:00 PM", type: "meal", key: "riceBatch" },
      { time: "04:00 PM", type: "meal", key: "dates3" },
      { time: "07:00 PM", type: "meal", key: "riceBatch" },
      { time: "10:30 PM", type: "meal", key: "shakeLight" }
    ]
  },
  {
    id: "thursday",
    name: "Thursday",
    type: "Home Office (Quick Mix)",
    notes: "Utilizes convenient single-serving pantry options like the purée and tuna.",
    shouldTrain: false,
    schedule: [
      { time: "09:00 AM", type: "meal", key: "eggsNormal" },
      { time: "01:00 PM", type: "meal", key: "tunaMeal" },
      { time: "04:30 PM", type: "meal", key: "dates2" },
      { time: "07:30 PM", type: "meal", key: "pureeMeal" },
      { time: "11:00 PM", type: "meal", key: "shakeNormal" }
    ]
  },
  {
    id: "friday",
    name: "Friday",
    type: "Home Office (Rice Batch)",
    notes: "Steady macros with clean food sources heading into the weekend.",
    shouldTrain: false,
    schedule: [
      { time: "09:00 AM", type: "meal", key: "eggsNormal" },
      { time: "12:00 PM", type: "meal", key: "riceBatch" },
      { time: "04:00 PM", type: "meal", key: "dates3" },
      { time: "07:00 PM", type: "meal", key: "riceBatch" },
      { time: "10:30 PM", type: "meal", key: "shakeLight" }
    ]
  },
  {
    id: "saturday",
    name: "Saturday",
    type: "Weekend Schedule",
    notes: "Waking up late (11 AM - 12 PM). Upgraded meal volumes to offset missing breakfast.",
    shouldTrain: false,
    schedule: [
      { time: "12:30 PM", type: "meal", key: "eggsMega" },
      { time: "04:00 PM", type: "meal", key: "dates4" },
      { time: "07:30 PM", type: "meal", key: "pasta" },
      { time: "11:30 PM", type: "meal", key: "shakeHeavy" }
    ]
  },
  {
    id: "sunday",
    name: "Sunday",
    type: "Late Wake Up Recovery",
    notes: "Emergency recovery layout for waking up late at 2:00 PM. Highly condensed meal timeline.",
    shouldTrain: false,
    schedule: [
      { time: "02:30 PM", type: "meal", key: "eggsMega" },
      { time: "05:30 PM", type: "meal", key: "datesBarCombo" },
      { time: "08:30 PM", type: "meal", key: "pastaTuna" },
      { time: "11:30 PM", type: "meal", key: "shakeHeavyPlus" }
    ]
  }
];

export default function App() {
  const [activeDayId, setActiveDayId] = useState("monday");

  // Find configuration for currently selected active day
  const activeDay = DAYS_CONFIG.find(d => d.id === activeDayId);

  // Calculate totals for active day by looking up each item key in the macro matrix
  const dayTotals = activeDay.schedule.reduce((acc, item) => {
    if (item.type === 'meal' && MACRO_DATA.meals[item.key]) {
      const meal = MACRO_DATA.meals[item.key];
      acc.kcal += meal.kcal;
      acc.p += meal.p;
      acc.f += meal.f;
      acc.c += meal.c;
    }
    return acc;
  }, { kcal: 0, p: 0, f: 0, c: 0 });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <header className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Activity className="text-emerald-400" /> Body Recomposition Dashboard
            </h1>
            <p className="text-slate-400 mt-1">72kg Lean Muscle Build & Fat Target Schedule</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 px-4 text-xs text-slate-300 max-w-sm">
            <span className="font-bold text-emerald-400">Target Protocol:</span> Slight deficit/maintenance combo, high protein tracking, and systematic fiber integration.
          </div>
        </header>

        {/* 7-Day Navigation Array Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
          {DAYS_CONFIG.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`flex-1 min-w-[100px] text-center py-3 px-4 rounded-lg font-medium transition-all text-sm ${
                activeDayId === day.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg font-bold'
                  : 'bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1 opacity-70" />
              {day.name}
            </button>
          ))}
        </div>

        {/* Main Grid Layout split into Content and Summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TIMELINE SECTION (Occupies 2 columns) */}
          <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="text-emerald-400 w-5 h-5" /> Diet Timeline Schedule
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeDay.type} Protocol</p>
              </div>
              {activeDay.shouldTrain && (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium animate-pulse">
                  <Dumbbell className="w-3.5 h-3.5" /> High Carbs: Gym Night
                </span>
              )}
            </div>

            {activeDay.notes && (
              <p className="bg-slate-900 border-l-4 border-emerald-500 p-3 rounded-r-lg text-sm text-slate-300 mb-8 italic">
                {activeDay.notes}
              </p>
            )}

            {/* Structured Simple Mapping Loop for the Timeline Items */}
            <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
              {activeDay.schedule.map((item, index) => {
                const isWorkout = item.type === 'workout';
                const mealData = !isWorkout ? MACRO_DATA.meals[item.key] : null;

                return (
                  <div key={index} className="relative group">
                    
                    {/* Visual Target Timeline Node Marker */}
                    <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                      isWorkout 
                        ? 'bg-amber-400 border-amber-400 scale-110 shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                        : 'bg-slate-900 border-emerald-500 group-hover:bg-emerald-400'
                    }`} />

                    {/* Timeline Event Card Content */}
                    <div className={`rounded-xl p-4 border transition-all ${
                      isWorkout 
                        ? 'bg-amber-950/20 border-amber-500/30 shadow-sm' 
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                    }`}>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-500" /> {item.time}
                        </span>
                        {mealData && (
                          <span className="bg-slate-800 text-slate-200 font-mono text-xs px-2 py-0.5 rounded border border-slate-700">
                            {mealData.kcal} kcal
                          </span>
                        )}
                      </div>

                      {isWorkout ? (
                        <div className="flex items-center gap-3 py-1 text-amber-300">
                          <Dumbbell className="w-5 h-5 shrink-0" />
                          <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-base font-bold text-white tracking-wide">{mealData?.name}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mealData?.details}</p>
                          
                          {/* Inner Macro Pill Matrix breakdown */}
                          <div className="flex flex-wrap gap-2 mt-3 font-mono text-xs">
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                              P: {mealData?.p}g
                            </span>
                            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">
                              C: {mealData?.c}g
                            </span>
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                              F: {mealData?.f}g
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR SIDE PANEL (Occupies 1 column) */}
          <div className="space-y-6">
            
            {/* Live Combined Accumulator Stats Macro Widget */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="text-emerald-400 w-5 h-5" /> Live Day Totals
              </h3>
              
              <div className="space-y-4">
                {/* Calories Accumulator */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                    <span>Total Energy Intake</span>
                    <span className="font-mono text-white font-bold">{dayTotals.kcal} / 2200 kcal</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${Math.min((dayTotals.kcal / 2200) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Protein Counter */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                    <span>Protein</span>
                    <span className="font-mono text-white font-bold">{dayTotals.p.toFixed(1)}g / 150g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${Math.min((dayTotals.p / 150) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Carbs Counter */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                    <span>Carbohydrates</span>
                    <span className="font-mono text-white font-bold">{dayTotals.c.toFixed(1)}g / 225g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full transition-all duration-500" style={{ width: `${Math.min((dayTotals.c / 225) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Fats Counter */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between text-xs text-slate-400 font-medium mb-1">
                    <span>Fats</span>
                    <span className="font-mono text-white font-bold">{dayTotals.f.toFixed(1)}g / 65g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${Math.min((dayTotals.f / 65) * 100, 100)}%` }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Action Store Budget Supplements Checklist Card */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="text-emerald-400 w-5 h-5" /> Budget Supplement Checklist
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Cheap, highly effective optimizations found easily at stores like Action to pair with this plan:</p>
              
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex gap-2.5 items-start bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-emerald-400 font-bold mt-0.5">☀️</span>
                  <div>
                    <strong className="text-white">Vitamin D3 (1 Pill)</strong>
                    <p className="text-slate-400 mt-0.5">Take in the morning with food. Crucial for office workers to keep testosterone levels optimization baseline clean.</p>
                  </div>
                </li>
                <li className="flex gap-2.5 items-start bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-emerald-400 font-bold mt-0.5">🌙</span>
                  <div>
                    <strong className="text-white">Magnesium (1 Pill)</strong>
                    <p className="text-slate-400 mt-0.5">Take right at night alongside your pre-sleep shake. Optimizes deep muscle relaxation and sleep recovery after late gym sessions.</p>
                  </div>
                </li>
                <li className="flex gap-2.5 items-start bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-emerald-400 font-bold mt-0.5">🌱</span>
                  <div>
                    <strong className="text-white">Psyllium Husk Powder (1 Tbsp)</strong>
                    <p className="text-slate-400 mt-0.5">Drink with water 10 mins before Mon/Tue pasta dinners. Safely buffers glucose absorption to match your 38g daily fiber target.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}