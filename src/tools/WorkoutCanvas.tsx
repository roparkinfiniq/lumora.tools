import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Plus,
  Settings,
  Globe,
  MoreHorizontal
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

const EN_DAY_LABELS: Record<string, string> = {
  mon: "Mon (Pull)",
  tue: "Tue (Push)",
  wed: "Wed (Legs)",
  thu: "Thu (Core)",
  fri: "Fri (Upper)",
  sat: "Sat (Legs)",
  sun: "Sun (Rest)"
};

const EN_DEFAULT_DATABASE: WorkoutDatabase = {
  mon: {
    tabLabel: "Mon (Pull)",
    mainTitle: "Monday: Pull (Back & Biceps)",
    subTitle: "Focus on Latissimus Dorsi & Core Activation",
    directive: "A day to develop the spinal frame for a solid posterior. Pull deep with the angle of your elbows, not forearm strength, and control the contraction's peak.",
    items: [
      { id: "mon-0", name: "Light Full-Body Cycling (Warmup)", category: "Warmup", target: "Moderate cardio for 10 min", isWarmup: true, duration: 10, note: "", tip: "Warmup joints", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "mon-1", name: "Seated Row Machine", category: "Back", target: "35kg x 12 reps", weight: 35, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Pull deep, elbows in" },
      { id: "mon-2", name: "Lat Pulldown Machine", category: "Back", target: "30kg x 12 reps", weight: 30, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Retract scapulae down" },
      { id: "mon-3", name: "Cable Biceps Curl", category: "Biceps", target: "15kg x 12 reps", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Anchor elbows to torso" },
      { id: "mon-4", name: "AB Wheel", category: "Core", target: "Bodyweight x 12 reps", isBodyweight: true, weight: 0, reps: 12, step: 1, sets: [null, null, null], note: "", tip: "Squeeze abs, keep posture" }
    ]
  },
  tue: {
    tabLabel: "Tue (Push)",
    mainTitle: "Tuesday: Push (Chest & Shoulders & Triceps)",
    subTitle: "Progressive Overload & Shoulder Joint Safety",
    directive: "Build a strong, stable chest and shoulders. Retract and depress your scapulae to protect rotator cuffs on all pushing movements.",
    items: [
      { id: "tue-0", name: "Dynamic Upper Body Stretching (Warmup)", category: "Warmup", target: "Mobility stretching for 5 min", isWarmup: true, duration: 5, note: "", tip: "Rotator cuff mobility", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "tue-1", name: "Chest Press Machine", category: "Chest", target: "30kg x 12 reps", weight: 30, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Apply bulldog grip" },
      { id: "tue-2", name: "Pec Deck Fly Machine", category: "Chest", target: "10kg x 12 reps", weight: 10, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Focus on chest contraction" },
      { id: "tue-3", name: "Shoulder Press Machine", category: "Shoulders", target: "15kg x 12 reps", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Press along scapular plane" },
      { id: "tue-4", name: "Side Lateral Raise", category: "Shoulders", target: "4kg x 15 reps", weight: 4, reps: 15, step: 0.5, sets: [null, null, null], note: "", tip: "Avoid traps shrugging" },
      { id: "tue-5", name: "Cable Pushdown (Rope)", category: "Triceps", target: "15kg x 12 reps", weight: 15, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Lock elbows, squeeze triceps" }
    ]
  },
  wed: {
    tabLabel: "Wed (Legs)",
    mainTitle: "Wednesday: Lower Body (Quads & Glutes)",
    subTitle: "Knee Stability & Posterior Chain Balance",
    directive: "The heavy session targeting the largest muscle group in your body. Focus on loading hamstrings and glutes cleanly.",
    items: [
      { id: "wed-0", name: "Light Walk (Warmup)", category: "Warmup", target: "Walking for 10 min", isWarmup: true, duration: 10, note: "", tip: "Loosen lower joints", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "wed-1", name: "Hip Abduction Machine", category: "Lower", target: "40kg x 12 reps", weight: 40, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Push knees outward" },
      { id: "wed-2", name: "Leg Press Machine", category: "Lower", target: "30kg x 15 reps", weight: 30, reps: 15, step: 5, sets: [null, null, null], note: "", tip: "Push through your heels" },
      { id: "wed-3", name: "Leg Extension Machine", category: "Lower", target: "15kg x 12 reps", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Hold peak contraction" },
      { id: "wed-4", name: "Leg Curl Machine", category: "Lower", target: "15kg x 12 reps", weight: 15, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Control hamstring return" }
    ]
  },
  thu: {
    tabLabel: "Thu (Core)",
    mainTitle: "Thursday: Core & Cardio Session",
    subTitle: "Improve Core Resistance & Aerobic Recovery",
    directive: "Focus on dynamic core stabilization and recovery cardiovascular training to burn body fat.",
    items: [
      { id: "thu-0", name: "Full Body Stretching (Warmup)", category: "Warmup", target: "Stretches for 10 min", isWarmup: true, duration: 10, note: "", tip: "Prepare cardiovascular flow", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "thu-1", name: "Core Plank", category: "Core", target: "Bodyweight x 60s hold", isBodyweight: true, weight: 0, reps: 60, step: 1, sets: [null, null, null], note: "", tip: "Keep neutral spine & pelvis" },
      { id: "thu-2", name: "AB Wheel Rollout", category: "Core", target: "Bodyweight x 10 reps", isBodyweight: true, weight: 0, reps: 10, step: 1, sets: [null, null, null], note: "", tip: "Resist arching lower back" },
      { id: "thu-3", name: "Stationary Bike (Cardio)", category: "Cardio", target: "Pedaling for 30 min", isCardio: true, duration: 30, note: "", tip: "Keep resistance level 3-4", sets: [], weight: 0, reps: 0, step: 2.5 }
    ]
  },
  fri: {
    tabLabel: "Fri (Upper)",
    mainTitle: "Friday: Upper Body Balance & Volume",
    subTitle: "Upper Body Hypertrophy & Vector Balance",
    directive: "A routine to balance pushing and pulling volume, targeting well-rounded upper body progression.",
    items: [
      { id: "fri-0", name: "Walk & Rotator Cuff Prep (Warmup)", category: "Warmup", target: "Warm up for 10 min", isWarmup: true, duration: 10, note: "", tip: "Improve joint lubrication", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "fri-1", name: "Chest Press Machine", category: "Chest", target: "30kg x 12 reps", weight: 30, reps: 12, step: 2.5, sets: [null, null, null], note: "", tip: "Control chest contraction" },
      { id: "fri-2", name: "Lat Pulldown Machine", category: "Back", target: "35kg x 12 reps", weight: 35, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Squeeze latissimus dorsi" },
      { id: "fri-3", name: "Side Lateral Raise", category: "Shoulders", target: "4kg x 15 reps", weight: 4, reps: 15, step: 0.5, sets: [null, null, null], note: "", tip: "Do not shrug shoulders" },
      { id: "fri-4", name: "Cable Pushdown (Rope)", category: "Triceps", target: "15kg x 12 reps", weight: 15, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Extend triceps completely" }
    ]
  },
  sat: {
    tabLabel: "Sat (Legs)",
    mainTitle: "Saturday: Lower Body & Core Focus",
    subTitle: "Posterior Chain Loading & Glute Activation",
    directive: "A high-density weekend workout session focusing on glutes, hamstrings, and midsection stability.",
    items: [
      { id: "sat-0", name: "Dynamic Foam Rolling (Warmup)", category: "Warmup", target: "Myofascial release for 10 min", isWarmup: true, duration: 10, note: "", tip: "Release muscle tension", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "sat-1", name: "Leg Press Machine", category: "Lower", target: "40kg x 12 reps", weight: 40, reps: 12, step: 5, sets: [null, null, null], note: "", tip: "Stimulate quadriceps fully" },
      { id: "sat-2", name: "Dumbbell Romanian Deadlift", category: "Lower", target: "10kg x 12 reps", weight: 10, reps: 12, step: 2, sets: [null, null, null], note: "", tip: "Hinge at the hips cleanly" },
      { id: "sat-3", name: "AB Wheel Rollout", category: "Core", target: "Bodyweight x 10 reps", isBodyweight: true, weight: 0, reps: 10, step: 1, sets: [null, null, null], note: "", tip: "Maintain rigid core alignment" },
      { id: "sat-4", name: "Core Plank", category: "Core", target: "Bodyweight x 60s hold", isBodyweight: true, weight: 0, reps: 60, step: 1, sets: [null, null, null], note: "", tip: "Push elbows through floor" }
    ]
  },
  sun: {
    tabLabel: "Sun (Rest)",
    mainTitle: "Sunday: Recovery & Rest",
    subTitle: "Active Recovery & Quality Muscle Stretching",
    directive: "Muscle synthesis and neural recovery occur only during rest. Enjoy recovery stretching to promote blood circulation.",
    items: [
      { id: "sun-0", name: "Full-Body Yoga Stretching (Warmup)", category: "Warmup", target: "Yoga recovery for 10 min", isWarmup: true, duration: 10, note: "", tip: "Relieve muscle fatigue", sets: [], weight: 0, reps: 0, step: 2.5 },
      { id: "sun-1", name: "Active recovery stroll (Cardio)", category: "Cardio", target: "Light walk for 20 min", isCardio: true, duration: 20, note: "", tip: "Boost recovery metabolism", sets: [], weight: 0, reps: 0, step: 2.5 }
    ]
  }
};

const TRANSLATIONS = {
  ko: {
    headerSub: "스마트 운동 캔버스",
    wakeLockDEMO: "제한됨 (미리보기)",
    pwaBannerTitle: "화면이 계속 켜져있는 \"진짜 앱\" 설치",
    pwaBannerDesc: "홈 화면에 추가하면 화면 유지 기능이 활성화됩니다!",
    pwaBannerInstall: "1초 설치",
    emptyRoutine: "이 요일에 설정된 운동이 없습니다. 새로운 운동을 추가해보세요.",
    addExerciseBtn: "새로운 운동 추가하기",
    completeLogsBtn: "오늘 운동 완료하고 기록 복사하기",
    resetLogsBtn: "오늘 기록(완료 상태) 초기화하기",
    copyDescText: "작성한 세션 데이터가 텍스트 형식으로 자동 복사됩니다.",
    setLogsLabel: "실제 완료 시간",
    setLogsLabelCardio: "수행 시간",
    completedText: "완료됨",
    markDoneText: "완료 체크",
    setIndexText: "세트",
    logSetText: "기록하기",
    weightLabel: "중량",
    repsLabel: "횟수",
    feedbackPlaceholder: "통증 및 세션 특이사항 피드백 입력",
    guidePrefix: "가이드",
    editLabel: "수정",
    deleteLabel: "삭제",
    routineProgressText: "세션 진척도",
    routineInfoEditTitle: "루틴 정보 수정",
    routineInfoEditDesc: "해당 요일의 메인 루틴 정보 및 가이드를 변경합니다",
    tabLabelInput: "탭 표시 이름 (Tab Label)",
    mainTitleInput: "루틴 메인 타이틀",
    subTitleInput: "루틴 부제목 (요약 가이드)",
    coachGuideInput: "오늘의 트레이닝 가이드 메시지",
    saveBtn: "수정 사항 저장",
    exerciseEditTitle: "운동 정보 수정",
    exerciseAddTitle: "새로운 운동 추가",
    exerciseEditDesc: "선택한 운동 설정을 조율합니다",
    exerciseAddDesc: "현재 요일에 새로운 운동을 설정합니다",
    exNameInput: "운동명",
    categoryInput: "카테고리",
    setCountInput: "세트 수",
    exTypeInput: "운동 특성",
    exTypeNormal: "일반",
    exTypeBodyweight: "맨몸",
    exTypeCardio: "유산소/웜업",
    baseWeightInput: "기본 중량 (kg)",
    baseRepsInput: "기본 횟수 (reps)",
    baseDurationInput: "기본 시간 (분)",
    exGuideInput: "운동 목표 가이드 문구",
    exTipInput: "운동 팁 (요약)",
    saveGeneralBtn: "저장하기",
    settingsTitle: "대시보드 요일 설정",
    settingsDesc: "탭에 노출할 요일을 선택하여 루틴을 커스텀하세요",
    settingsWarn: "최소 1개 이상의 요일은 선택되어야 합니다.",
    applyBtn: "설정 적용하기",
    backupTitle: "루틴 데이터 백업 & 복원",
    backupDesc: "새로고침이 되어도 안전하게 나의 루틴을 지키세요",
    backupGenTitle: "현재 루틴 백업 코드 생성",
    backupGenDesc: "아래 보안 코드를 복사해 메모장에 저장하거나 기기를 변경할 때 사용하세요.",
    btnCopyCode: "코드 복사",
    backupRestoreTitle: "보안 코드로 기록 복원",
    backupRestoreDesc: "복사해 둔 코드를 붙여넣으면 진행 데이터가 즉시 완벽 복원됩니다.",
    btnRestoreApply: "기록 동기화 및 복원 적용",
    btnResetAll: "현재 브라우저 기록 전체 초기화하기",
    safetyTitle: "웨이트 트레이닝 부상 방지 가이드",
    safetyDesc: "안전하고 정교한 자극 전달을 위한 가이드",
    pwaTitle: "홈 화면 설치 가이드",
    pwaDesc: "설치해서 사용하면 절전 모드가 자동 방지됩니다!",
    moreMenuTitle: "더 보기 메뉴",
    moreMenuDesc: "루틴 설정, 백업 및 안전 가이드를 제공합니다",
    toastCopySuccess: "오늘의 운동 기록이 복사되었습니다. 대화창에 바로 붙여넣기 해주세요!",
    toastCopyFail: "복사에 실패했습니다. 수동 복사 부탁드립니다.",
    toastResetSuccess: "오늘의 운동 기록이 초기화되었습니다.",
    toastRestoreSuccess: "기록이 완벽하게 동기화 복원되었습니다!",
    toastRestoreFail: "올바르지 않은 복원 코드입니다. 복사한 코드가 완전한지 체크해 보세요.",
    toastSettingSuccess: "요일 노출 설정이 변경되었습니다.",
    toastExAddSuccess: "새로운 운동이 추가되었습니다.",
    toastExEditSuccess: "운동 정보가 수정되었습니다.",
    toastExDeleteSuccess: "운동이 삭제되었습니다.",
    toastTabSettingMin: "최소 하나의 요일은 활성화되어야 합니다!",
    toastRestoreInputCode: "복원할 백업 코드를 입력해 주세요.",
    monLabel: "월요일", tueLabel: "화요일", wedLabel: "수요일", thuLabel: "목요일", friLabel: "금요일", satLabel: "토요일", sunLabel: "일요일",
    wristTitle: "손목 보호", wristBody: "프레스 동작 시 엄지 아랫부분의 뼈(척골 라인)에 무거운 바를 얹어 고정하는 '불독 그립'을 사용하여 손목이 뒤로 꺾여 생기는 손상을 방지합니다.",
    kneeTitle: "무릎 제어", kneeBody: "스쿼트, 레그 프레스 시 발끝 방향과 무릎이 나아가는 궤적을 반드시 평행하게 유지합니다. 발가락이 안쪽으로 모이거나 무릎이 모이지 않게 주의하세요.",
    shoulderTitle: "어깨 안정", shoulderBody: "레이즈 및 상체 밀기 동작 시 팔을 완전히 180도 옆으로 벌리지 않고, 몸통 전면으로 약 30도 앞(견갑면 궤적)으로 향하여 충돌 증후군을 예방하세요.",
    androidPwaTitle: "갤럭시 / 안드로이드", androidPwaSteps: ["인터넷 주소창 우측 상단의 더보기(점 3개) 또는 공유 버튼을 터치합니다.", "메뉴 리스트에서 \"홈 화면에 추가\" 또는 \"앱 설치\"를 누르면 완료!"],
    iosPwaTitle: "아이폰 / iOS", iosPwaSteps: ["사파리(Safari) 브라우저 하단의 공유 버튼(내보내기 모양)을 터치합니다.", "리스트를 내리다 보면 나타나는 \"홈 화면에 추가\"를 눌러주면 완료!"],
    pwaTip: "※ 카카오톡, 네이버, 인앱 브라우저 등으로 이 창을 보고 계신가요? 우측 하단이나 상단 메뉴의 \"기본 브라우저(Chrome/Safari)로 열기\"를 한 다음, 위의 순서대로 홈 화면에 설치해 주세요!",
    resetConfirmTitle: "운동 기록 초기화",
    resetConfirmDesc: "오늘 진행한 완료 상태를 비웁니다",
    resetConfirmWarn: "오늘 체크한 완료 상태와 피드백을 모두 초기화하시겠습니까? 설정된 무게와 횟수는 다음 운동을 위해 그대로 유지됩니다.",
    btnCancel: "취소하기",
    btnConfirmReset: "초기화 진행",
    reportHeader: "[ LUMORA WORKOUT REPORT ]",
    reportSession: "SESSION",
    reportDate: "DATE",
    reportActual: "수행 기록",
    reportFeedback: "피드백",
    reportConditionPass: "컨디션 조절 및 패스",
    reportSets: "세트",
    reportReps: "회",
    reportFooter: "* 본 기록은 브라우저 로컬 저장소에 안전하게 유지됩니다.",
    pwaInstallTitle: "1초 설치",
    btnCloseGeneral: "닫기"
  },
  en: {
    headerSub: "Smart Workout Canvas",
    wakeLockDEMO: "Demo Viewport",
    pwaBannerTitle: "Install as a Home Screen App",
    pwaBannerDesc: "Add to Home Screen to activate screen wake lock feature!",
    pwaBannerInstall: "Install",
    emptyRoutine: "No exercises set for this day. Try adding a new exercise.",
    addExerciseBtn: "Add New Exercise",
    completeLogsBtn: "Finish Workout & Copy Logs",
    resetLogsBtn: "Reset Today's Completion Logs",
    copyDescText: "Your workout log will be copied to clipboard in text format.",
    setLogsLabel: "Actual Completed Time",
    setLogsLabelCardio: "Workout Duration",
    completedText: "Done",
    markDoneText: "Mark Done",
    setIndexText: "Set",
    logSetText: "Log",
    weightLabel: "Weight",
    repsLabel: "Reps",
    feedbackPlaceholder: "Enter pain levels or workout feedback notes...",
    guidePrefix: "Guide",
    editLabel: "Edit",
    deleteLabel: "Delete",
    routineProgressText: "Progress",
    routineInfoEditTitle: "Edit Routine Details",
    routineInfoEditDesc: "Modify the main session title and coach guide for this day",
    tabLabelInput: "Tab Display Label",
    mainTitleInput: "Main Routine Title",
    subTitleInput: "Subtitle (Summary Guide)",
    coachGuideInput: "Coach Directive Message",
    saveBtn: "Save Changes",
    exerciseEditTitle: "Edit Exercise Info",
    exerciseAddTitle: "Add New Exercise",
    exerciseEditDesc: "Tune settings for this exercise",
    exerciseAddDesc: "Add a new exercise to this day's routine",
    exNameInput: "Exercise Name",
    categoryInput: "Category",
    setCountInput: "Sets Count",
    exTypeInput: "Exercise Type",
    exTypeNormal: "Strength",
    exTypeBodyweight: "Bodyweight",
    exTypeCardio: "Cardio/Warmup",
    baseWeightInput: "Default Weight (kg)",
    baseRepsInput: "Default Reps (reps)",
    baseDurationInput: "Default Time (mins)",
    exGuideInput: "Target/Goal Text",
    exTipInput: "Exercise Tip (Short)",
    saveGeneralBtn: "Save",
    settingsTitle: "Dashboard Days Toggle",
    settingsDesc: "Select active days to customize your routine dashboard",
    settingsWarn: "At least one day must remain active.",
    applyBtn: "Apply Settings",
    backupTitle: "Routine Backup & Restore",
    backupDesc: "Secure your custom routines across page reloads",
    backupGenTitle: "Generate Backup Token",
    backupGenDesc: "Copy the security token below to save your backup in a safe place.",
    btnCopyCode: "Copy Code",
    backupRestoreTitle: "Restore from Token",
    backupRestoreDesc: "Paste your saved token code below to restore your routine data instantly.",
    btnRestoreApply: "Apply Restore Token",
    btnResetAll: "Wipe all Local Browser Records",
    safetyTitle: "Injury Prevention Safety Guide",
    safetyDesc: "Precise biomechanics for injury-free workout progression",
    pwaTitle: "Home Screen App Installation Guide",
    pwaDesc: "Install as a PWA to keep your screen turned on automatically!",
    moreMenuTitle: "More Menu",
    moreMenuDesc: "Access routine settings, backup tools, and safety guide",
    toastCopySuccess: "Today's workout report has been copied to your clipboard! Paste it to the chat.",
    toastCopyFail: "Copy failed. Please manually copy the logs.",
    toastResetSuccess: "Today's workout logs have been reset.",
    toastRestoreSuccess: "Routines successfully restored and synchronized!",
    toastRestoreFail: "Invalid restore token. Check if the token is completely copied.",
    toastSettingSuccess: "Active days settings updated.",
    toastExAddSuccess: "New exercise added successfully.",
    toastExEditSuccess: "Exercise settings updated.",
    toastExDeleteSuccess: "Exercise removed.",
    toastTabSettingMin: "At least one day must be active!",
    toastRestoreInputCode: "Please enter a backup token.",
    monLabel: "Monday", tueLabel: "Tuesday", wedLabel: "Wednesday", thuLabel: "Thursday", friLabel: "Friday", satLabel: "Saturday", sunLabel: "Sunday",
    wristTitle: "Wrist Safety", wristBody: "On pressing motions, rest the bar directly over the heel of the palm (ulnar line) using the 'bulldog grip' to prevent wrist bending and joint damage.",
    kneeTitle: "Knee Control", kneeBody: "During squatting or pressing movements, ensure knee caps track perfectly parallel with toes. Do not let knees cave inwards.",
    shoulderTitle: "Shoulder Placement", shoulderBody: "On lateral raises and pushing actions, raise hands about 30 degrees forward (scapular plane) instead of flat sideways to prevent impingement.",
    androidPwaTitle: "Android / Chrome", androidPwaSteps: ["Tap the three dots (More) or share button in the top-right corner.", "Tap \"Add to Home Screen\" or \"Install App\" to complete!"],
    iosPwaTitle: "iOS / Safari", iosPwaSteps: ["Tap the share button (Export box icon) at the bottom of Safari.", "Scroll down and tap \"Add to Home Screen\" to complete!"],
    pwaTip: "※ Using KakaoTalk, Naver or other in-app browsers? Tap \"Open in default browser (Chrome/Safari)\" first, and then follow the steps to install it on your home screen!",
    resetConfirmTitle: "Reset Logs",
    resetConfirmDesc: "Clear today's completed marks",
    resetConfirmWarn: "Are you sure you want to clear today's completed marks and comments? Your weights and reps will be saved for next session.",
    btnCancel: "Cancel",
    btnConfirmReset: "Reset Logs",
    reportHeader: "[ LUMORA WORKOUT REPORT ]",
    reportSession: "SESSION",
    reportDate: "DATE",
    reportActual: "Performance",
    reportFeedback: "Feedback",
    reportConditionPass: "Condition adjustment / Passed",
    reportSets: "Sets",
    reportReps: "Reps",
    reportFooter: "* This log is safely stored in your local browser storage.",
    pwaInstallTitle: "Install",
    btnCloseGeneral: "Close"
  }
};

export default function WorkoutCanvas() {
  const [lang, setLang] = useState<"ko" | "en">(() => {
    const savedLang = localStorage.getItem("gems_workout_lang");
    if (savedLang === "en" || savedLang === "ko") {
      return savedLang;
    }
    const path = window.location.pathname;
    if (path.includes("/workout-canvas/ko")) {
      return "ko";
    }
    if (path.includes("/workout-canvas/en")) {
      return "en";
    }
    return "en";
  });
  const [activeDay, setActiveDay] = useState<string>("mon");
  const [db, setDb] = useState<WorkoutDatabase>(EN_DEFAULT_DATABASE);
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
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Double click confirm tracking states
  const [resetConfirmActive, setResetConfirmActive] = useState(false);
  const [deleteConfirmActive, setDeleteConfirmActive] = useState<Record<string, boolean>>({});

  // Editing exercise mapping
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  // Exercise Form State
  const [editExName, setEditExName] = useState("");
  const [editExCategory, setEditExCategory] = useState("Back");
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
  const [wakeLockStatusText, setWakeLockStatusText] = useState("화면 유지 OFF");
  const [isIframe, setIsIframe] = useState(false);

  // Backup tokens states
  const [exportCode, setExportCode] = useState("");
  const [importCode, setImportCode] = useState("");

  // Frame detection
  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  // Sync language changes back to URL & LocalStorage
  useEffect(() => {
    localStorage.setItem("gems_workout_lang", lang);
    const path = window.location.pathname;
    if (path.startsWith("/utilities/workout-canvas")) {
      const targetUrl = `/utilities/workout-canvas/${lang}`;
      window.history.replaceState(window.history.state, "", targetUrl);
    }
  }, [lang]);

  // Prevent hover shifts when modal is open
  const isAnyModalOpen = isRoutineModalOpen || isExerciseModalOpen || isSettingsOpen || isBackupOpen || isSafetyOpen || isPwaOpen || isResetConfirmOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isAnyModalOpen]);

  // Load from local storage
  useEffect(() => {
    const savedVisible = localStorage.getItem(`gems_visible_days_${lang}`);
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

    const savedDay = localStorage.getItem(`gems_active_day_${lang}`);
    if (savedDay && ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(savedDay)) {
      if (initialVisible.includes(savedDay)) {
        setActiveDay(savedDay);
      } else {
        setActiveDay(initialVisible[0] || "mon");
      }
    } else {
      setActiveDay(initialVisible[0] || "mon");
    }

    const savedDb = localStorage.getItem(`gems_workout_database_v1_${lang}`);
    if (savedDb) {
      try {
        const parsed = JSON.parse(savedDb);
        const mergedDb = { ...(lang === "ko" ? DEFAULT_DATABASE : EN_DEFAULT_DATABASE) };
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
        setDb(lang === "ko" ? DEFAULT_DATABASE : EN_DEFAULT_DATABASE);
      }
    } else {
      setDb(lang === "ko" ? DEFAULT_DATABASE : EN_DEFAULT_DATABASE);
    }
  }, [lang]);

  // Save to local storage
  const saveToStorage = (updatedDb: WorkoutDatabase, day: string, daysList?: string[]) => {
    try {
      localStorage.setItem(`gems_workout_database_v1_${lang}`, JSON.stringify(updatedDb));
      localStorage.setItem(`gems_active_day_${lang}`, day);
      if (daysList) {
        localStorage.setItem(`gems_visible_days_${lang}`, JSON.stringify(daysList));
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
        setWakeLockStatusText("화면 유지 ON");
        wl.addEventListener("release", () => {
          setIsWakeLockActive(false);
          setWakeLockStatusText("화면 유지 OFF");
        });
      } else {
        setWakeLockStatusText("화면 유지 OFF");
      }
    } catch (err) {
      setWakeLockStatusText("화면 유지 OFF");
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
        setWakeLockStatusText("화면 유지 OFF");
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
    const t = TRANSLATIONS[lang];

    let report = `${t.reportHeader}\n`;
    report += `────────────────────────────\n`;
    report += `${t.reportSession} : ${data.mainTitle}\n`;
    report += `${t.reportDate}    : ${dateStr}\n\n`;

    data.items.forEach((it) => {
      let actual = "";
      if (it.isCardio || it.isWarmup) {
        actual = it.isDone ? `${it.duration}${lang === "ko" ? "분 수행" : " min performed"}` : t.reportConditionPass;
      } else {
        const doneSets = it.sets.filter((s) => s !== null);
        if (doneSets.length > 0) {
          actual = doneSets
            .map((s, idx) => {
              if (!s) return "";
              return it.isBodyweight
                ? `${idx + 1}${lang === "ko" ? "세트" : "Set"} (${s.r}${t.reportReps})`
                : `${idx + 1}${lang === "ko" ? "세트" : "Set"} (${s.w}kg / ${s.r}${t.reportReps})`;
            })
            .join(", ");
        } else {
          actual = t.reportConditionPass;
        }
      }
      report += `■ ${it.name} (${it.category})\n`;
      report += `  ${t.reportActual} : ${actual}\n`;
      if (it.note && it.note.trim()) {
        report += `  ${t.reportFeedback} : ${it.note}\n`;
      }
      report += `\n`;
    });

    report += `────────────────────────────\n`;
    report += `${t.reportFooter}`;

    navigator.clipboard.writeText(report).then(
      () => {
        triggerToastBanner(t.toastCopySuccess);
      },
      () => {
        triggerToastBanner(t.toastCopyFail);
      }
    );
  };

  const toggleLanguage = () => {
    const nextLang = lang === "ko" ? "en" : "ko";
    setLang(nextLang);
    localStorage.setItem("gems_workout_lang", nextLang);
    triggerToastBanner(nextLang === "ko" ? "한국어로 변경되었습니다." : "Language changed to English.");
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
    triggerToastBanner(t.toastResetSuccess);
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
      triggerToastBanner(t.toastRestoreInputCode);
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
      triggerToastBanner(t.toastRestoreSuccess);
    } catch (e) {
      triggerToastBanner(t.toastRestoreFail);
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
    updatedDb[activeDay].tabLabel = tabLabel || CURRENT_DAY_LABELS[activeDay];
    updatedDb[activeDay].mainTitle = title;
    updatedDb[activeDay].subTitle = subtitle;
    updatedDb[activeDay].directive = directive;

    setDb(updatedDb);
    saveToStorage(updatedDb, activeDay);
    setIsRoutineModalOpen(false);
    triggerToastBanner(t.toastExEditSuccess);
  };

  // Exercise modal trigger
  const openExerciseModal = (itemId: string | null) => {
    setEditingExerciseId(itemId);
    if (!itemId) {
      setEditExName("");
      setEditExCategory(lang === "ko" ? "등" : "Back");
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
      triggerToastBanner(lang === "ko" ? "운동명을 입력해 주세요." : "Please enter the exercise name.");
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
    triggerToastBanner(editingExerciseId ? t.toastExEditSuccess : t.toastExAddSuccess);
  };

  const deleteExercise = (itemId: string) => {
    if (!deleteConfirmActive[itemId]) {
      const newConfirm = { ...deleteConfirmActive };
      newConfirm[itemId] = true;
      setDeleteConfirmActive(newConfirm);
      triggerToastBanner(lang === "ko" ? "⚠️ 한 번 더 누르면 정말 삭제됩니다!" : "⚠️ Tap again to delete permanently!");
      setTimeout(() => {
        setDeleteConfirmActive((prev) => ({ ...prev, [itemId]: false }));
      }, 3000);
    } else {
      const updatedDb = { ...db };
      updatedDb[activeDay].items = updatedDb[activeDay].items.filter((it) => it.id !== itemId);
      setDb(updatedDb);
      saveToStorage(updatedDb, activeDay);
      setDeleteConfirmActive((prev) => ({ ...prev, [itemId]: false }));
      triggerToastBanner(t.toastExDeleteSuccess);
    }
  };

  // Settings visible days apply
  const applyVisibleDays = (selectedDays: string[]) => {
    if (selectedDays.length === 0) {
      triggerToastBanner(t.toastTabSettingMin);
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
    triggerToastBanner(t.toastSettingSuccess);
  };

  const t = TRANSLATIONS[lang];
  const CURRENT_DAY_LABELS = lang === "ko" ? DAY_LABELS : EN_DAY_LABELS;

  return (
    <div className="w-full flex flex-col bg-transparent text-lumora-text relative pb-12 font-sans select-none overflow-x-hidden">
      
      {/* Dynamic Toast Banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
            className="fixed bottom-10 left-1/2 bg-[#131219] border border-lumora-highlight/30 text-white font-extrabold px-6 py-4 rounded-2xl text-xs shadow-2xl z-50 flex items-center gap-3 w-80 max-w-full"
          >
            <div className="w-5 h-5 rounded-full bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
              <Clipboard className="w-3.5 h-3.5" />
            </div>
            <span className="leading-tight text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-lumora-card/95 backdrop-blur-md border-b border-white/5 px-4 py-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-lumora-highlight to-lumora-highlight/85 flex items-center justify-center text-slate-900 font-extrabold text-base sm:text-lg shadow-md shadow-lumora-highlight/20">
                L
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lumora-highlight border-2 border-lumora-card rounded-full"></span>
            </div>
            <div className="leading-tight min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase truncate">Lumora Workout</h1>
              <p className="text-[9px] font-semibold text-lumora-sub tracking-tight whitespace-nowrap mt-0.5 hidden sm:block">{t.headerSub}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Smart Screen Status Indicator (Wake Lock) */}
            <button
              onClick={triggerWakeLockAction}
              className={`btn-tap p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all whitespace-nowrap shrink-0 ${
                isIframe
                  ? "bg-lumora-highlight/10 border border-lumora-highlight/20 text-lumora-highlight"
                  : isWakeLockActive
                  ? "bg-lumora-highlight/10 border border-lumora-highlight/20 text-lumora-highlight"
                  : "bg-lumora-bg/60 border border-white/5 text-lumora-sub"
              }`}
              title={isIframe ? t.wakeLockDEMO : (wakeLockStatusText === "화면 유지 ON" ? (lang === "ko" ? "화면 유지 ON" : "Wake Lock ON") : (lang === "ko" ? "화면 유지 OFF" : "Wake Lock OFF"))}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="inline sm:hidden">{isWakeLockActive ? "ON" : "OFF"}</span>
              <span className="hidden sm:inline">
                {isIframe ? t.wakeLockDEMO : (wakeLockStatusText === "화면 유지 ON" ? (lang === "ko" ? "화면 유지 ON" : "Wake Lock ON") : (lang === "ko" ? "화면 유지 OFF" : "Wake Lock OFF"))}
              </span>
            </button>

            {/* Language Switch Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="btn-tap p-1.5 sm:px-2 sm:py-1.5 bg-lumora-bg/60 border border-white/5 rounded-xl text-[10px] font-bold text-lumora-highlight flex items-center gap-1 shrink-0"
              title={lang === "ko" ? "English" : "한국어"}
            >
              <Globe className="w-3.5 h-3.5 text-lumora-highlight" />
              <span className="uppercase">{lang === "ko" ? "EN" : "KO"}</span>
            </button>

            {/* Routine Settings (Visible Days Toggle) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn-tap p-1.5 bg-lumora-bg/60 border border-white/5 rounded-xl text-[10px] font-bold text-lumora-sub hidden sm:inline-flex items-center gap-1 shrink-0"
              title="루틴 설정 및 요일 활성화"
            >
              <Settings className="w-3.5 h-3.5 text-lumora-sub" />
            </button>

            {/* Data Backup & Restore Trigger */}
            <button
              onClick={openBackupModal}
              className="btn-tap p-1.5 bg-lumora-bg/60 border border-white/5 rounded-xl text-[10px] font-bold text-lumora-sub hidden sm:inline-flex items-center gap-1 shrink-0"
              title="기록 백업/복원"
            >
              <Database className="w-3.5 h-3.5 text-lumora-sub" />
            </button>

            {/* Injury Prevention Specs */}
            <button
              onClick={() => setIsSafetyOpen(true)}
              className="btn-tap p-1.5 bg-lumora-bg/60 border border-white/5 rounded-xl text-[10px] font-bold text-lumora-sub hidden sm:inline-flex items-center gap-1 shrink-0"
              title="부상 방지 가이드"
            >
              <Info className="w-3.5 h-3.5 text-lumora-sub" />
            </button>

            {/* More Options Menu (Mobile Only) */}
            <button
              onClick={() => setIsMoreOpen(true)}
              className="btn-tap p-1.5 bg-lumora-bg/60 border border-white/5 rounded-xl text-[10px] font-bold text-lumora-sub flex sm:hidden items-center gap-1 shrink-0"
              title="더 보기"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-lumora-sub" />
            </button>
          </div>
        </div>
      </header>

      {/* PWA Install Banner */}
      {isIframe && (
        <div className="w-full px-4 mt-3">
          <div className="bg-gradient-to-r from-lumora-highlight/10 to-lumora-bg/60 border border-lumora-highlight/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-white break-words leading-tight">{t.pwaBannerTitle}</h4>
                <p className="text-[10px] text-lumora-sub mt-0.5 break-words leading-tight">{t.pwaBannerDesc}</p>
              </div>
            </div>
            <button
              onClick={() => setIsPwaOpen(true)}
              className="btn-tap px-3 py-2 bg-lumora-highlight hover:bg-[#c4b5fd] text-slate-900 font-black text-xs rounded-xl shadow-md shrink-0"
            >
              {t.pwaBannerInstall}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Flow */}
      <main className="flex-1 w-full px-4 md:px-5 mt-5 space-y-4">
        
        {/* Segmented Tab Bar */}
        <div 
          className="bg-lumora-bg/60 p-1.5 rounded-2xl border border-white/5 grid gap-1 shadow-lg w-full"
          style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))` }}
        >
          {visibleDays.map((day) => {
            const isSelected = day === activeDay;
            const label = db[day]?.tabLabel || CURRENT_DAY_LABELS[day] || "";
            let dayChar = label.charAt(0);
            let subLabel = "";
            const match = label.match(/\(([^)]+)\)/);
            if (match && match[1]) {
              subLabel = match[1];
            } else {
              // For English Tab Labels (e.g. "Mon (Pull)")
              const spaceIdx = label.indexOf(" ");
              if (spaceIdx !== -1) {
                dayChar = label.substring(0, spaceIdx);
                const subMatch = label.match(/\(([^)]+)\)/) || label.match(/ ([^(]+)/);
                subLabel = subMatch ? subMatch[1] : "";
              } else {
                subLabel = label.substring(2).replace(/[()]/g, "").trim();
              }
            }

            return (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`btn-tap flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 border ${
                  isSelected
                    ? "bg-lumora-highlight border-lumora-highlight text-slate-900 font-bold shadow-md shadow-lumora-highlight/10"
                    : "bg-transparent border-transparent text-lumora-sub hover:text-white font-semibold"
                }`}
              >
                <span className="text-[13px] font-black leading-none">{dayChar}</span>
                {subLabel && (
                  <span className={`text-[8px] mt-1 font-bold tracking-tight opacity-80 leading-none ${
                    isSelected ? "text-slate-800" : "text-lumora-sub/80"
                  }`}>
                    {subLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Coach Directive Panel */}
        <div className="bg-gradient-to-b from-lumora-card/30 to-lumora-bg/40 border border-white/5 rounded-2xl p-4 shadow-md flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded-xl bg-lumora-highlight/10 flex items-center justify-center text-lumora-highlight shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <span className="text-[9px] font-extrabold text-lumora-highlight tracking-wider uppercase">{t.guideTitle}</span>
            <p className="text-xs text-lumora-text leading-relaxed font-semibold break-words">
              {db[activeDay]?.directive}
            </p>
          </div>
        </div>

        {/* Routine Metadata */}
        <div className="flex items-start justify-between px-1 gap-4">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-start space-x-2">
              <h2 className="text-base font-extrabold text-white tracking-tight break-words min-w-0">{db[activeDay]?.mainTitle}</h2>
              <button
                onClick={openRoutineModal}
                className="btn-tap p-1 bg-lumora-bg/60 hover:bg-lumora-hover border border-white/5 rounded-lg text-lumora-sub hover:text-white shrink-0 mt-0.5"
                title={t.editLabel}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-lumora-sub break-words">{db[activeDay]?.subTitle}</p>
          </div>
          <div className="bg-[#1a1921]/40 px-3 py-1.5 rounded-xl border border-white/5 text-right shrink-0">
            <span className="text-[9px] text-lumora-sub font-extrabold block uppercase tracking-wider">{t.routineProgressText}</span>
            <span className="text-xs font-black text-lumora-highlight">{getProgressPct()}%</span>
          </div>
        </div>

        {/* Dynamic Workouts Holder */}
        <div className="space-y-4">
          {(!db[activeDay]?.items || db[activeDay].items.length === 0) ? (
            <div className="text-center py-8 text-xs text-lumora-sub border border-dashed border-white/5 rounded-2xl">
              {t.emptyRoutine}
            </div>
          ) : (
            db[activeDay].items.map((item) => {
              let catColor = "bg-lumora-highlight/10 text-lumora-highlight border-lumora-highlight/20";
              if (item.category === "웜업" || item.category === "Warmup") {
                catColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
              }

              return (
                <div key={item.id} className="bg-lumora-bg/40 border border-white/5 rounded-2xl p-4 space-y-4 shadow-sm">
                  {/* Exercise Card Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center">
                        <span className={`text-[9px] ${catColor} font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider`}>
                          {lang === "ko" ? item.category : (item.category === "웜업" ? "Warmup" : (item.category === "유산소" ? "Cardio" : item.category))}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 break-words">{item.name}</h3>
                      <p className="text-xs text-lumora-sub break-words">{t.guidePrefix}: {item.target}</p>
                      {item.tip && item.tip.trim() !== "" && (
                        <div className="flex items-start gap-1.5 mt-1.5">
                          <span className="text-[9px] px-1.5 py-0.5 bg-lumora-highlight/10 text-lumora-highlight rounded font-extrabold shrink-0 mt-0.5">TIP</span>
                          <p className="text-[11px] text-lumora-sub font-medium leading-relaxed break-words">{item.tip}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0 pt-0.5">
                      <button
                        onClick={() => openExerciseModal(item.id)}
                        className="btn-tap p-1.5 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg transition"
                        title={t.editLabel}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteExercise(item.id)}
                        className={`btn-tap p-1.5 bg-lumora-hover rounded-lg transition-colors ${
                          deleteConfirmActive[item.id] ? "text-red-400 bg-red-950/40" : "text-lumora-sub hover:text-red-400"
                        }`}
                        title={t.deleteLabel}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Exercise Card Body */}
                  {item.isWarmup ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-lumora-card/50 p-3 rounded-2xl border border-white/5 text-xs">
                        <span className="text-lumora-sub font-extrabold whitespace-nowrap shrink-0">{t.setLogsLabel}</span>
                        <div className="flex items-center space-x-3 bg-lumora-bg/40 px-3 py-1.5 rounded-xl border border-white/5">
                          <button
                            onClick={() => changeCardio(item.id, -1)}
                            className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-white text-sm px-2">{item.duration}{lang === "ko" ? "분" : " min"}</span>
                          <button
                            onClick={() => changeCardio(item.id, 1)}
                            className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCardioDone(item.id)}
                        className={`btn-tap w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                          item.isDone
                            ? "bg-lumora-highlight text-slate-900 border-lumora-highlight shadow-md"
                            : "bg-lumora-bg/60 border border-white/5 text-lumora-sub"
                        }`}
                      >
                        {item.isDone ? (
                          <>
                            <Check className="w-4 h-4 mr-1" /> {t.completedText}
                          </>
                        ) : (
                          t.markDoneText
                        )}
                      </button>
                    </div>
                  ) : item.isCardio ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-lumora-card/50 p-3 rounded-2xl border border-white/5 text-xs">
                        <span className="text-lumora-sub font-extrabold whitespace-nowrap shrink-0">{t.setLogsLabelCardio}</span>
                        <div className="flex items-center space-x-3 bg-lumora-bg/40 px-3 py-1.5 rounded-xl border border-white/5">
                          <button
                            onClick={() => changeCardio(item.id, -5)}
                            className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-white text-sm px-2">{item.duration}{lang === "ko" ? "분" : " min"}</span>
                          <button
                            onClick={() => changeCardio(item.id, 5)}
                            className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCardioDone(item.id)}
                        className={`btn-tap w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                          item.isDone
                            ? "bg-lumora-highlight text-slate-900 border-lumora-highlight shadow-md"
                            : "bg-lumora-bg/60 border border-white/5 text-lumora-sub"
                        }`}
                      >
                        {item.isDone ? (
                          <>
                            <Check className="w-4 h-4 mr-1" /> {t.completedText}
                          </>
                        ) : (
                          t.markDoneText
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Set Buttons */}
                      <div className="grid grid-cols-3 gap-2 py-0.5">
                        {(item.sets || []).map((setVal, idx) => {
                          const completed = setVal !== null;
                          let dispText = t.logSetText;
                          if (completed) {
                            dispText = item.isBodyweight ? `${setVal.r}${lang === "ko" ? "회" : " reps"}` : `${setVal.w}kg / ${setVal.r}${lang === "ko" ? "회" : " reps"}`;
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => toggleSetStatus(item.id, idx)}
                              className={`btn-tap py-3 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                                completed
                                  ? "bg-lumora-highlight text-slate-900 border-lumora-highlight shadow-md"
                                  : "bg-lumora-bg/60 border border-white/5 text-lumora-sub"
                              }`}
                            >
                              <span className={`text-[9px] ${completed ? "text-slate-800" : "text-lumora-sub/60"} font-black uppercase`}>
                                {idx + 1}{t.setIndexText}
                              </span>
                              <span className="text-xs font-extrabold mt-0.5">{dispText}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Adjusters Layout */}
                      <div className="bg-lumora-card/50 p-3 rounded-2xl border border-white/5 flex flex-wrap gap-2 text-xs">
                        {!item.isBodyweight && (
                          <div className="flex-1 min-w-[140px] flex items-center justify-center space-x-1.5 bg-lumora-bg/40 px-2 py-2 rounded-xl border border-white/5">
                            <span className="text-lumora-sub font-extrabold shrink-0">{t.weightLabel}</span>
                            <button
                              onClick={() => changeVal(item.id, "w", -item.step)}
                              className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-extrabold text-white min-w-[42px] text-center text-xs">{item.weight}kg</span>
                            <button
                              onClick={() => changeVal(item.id, "w", item.step)}
                              className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <div className="flex-1 min-w-[140px] flex items-center justify-center space-x-1.5 bg-lumora-bg/40 px-2 py-2 rounded-xl border border-white/5">
                          <span className="text-lumora-sub font-extrabold shrink-0">{t.repsLabel}</span>
                          <button
                            onClick={() => changeVal(item.id, "r", -1)}
                            className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-extrabold text-white min-w-[28px] text-center text-xs">{item.reps}{lang === "ko" ? "회" : " reps"}</span>
                          <button
                            onClick={() => changeVal(item.id, "r", 1)}
                            className="btn-tap p-1 bg-lumora-hover text-lumora-text hover:bg-white/10 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Comment Feedback Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-lumora-sub/60">
                      <MessageSquare className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={item.note || ""}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      placeholder={t.feedbackPlaceholder}
                      className="w-full bg-lumora-card/60 border border-white/5 text-xs text-lumora-text rounded-2xl pl-10 pr-3 py-3.5 focus:outline-none focus:border-lumora-highlight placeholder-lumora-sub/30 transition"
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
          className="btn-tap w-full py-3.5 bg-lumora-bg/60 hover:bg-lumora-hover border border-white/5 text-lumora-highlight font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addExerciseBtn}</span>
        </button>

        {/* In-Flow Copy Control */}
        <div className="pt-6 pb-8 border-t border-white/5">
          <button
            onClick={copyRoutineResults}
            className="btn-tap w-full py-4 bg-gradient-to-r from-lumora-highlight to-lumora-highlight/85 text-slate-900 font-black rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-lumora-highlight/10 text-sm"
          >
            <CheckCheck className="w-5 h-5" />
            <span>{t.completeLogsBtn}</span>
          </button>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="btn-tap w-full py-3 mt-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-sm text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetLogsBtn}</span>
          </button>
          <p className="text-center text-[11px] text-lumora-sub mt-3 font-medium">
            {t.copyDescText}
          </p>
        </div>

      </main>

      {/* Routine Metadata Edit Modal */}
      {createPortal(
        <AnimatePresence>
          {isRoutineModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsRoutineModalOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsRoutineModalOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.routineInfoEditTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.routineInfoEditDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.tabLabelInput}</label>
                      <input
                        type="text"
                        value={editRoutineTabLabel}
                        onChange={(e) => setEditRoutineTabLabel(e.target.value)}
                        placeholder={lang === "ko" ? "예: 월 (당기기)" : "e.g. Mon (Pull)"}
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.mainTitleInput}</label>
                      <input
                        type="text"
                        value={editRoutineTitle}
                        onChange={(e) => setEditRoutineTitle(e.target.value)}
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.subTitleInput}</label>
                      <input
                        type="text"
                        value={editRoutineSubTitle}
                        onChange={(e) => setEditRoutineSubTitle(e.target.value)}
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.coachGuideInput}</label>
                      <textarea
                        value={editRoutineDirective}
                        onChange={(e) => setEditRoutineDirective(e.target.value)}
                        rows={3}
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight resize-none"
                      />
                    </div>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={saveRoutineInfo}
                      className="btn-tap w-full py-3 bg-lumora-highlight hover:bg-[#c4b5fd] text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.saveBtn}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Exercise Add/Edit Modal */}
      {createPortal(
        <AnimatePresence>
          {isExerciseModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExerciseModalOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsExerciseModalOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">
                          {editingExerciseId ? t.exerciseEditTitle : t.exerciseAddTitle}
                        </h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">
                          {editingExerciseId ? t.exerciseEditDesc : t.exerciseAddDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.exNameInput}</label>
                      <input
                        type="text"
                        value={editExName}
                        onChange={(e) => setEditExName(e.target.value)}
                        placeholder={lang === "ko" ? "예: 시티드 로우" : "e.g. Seated Row"}
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.categoryInput}</label>
                        <select
                          value={editExCategory}
                          onChange={(e) => setEditExCategory(e.target.value)}
                          className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-2 py-2.5 focus:outline-none focus:border-lumora-highlight"
                        >
                          {lang === "ko" ? (
                            <>
                              <option value="등">등</option>
                              <option value="가슴">가슴</option>
                              <option value="하체">하체</option>
                              <option value="어깨">어깨</option>
                              <option value="이두">이두</option>
                              <option value="삼두">삼두</option>
                              <option value="코어">코어</option>
                              <option value="웜업">웜업</option>
                              <option value="유산소">유산소</option>
                            </>
                          ) : (
                            <>
                              <option value="Back">Back</option>
                              <option value="Chest">Chest</option>
                              <option value="Lower">Lower</option>
                              <option value="Shoulders">Shoulders</option>
                              <option value="Biceps">Biceps</option>
                              <option value="Triceps">Triceps</option>
                              <option value="Core">Core</option>
                              <option value="Warmup">Warmup</option>
                              <option value="Cardio">Cardio</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.setCountInput}</label>
                        <select
                          value={editExSetsCount}
                          onChange={(e) => setEditExSetsCount(parseInt(e.target.value, 10))}
                          className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-2 py-2.5 focus:outline-none focus:border-lumora-highlight"
                        >
                          <option value={1}>1 {lang === "ko" ? "세트" : "Set"}</option>
                          <option value={2}>2 {lang === "ko" ? "세트" : "Sets"}</option>
                          <option value={3}>3 {lang === "ko" ? "세트" : "Sets"}</option>
                          <option value={4}>4 {lang === "ko" ? "세트" : "Sets"}</option>
                          <option value={5}>5 {lang === "ko" ? "세트" : "Sets"}</option>
                          <option value={6}>6 {lang === "ko" ? "세트" : "Sets"}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.exTypeInput}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["normal", "bodyweight", "cardio"] as const).map((tType) => {
                          const isSelected = editExType === tType;
                          const labelText = tType === "normal" ? t.exTypeNormal : tType === "bodyweight" ? t.exTypeBodyweight : t.exTypeCardio;
                          return (
                            <button
                              key={tType}
                              type="button"
                              onClick={() => setEditExType(tType)}
                              className={`flex items-center justify-center p-2 rounded-xl cursor-pointer select-none border transition-all text-[10px] font-bold ${
                                isSelected
                                  ? "bg-lumora-highlight/10 border-lumora-highlight text-lumora-highlight"
                                  : "bg-lumora-bg/80 border-white/5 text-lumora-sub"
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
                          <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.baseWeightInput}</label>
                          <input
                            type="number"
                            value={editExWeight}
                            onChange={(e) => setEditExWeight(parseFloat(e.target.value) || 0)}
                            className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.baseRepsInput}</label>
                          <input
                            type="number"
                            value={editExReps}
                            onChange={(e) => setEditExReps(parseInt(e.target.value, 10) || 0)}
                            className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                          />
                        </div>
                      </div>
                    )}

                    {editExType === "bodyweight" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.baseRepsInput}</label>
                        <input
                          type="number"
                          value={editExReps}
                          onChange={(e) => setEditExReps(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                        />
                      </div>
                    )}

                    {editExType === "cardio" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.baseDurationInput}</label>
                        <input
                          type="number"
                          value={editExDuration}
                          onChange={(e) => setEditExDuration(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.exGuideInput}</label>
                      <input
                        type="text"
                        value={editExTarget}
                        onChange={(e) => setEditExTarget(e.target.value)}
                        placeholder={
                          editExType === "cardio"
                            ? (lang === "ko" ? "예: 10분 빠른 걷기" : "e.g. 10 min fast walk")
                            : editExType === "bodyweight"
                            ? (lang === "ko" ? "예: 맨몸 x 12회" : "e.g. bodyweight x 12 reps")
                            : (lang === "ko" ? "예: 30kg x 12회" : "e.g. 30kg x 12 reps")
                        }
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.exTipInput}</label>
                      <input
                        type="text"
                        value={editExTip}
                        onChange={(e) => setEditExTip(e.target.value)}
                        placeholder={lang === "ko" ? "예: 무릎 방향 정렬 엄수" : "e.g. Keep knees aligned with feet"}
                        className="w-full bg-lumora-bg/80 border border-white/10 text-xs text-lumora-text rounded-xl px-3 py-2.5 focus:outline-none focus:border-lumora-highlight"
                      />
                    </div>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={saveExercise}
                      className="btn-tap w-full py-3 bg-lumora-highlight hover:bg-[#c4b5fd] text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.saveGeneralBtn}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Settings Modal (Visible Days Toggle) */}
      {createPortal(
        <AnimatePresence>
          {isSettingsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSettingsOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.settingsTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.settingsDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p className="text-[11px] text-lumora-sub font-semibold">{t.settingsWarn}</p>

                    <div className="space-y-2">
                      {DAY_ORDER.map((day) => {
                        const isChecked = visibleDays.includes(day);
                        return (
                          <label
                            key={day}
                            className="flex items-center justify-between p-3 bg-lumora-bg/85 hover:bg-lumora-hover border border-white/5 rounded-2xl cursor-pointer transition"
                          >
                            <span className="text-xs font-semibold text-slate-200">
                              {day === "mon"
                                ? t.monLabel
                                : day === "tue"
                                ? t.tueLabel
                                : day === "wed"
                                ? t.wedLabel
                                : day === "thu"
                                ? t.thuLabel
                                : day === "fri"
                                ? t.friLabel
                                : day === "sat"
                                ? t.satLabel
                                : t.sunLabel}
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
                              className="w-4 h-4 accent-[#c4b5fd]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={() => applyVisibleDays(visibleDays)}
                      className="btn-tap w-full py-3 bg-lumora-highlight hover:bg-[#c4b5fd] text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.applyBtn}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Backup & Restore Modal */}
      {createPortal(
        <AnimatePresence>
          {isBackupOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBackupOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsBackupOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.backupTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.backupDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Export Segment */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.backupGenTitle}</label>
                      <p className="text-[10px] text-lumora-sub">{t.backupGenDesc}</p>
                      <div className="relative mt-1">
                        <textarea
                          readOnly
                          value={exportCode}
                          className="w-full h-16 bg-lumora-bg/85 border border-white/5 text-[10px] text-lumora-sub rounded-xl p-2.5 focus:outline-none resize-none font-mono break-all"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(exportCode).then(() => {
                              triggerToastBanner(lang === "ko" ? "백업용 보안 코드가 복사되었습니다! 안전한 곳에 기록해 두세요." : "Backup token copied! Keep it in a safe place.");
                            });
                          }}
                          className="btn-tap absolute right-2 bottom-2 px-2.5 py-1.5 bg-lumora-highlight text-slate-900 font-extrabold text-[10px] rounded-lg shadow-md flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> {t.btnCopyCode}
                        </button>
                      </div>
                    </div>

                    {/* Import Segment */}
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <label className="text-[11px] font-extrabold text-lumora-highlight tracking-wider uppercase block">{t.backupRestoreTitle}</label>
                      <p className="text-[10px] text-lumora-sub">{t.backupRestoreDesc}</p>
                      <textarea
                        value={importCode}
                        onChange={(e) => setImportCode(e.target.value)}
                        placeholder={lang === "ko" ? "여기에 백업 보안 코드를 붙여넣으세요..." : "Paste your backup token here..."}
                        className="w-full h-16 mt-1 bg-lumora-bg/85 border border-white/5 text-[10px] text-lumora-text rounded-xl p-2.5 focus:outline-none focus:border-lumora-highlight resize-none font-mono break-all placeholder:text-slate-600"
                      />
                      <button
                        onClick={importBackupCode}
                        className="btn-tap w-full py-2.5 bg-lumora-highlight hover:bg-[#c4b5fd] text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{t.btnRestoreApply}</span>
                      </button>
                    </div>

                    {/* Safe Smart Wipe Reset Button */}
                    <div className="text-center pt-2 border-t border-white/5">
                      <button
                        onClick={resetAllData}
                        className={`btn-tap text-[10px] font-extrabold transition-all duration-200 ${
                          resetConfirmActive ? "text-amber-500 font-black" : "text-rose-500 hover:text-rose-400 underline"
                        }`}
                      >
                        {resetConfirmActive ? (lang === "ko" ? "⚠️ 한번 더 클릭 시 정말 전체 초기화!" : "⚠️ Click once more to WIPE ALL!") : t.btnResetAll}
                      </button>
                    </div>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={() => setIsBackupOpen(false)}
                      className="btn-tap w-full py-3 bg-lumora-bg/60 border border-white/5 text-lumora-sub hover:text-white font-black rounded-xl text-xs flex items-center justify-center transition"
                    >
                      <span>{t.btnCloseGeneral}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Injury Risk Specs Modal */}
      {createPortal(
        <AnimatePresence>
          {isSafetyOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSafetyOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsSafetyOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-450 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.safetyTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.safetyDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    <div className="p-3.5 bg-[#1a1921]/50 rounded-2xl border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center">
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-450 font-extrabold text-[10px] rounded border border-rose-500/20 shrink-0">{t.wristTitle}</span>
                      </div>
                      <p className="text-[11px] text-lumora-text/80 leading-relaxed font-semibold break-words">
                        {t.wristBody}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#1a1921]/50 rounded-2xl border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-450 font-extrabold text-[10px] rounded border border-amber-500/20 shrink-0">{t.kneeTitle}</span>
                      </div>
                      <p className="text-[11px] text-lumora-text/80 leading-relaxed font-semibold break-words">
                        {t.kneeBody}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#1a1921]/50 rounded-2xl border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center">
                        <span className="px-2 py-0.5 bg-teal-500/10 text-teal-450 font-extrabold text-[10px] rounded border border-teal-500/20 shrink-0">{t.shoulderTitle}</span>
                      </div>
                      <p className="text-[11px] text-lumora-text/80 leading-relaxed font-semibold break-words">
                        {t.shoulderBody}
                      </p>
                    </div>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={() => setIsSafetyOpen(false)}
                      className="btn-tap w-full py-3 bg-lumora-bg/60 border border-white/5 text-lumora-sub hover:text-white font-black rounded-xl text-xs flex items-center justify-center transition"
                    >
                      <span>{t.btnCloseGeneral}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* PWA Install Guide Modal */}
      {createPortal(
        <AnimatePresence>
          {isPwaOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPwaOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsPwaOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-450 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.pwaTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.pwaDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-2.5">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-450 font-extrabold text-[11px] rounded-lg border border-emerald-500/20 inline-block">{t.androidPwaTitle}</span>
                      <ol className="text-xs text-lumora-text/80 space-y-2 list-decimal list-inside pl-1 font-semibold leading-relaxed">
                        {t.androidPwaSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-2.5 border-t border-white/5 pt-4">
                      <span className="px-2.5 py-1 bg-teal-500/10 text-teal-450 font-extrabold text-[11px] rounded-lg border border-teal-500/20 inline-block">{t.iosPwaTitle}</span>
                      <ol className="text-xs text-lumora-text/80 space-y-2 list-decimal list-inside pl-1 font-semibold leading-relaxed">
                        {t.iosPwaSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="p-3 bg-[#1a1921]/50 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-lumora-sub leading-relaxed font-medium">
                        {t.pwaTip}
                      </p>
                    </div>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={() => setIsPwaOpen(false)}
                      className="btn-tap w-full py-3 bg-lumora-bg/60 border border-white/5 text-lumora-sub hover:text-white font-black rounded-xl text-xs flex items-center justify-center transition"
                    >
                      <span>{t.btnCloseGeneral}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Reset Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {isResetConfirmOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsResetConfirmOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsResetConfirmOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-450 flex items-center justify-center shrink-0">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.resetConfirmTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.resetConfirmDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p className="text-[11px] text-lumora-text/80 leading-relaxed font-semibold">
                      {t.resetConfirmWarn}
                    </p>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsResetConfirmOpen(false)}
                        className="btn-tap w-full py-3 bg-lumora-bg/60 border border-white/5 text-lumora-sub hover:text-white font-black rounded-xl text-xs flex items-center justify-center transition"
                      >
                        {t.btnCancel}
                      </button>
                      <button
                        onClick={executeResetTodayRoutine}
                        className="btn-tap w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black rounded-xl text-xs flex items-center justify-center transition"
                      >
                        {t.btnConfirmReset}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* More Options Modal (Mobile Menu) */}
      {createPortal(
        <AnimatePresence>
          {isMoreOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMoreOpen(false)}
                className="fixed inset-0 bg-[#131219]/80 backdrop-blur-sm z-[120]"
              />
              <div className="fixed inset-0 z-[121] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto bg-lumora-card border-t sm:border border-white/10 w-full max-w-md sm:max-w-sm rounded-t-3xl sm:rounded-3xl flex flex-col relative shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
                >
                  {/* Header (Sticky) */}
                  <div className="shrink-0 p-6 pb-4 relative border-b border-white/5">
                    <button
                      onClick={() => setIsMoreOpen(false)}
                      className="absolute top-5 right-6 p-2 bg-lumora-hover hover:bg-white/10 rounded-xl text-lumora-sub transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 min-w-0 flex-1 mr-8">
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <MoreHorizontal className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-white break-words leading-tight">{t.moreMenuTitle}</h3>
                        <p className="text-[10px] text-lumora-sub break-words leading-tight mt-0.5">{t.moreMenuDesc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center p-4 bg-[#1a1921]/50 hover:bg-lumora-hover border border-white/5 rounded-2xl transition text-left pointer-events-auto gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white break-words leading-tight">{t.settingsTitle}</div>
                        <div className="text-[9px] text-lumora-sub mt-0.5 break-words leading-tight">{t.settingsDesc}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        openBackupModal();
                      }}
                      className="w-full flex items-center p-4 bg-[#1a1921]/50 hover:bg-lumora-hover border border-white/5 rounded-2xl transition text-left pointer-events-auto gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-lumora-highlight/10 text-lumora-highlight flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white break-words leading-tight">{t.backupTitle}</div>
                        <div className="text-[9px] text-lumora-sub mt-0.5 break-words leading-tight">{t.backupDesc}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        setIsSafetyOpen(true);
                      }}
                      className="w-full flex items-center p-4 bg-[#1a1921]/50 hover:bg-lumora-hover border border-white/5 rounded-2xl transition text-left pointer-events-auto gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-450 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white break-words leading-tight">{t.safetyTitle}</div>
                        <div className="text-[9px] text-lumora-sub mt-0.5 break-words leading-tight">{t.safetyDesc}</div>
                      </div>
                    </button>
                  </div>

                  {/* Footer (Sticky) */}
                  <div className="shrink-0 p-6 pt-4 border-t border-white/5 bg-lumora-card">
                    <button
                      onClick={() => setIsMoreOpen(false)}
                      className="btn-tap w-full py-3 bg-lumora-bg/60 border border-white/5 text-lumora-sub hover:text-white font-black rounded-xl text-xs flex items-center justify-center transition pointer-events-auto"
                  >
                    <span>{t.btnCloseGeneral}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}

    </div>
  );
}
