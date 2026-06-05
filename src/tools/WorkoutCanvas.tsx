import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Toast from "../components/Toast";
import {
  Dumbbell,
  Zap,
  Copy,
  Trash2,
  AlertCircle,
  ShieldAlert,
  Database,
  Info,
  X,
  Smartphone,
  Check,
  Plus,
  Minus,
  MessageSquare,
  RotateCcw,
  BookOpen,
  Settings,
  BrainCircuit
} from "lucide-react";

interface ExerciseSet {
  w: number;
  r: number;
}

interface ExerciseItem {
  id: string;
  name: string;
  category: string;
  target: string;
  isWarmup?: boolean;
  isCardio?: boolean;
  isBodyweight?: boolean;
  duration?: number;
  weight: number;
  reps: number;
  step: number;
  sets: (ExerciseSet | null)[];
  note: string;
  tip: string;
}

interface DayRoutine {
  mainTitle: string;
  subTitle: string;
  directive: string; // Internally mapped to focus/session notes to maintain localStorage compatibility
  items: ExerciseItem[];
}

interface WorkoutDatabase {
  [day: string]: DayRoutine;
}

const DEFAULT_DATABASE: WorkoutDatabase = {
  mon: {
    mainTitle: "Monday: Pull (Back & Biceps)",
    subTitle: "Build strength and improve posture with pull patterns",
    directive: "Focus on driving with your elbows during back movements to maximize lat engagement. Keep your shoulders down and chest tall.",
    items: [
      { id: "mon-0", name: "Treadmill Walk (Warmup)", category: "Warmup", target: "Easy walk 10 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 10, sets: [], note: "", tip: "General circulation" },
      { id: "mon-1", name: "Lat Pulldown (Wide Grip)", category: "Back", target: "30kg x 12 reps", weight: 30, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Squeeze shoulder blades" },
      { id: "mon-2", name: "Seated Cable Row", category: "Back", target: "35kg x 12 reps", weight: 35, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Keep posture upright" },
      { id: "mon-3", name: "Dumbbell Bicep Curl", category: "Biceps", target: "8kg x 12 reps", weight: 8, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Control the descent" },
      { id: "mon-4", name: "Plank Hold", category: "Core", target: "Bodyweight x 60 sec", isBodyweight: true, weight: 0, reps: 60, step: 1, sets: [null, null, null], note: "", tip: "Engage glutes & abs" }
    ]
  },
  tue: {
    mainTitle: "Tuesday: Cardio & Core Focus",
    subTitle: "Build aerobic endurance and core stability",
    directive: "Maintain a steady heart rate. Focus on breathing through your diaphragm and keeping your core braced during stability work.",
    items: [
      { id: "tue-0", name: "Dynamic Stretching (Warmup)", category: "Warmup", target: "Full body mobility 5 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 5, sets: [], note: "", tip: "Lubricate joints" },
      { id: "tue-1", name: "Plank Hold", category: "Core", target: "Bodyweight x 60 sec", isBodyweight: true, weight: 0, reps: 60, step: 1, sets: [null, null, null], note: "", tip: "Keep hips level" },
      { id: "tue-2", name: "Bicycle Crunches", category: "Core", target: "Bodyweight x 20 reps", isBodyweight: true, weight: 0, reps: 20, step: 1, sets: [null, null, null], note: "", tip: "Slow controlled twists" },
      { id: "tue-3", name: "Elliptical Trainer (Cardio)", category: "Cardio", target: "20 min", isCardio: true, weight: 0, reps: 0, step: 5, duration: 20, sets: [], note: "", tip: "Steady aerobic pace" }
    ]
  },
  wed: {
    mainTitle: "Wednesday: Push (Chest, Shoulders & Triceps)",
    subTitle: "Develop upper body pressing strength",
    directive: "Keep your wrists stacked and elbows slightly tucked (around 45 degrees) to protect your shoulder joints. Press with control.",
    items: [
      { id: "wed-0", name: "Treadmill Walk (Warmup)", category: "Warmup", target: "Easy walk 10 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 10, sets: [], note: "", tip: "Warm up shoulders" },
      { id: "wed-1", name: "Chest Press Machine", category: "Chest", target: "30kg x 12 reps", weight: 30, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Drive from chest fibers" },
      { id: "wed-2", name: "Dumbbell Shoulder Press", category: "Shoulders", target: "10kg x 12 reps", weight: 10, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Keep core braced" },
      { id: "wed-3", name: "Dumbbell Lateral Raise", category: "Shoulders", target: "5kg x 15 reps", weight: 5, reps: 15, step: 0.5, sets: [null, null, null], note: "", tip: "Lead with elbows" },
      { id: "wed-4", name: "Tricep Rope Pushdown", category: "Triceps", target: "15kg x 12 reps", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Full elbow extension" }
    ]
  },
  thu: {
    mainTitle: "Thursday: Active Recovery & Mobility",
    subTitle: "Reduce muscle soreness and improve joint range of motion",
    directive: "Today is about active recovery. Focus on deep stretches, breathing, and restoring joint range of motion. Do not push to failure.",
    items: [
      { id: "thu-0", name: "Foam Rolling (Warmup)", category: "Warmup", target: "Full body rolling 10 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 10, sets: [], note: "", tip: "Release muscle tightness" },
      { id: "thu-1", name: "Yoga Mobility Flows (Cardio)", category: "Cardio", target: "Stretching 15 min", isCardio: true, weight: 0, reps: 0, step: 5, duration: 15, sets: [], note: "", tip: "Focus on deep breathing" },
      { id: "thu-2", name: "Low-Intensity Walk (Cardio)", category: "Cardio", target: "Easy walk 20 min", isCardio: true, weight: 0, reps: 0, step: 5, duration: 20, sets: [], note: "", tip: "Keep heart rate low" }
    ]
  },
  fri: {
    mainTitle: "Friday: Legs & Lower Body",
    subTitle: "Build lower body strength and joint stability",
    directive: "Drive through your heels and keep your knees aligned with your toes. Engage your core and keep your spine neutral throughout.",
    items: [
      { id: "fri-0", name: "Bodyweight Squats (Warmup)", category: "Warmup", target: "Easy warmup 5 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 5, sets: [], note: "", tip: "Activate glutes & hips" },
      { id: "fri-1", name: "Leg Press Machine", category: "Legs", target: "50kg x 12 reps", weight: 50, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Do not lock knees at top" },
      { id: "fri-2", name: "Dumbbell Romanian Deadlift", category: "Legs", target: "12kg x 12 reps", weight: 12, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Hinge at the hips" },
      { id: "fri-3", name: "Leg Curl Machine", category: "Legs", target: "20kg x 12 reps", weight: 20, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Isolate hamstrings" },
      { id: "fri-4", name: "Standing Calf Raise", category: "Legs", target: "Bodyweight x 15 reps", isBodyweight: true, weight: 0, reps: 15, step: 1, sets: [null, null, null], note: "", tip: "Full range of motion" }
    ]
  },
  sat: {
    mainTitle: "Saturday: Upper Body Hypertrophy",
    subTitle: "Balanced conditioning for the chest, back, and shoulders",
    directive: "Focus on the mind-muscle connection. Control the negative (lowering) phase of each lift and squeeze at the peak contraction.",
    items: [
      { id: "sat-0", name: "Light Rowing (Warmup)", category: "Warmup", target: "Easy row 5 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 5, sets: [], note: "", tip: "Warm up full body" },
      { id: "sat-1", name: "Dumbbell Flat Bench Press", category: "Chest", target: "14kg x 12 reps", weight: 14, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Control the dumbbells" },
      { id: "sat-2", name: "One-Arm Dumbbell Row", category: "Back", target: "12kg x 12 reps", weight: 12, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Keep chest facing down" },
      { id: "sat-3", name: "Dumbbell Shoulder Press", category: "Shoulders", target: "10kg x 12 reps", weight: 10, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Fully extend arms at top" },
      { id: "sat-4", name: "Hammer Curl", category: "Biceps", target: "8kg x 12 reps", weight: 8, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Keep elbows pinned to side" }
    ]
  },
  sun: {
    mainTitle: "Sunday: Rest & Recharge",
    subTitle: "Promote systemic recovery and mental clarity",
    directive: "Allow your muscles to repair and your central nervous system to reset. Practice gratitude, stretch gently, and rest fully.",
    items: [
      { id: "sun-0", name: "Deep Breathing (Warmup)", category: "Warmup", target: "Slow breathing 5 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 5, sets: [], note: "", tip: "Activate parasympathetic state" },
      { id: "sun-1", name: "Full Body Static Stretching", category: "Warmup", target: "Hold stretches 15 min", isWarmup: true, weight: 0, reps: 0, step: 1, duration: 15, sets: [], note: "", tip: "Hold stretches for 30s each" }
    ]
  }
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export default function WorkoutCanvas() {
  const [activeDay, setActiveDay] = useState<string>("mon");
  const [db, setDb] = useState<WorkoutDatabase>(DEFAULT_DATABASE);
  const [visibleDays, setVisibleDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Modals state
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isPwaOpen, setIsPwaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [editingDay, setEditingDay] = useState<string>("mon");

  // New Exercise Form State
  const [newExName, setNewExName] = useState("");
  const [newExCategory, setNewExCategory] = useState("Legs");
  const [newExTip, setNewExTip] = useState("");
  const [newExTarget, setNewExTarget] = useState("");
  const [newExType, setNewExType] = useState<"strength" | "bodyweight" | "warmup" | "cardio">("strength");
  const [newExWeight, setNewExWeight] = useState(20);
  const [newExReps, setNewExReps] = useState(12);
  const [newExDuration, setNewExDuration] = useState(10);
  const [newExStep, setNewExStep] = useState(2.5);

  // Wake lock states
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [wakeLockObj, setWakeLockObj] = useState<any>(null);
  const [wakeLockStatusText, setWakeLockStatusText] = useState("Keep Screen On");

  // Backup codes states
  const [exportCode, setExportCode] = useState("");
  const [importCode, setImportCode] = useState("");

  // Load from local storage
  useEffect(() => {
    const savedVisible = localStorage.getItem("gems_visible_days");
    let initialVisible = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (savedVisible) {
      try {
        const parsed = JSON.parse(savedVisible);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialVisible = parsed.filter(d => ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(d));
          setVisibleDays(initialVisible);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    const savedDay = localStorage.getItem("gems_active_day");
    if (savedDay && ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(savedDay)) {
      if (initialVisible.includes(savedDay)) {
        setActiveDay(savedDay);
        setEditingDay(savedDay);
      } else {
        setActiveDay(initialVisible[0] || "mon");
        setEditingDay(initialVisible[0] || "mon");
      }
    } else {
      setActiveDay(initialVisible[0] || "mon");
      setEditingDay(initialVisible[0] || "mon");
    }

    const savedDb = localStorage.getItem("gems_workout_database_v1");
    if (savedDb) {
      try {
        const parsed = JSON.parse(savedDb);
        const mergedDb = { ...DEFAULT_DATABASE };
        for (const day in mergedDb) {
          if (parsed[day]) {
            mergedDb[day].mainTitle = parsed[day].mainTitle ?? mergedDb[day].mainTitle;
            mergedDb[day].subTitle = parsed[day].subTitle ?? mergedDb[day].subTitle;
            mergedDb[day].directive = parsed[day].directive ?? mergedDb[day].directive;
            if (parsed[day].items) {
              mergedDb[day].items = parsed[day].items.map((savedItem: any) => {
                return {
                  id: savedItem.id,
                  name: savedItem.name,
                  category: savedItem.category,
                  target: savedItem.target,
                  isWarmup: savedItem.isWarmup,
                  isCardio: savedItem.isCardio,
                  isBodyweight: savedItem.isBodyweight,
                  duration: savedItem.duration,
                  weight: savedItem.weight,
                  reps: savedItem.reps,
                  step: savedItem.step ?? 2.5,
                  sets: savedItem.sets ?? [null, null, null],
                  note: savedItem.note ?? "",
                  tip: savedItem.tip ?? "",
                };
              });
            }
          }
        }
        setDb(mergedDb);
      } catch (e) {
        console.warn("Storage data corrupted, using default template.");
      }
    }
  }, []);

  // Save to local storage
  const saveToStorage = (updatedDb: WorkoutDatabase, day: string, daysList?: string[]) => {
    localStorage.setItem("gems_workout_database_v1", JSON.stringify(updatedDb));
    localStorage.setItem("gems_active_day", day);
    if (daysList) {
      localStorage.setItem("gems_visible_days", JSON.stringify(daysList));
    }
  };

  const handleDayChange = (day: string) => {
    setActiveDay(day);
    saveToStorage(db, day);
  };

  // Direct edit of today's focus notes on screen
  const handleDirectiveChange = (val: string) => {
    const updatedDb = { ...db };
    updatedDb[activeDay].directive = val;
    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Set updates
  const toggleSetStatus = (itemId: string, setIdx: number) => {
    const updatedDb = { ...db };
    const items = updatedDb[activeDay].items;
    const itemIdx = items.findIndex((it) => it.id === itemId);
    if (itemIdx === -1) return;

    const item = { ...items[itemIdx] };
    const sets = [...item.sets];
    if (sets[setIdx] === null) {
      sets[setIdx] = { w: item.isBodyweight ? 0 : item.weight, r: item.reps };
    } else {
      sets[setIdx] = null;
    }
    item.sets = sets;
    items[itemIdx] = item;
    
    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Adjust parameters
  const adjustVal = (itemId: string, field: "w" | "r", amount: number) => {
    const updatedDb = { ...db };
    const items = updatedDb[activeDay].items;
    const itemIdx = items.findIndex((it) => it.id === itemId);
    if (itemIdx === -1) return;

    const item = { ...items[itemIdx] };
    if (field === "w") {
      item.weight = Math.max(0, parseFloat((item.weight + amount).toFixed(1)));
    } else if (field === "r") {
      item.reps = Math.max(1, item.reps + amount);
    }
    items[itemIdx] = item;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Adjust duration (warmup / cardio)
  const adjustDuration = (itemId: string, amount: number) => {
    const updatedDb = { ...db };
    const items = updatedDb[activeDay].items;
    const itemIdx = items.findIndex((it) => it.id === itemId);
    if (itemIdx === -1) return;

    const item = { ...items[itemIdx] };
    if (item.duration !== undefined) {
      item.duration = Math.max(0, item.duration + amount);
    }
    items[itemIdx] = item;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Text comment update
  const handleCommentChange = (itemId: string, val: string) => {
    const updatedDb = { ...db };
    const items = updatedDb[activeDay].items;
    const itemIdx = items.findIndex((it) => it.id === itemId);
    if (itemIdx === -1) return;

    const item = { ...items[itemIdx] };
    item.note = val;
    items[itemIdx] = item;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Toggle visible day
  const toggleVisibleDay = (day: string) => {
    let updatedVisible = [...visibleDays];
    if (updatedVisible.includes(day)) {
      if (updatedVisible.length === 1) {
        setToastMessage("At least one day must be active.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
      updatedVisible = updatedVisible.filter((d) => d !== day);
    } else {
      updatedVisible.push(day);
    }
    
    // Sort to maintain Mon -> Sun order
    const sortedVisible = [...DAY_ORDER].filter((d) => updatedVisible.includes(d));
    setVisibleDays(sortedVisible);

    // Fallback if activeDay is hidden
    let newActive = activeDay;
    if (!sortedVisible.includes(activeDay)) {
      newActive = sortedVisible[0] || "mon";
      setActiveDay(newActive);
    }
    
    saveToStorage(db, newActive, sortedVisible);
  };

  // Add a new exercise to routine
  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const updatedDb = { ...db };
    const newId = `${editingDay}-${Date.now()}`;
    const newEx: ExerciseItem = {
      id: newId,
      name: newExName.trim(),
      category: newExCategory.trim(),
      tip: newExTip.trim() || "Focus on form",
      target: newExTarget.trim() || (newExType === "warmup" || newExType === "cardio" ? `${newExDuration} min` : newExType === "bodyweight" ? `Bodyweight x ${newExReps} reps` : `${newExWeight}kg x ${newExReps} reps`),
      isWarmup: newExType === "warmup",
      isCardio: newExType === "cardio",
      isBodyweight: newExType === "bodyweight",
      duration: newExType === "warmup" || newExType === "cardio" ? newExDuration : undefined,
      weight: newExType === "strength" ? newExWeight : 0,
      reps: newExType === "strength" || newExType === "bodyweight" ? newExReps : 0,
      step: newExStep,
      sets: newExType === "warmup" || newExType === "cardio" ? [] : [null, null, null],
      note: ""
    };

    updatedDb[editingDay].items.push(newEx);
    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);

    // Reset Form
    setNewExName("");
    setNewExTip("");
    setNewExTarget("");

    setToastMessage("New exercise added to routine!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Delete exercise from routine
  const handleDeleteExercise = (day: string, itemId: string) => {
    const updatedDb = { ...db };
    updatedDb[day].items = updatedDb[day].items.filter((it) => it.id !== itemId);
    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);

    setToastMessage("Exercise removed from routine.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Edit exercise details inline
  const handleEditExerciseInline = (day: string, itemId: string, fields: Partial<ExerciseItem>) => {
    const updatedDb = { ...db };
    const items = updatedDb[day].items;
    const idx = items.findIndex((it) => it.id === itemId);
    if (idx === -1) return;

    items[idx] = { ...items[idx], ...fields };
    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Progress metrics
  const getProgressPct = () => {
    const items = db[activeDay].items;
    if (items.length === 0) return 0;
    let completed = 0;
    items.forEach((it) => {
      if (it.isWarmup && (it.duration ?? 0) > 0) completed++;
      else if (it.isCardio && (it.duration ?? 0) > 0) completed++;
      else if (!it.isWarmup && !it.isCardio && it.sets.some((s) => s !== null)) completed++;
    });
    return Math.round((completed / items.length) * 100);
  };

  // Wake lock control
  const triggerWakeLockAction = async () => {
    if ("wakeLock" in navigator) {
      if (isWakeLockActive) {
        if (wakeLockObj) {
          await wakeLockObj.release();
          setWakeLockObj(null);
        }
        setIsWakeLockActive(false);
        setWakeLockStatusText("Keep Screen On");
      } else {
        try {
          const wl = await (navigator as any).wakeLock.request("screen");
          setWakeLockObj(wl);
          setIsWakeLockActive(true);
          setWakeLockStatusText("Screen Kept On");
          wl.addEventListener("release", () => {
            setIsWakeLockActive(false);
            setWakeLockStatusText("Keep Screen On");
          });
        } catch (err) {
          console.warn("Screen Wake Lock blocked or unavailable", err);
          setWakeLockStatusText("Wake Lock Blocked");
        }
      }
    } else {
      setIsPwaOpen(true);
    }
  };

  // Trigger wake lock auto request on focus
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !isWakeLockActive && wakeLockObj) {
        try {
          const wl = await (navigator as any).wakeLock.request("screen");
          setWakeLockObj(wl);
          setIsWakeLockActive(true);
        } catch (err) {
          console.log(err);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isWakeLockActive, wakeLockObj]);

  // Report Generator for Copy
  const copyRoutineReport = () => {
    const data = db[activeDay];
    const now = new Date();
    const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, "0")}. ${String(now.getDate()).padStart(2, "0")}`;

    let report = `[ GEMS PERSONAL TRAINING REPORT ]\n`;
    report += `────────────────────────────\n`;
    report += `SESSION     : ${data.mainTitle}\n`;
    report += `DATE        : ${dateStr}\n\n`;

    report += `SESSION FOCUS & GOALS:\n`;
    report += `"${data.directive}"\n\n`;

    report += `COMPLETED WORKOUT LOG:\n`;
    data.items.forEach((it, index) => {
      report += `\n${index + 1}. ${it.name} (${it.category})\n`;
      if (it.isWarmup || it.isCardio) {
        report += `   - Duration: ${it.duration ?? 0} min completed\n`;
      } else {
        const loggedSets = it.sets
          .map((s, sIdx) => ({ s, sIdx }))
          .filter((item) => item.s !== null);
        if (loggedSets.length > 0) {
          loggedSets.forEach((item) => {
            const setVal = item.s!;
            if (it.isBodyweight) {
              report += `   - SET ${item.sIdx + 1}: Bodyweight x ${setVal.r} reps\n`;
            } else {
              report += `   - SET ${item.sIdx + 1}: ${setVal.w}kg x ${setVal.r} reps\n`;
            }
          });
        } else {
          report += `   - No sets logged\n`;
        }
      }
      if (it.note.trim()) {
        report += `   - Feedback: ${it.note}\n`;
      }
    });

    report += `\n────────────────────────────\n`;
    report += `Generated with Gems PT Canvas. local-first data processing.`;

    navigator.clipboard.writeText(report);
    setToastMessage("Workout report copied! Share it with your Trainer, Coach, or AI.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Generate Backup code (Base64)
  const generateBackupCode = () => {
    try {
      const payload = {
        db,
        visibleDays
      };
      const codeStr = JSON.stringify(payload);
      // Unicode safe base64 encoding
      const encoded = btoa(encodeURIComponent(codeStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
      setExportCode(encoded);
    } catch (e) {
      console.error(e);
    }
  };

  // Apply restore
  const handleImportRestore = () => {
    if (!importCode.trim()) return;
    try {
      const decodedStr = decodeURIComponent(
        atob(importCode)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsedPayload = JSON.parse(decodedStr);
      
      const parsedDb = parsedPayload.db ?? parsedPayload; // fallback check
      const parsedVisible = parsedPayload.visibleDays ?? ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

      // Structure check
      let isValid = true;
      ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].forEach((d) => {
        if (!parsedDb[d] || !parsedDb[d].items) isValid = false;
      });

      if (isValid) {
        setDb(parsedDb);
        setVisibleDays(parsedVisible);
        const sortedVisible = [...DAY_ORDER].filter((d) => parsedVisible.includes(d));
        const newActive = sortedVisible[0] || "mon";
        setActiveDay(newActive);
        
        saveToStorage(parsedDb, newActive, sortedVisible);
        setToastMessage("Database successfully restored!");
        setShowToast(true);
        setIsBackupOpen(false);
        setImportCode("");
        setTimeout(() => setShowToast(false), 2000);
      } else {
        alert("Invalid backup code structure.");
      }
    } catch (e) {
      alert("Failed to decode backup code. Make sure it's correct.");
    }
  };

  // Reset database to templates
  const resetDbToDefaults = () => {
    if (window.confirm("Are you sure you want to clear your local workout logs? This cannot be undone.")) {
      setDb(DEFAULT_DATABASE);
      setVisibleDays(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
      saveToStorage(DEFAULT_DATABASE, "mon", ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
      setActiveDay("mon");
      setEditingDay("mon");
      setToastMessage("Data reset successfully.");
      setShowToast(true);
      setIsBackupOpen(false);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-6 relative">
      <Toast isVisible={showToast} message={toastMessage} onClose={() => setShowToast(false)} />

      {/* Header controls block */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lumora-highlight/20 flex items-center justify-center text-lumora-highlight">
            <Dumbbell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Gems PT Canvas</h3>
            <p className="text-[10px] text-white/30 font-display font-bold uppercase tracking-widest">AI Feedback Log V1.4</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/55 hover:text-white rounded-xl transition-all border border-white/10 flex items-center gap-1 text-[10px] uppercase font-bold"
            title="Edit Routines & settings"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Wake lock indicator button */}
          <button
            onClick={triggerWakeLockAction}
            className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all ${
              isWakeLockActive
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
            }`}
          >
            <Zap className={`h-3 w-3 ${isWakeLockActive ? "animate-pulse text-emerald-400" : ""}`} />
            <span>{wakeLockStatusText}</span>
          </button>

          {/* Backup Action */}
          <button
            onClick={() => {
              generateBackupCode();
              setIsBackupOpen(true);
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all border border-white/10"
            title="Backup & Restore"
          >
            <Database className="h-4 w-4" />
          </button>

          {/* Safety Action */}
          <button
            onClick={() => setIsSafetyOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all border border-white/10"
            title="Safety Guidelines"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Dynamic Segmented Days Tabs for Checked Visible Days */}
        <div className="bg-white/[0.02] border border-white/5 p-1 rounded-2xl flex flex-wrap justify-between gap-1 shadow-lg">
          {visibleDays.map((day) => {
            const labelMap: Record<string, string> = { 
              mon: "Mon", 
              tue: "Tue", 
              wed: "Wed", 
              thu: "Thu", 
              fri: "Fri", 
              sat: "Sat", 
              sun: "Sun" 
            };
            return (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`flex-1 min-w-[50px] py-2 text-center rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeDay === day
                    ? "bg-lumora-highlight text-white shadow-md shadow-lumora-highlight/10"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {labelMap[day] ?? day.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* User-editable today focus goals */}
        <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-lumora-highlight/10 flex items-center justify-center text-lumora-highlight shrink-0 mt-0.5 animate-pulse">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-lumora-highlight tracking-wider uppercase">Today's Focus & Goals</span>
              <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">Click to Edit Direct</span>
            </div>
            <textarea
              value={db[activeDay].directive}
              onChange={(e) => handleDirectiveChange(e.target.value)}
              placeholder="What are your goals or guidelines for today? Type them here..."
              className="w-full bg-transparent border-0 resize-none p-0 text-xs text-white/80 focus:outline-none focus:ring-0 leading-relaxed font-semibold placeholder:text-white/20 h-16"
            />
          </div>
        </div>

        {/* Routine Titles and Progress */}
        <div className="flex items-center justify-between px-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-extrabold text-white tracking-tight">{db[activeDay].mainTitle}</h2>
            <p className="text-[11px] text-white/40">{db[activeDay].subTitle}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[9px] text-white/30 font-extrabold block uppercase tracking-wider">Progress</span>
            <span className="text-xs font-black text-lumora-highlight">{getProgressPct()}%</span>
          </div>
        </div>

        {/* Workout list */}
        <div className="space-y-4">
          {db[activeDay].items.length === 0 ? (
            <div className="text-center py-8 text-xs text-white/20 border border-dashed border-white/5 rounded-2xl">
              No exercises configured for this day. Open Settings to add custom routines.
            </div>
          ) : (
            db[activeDay].items.map((item) => {
              let catColor = "bg-lumora-highlight/10 text-lumora-highlight border-lumora-highlight/20";
              if (item.category === "Warmup") {
                catColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
              } else if (item.category === "Cardio") {
                catColor = "bg-lumora-blue/10 text-lumora-blue border-lumora-blue/20";
              }

              return (
                <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 shadow-sm hover:border-white/10 transition-colors">
                  
                  {/* Exercise Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className={`text-[9px] ${catColor} font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider`}>
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">{item.name}</h3>
                      <p className="text-[11px] text-white/40">Target: {item.target}</p>
                    </div>
                    <span className="text-[10px] text-white/50 font-bold bg-white/[0.03] px-2.5 py-1 rounded-xl border border-white/5">
                      {item.tip}
                    </span>
                  </div>

                  {/* Exercise Body */}
                  {item.isWarmup ? (
                    <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
                      <span className="text-white/50 font-extrabold">Logged Warmup Time</span>
                      <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                        <button
                          onClick={() => adjustDuration(item.id, -1)}
                          className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-black text-white text-xs px-2 min-w-[40px] text-center">{item.duration} min</span>
                        <button
                          onClick={() => adjustDuration(item.id, 1)}
                          className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : item.isCardio ? (
                    <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
                      <span className="text-white/50 font-extrabold">Logged Cardio Time</span>
                      <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                        <button
                          onClick={() => adjustDuration(item.id, -5)}
                          className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-black text-white text-xs px-2 min-w-[40px] text-center">{item.duration} min</span>
                        <button
                          onClick={() => adjustDuration(item.id, 5)}
                          className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Set logs status */}
                      <div className="grid grid-cols-3 gap-2">
                        {item.sets.map((setVal, setIdx) => {
                          const completed = setVal !== null;
                          let dispText = "Log";
                          if (completed) {
                            dispText = item.isBodyweight ? `${setVal.r}r` : `${setVal.w}kg/${setVal.r}r`;
                          }
                          return (
                            <button
                              key={setIdx}
                              onClick={() => toggleSetStatus(item.id, setIdx)}
                              className={`py-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                                completed
                                  ? "bg-lumora-highlight text-white border-lumora-highlight/30 shadow-md"
                                  : "bg-black/30 border-white/5 text-white/30 hover:border-white/10 hover:text-white/50"
                              }`}
                            >
                              <span className={`text-[8px] font-black uppercase ${completed ? "text-white/80" : "text-white/20"}`}>
                                Set {setIdx + 1}
                              </span>
                              <span className="text-[10px] font-extrabold mt-0.5">{dispText}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Adjusters Layout */}
                      <div className="bg-black/40 p-3 rounded-2xl border border-white/5 grid grid-cols-2 gap-3 text-xs">
                        {!item.isBodyweight ? (
                          <div className="flex items-center justify-between bg-white/[0.03] px-2.5 py-1.5 rounded-xl border border-white/5">
                            <span className="text-white/40 font-extrabold shrink-0">Wt.</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => adjustVal(item.id, "w", -item.step)}
                                className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white/80"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-extrabold text-white text-center text-xs min-w-[36px]">
                                {item.weight}kg
                              </span>
                              <button
                                onClick={() => adjustVal(item.id, "w", item.step)}
                                className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white/80"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center bg-white/[0.02] px-2.5 py-1.5 rounded-xl border border-dashed border-white/5 text-white/30 text-[10px] font-bold">
                            Bodyweight Set
                          </div>
                        )}

                        <div className="flex items-center justify-between bg-white/[0.03] px-2.5 py-1.5 rounded-xl border border-white/5">
                          <span className="text-white/40 font-extrabold shrink-0">Reps</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => adjustVal(item.id, "r", -1)}
                              className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white/80"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-extrabold text-white text-center text-xs min-w-[28px]">
                              {item.reps} reps
                            </span>
                            <button
                              onClick={() => adjustVal(item.id, "r", 1)}
                              className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white/80"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comment row */}
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-white/20">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      placeholder="Log comments, pain points, or general sensation details here..."
                      className="w-full bg-black/40 border border-white/5 text-xs text-white/80 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-white/15 placeholder-white/10 transition"
                    />
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Copy trigger button */}
        <div className="pt-6 pb-4 border-t border-white/5">
          <button
            onClick={copyRoutineReport}
            className="w-full py-4 bg-white hover:bg-white/95 text-black font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-[0.99] active:scale-[0.97] transition-all text-xs uppercase tracking-wider"
          >
            <Check className="h-4 w-4 text-black" />
            <span>Complete & Copy AI Coach Report</span>
          </button>
          <p className="text-center text-[10px] text-white/30 mt-3 font-medium">
            Copy this structured log to submit and report directly to your AI Coach / Trainer!
          </p>
        </div>

      </div>

      {/* Footer Local disclaimer */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl">
        <Zap className="h-3 w-3 text-lumora-highlight" />
        <p className="text-[10px] font-display font-bold text-white/30 uppercase tracking-widest">
          Local-first active caching. No database uploads or network tracing is executed.
        </p>
      </div>

      {/* Settings Modal (Customize Routines + Toggle Day Visibilities) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[120]"
            />
            {/* Modal positioning container */}
            <div className="absolute inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#0f0f12] border border-white/10 w-full max-w-lg rounded-3xl p-6 space-y-5 relative shadow-2xl overflow-y-auto max-h-[90%] no-scrollbar"
              >
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Routine Customizer</h3>
                  <p className="text-[10px] text-white/40">Toggle active days and customize routine plans.</p>
                </div>
              </div>

              {/* Active Days Visibility Selector */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">Active Weekly Days (Tab Display)</label>
                <p className="text-[9px] text-white/30">Toggle which days are displayed on your main dashboard tab bar.</p>
                <div className="flex flex-wrap gap-1.5 p-2 bg-black/40 rounded-xl border border-white/5">
                  {DAY_ORDER.map((day) => {
                    const isVisible = visibleDays.includes(day);
                    const labelMap: Record<string, string> = { 
                      mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" 
                    };
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleVisibleDay(day)}
                        className={`flex-1 min-w-[50px] py-1.5 text-center text-[10px] font-bold rounded-lg transition-all ${
                          isVisible
                            ? "bg-lumora-highlight text-white"
                            : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50"
                        }`}
                      >
                        {labelMap[day]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-1 border-t border-white/5">
                {/* Routine day editor select - Displays only available checked days */}
                <div className="flex gap-1 overflow-x-auto pb-2 border-b border-white/5 no-scrollbar">
                  {DAY_ORDER.map((day) => {
                    const dayLabels: Record<string, string> = { 
                      mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" 
                    };
                    const isTabVisible = visibleDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setEditingDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                          editingDay === day 
                            ? "bg-lumora-highlight text-white" 
                            : "bg-white/5 text-white/40 hover:text-white/60"
                        } ${!isTabVisible ? "opacity-35" : ""}`}
                      >
                        {dayLabels[day]} {!isTabVisible && "💤"}
                      </button>
                    );
                  })}
                </div>

                {/* Editing Routine details */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <label className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Routine Title</label>
                      {!visibleDays.includes(editingDay) && (
                        <span className="text-[9px] text-amber-500 font-bold uppercase">Hidden Day (Turn on above to see tab)</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={db[editingDay].mainTitle}
                      onChange={(e) => {
                        const updated = { ...db };
                        updated[editingDay].mainTitle = e.target.value;
                        setDb(updated);
                        saveToStorage(updated, activeDay);
                      }}
                      className="bg-black border border-white/5 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/10"
                      placeholder="e.g. Friday: Legs Focus"
                    />
                    <input
                      type="text"
                      value={db[editingDay].subTitle}
                      onChange={(e) => {
                        const updated = { ...db };
                        updated[editingDay].subTitle = e.target.value;
                        setDb(updated);
                        saveToStorage(updated, activeDay);
                      }}
                      className="bg-black border border-white/5 text-[11px] text-white/60 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-white/10"
                      placeholder="Sub-description"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Default Day Focus/Goal</label>
                    <textarea
                      value={db[editingDay].directive}
                      onChange={(e) => {
                        const updated = { ...db };
                        updated[editingDay].directive = e.target.value;
                        setDb(updated);
                        saveToStorage(updated, activeDay);
                      }}
                      className="bg-black border border-white/5 text-xs text-white rounded-lg px-3 py-2 h-16 resize-none focus:outline-none focus:border-white/10"
                      placeholder="Default focus notes for this day"
                    />
                  </div>

                  {/* Current exercises list */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Exercise Configs</label>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                      {db[editingDay].items.length === 0 ? (
                        <p className="text-[10px] text-white/20 py-2">No exercises configured.</p>
                      ) : (
                        db[editingDay].items.map((ex) => (
                          <div key={ex.id} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black/40 border border-white/5 rounded-xl text-xs">
                            <div className="space-y-0.5 w-[75%]">
                              <input
                                type="text"
                                value={ex.name}
                                onChange={(e) => handleEditExerciseInline(editingDay, ex.id, { name: e.target.value })}
                                className="bg-transparent border-0 p-0 text-xs text-white font-bold focus:outline-none focus:underline w-full"
                              />
                              <div className="flex gap-2 items-center text-[9px] text-white/40">
                                <span>{ex.category}</span>
                                <span>•</span>
                                <input
                                  type="text"
                                  value={ex.target}
                                  onChange={(e) => handleEditExerciseInline(editingDay, ex.id, { target: e.target.value })}
                                  className="bg-transparent border-0 p-0 text-[9px] text-white/40 focus:outline-none focus:underline w-32"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteExercise(editingDay, ex.id)}
                              className="p-1.5 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-lg transition-colors border border-white/5"
                              title="Remove exercise"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Exercise Form section */}
                  <form onSubmit={handleAddExercise} className="border-t border-white/5 pt-4 space-y-3">
                    <span className="text-[10px] font-bold text-lumora-highlight tracking-widest uppercase block">Add Custom Workout</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 block">Exercise Name</label>
                        <input
                          type="text"
                          required
                          value={newExName}
                          onChange={(e) => setNewExName(e.target.value)}
                          placeholder="e.g. Leg Press"
                          className="w-full bg-black border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-white/10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 block">Target Label</label>
                        <input
                          type="text"
                          value={newExTarget}
                          onChange={(e) => setNewExTarget(e.target.value)}
                          placeholder="e.g. 30kg x 15 reps"
                          className="w-full bg-black border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-white/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 block">Category</label>
                        <input
                          type="text"
                          value={newExCategory}
                          onChange={(e) => setNewExCategory(e.target.value)}
                          placeholder="e.g. Legs, Chest"
                          className="w-full bg-black border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 block">Tip / Cue Note</label>
                        <input
                          type="text"
                          value={newExTip}
                          onChange={(e) => setNewExTip(e.target.value)}
                          placeholder="e.g. Keep back straight"
                          className="w-full bg-black border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 block">Execution Style</label>
                        <select
                          value={newExType}
                          onChange={(e) => setNewExType(e.target.value as any)}
                          className="w-full bg-black border border-white/5 text-xs text-white/80 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="strength">Strength (Wt. & Reps)</option>
                          <option value="bodyweight">Bodyweight (Reps Only)</option>
                          <option value="warmup">Warmup (Timer)</option>
                          <option value="cardio">Cardio (Timer)</option>
                        </select>
                      </div>
                      
                      {newExType === "strength" && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="space-y-0.5">
                            <label className="text-[8px] text-white/40">Weight</label>
                            <input
                              type="number"
                              min="0"
                              value={newExWeight}
                              onChange={(e) => setNewExWeight(parseFloat(e.target.value) || 0)}
                              className="w-full bg-black border border-white/5 text-xs text-white rounded-lg p-1.5 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[8px] text-white/40">Reps</label>
                            <input
                              type="number"
                              min="1"
                              value={newExReps}
                              onChange={(e) => setNewExReps(parseInt(e.target.value) || 1)}
                              className="w-full bg-black border border-white/5 text-xs text-white rounded-lg p-1.5 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                      {newExType === "bodyweight" && (
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/40 block">Target Reps</label>
                          <input
                            type="number"
                            min="1"
                            value={newExReps}
                            onChange={(e) => setNewExReps(parseInt(e.target.value) || 1)}
                            className="w-full bg-black border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                      )}
                      {(newExType === "warmup" || newExType === "cardio") && (
                        <div className="space-y-1">
                          <label className="text-[9px] text-white/40 block">Target Duration (min)</label>
                          <input
                            type="number"
                            min="1"
                            value={newExDuration}
                            onChange={(e) => setNewExDuration(parseInt(e.target.value) || 1)}
                            className="w-full bg-black border border-white/5 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-white text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg hover:bg-white/90 active:scale-95 transition-all mt-4"
                    >
                      Add Exercise to Routine
                    </button>
                  </form>

                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>

      {/* Backup Modal */}
      <AnimatePresence>
        {isBackupOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBackupOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[120]"
            />
            {/* Modal positioning container */}
            <div className="absolute inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#0f0f12] border border-white/10 w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
              <button
                onClick={() => setIsBackupOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Sync & Backup</h3>
                  <p className="text-[10px] text-white/40">Secure your training database via token code.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-lumora-highlight tracking-widest uppercase block">Export Routine Token</label>
                  <p className="text-[9px] text-white/40">Copy this secure base64 token to save your records elsewhere.</p>
                  <div className="relative mt-1">
                    <textarea
                      readOnly
                      value={exportCode}
                      className="w-full h-16 bg-black border border-white/5 text-[9px] text-white/40 rounded-xl p-2.5 focus:outline-none resize-none font-mono break-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(exportCode);
                        setToastMessage("Backup code copied!");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2000);
                      }}
                      className="absolute right-2 bottom-2 px-2 py-1 bg-white hover:bg-white/95 text-black font-extrabold text-[9px] rounded-lg shadow-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-1 border-t border-white/5 pt-4">
                  <label className="text-[10px] font-bold text-lumora-blue tracking-widest uppercase block">Import / Restore Data</label>
                  <p className="text-[9px] text-white/40">Paste your exported backup code below to sync all logs.</p>
                  <textarea
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    placeholder="Paste secure base64 token here..."
                    className="w-full h-16 mt-1 bg-black border border-white/5 text-[9px] text-white/80 rounded-xl p-2.5 focus:outline-none focus:border-white/10 resize-none font-mono break-all placeholder:text-white/10"
                  />
                  <button
                    onClick={handleImportRestore}
                    className="w-full py-2.5 bg-lumora-blue hover:bg-lumora-blue/90 text-white font-black rounded-xl text-[10px] flex items-center justify-center gap-1.5 shadow-lg transition-all"
                  >
                    <span>Import & Synchronize Database</span>
                  </button>
                </div>

                <div className="text-center pt-2 border-t border-white/5">
                  <button
                    onClick={resetDbToDefaults}
                    className="text-[9px] text-red-400 hover:text-red-300 font-extrabold underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Wipe current browser records</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>

      {/* Safety Specs Modal */}
      <AnimatePresence>
        {isSafetyOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSafetyOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[120]"
            />
            {/* Modal positioning container */}
            <div className="absolute inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#0f0f12] border border-white/10 w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
              <button
                onClick={() => setIsSafetyOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Safety Guidelines</h3>
                  <p className="text-[10px] text-white/40">Active body protection specs from Gems Coach.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 flex items-start gap-3">
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-400 font-extrabold text-[9px] rounded border border-red-500/20 mt-0.5 shrink-0">WRIST</span>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    History of thumb-root pain during Chest Press. Always use the <strong>'Bulldog Grip'</strong> (resting the bar diagonally on the base of the palm aligned with the ulna) to avoid extension strain.
                  </p>
                </div>
                <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 flex items-start gap-3">
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-extrabold text-[9px] rounded border border-amber-500/20 mt-0.5 shrink-0">KNEE</span>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Patellar loading issues detected. Instead of high-load free weights, use track-guided machines and restrict extension range to the top 50% of the movement path.
                  </p>
                </div>
                <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 flex items-start gap-3">
                  <span className="px-2 py-0.5 bg-lumora-blue/10 text-lumora-blue font-extrabold text-[9px] rounded border border-lumora-blue/20 mt-0.5 shrink-0">SHOULDER</span>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Left shoulder joint clicking during lateral motions. Do not push elbows straight out to the sides; tuck them forward 30 degrees (scapular plane orientation) to prevent impingement.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>

      {/* PWA App Guide Modal */}
      <AnimatePresence>
        {isPwaOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPwaOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[120]"
            />
            {/* Modal positioning container */}
            <div className="absolute inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#0f0f12] border border-white/10 w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
              <button
                onClick={() => setIsPwaOpen(false)}
                className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">PWA Setup Guide</h3>
                  <p className="text-[10px] text-white/40">How to keep screen wake lock active on mobile devices.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-extrabold text-[10px] rounded border border-emerald-500/20 inline-block">Android / Chrome</span>
                  <ol className="text-xs text-white/70 space-y-1.5 list-decimal list-inside pl-1 font-semibold leading-relaxed">
                    <li>Tap the <span className="text-white font-bold">More Options (three dots)</span> menu in the top right.</li>
                    <li>Select <span className="text-lumora-highlight font-bold">"Add to Home screen"</span> or <span className="text-lumora-highlight font-bold">"Install App"</span>.</li>
                  </ol>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="px-2 py-0.5 bg-lumora-blue/10 text-lumora-blue font-extrabold text-[10px] rounded border border-lumora-blue/20 inline-block">iOS / Safari</span>
                  <ol className="text-xs text-white/70 space-y-1.5 list-decimal list-inside pl-1 font-semibold leading-relaxed">
                    <li>Tap the Safari browser <span className="text-white font-bold">Share button</span> at the bottom.</li>
                    <li>Scroll down and tap <span className="text-lumora-highlight font-bold">"Add to Home Screen"</span>.</li>
                  </ol>
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-white/40 leading-relaxed font-medium">
                    * If you are currently viewing this within a preview wrapper (e.g. Gemini UI window or Messenger webview), select <span className="text-white font-bold">"Open in default browser"</span> from your options first, then follow the steps above to install.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
