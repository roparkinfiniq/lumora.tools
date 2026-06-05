import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dumbbell,
  Zap,
  Copy,
  Trash2,
  ShieldAlert,
  Database,
  Info,
  X,
  Smartphone,
  Download,
  MessageSquare,
  Edit2,
  PlusCircle,
  CheckCheck,
  RotateCcw,
  Clipboard,
  Edit3,
  Upload,
  Check,
  Minus,
  Plus
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
  isDone?: boolean;
  duration?: number;
  weight: number;
  reps: number;
  step: number;
  sets: (ExerciseSet | null)[];
  note: string;
  tip: string;
}

interface DayRoutine {
  tabLabel?: string;
  mainTitle: string;
  subTitle: string;
  directive: string;
  items: ExerciseItem[];
}

interface WorkoutDatabase {
  [day: string]: DayRoutine;
}

const DEFAULT_DATABASE: WorkoutDatabase = {
  mon: {
    tabLabel: "월 (당기기)",
    mainTitle: "월요일: 당기기 (등 & 이두)",
    subTitle: "광배근 주력 타격 및 전면 코어 활성",
    directive: "상승 다이어트와 탄탄한 뒤태를 위해 척추 라인 프레임을 고르게 발달시키는 날입니다. 팔 힘이 아닌 팔꿈치 각도로 깊게 당겨주고 수축 끝자락을 컨트롤하세요.",
    items: [
      { id: "mon-0", name: "가벼운 전신 사이클 (웜업)", category: "웜업", target: "중저강도 심박수 유도 10분", isWarmup: true, duration: 10, note: "", tip: "전신 윤활 가속", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "mon-1", name: "시티드 로우 (Seated Row)", category: "등", target: "35kg x 12회", weight: 35, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "팔꿈치 각도를 모아 깊게 수축" },
      { id: "mon-2", name: "랫풀다운 (Lat Pulldown)", category: "등", target: "30kg x 12회", weight: 30, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "날개뼈를 단단히 내려 모아주기" },
      { id: "mon-3", name: "케이블 바이셉스 컬", category: "이두", target: "15kg x 12회", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "팔꿈치를 몸통에 밀착하여 제어" },
      { id: "mon-4", name: "AB 휠 (AB Wheel)", category: "코어", target: "맨몸 x 12회", isBodyweight: true, weight: 0, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "복근의 수축 저항에 완전히 몰입" }
    ]
  },
  tue: {
    tabLabel: "화 (밀기)",
    mainTitle: "화요일: 밀기 (가슴 & 어깨 & 삼두)",
    subTitle: "점진적 과부하 프로그램 및 관절 안전 궤적 확보",
    directive: "밀어내는 주동근을 단련하고 탄탄한 가슴 라인을 구축하는 날입니다. 숄더 및 체스트 동작 시 어깨가 들리지 않도록 견갑을 하강 고정하세요.",
    items: [
      { id: "tue-0", name: "상체 스트레칭 & 어깨 회전근 (웜업)", category: "웜업", target: "동적 가동성 스트레칭 5분", isWarmup: true, duration: 5, note: "", tip: "부상 예방 및 가동성", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "tue-1", name: "체스트 프레스 머신", category: "가슴", target: "30kg x 12회", weight: 30, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "바를 밀 때 불독 그립 엄수" },
      { id: "tue-2", name: "펙 덱 플라이 머신", category: "가슴", target: "10kg x 12회", weight: 10, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "가슴 안쪽 모아주기에 힘쓰기" },
      { id: "tue-3", name: "숄더 프레스 머신", category: "어깨", target: "15kg x 12회", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "견갑면 각도로 손잡이 조율" },
      { id: "tue-4", name: "사이드 레터럴 레이즈", category: "어깨", target: "4kg x 15회", weight: 4, reps: 15, step: 0.5, sets: [null, null, null], note: "", tip: "승모근 반동 최소화" },
      { id: "tue-5", name: "케이블 푸시다운 (로프)", category: "삼두", target: "15kg x 12회", weight: 15, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "삼두근 자극 최고조 도달" }
    ]
  },
  wed: {
    tabLabel: "수 (하체)",
    mainTitle: "수요일: 하체 (대퇴사두 & 둔근)",
    subTitle: "무릎 안정성 확보 및 대퇴 후면 조율",
    directive: "신체에서 가장 큰 근육군인 하체 트레이닝의 메인 세션입니다. 둔근과 허벅지 후면에 자극을 확실하게 걸어 진행하세요.",
    items: [
      { id: "wed-0", name: "평지 가벼운 걷기 (웜업)", category: "웜업", target: "가벼운 템포 걷기 10분", isWarmup: true, duration: 10, note: "", tip: "하체 관절 부드럽게 풀기", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "wed-1", name: "힙 업덕션 머신", category: "하체", target: "40kg x 12회", weight: 40, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "무릎 외측 방향으로 외전" },
      { id: "wed-2", name: "레그 프레스", category: "하체", target: "30kg x 15회", weight: 30, reps: 15, step: 5, sets: [null, null, null], note: "", tip: "뒤꿈치 힘으로 단단히 밀기" },
      { id: "wed-3", name: "레그 익스텐션", category: "하체", target: "15kg x 12회", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "최대 수축 후 천천히 버티기" },
      { id: "wed-4", name: "레그 컬", category: "하체", target: "15kg x 12회", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "허벅지 뒷근육의 텐션 제어" }
    ]
  },
  thu: {
    tabLabel: "목 (코어)",
    mainTitle: "목요일: 코어 & 유산소 세션",
    subTitle: "코어 근육 저항성 향상 및 심폐 회복 유도",
    directive: "신체 중심부를 잡아주는 코어 활성화와 체지방 연소를 촉진하는 심폐 유산소 트레이닝 데이입니다.",
    items: [
      { id: "thu-0", name: "전신 스트레칭 (웜업)", category: "웜업", target: "스트레칭 10분", isWarmup: true, duration: 10, note: "", tip: "전신 이완 및 심박수 준비", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "thu-1", name: "플랭크 (Plank)", category: "코어", target: "맨몸 x 60초 버티기", isBodyweight: true, weight: 0, reps: 60, step: 1, sets: [null, null, null], note: "", tip: "골반 중립 및 전신 텐션 체크" },
      { id: "thu-2", name: "AB 휠 (AB Wheel)", category: "코어", target: "맨몸 x 10회", isBodyweight: true, weight: 0, reps: 10, step: 1, sets: [null, null, null], note: "", tip: "복근에 저항을 걸고 상체 제어" },
      { id: "thu-3", name: "좌식 사이클 (유산소)", category: "유산소", target: "30분 수행", isCardio: true, duration: 30, note: "", tip: "페달링 강도 3~4 고정 유지", sets: [], weight: 0, reps: 0, step: 2.5 }
    ]
  },
  fri: {
    tabLabel: "금 (상체)",
    mainTitle: "금요일: 상체 보완 (등 & 가슴 & 어깨)",
    subTitle: "고른 볼륨 성장을 위한 상체 복합 패키지",
    directive: "밀기와 당기기 운동의 밸런스를 균형 있게 보강하는 상체 전반 하이퍼트로피 타겟의 피드백 코칭 세션입니다.",
    items: [
      { id: "fri-0", name: "가벼운 걷기 및 회전근개 (웜업)", category: "웜업", target: "빠른 걷기 10분", isWarmup: true, duration: 10, note: "", tip: "체온 높여 운동 효율 증가", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "fri-1", name: "체스트 프레스 머신", category: "가슴", target: "30kg x 12회", weight: 30, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "수축 제어 및 대흉근 집중" },
      { id: "fri-2", name: "랫풀다운 (Lat Pulldown)", category: "등", target: "35kg x 12회", weight: 35, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "등 상부 자극점을 강하게 쥐어짜기" },
      { id: "fri-3", name: "사이드 레터럴 레이즈", category: "어깨", target: "4kg x 15회", weight: 4, reps: 15, step: 0.5, sets: [null, null, null], note: "", tip: "승모근 반동 최소화" },
      { id: "fri-4", name: "케이블 푸시다운 (로프)", category: "삼두", target: "15kg x 12회", weight: 15, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "팔 뒷근육 확실하게 수축" }
    ]
  },
  sat: {
    tabLabel: "토 (하체)",
    mainTitle: "토요일: 하체 & 코어 보완",
    subTitle: "밀도 높은 자극과 고관절 후면부 트레이닝",
    directive: "한 주의 피로를 털어내며 하체 후면 사슬(햄스트링/둔근) 및 코어 근육을 밀도 높게 채우는 주말 강화 프로그램입니다.",
    items: [
      { id: "sat-0", name: "동적 폼롤러 스트레칭 (웜업)", category: "웜업", target: "스트레칭 10분", isWarmup: true, duration: 10, note: "", tip: "하체 근막 이완", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "sat-1", name: "레그 프레스", category: "하체", target: "40kg x 12회", weight: 40, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "대퇴부 자극 극대화" },
      { id: "sat-2", name: "덤벨 루마니안 데드리프트", category: "하체", target: "10kg x 12회", weight: 10, reps: 12, step: 2, sets: [null, null, null], note: "", tip: "고관절 접기 힙힌지 중심 동작" },
      { id: "sat-3", name: "AB 휠 (AB Wheel)", category: "코어", target: "맨몸 x 10회", isBodyweight: true, weight: 0, reps: 10, step: 1, sets: [null, null, null], note: "", tip: "골반이 꺾이지 않도록 지탱" },
      { id: "sat-4", name: "플랭크 (Plank)", category: "코어", target: "맨몸 x 60초 버티기", isBodyweight: true, weight: 0, reps: 60, step: 1, sets: [null, null, null], note: "", tip: "지면을 밀어내듯 코어 유지" }
    ]
  },
  sun: {
    tabLabel: "일 (휴식)",
    mainTitle: "일요일: 전신 회복 및 휴식",
    subTitle: "신체 순환 촉진 및 질 높은 스트레칭 프로그램",
    directive: "근조직의 성장과 관절 회복은 완전한 충전 상태에서만 완벽히 일어납니다. 스트레칭을 통해 전신 혈류를 순환시켜 줍니다.",
    items: [
      { id: "sun-0", name: "전신 이완 요가 스트레칭 (웜업)", category: "웜업", target: "정적 전신 스트레칭 10분", isWarmup: true, duration: 10, note: "", tip: "누적 긴장 완화", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "sun-1", name: "가벼운 산책 (유산소)", category: "유산소", target: "20분 가볍게 걷기", isCardio: true, duration: 20, note: "", tip: "신진대사 활성화", sets: [], weight: 0, reps: 0, step: 2.5 }
    ]
  }
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const DAY_LABELS: Record<string, string> = {
  mon: "월 (당기기)",
  tue: "화 (밀기)",
  wed: "수 (하체)",
  thu: "목 (코어)",
  fri: "금 (상체)",
  sat: "토 (하체)",
  sun: "일 (휴식)"
};

export default function WorkoutCanvas() {
  const [activeDay, setActiveDay] = useState<string>("mon");
  const [db, setDb] = useState<WorkoutDatabase>(DEFAULT_DATABASE);
  const [visibleDays, setVisibleDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modals open/close states
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isPwaOpen, setIsPwaOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Double click confirm tracking states
  const [resetConfirmActive, setResetConfirmActive] = useState(false);
  const [deleteConfirmActive, setDeleteConfirmActive] = useState<Record<string, boolean>>({});

  // Editing exercise mapping
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  // Exercise Form State
  const [editExName, setEditExName] = useState("");
  const [editExCategory, setEditExCategory] = useState("등");
  const [editExSetsCount, setEditExSetsCount] = useState(3);
  const [editExType, setEditExType] = useState<"normal" | "bodyweight" | "cardio">("normal");
  const [editExWeight, setEditExWeight] = useState(30);
  const [editExReps, setEditExReps] = useState(12);
  const [editExDuration, setEditExDuration] = useState(10);
  const [editExTarget, setEditExTarget] = useState("");
  const [editExTip, setEditExTip] = useState("");

  // Routine Info Form State
  const [editRoutineTabLabel, setEditRoutineTabLabel] = useState("");
  const [editRoutineTitle, setEditRoutineTitle] = useState("");
  const [editRoutineSubTitle, setEditRoutineSubTitle] = useState("");
  const [editRoutineDirective, setEditRoutineDirective] = useState("");

  // Wake lock states
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [wakeLockObj, setWakeLockObj] = useState<any>(null);
  const [wakeLockStatusText, setWakeLockStatusText] = useState("화면 유지 대기");
  const [isIframe, setIsIframe] = useState(false);

  // Backup tokens states
  const [exportCode, setExportCode] = useState("");
  const [importCode, setImportCode] = useState("");

  // Frame detection
  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

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
      } else {
        setActiveDay(initialVisible[0] || "mon");
      }
    } else {
      setActiveDay(initialVisible[0] || "mon");
    }

    const savedDb = localStorage.getItem("gems_workout_database_v1");
    if (savedDb) {
      try {
        const parsed = JSON.parse(savedDb);
        const mergedDb = { ...DEFAULT_DATABASE };
        for (const day in mergedDb) {
          if (parsed[day]) {
            mergedDb[day].tabLabel = parsed[day].tabLabel ?? mergedDb[day].tabLabel;
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
                  isDone: savedItem.isDone,
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
    try {
      localStorage.setItem("gems_workout_database_v1", JSON.stringify(updatedDb));
      localStorage.setItem("gems_active_day", day);
      if (daysList) {
        localStorage.setItem("gems_visible_days", JSON.stringify(daysList));
      }
    } catch (e) {
      console.error("Local Storage save failed", e);
    }
  };

  const handleDayChange = (day: string) => {
    setActiveDay(day);
    saveToStorage(db, day);
  };

  const triggerToastBanner = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
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
      sets[setIdx] = { w: item.weight, r: item.reps };
    } else {
      sets[setIdx] = null;
    }
    item.sets = sets;
    items[itemIdx] = item;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Adjust parameters
  const changeVal = (itemId: string, field: "w" | "r", amount: number) => {
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
  const changeCardio = (itemId: string, amount: number) => {
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

  // Toggle cardio/warmup completed status
  const toggleCardioDone = (itemId: string) => {
    const updatedDb = { ...db };
    const items = updatedDb[activeDay].items;
    const itemIdx = items.findIndex((it) => it.id === itemId);
    if (itemIdx === -1) return;

    const item = { ...items[itemIdx] };
    item.isDone = !item.isDone;
    items[itemIdx] = item;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
  };

  // Progress metrics
  const getProgressPct = () => {
    const items = db[activeDay].items || [];
    if (items.length === 0) return 0;
    let completed = 0;
    items.forEach((it) => {
      if (it.isWarmup && it.isDone) completed++;
      else if (it.isCardio && it.isDone) completed++;
      else if (!it.isWarmup && !it.isCardio && it.sets.some((s) => s !== null)) completed++;
    });
    return Math.round((completed / items.length) * 100);
  };

  // Wake lock control
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        const wl = await (navigator as any).wakeLock.request("screen");
        setWakeLockObj(wl);
        setIsWakeLockActive(true);
        setWakeLockStatusText("화면 유지 활성화");
        wl.addEventListener("release", () => {
          setIsWakeLockActive(false);
          setWakeLockStatusText("화면 유지 비활성화");
        });
      } else {
        setWakeLockStatusText("미지원 기기");
      }
    } catch (err) {
      setWakeLockStatusText("설정 대기");
    }
  };

  const triggerWakeLockAction = async () => {
    if (isIframe) {
      setIsPwaOpen(true);
    } else {
      if (wakeLockObj) {
        try {
          await wakeLockObj.release();
        } catch (e) {
          console.warn(e);
        }
        setWakeLockObj(null);
        setIsWakeLockActive(false);
        setWakeLockStatusText("화면 유지 비활성화");
      } else {
        await requestWakeLock();
      }
    }
  };

  useEffect(() => {
    if (!isIframe) {
      requestWakeLock();
    }
  }, [isIframe]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!isIframe && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isIframe]);

  // Copy routine reports to clipboard
  const copyRoutineResults = () => {
    const data = db[activeDay];
    const now = new Date();
    const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, "0")}. ${String(now.getDate()).padStart(2, "0")}`;

    let report = `[ LUMORA WORKOUT REPORT ]\n`;
    report += `────────────────────────────\n`;
    report += `SESSION : ${data.mainTitle}\n`;
    report += `DATE    : ${dateStr}\n\n`;

    data.items.forEach((it) => {
      let actual = "";
      if (it.isCardio || it.isWarmup) {
        actual = it.isDone ? `${it.duration}분 수행` : "컨디션 조절 및 패스";
      } else {
        const doneSets = it.sets.filter((s) => s !== null);
        if (doneSets.length > 0) {
          actual = doneSets
            .map((s, idx) => {
              if (!s) return "";
              return it.isBodyweight
                ? `${idx + 1}SET (${s.r}회)`
                : `${idx + 1}SET (${s.w}kg / ${s.r}회)`;
            })
            .join(", ");
        } else {
          actual = "컨디션 조절 및 패스";
        }
      }
      report += `■ ${it.name} (${it.category})\n`;
      report += `  수행 기록 : ${actual}\n`;
      if (it.note && it.note.trim()) {
        report += `  피드백    : ${it.note}\n`;
      }
      report += `\n`;
    });

    report += `────────────────────────────\n`;
    report += `* 본 기록은 브라우저 로컬 저장소에 안전하게 유지됩니다.`;

    navigator.clipboard.writeText(report).then(
      () => {
        triggerToastBanner("오늘의 운동 기록이 복사되었습니다. 대화창에 바로 붙여넣기 해주세요!");
      },
      () => {
        triggerToastBanner("복사에 실패했습니다. 수동 복사 부탁드립니다.");
      }
    );
  };

  // Reset completion logs only
  const executeResetTodayRoutine = () => {
    const updatedDb = { ...db };
    const items = updatedDb[activeDay].items || [];
    items.forEach((it) => {
      if (it.sets) {
        it.sets = it.sets.map(() => null);
      }
      if (it.isCardio || it.isWarmup) {
        it.isDone = false;
      }
      it.note = "";
    });
    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
    setIsResetConfirmOpen(false);
    triggerToastBanner("오늘의 운동 기록이 초기화되었습니다.");
  };

  // Backup & Restore
  const openBackupModal = () => {
    try {
      const dbString = JSON.stringify(db);
      const base64Code = btoa(unescape(encodeURIComponent(dbString)));
      setExportCode(base64Code);
    } catch (e) {
      setExportCode("에러: 백업 코드를 로드하지 못했습니다.");
    }
    setImportCode("");
    setIsBackupOpen(true);
  };

  const importBackupCode = () => {
    if (!importCode.trim()) {
      triggerToastBanner("복원할 백업 코드를 입력해 주세요.");
      return;
    }
    try {
      const decodedStr = decodeURIComponent(escape(atob(importCode.trim())));
      const importedData = JSON.parse(decodedStr);

      let isValid = false;
      for (const d in importedData) {
        if (importedData[d].items && Array.isArray(importedData[d].items)) {
          isValid = true;
          break;
        }
      }

      if (!isValid) throw new Error("Format invalid.");

      const updatedDb = { ...db };
      for (const day in importedData) {
        if (importedData[day]) {
          updatedDb[day] = importedData[day];
        }
      }

      setDb(updatedDb);
      saveToStorage(updatedDb, activeDay);
      setIsBackupOpen(false);
      triggerToastBanner("기록이 완벽하게 동기화 복원되었습니다!");
    } catch (e) {
      triggerToastBanner("올바르지 않은 복원 코드입니다. 복사한 코드가 완전한지 체크해 보세요.");
    }
  };

  const resetAllData = () => {
    if (!resetConfirmActive) {
      setResetConfirmActive(true);
      setTimeout(() => {
        setResetConfirmActive(false);
      }, 3500);
    } else {
      localStorage.removeItem("gems_workout_database_v1");
      localStorage.removeItem("gems_active_day");
      localStorage.removeItem("gems_visible_days");
      window.location.reload();
    }
  };

  // Routine modal info edit
  const openRoutineModal = () => {
    const selected = db[activeDay];
    setEditRoutineTabLabel(selected.tabLabel || DAY_LABELS[activeDay]);
    setEditRoutineTitle(selected.mainTitle);
    setEditRoutineSubTitle(selected.subTitle);
    setEditRoutineDirective(selected.directive);
    setIsRoutineModalOpen(true);
  };

  const saveRoutineInfo = () => {
    const tabLabel = editRoutineTabLabel.trim();
    const title = editRoutineTitle.trim();
    const subtitle = editRoutineSubTitle.trim();
    const directive = editRoutineDirective.trim();

    if (!title) {
      triggerToastBanner("루틴 타이틀을 입력해 주세요.");
      return;
    }

    const updatedDb = { ...db };
    updatedDb[activeDay].tabLabel = tabLabel || DAY_LABELS[activeDay];
    updatedDb[activeDay].mainTitle = title;
    updatedDb[activeDay].subTitle = subtitle;
    updatedDb[activeDay].directive = directive;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
    setIsRoutineModalOpen(false);
    triggerToastBanner("루틴 정보가 수정되었습니다.");
  };

  // Exercise modal trigger
  const openExerciseModal = (itemId: string | null) => {
    setEditingExerciseId(itemId);
    if (!itemId) {
      setEditExName("");
      setEditExCategory("등");
      setEditExSetsCount(3);
      setEditExType("normal");
      setEditExWeight(30);
      setEditExReps(12);
      setEditExDuration(10);
      setEditExTarget("");
      setEditExTip("");
    } else {
      const item = db[activeDay].items.find((it) => it.id === itemId);
      if (!item) return;

      setEditExName(item.name);
      setEditExCategory(item.category);
      setEditExSetsCount(item.sets.length);

      if (item.isWarmup || item.isCardio) {
        setEditExType("cardio");
      } else if (item.isBodyweight) {
        setEditExType("bodyweight");
      } else {
        setEditExType("normal");
      }

      setEditExWeight(item.weight ?? 0);
      setEditExReps(item.reps ?? 0);
      setEditExDuration(item.duration ?? 10);
      setEditExTarget(item.target || "");
      setEditExTip(item.tip || "");
    }
    setIsExerciseModalOpen(true);
  };

  const saveExercise = () => {
    const name = editExName.trim();
    const category = editExCategory;
    const setsCount = editExSetsCount;
    const type = editExType;
    const weight = editExWeight;
    const reps = editExReps;
    const duration = editExDuration;
    const target = editExTarget.trim();
    const tip = editExTip.trim();

    if (!name) {
      triggerToastBanner("운동명을 입력해 주세요.");
      return;
    }

    const isWarmup = category === "웜업";
    const isCardio = category === "유산소" || (type === "cardio" && category !== "웜업");
    const isBodyweight = type === "bodyweight";

    let targetText = target;
    if (!targetText) {
      if (isCardio || isWarmup) {
        targetText = `${duration}분 수행`;
      } else {
        targetText = isBodyweight ? `${reps}회` : `${weight}kg x ${reps}회`;
      }
    }

    const updatedDb = { ...db };
    if (!editingExerciseId) {
      // Create new exercise
      const newId = `${activeDay}-${Date.now()}`;
      const sets = Array(setsCount).fill(null);

      const newItem: ExerciseItem = {
        id: newId,
        name,
        category,
        target: targetText,
        weight: isBodyweight || isCardio || isWarmup ? 0 : weight,
        reps: isCardio || isWarmup ? 0 : reps,
        step: category === "어깨" ? 0.5 : category === "하체" ? 5 : 2.5,
        sets,
        note: "",
        tip: tip || `${category} 가이드`,
      };

      if (isWarmup) newItem.isWarmup = true;
      if (isCardio) newItem.isCardio = true;
      if (isBodyweight) newItem.isBodyweight = true;
      if (isWarmup || isCardio) newItem.duration = duration;

      if (!updatedDb[activeDay].items) {
        updatedDb[activeDay].items = [];
      }
      updatedDb[activeDay].items.push(newItem);
    } else {
      // Edit existing exercise
      const items = updatedDb[activeDay].items;
      const idx = items.findIndex((it) => it.id === editingExerciseId);
      if (idx !== -1) {
        const item = { ...items[idx] };
        item.name = name;
        item.category = category;
        item.target = targetText;
        item.weight = isBodyweight || isCardio || isWarmup ? 0 : weight;
        item.reps = isCardio || isWarmup ? 0 : reps;
        item.tip = tip || `${category} 가이드`;

        // Clear previous conditional fields
        delete item.isWarmup;
        delete item.isCardio;
        delete item.isBodyweight;
        delete item.duration;

        if (isWarmup) item.isWarmup = true;
        if (isCardio) item.isCardio = true;
        if (isBodyweight) item.isBodyweight = true;
        if (isWarmup || isCardio) item.duration = duration;

        // Resize sets array
        const currentSets = item.sets || [];
        const newSets = [];
        for (let i = 0; i < setsCount; i++) {
          if (i < currentSets.length) {
            newSets.push(currentSets[i]);
          } else {
            newSets.push(null);
          }
        }
        item.sets = newSets;
        items[idx] = item;
      }
    }

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
    setIsExerciseModalOpen(false);
    triggerToastBanner(editingExerciseId ? "운동 정보가 수정되었습니다." : "새로운 운동이 추가되었습니다.");
  };

  const deleteExercise = (itemId: string) => {
    if (!deleteConfirmActive[itemId]) {
      const newConfirm = { ...deleteConfirmActive };
      newConfirm[itemId] = true;
      setDeleteConfirmActive(newConfirm);
      triggerToastBanner("⚠️ 한 번 더 누르면 정말 삭제됩니다!");
      setTimeout(() => {
        setDeleteConfirmActive((prev) => ({ ...prev, [itemId]: false }));
      }, 3000);
    } else {
      const updatedDb = { ...db };
      updatedDb[activeDay].items = updatedDb[activeDay].items.filter((it) => it.id !== itemId);
      setDb(updatedDb);
      saveToStorage(updatedDb, activeDay);
      setDeleteConfirmActive((prev) => ({ ...prev, [itemId]: false }));
      triggerToastBanner("운동이 삭제되었습니다.");
    }
  };

  // Settings visible days apply
  const applyVisibleDays = (selectedDays: string[]) => {
    if (selectedDays.length === 0) {
      triggerToastBanner("최소 하나의 요일은 활성화되어야 합니다!");
      return;
    }

    // Sort according to DAY_ORDER
    const sortedVisible = [...DAY_ORDER].filter((d) => selectedDays.includes(d));
    setVisibleDays(sortedVisible);

    let nextActive = activeDay;
    if (!sortedVisible.includes(activeDay)) {
      nextActive = sortedVisible[0];
      setActiveDay(nextActive);
    }

    saveToStorage(db, nextActive, sortedVisible);
    setIsSettingsOpen(false);
    triggerToastBanner("요일 노출 설정이 변경되었습니다.");
  };

  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen flex flex-col bg-[#1e1e1e] text-slate-200 border-x border-[#3a3a3a]/30 relative shadow-2xl pb-12 font-sans select-none overflow-x-hidden">
      
      {/* Dynamic Toast Banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
            className="fixed bottom-10 left-1/2 bg-slate-900 border border-[#a78bfa]/30 text-white font-extrabold px-6 py-4 rounded-2xl text-xs shadow-2xl z-50 flex items-center gap-3 w-80 max-w-full"
          >
            <div className="w-5 h-5 rounded-full bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
              <Clipboard className="w-3.5 h-3.5" />
            </div>
            <span className="leading-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#1e1e1e]/95 backdrop-blur-md border-b border-[#3a3a3a]/60 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#8b5cf6] flex items-center justify-center text-[#1e1e1e] font-extrabold text-lg shadow-md shadow-[#a78bfa]/20">
                L
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#a78bfa] border-2 border-[#1e1e1e] rounded-full"></span>
            </div>
            <div>
              <h1 class="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Lumora Workout</h1>
              <p className="text-sm font-black text-white tracking-tight">스마트 모바일 운동 캔버스</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Smart Screen Status Indicator (Wake Lock) */}
            <button
              onClick={triggerWakeLockAction}
              className={`btn-tap px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                isIframe
                  ? "bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa]"
                  : isWakeLockActive
                  ? "bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa]"
                  : "bg-[#262626] border border-[#3a3a3a] text-slate-500"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isIframe ? "제한됨 (미리보기)" : wakeLockStatusText}</span>
            </button>

            {/* Routine Settings (Visible Days Toggle) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn-tap px-2 py-1.5 bg-[#262626] border border-[#3a3a3a] rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-1"
              title="루틴 설정 및 요일 활성화"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Data Backup & Restore Trigger */}
            <button
              onClick={openBackupModal}
              className="btn-tap px-2 py-1.5 bg-[#262626] border border-[#3a3a3a] rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-1"
              title="기록 백업/복원"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Injury Prevention Specs */}
            <button
              onClick={() => setIsSafetyOpen(true)}
              className="btn-tap px-2 py-1.5 bg-[#262626] border border-[#3a3a3a] rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-1"
              title="부상 방지 가이드"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* PWA Install Banner */}
      {isIframe && (
        <div className="max-w-md w-full mx-auto px-4 mt-3">
          <div className="bg-gradient-to-r from-[#a78bfa]/10 to-[#262626] border border-[#a78bfa]/30 rounded-2xl p-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">화면이 계속 켜져있는 "진짜 앱" 설치</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">홈 화면에 추가하면 화면 유지 기능이 활성화됩니다!</p>
              </div>
            </div>
            <button
              onClick={() => setIsPwaOpen(true)}
              className="btn-tap px-3 py-2 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#1e1e1e] font-black text-xs rounded-xl shadow-md shrink-0"
            >
              1초 설치
            </button>
          </div>
        </div>
      )}

      {/* Main Content Flow */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 mt-4 space-y-4">
        
        {/* Segmented Tab Bar */}
        <div className="bg-[#262626] p-1.5 rounded-2xl border border-[#3a3a3a]/80 flex flex-wrap justify-between gap-1 shadow-lg">
          {visibleDays.map((day) => {
            const isSelected = day === activeDay;
            return (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`btn-tap flex-1 min-w-[70px] py-3 text-center rounded-xl text-xs transition-all duration-200 ${
                  isSelected
                    ? "bg-[#a78bfa] text-[#1e1e1e] font-bold shadow-md shadow-[#a78bfa]/10"
                    : "text-slate-400 hover:text-slate-200 font-semibold"
                }`}
              >
                {db[day]?.tabLabel || DAY_LABELS[day]}
              </button>
            );
          })}
        </div>

        {/* Coach Directive Panel */}
        <div className="bg-gradient-to-b from-[#2d2d2d] to-[#262626] border border-[#3a3a3a]/80 rounded-2xl p-4 shadow-md flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-extrabold text-[#a78bfa] tracking-wider uppercase">오늘의 트레이닝 가이드</span>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              {db[activeDay]?.directive}
            </p>
          </div>
        </div>

        {/* Routine Metadata */}
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">{db[activeDay]?.mainTitle}</h2>
              <button
                onClick={openRoutineModal}
                className="btn-tap p-1 bg-[#262626] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded-lg text-slate-400 hover:text-white"
                title="루틴 정보 수정"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">{db[activeDay]?.subTitle}</p>
          </div>
          <div className="bg-[#262626] px-3 py-1.5 rounded-xl border border-[#3a3a3a] text-right shrink-0">
            <span className="text-[9px] text-slate-500 font-extrabold block uppercase tracking-wider">세션 진척도</span>
            <span className="text-xs font-black text-[#a78bfa]">{getProgressPct()}%</span>
          </div>
        </div>

        {/* Dynamic Workouts Holder */}
        <div className="space-y-4">
          {(!db[activeDay]?.items || db[activeDay].items.length === 0) ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-[#3a3a3a] rounded-2xl">
              이 요일에 설정된 운동이 없습니다. 새로운 운동을 추가해보세요.
            </div>
          ) : (
            db[activeDay].items.map((item) => {
              let catColor = "bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20";
              if (item.category === "웜업") {
                catColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
              }

              return (
                <div key={item.id} className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 space-y-4 shadow-sm">
                  {/* Exercise Card Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <span className={`text-[9px] ${catColor} font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider`}>
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">{item.name}</h3>
                      <p className="text-xs text-slate-400">가이드: {item.target}</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold bg-[#1e1e1e] px-2.5 py-1 rounded-xl border border-[#3a3a3a]">
                        {item.tip}
                      </span>
                      <button
                        onClick={() => openExerciseModal(item.id)}
                        className="btn-tap p-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-slate-400 hover:text-white"
                        title="수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteExercise(item.id)}
                        className={`btn-tap p-1 bg-[#2a2a2a] hover:bg-rose-950 rounded-lg transition-colors ${
                          deleteConfirmActive[item.id] ? "text-rose-400 bg-rose-950/40" : "text-slate-400 hover:text-rose-450"
                        }`}
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Exercise Card Body */}
                  {item.isWarmup ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-2xl border border-[#2a2a2a] text-xs">
                        <span className="text-slate-400 font-extrabold">실제 완료 시간</span>
                        <div className="flex items-center space-x-3 bg-[#262626] px-3 py-1.5 rounded-xl border border-[#3a3a3a]">
                          <button
                            onClick={() => changeCardio(item.id, -1)}
                            className="btn-tap p-1 bg-[#2a2a2a] text-slate-300 hover:text-white rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-white text-sm px-2">{item.duration}분</span>
                          <button
                            onClick={() => changeCardio(item.id, 1)}
                            className="btn-tap p-1 bg-[#2a2a2a] text-slate-300 hover:text-white rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCardioDone(item.id)}
                        className={`btn-tap w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                          item.isDone
                            ? "bg-[#a78bfa] text-[#1e1e1e] border-[#a78bfa] shadow-md"
                            : "bg-[#1e1e1e] border-[#3a3a3a] text-slate-500"
                        }`}
                      >
                        {item.isDone ? (
                          <>
                            <Check className="w-4 h-4 mr-1" /> 완료됨
                          </>
                        ) : (
                          "완료 체크"
                        )}
                      </button>
                    </div>
                  ) : item.isCardio ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-2xl border border-[#2a2a2a] text-xs">
                        <span className="text-slate-400 font-extrabold">수행 시간</span>
                        <div className="flex items-center space-x-3 bg-[#262626] px-3 py-1.5 rounded-xl border border-[#3a3a3a]">
                          <button
                            onClick={() => changeCardio(item.id, -5)}
                            className="btn-tap p-1 bg-[#1e1e1e] text-slate-300 hover:text-white rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-white text-sm px-2">{item.duration}분</span>
                          <button
                            onClick={() => changeCardio(item.id, 5)}
                            className="btn-tap p-1 bg-[#1e1e1e] text-slate-300 hover:text-white rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCardioDone(item.id)}
                        className={`btn-tap w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                          item.isDone
                            ? "bg-[#a78bfa] text-[#1e1e1e] border-[#a78bfa] shadow-md"
                            : "bg-[#1e1e1e] border-[#3a3a3a] text-slate-500"
                        }`}
                      >
                        {item.isDone ? (
                          <>
                            <Check className="w-4 h-4 mr-1" /> 완료됨
                          </>
                        ) : (
                          "완료 체크"
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Set Buttons */}
                      <div className="grid grid-cols-3 gap-2 py-0.5">
                        {item.sets.map((setVal, idx) => {
                          const completed = setVal !== null;
                          let dispText = "기록하기";
                          if (completed) {
                            dispText = item.isBodyweight ? `${setVal.r}회` : `${setVal.w}kg / ${setVal.r}회`;
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => toggleSetStatus(item.id, idx)}
                              className={`btn-tap py-3 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                                completed
                                  ? "bg-[#a78bfa] text-[#1e1e1e] border-[#a78bfa] shadow-md"
                                  : "bg-[#1e1e1e] border-[#3a3a3a] text-slate-500"
                              }`}
                            >
                              <span className={`text-[9px] ${completed ? "text-[#1e1e1e]/60" : "text-slate-650"} font-black uppercase`}>
                                {idx + 1}세트
                              </span>
                              <span className="text-xs font-extrabold mt-0.5">{dispText}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Adjusters Layout */}
                      <div className={`bg-[#1e1e1e] p-3 rounded-2xl border border-[#2a2a2a] grid ${item.isBodyweight ? "grid-cols-1" : "grid-cols-2"} gap-3 text-xs`}>
                        {!item.isBodyweight && (
                          <div className="flex items-center justify-center space-x-2 bg-[#262626] px-2.5 py-2 rounded-xl border border-[#3a3a3a]">
                            <span className="text-slate-400 font-extrabold shrink-0">중량</span>
                            <button
                              onClick={() => changeVal(item.id, "w", -item.step)}
                              className="btn-tap p-1 bg-[#2a2a2a] text-slate-300 hover:text-white rounded-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-extrabold text-white min-w-[42px] text-center text-xs">{item.weight}kg</span>
                            <button
                              onClick={() => changeVal(item.id, "w", item.step)}
                              className="btn-tap p-1 bg-[#2a2a2a] text-slate-300 hover:text-white rounded-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center justify-center space-x-2 bg-[#262626] px-2.5 py-2 rounded-xl border border-[#3a3a3a]">
                          <span className="text-slate-400 font-extrabold shrink-0">횟수</span>
                          <button
                            onClick={() => changeVal(item.id, "r", -1)}
                            className="btn-tap p-1 bg-[#2a2a2a] text-slate-300 hover:text-white rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-extrabold text-white min-w-[28px] text-center text-xs">{item.reps}회</span>
                          <button
                            onClick={() => changeVal(item.id, "r", 1)}
                            className="btn-tap p-1 bg-[#2a2a2a] text-slate-300 hover:text-white rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Comment Feedback Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-500">
                      <MessageSquare className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={item.note || ""}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      placeholder="통증 및 세션 특이사항 피드백 입력"
                      className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-xs text-slate-300 rounded-2xl pl-10 pr-3 py-3.5 focus:outline-none focus:border-[#a78bfa] placeholder-slate-600 transition"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Workout Exercise Button */}
        <button
          onClick={() => openExerciseModal(null)}
          className="btn-tap w-full py-3.5 bg-[#262626] hover:bg-[#2d2d2d] border border-[#3a3a3a] text-[#a78bfa] font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>새로운 운동 추가하기</span>
        </button>

        {/* In-Flow Copy Control */}
        <div className="pt-6 pb-8 border-t border-[#3a3a3a]/80">
          <button
            onClick={copyRoutineResults}
            className="btn-tap w-full py-4 bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] text-[#1e1e1e] font-black rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-[#a78bfa]/10 text-sm"
          >
            <CheckCheck className="w-5 h-5" />
            <span>오늘 운동 완료하고 기록 복사하기</span>
          </button>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="btn-tap w-full py-3 mt-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>오늘 기록(완료 상태) 초기화하기</span>
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">
            작성한 세션 데이터가 텍스트 형식으로 자동 복사됩니다.
          </p>
        </div>

      </main>

      {/* Routine Metadata Edit Modal */}
      <AnimatePresence>
        {isRoutineModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRoutineModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
                <button
                  onClick={() => setIsRoutineModalOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">루틴 정보 수정</h3>
                    <p className="text-[10px] text-slate-400">해당 요일의 메인 루틴 정보 및 가이드를 변경합니다</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">탭 표시 이름 (Tab Label)</label>
                    <input
                      type="text"
                      value={editRoutineTabLabel}
                      onChange={(e) => setEditRoutineTabLabel(e.target.value)}
                      placeholder="예: 월 (당기기)"
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">루틴 메인 타이틀</label>
                    <input
                      type="text"
                      value={editRoutineTitle}
                      onChange={(e) => setEditRoutineTitle(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">루틴 부제목 (요약 가이드)</label>
                    <input
                      type="text"
                      value={editRoutineSubTitle}
                      onChange={(e) => setEditRoutineSubTitle(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">오늘의 트레이닝 가이드 메시지</label>
                    <textarea
                      value={editRoutineDirective}
                      onChange={(e) => setEditRoutineDirective(e.target.value)}
                      rows={3}
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa] resize-none"
                    />
                  </div>

                  <button
                    onClick={saveRoutineInfo}
                    className="btn-tap w-full py-3 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#1e1e1e] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>수정 사항 저장</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Exercise Add/Edit Modal */}
      <AnimatePresence>
        {isExerciseModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExerciseModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl overflow-y-auto max-h-[90%]"
              >
                <button
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {editingExerciseId ? "운동 정보 수정" : "새로운 운동 추가"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {editingExerciseId ? "선택한 운동 설정을 조율합니다" : "현재 요일에 새로운 운동을 설정합니다"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pr-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">운동명</label>
                    <input
                      type="text"
                      value={editExName}
                      onChange={(e) => setEditExName(e.target.value)}
                      placeholder="예: 시티드 로우"
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">카테고리</label>
                      <select
                        value={editExCategory}
                        onChange={(e) => setEditExCategory(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-2 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                      >
                        <option value="등">등</option>
                        <option value="가슴">가슴</option>
                        <option value="하체">하체</option>
                        <option value="어깨">어깨</option>
                        <option value="이두">이두</option>
                        <option value="삼두">삼두</option>
                        <option value="코어">코어</option>
                        <option value="웜업">웜업</option>
                        <option value="유산소">유산소</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">세트 수</label>
                      <select
                        value={editExSetsCount}
                        onChange={(e) => setEditExSetsCount(parseInt(e.target.value, 10))}
                        className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-2 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                      >
                        <option value={1}>1세트</option>
                        <option value={2}>2세트</option>
                        <option value={3}>3세트</option>
                        <option value={4}>4세트</option>
                        <option value={5}>5세트</option>
                        <option value={6}>6세트</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">운동 특성</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["normal", "bodyweight", "cardio"] as const).map((t) => {
                        const isSelected = editExType === t;
                        const labelText = t === "normal" ? "일반" : t === "bodyweight" ? "맨몸" : "유산소/웜업";
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setEditExType(t)}
                            className={`flex items-center justify-center p-2 rounded-xl cursor-pointer select-none border transition-all text-[10px] font-bold ${
                              isSelected
                                ? "bg-[#a78bfa]/10 border-[#a78bfa] text-[#a78bfa]"
                                : "bg-[#1e1e1e] border-[#3a3a3a] text-slate-400"
                            }`}
                          >
                            {labelText}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {editExType === "normal" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">기본 중량 (kg)</label>
                        <input
                          type="number"
                          value={editExWeight}
                          onChange={(e) => setEditExWeight(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">기본 횟수 (reps)</label>
                        <input
                          type="number"
                          value={editExReps}
                          onChange={(e) => setEditExReps(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                        />
                      </div>
                    </div>
                  )}

                  {editExType === "bodyweight" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">기본 횟수 (reps)</label>
                      <input
                        type="number"
                        value={editExReps}
                        onChange={(e) => setEditExReps(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>
                  )}

                  {editExType === "cardio" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">기본 시간 (분)</label>
                      <input
                        type="number"
                        value={editExDuration}
                        onChange={(e) => setEditExDuration(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">운동 목표 가이드 문구</label>
                    <input
                      type="text"
                      value={editExTarget}
                      onChange={(e) => setEditExTarget(e.target.value)}
                      placeholder={
                        editExType === "cardio"
                          ? "예: 10분 빠른 걷기"
                          : editExType === "bodyweight"
                          ? "예: 맨몸 x 12회"
                          : "예: 30kg x 12회"
                      }
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">운동 팁 (요약)</label>
                    <input
                      type="text"
                      value={editExTip}
                      onChange={(e) => setEditExTip(e.target.value)}
                      placeholder="예: 무릎 방향 정렬 엄수"
                      className="w-full bg-[#1e1e1e] border border-[#3a3a3a] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                </div>

                <button
                  onClick={saveExercise}
                  className="btn-tap w-full py-3 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#1e1e1e] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                >
                  <Check className="w-4 h-4" />
                  <span>저장하기</span>
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal (Visible Days Toggle) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">대시보드 요일 설정</h3>
                    <p className="text-[10px] text-slate-400">탭에 노출할 요일을 선택하여 루틴을 커스텀하세요</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 font-semibold">최소 1개 이상의 요일은 선택되어야 합니다.</p>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {DAY_ORDER.map((day) => {
                      const isChecked = visibleDays.includes(day);
                      return (
                        <label
                          key={day}
                          className="flex items-center justify-between p-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl cursor-pointer transition"
                        >
                          <span className="text-xs font-semibold text-slate-200">
                            {day === "mon"
                              ? "월요일"
                              : day === "tue"
                              ? "화요일"
                              : day === "wed"
                              ? "수요일"
                              : day === "thu"
                              ? "목요일"
                              : day === "fri"
                              ? "금요일"
                              : day === "sat"
                              ? "토요일"
                              : "일요일"}
                          </span>
                          <input
                            type="checkbox"
                            value={day}
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let updated = [...visibleDays];
                              if (checked) {
                                if (!updated.includes(day)) updated.push(day);
                              } else {
                                updated = updated.filter((d) => d !== day);
                              }
                              // Limit: must have at least 1 day
                              if (updated.length > 0) {
                                setVisibleDays(updated);
                              }
                            }}
                            className="w-4 h-4 accent-[#a78bfa]"
                          />
                        </label>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => applyVisibleDays(visibleDays)}
                    className="btn-tap w-full py-3 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#1e1e1e] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>설정 적용하기</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Backup & Restore Modal */}
      <AnimatePresence>
        {isBackupOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBackupOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
                <button
                  onClick={() => setIsBackupOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">루틴 데이터 백업 & 복원</h3>
                    <p className="text-[10px] text-slate-400">새로고침이 되어도 안전하게 나의 루틴을 지키세요</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Export Segment */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">현재 루틴 백업 코드 생성</label>
                    <p className="text-[10px] text-slate-400">아래 보안 코드를 복사해 메모장에 저장하거나 기기를 변경할 때 사용하세요.</p>
                    <div className="relative mt-1">
                      <textarea
                        readOnly
                        value={exportCode}
                        className="w-full h-16 bg-[#1e1e1e] border border-[#3a3a3a] text-[10px] text-slate-400 rounded-xl p-2.5 focus:outline-none resize-none font-mono break-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(exportCode).then(() => {
                            triggerToastBanner("백업용 보안 코드가 복사되었습니다! 안전한 곳에 기록해 두세요.");
                          });
                        }}
                        className="btn-tap absolute right-2 bottom-2 px-2.5 py-1.5 bg-[#a78bfa] text-[#1e1e1e] font-extrabold text-[10px] rounded-lg shadow-md flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> 코드 복사
                      </button>
                    </div>
                  </div>

                  {/* Import Segment */}
                  <div className="space-y-2 border-t border-[#3a3a3a] pt-4">
                    <label className="text-[11px] font-extrabold text-[#a78bfa] tracking-wider uppercase block">보안 코드로 기록 복원</label>
                    <p className="text-[10px] text-slate-400">복사해 둔 코드를 붙여넣으면 진행 데이터가 즉시 완벽 복원됩니다.</p>
                    <textarea
                      value={importCode}
                      onChange={(e) => setImportCode(e.target.value)}
                      placeholder="여기에 백업 보안 코드를 붙여넣으세요..."
                      className="w-full h-16 mt-1 bg-[#1e1e1e] border border-[#3a3a3a] text-[10px] text-slate-350 rounded-xl p-2.5 focus:outline-none focus:border-[#a78bfa] resize-none font-mono break-all placeholder:text-slate-600"
                    />
                    <button
                      onClick={importBackupCode}
                      className="btn-tap w-full py-2.5 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#1e1e1e] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>기록 동기화 및 복원 적용</span>
                    </button>
                  </div>

                  {/* Safe Smart Wipe Reset Button */}
                  <div className="text-center pt-2 border-t border-[#3a3a3a]">
                    <button
                      onClick={resetAllData}
                      className={`btn-tap text-[10px] font-extrabold transition-all duration-200 ${
                        resetConfirmActive ? "text-amber-500 font-black" : "text-rose-500 hover:text-rose-400 underline"
                      }`}
                    >
                      {resetConfirmActive ? "⚠️ 한번 더 클릭 시 정말 전체 초기화!" : "현재 브라우저 기록 전체 초기화하기"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Injury Risk Specs Modal */}
      <AnimatePresence>
        {isSafetyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSafetyOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
                <button
                  onClick={() => setIsSafetyOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">웨이트 트레이닝 부상 방지 가이드</h3>
                    <p className="text-[10px] text-slate-400">안전하고 정교한 자극 전달을 위한 가이드</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-[#3a3a3a] flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 font-extrabold text-[10px] rounded border border-rose-500/20 mt-0.5 shrink-0">손목 보호</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      프레스 동작 시 엄지 아랫부분의 뼈(척골 라인)에 무거운 바를 얹어 고정하는 <strong className="text-white">'불독 그립'</strong>을 사용하여 손목이 뒤로 꺾여 생기는 손상을 방지합니다.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-[#3a3a3a] flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-extrabold text-[10px] rounded border border-amber-500/20 mt-0.5 shrink-0">무릎 제어</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      스쿼트, 레그 프레스 시 발끝 방향과 무릎이 나아가는 궤적을 반드시 평행하게 유지합니다. 발가락이 안쪽으로 모이거나 무릎이 모이지 않게 주의하세요.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-950/50 rounded-2xl border border-[#3a3a3a] flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 font-extrabold text-[10px] rounded border border-teal-500/20 mt-0.5 shrink-0">어깨 안정</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      레이즈 및 상체 밀기 동작 시 팔을 완전히 180도 옆으로 벌리지 않고, 몸통 전면으로 약 30도 앞(견갑면 궤적)으로 향하여 충돌 증후군을 예방하세요.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* PWA Install Guide Modal */}
      <AnimatePresence>
        {isPwaOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPwaOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
                <button
                  onClick={() => setIsPwaOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">홈 화면 설치 가이드</h3>
                    <p className="text-[10px] text-slate-400">설치해서 사용하면 절전 모드가 자동 방지됩니다!</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-extrabold text-[11px] rounded-lg border border-emerald-500/20 inline-block">갤럭시 / 안드로이드</span>
                    <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1 font-semibold leading-relaxed">
                      <li>인터넷 주소창 우측 상단의 <strong className="text-white">더보기(점 3개)</strong> 또는 공유 버튼을 터치합니다.</li>
                      <li>메뉴 리스트에서 <strong className="text-emerald-400">"홈 화면에 추가"</strong> 또는 <strong className="text-emerald-400">"앱 설치"</strong>를 누르면 완료!</li>
                    </ol>
                  </div>

                  <div className="space-y-2.5 border-t border-[#3a3a3a] pt-4">
                    <span className="px-2.5 py-1 bg-teal-500/10 text-teal-400 font-extrabold text-[11px] rounded-lg border border-teal-500/20 inline-block">아이폰 / iOS</span>
                    <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1 font-semibold leading-relaxed">
                      <li>사파리(Safari) 브라우저 하단의 <strong className="text-white">공유 버튼(내보내기 모양)</strong>을 터치합니다.</li>
                      <li>리스트를 내리다 보면 나타나는 <strong className="text-emerald-400">"홈 화면에 추가"</strong>를 눌러주면 완료!</li>
                    </ol>
                  </div>

                  <div className="p-3 bg-slate-950/50 rounded-2xl border border-[#3a3a3a]">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      ※ 카카오톡, 네이버, 인앱 브라우저 등으로 이 창을 보고 계신가요? <br />
                      우측 하단이나 상단 메뉴의 <strong className="text-white">"기본 브라우저(Chrome/Safari)로 열기"</strong>를 한 다음, 위의 순서대로 홈 화면에 설치해 주세요!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[120]"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="pointer-events-auto bg-[#262626] border border-[#3a3a3a] w-full max-w-sm rounded-3xl p-6 space-y-5 relative shadow-2xl"
              >
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="absolute top-5 right-5 p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl text-slate-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 border-b border-[#3a3a3a] pb-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">운동 기록 초기화</h3>
                    <p className="text-[10px] text-slate-400">오늘 진행한 완료 상태를 비웁니다</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                    오늘 체크한 완료 상태와 피드백을 모두 초기화하시겠습니까?<br />
                    <span className="text-rose-400 mt-1 block">※ 설정된 무게와 횟수는 다음 운동을 위해 그대로 유지됩니다.</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#3a3a3a]">
                    <button
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="btn-tap w-full py-3 bg-[#1e1e1e] border border-[#3a3a3a] text-slate-400 hover:text-white font-black rounded-xl text-xs flex items-center justify-center transition"
                    >
                      취소하기
                    </button>
                    <button
                      onClick={executeResetTodayRoutine}
                      className="btn-tap w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-black rounded-xl text-xs flex items-center justify-center transition"
                    >
                      초기화 진행
                    </button>
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
