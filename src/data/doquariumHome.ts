// Doquarium official homepage copy (/doquarium in English, /doquarium/ko in Korean).
// Source: the doquarium repo's docs/14 "스토어 등록정보 문구" (store listing,
// 래원 2026-10-10 · 10-19) and docs/26 "SNS 운영" rules: no emoji, only features
// that really exist, no numbers like days-to-grow, "hatch" not "draw", no
// pricing talk while the app is in testing. Update this file when the store
// listing changes.

import type { PolicyLang } from "./doquarium";

export interface HomeFeature {
  title: string;
  body: string[];
  shot: string; // screenshot name in public/media/doquarium/{lang}/
  alt: string;
}

export interface HomeCopy {
  langLabel: string;
  badgeBeta: string;
  badgeSoon: string;
  tagline: string;
  lead: string;
  storeSoon: string;
  betaCta: string;
  betaSub: string;
  storyTitle: string;
  story: string[];
  features: HomeFeature[];
  moreTitle: string;
  more: { title: string; body: string }[];
  principlesTitle: string;
  principlesSub: string;
  principles: { title: string; body: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  contactTitle: string;
  contactBody: string;
  privacy: string;
  deleteAccount: string;
  reelLabel: string;
}

export const DOQUARIUM_HOME: Record<PolicyLang, HomeCopy> = {
  en: {
    langLabel: "English",
    badgeBeta: "Android Beta · Testers Wanted",
    badgeSoon: "Coming soon · Android & iPhone",
    tagline: "Finish a task, feed your fish.",
    lead: "Doquarium is a to-do app with a neon fish tank. Every to-do is fish food: get things done and your fish eats and grows. Put things off and the water turns murky.",
    storeSoon: "Coming soon",
    betaCta: "Join the Android beta",
    betaSub: "Testers wanted · help Doquarium launch",
    storyTitle: "Checking off to-dos gets boring.",
    story: [
      "Let's be honest, checking off to-dos gets boring. In Doquarium, every to-do is fish food.",
      "Knock out today's tasks and watch your fish munch and grow. Put them off, and they start rotting in the tank. Kind of hard to procrastinate after that.",
    ],
    features: [
      {
        title: "To-dos are fish food",
        body: [
          "One check, one meal. Every day you get things done, your fish grows from egg to adult.",
          "Add a to-do and it drifts down into the tank as a glowing piece of food.",
        ],
        shot: "02-eat",
        alt: "A to-do list under a neon tank, with a fish swimming over to eat",
      },
      {
        title: "Leave it, and the water clouds",
        body: [
          "Skipped tasks get an \"overdue\" tag and a murky little cloud. The water gets cloudy and your fish starts to feel it.",
          "You'll end up doing them. Trust us.",
        ],
        shot: "03-rotten",
        alt: "A murky green tank above to-dos marked as overdue",
      },
      {
        title: "The thrill of hatching",
        body: [
          "Common, Rare, Mystic, Legendary. You won't know who's inside until the egg hatches.",
          "Legendaries come with an aurora glow and a sparkling trail. Fully grown fish are saved in your Collection.",
        ],
        shot: "04-collection",
        alt: "The Collection screen with a Comb Jelly, Whale Shark, Sea Dragon, and Starlight Jelly",
      },
      {
        title: "Made for zoning out",
        body: [
          "Neon fish glowing softly in dark water. Just watching them is a nice way to wind down your day.",
          "Grown fish can swim together in your aquarium. Tap the glass and a fish swims over for a little boop.",
        ],
        shot: "05-aquarium",
        alt: "An aquarium of grown fish, a turtle, and a jellyfish swimming together",
      },
      {
        title: "Share a tank with friends",
        body: [
          "Share a room code to start a group tank. When a friend finishes a task, their fish eats. Your move.",
          "Send each other cheers, pokes, and celebrations. Your to-dos stay private unless you choose to share them.",
        ],
        shot: "06-group",
        alt: "A shared tank with friends' fish swimming together above a to-do list",
      },
    ],
    moreTitle: "And a few more things",
    more: [
      { title: "Pick your look", body: "Teal neon, pink neon, or a soft cartoon style. Each tank can wear its own theme." },
      { title: "Coins and decorations", body: "Earn coins as you finish tasks, then spend them on plants, coral, caves, and more for your tank." },
      { title: "Relaxed or Intense", body: "Go Relaxed to take it slow, or Intense if you want real stakes. Each tank picks its own." },
      { title: "A ghost, not a gravestone", body: "If a fish passes on, it turns into a cute little ghost that floats around. Don't worry, you can bring it back." },
      { title: "Home screen widget", body: "See today's to-dos on your home screen and tap the food dot to check one off. Your fish still eats." },
      { title: "No sign-up needed", body: "Start right away. If you like, back up your progress with your Google account to keep it on a new phone." },
    ],
    principlesTitle: "Made to send you back to real life.",
    principlesSub: "Skip the endless scroll. Grow your fish with what you get done today.",
    principles: [
      { title: "Built to let you go", body: "No infinite feeds and no endless rewards for staring at the screen. Check in, feed your fish, and get back to your day." },
      { title: "Coins come from real tasks", body: "Your tank grows from what you actually get done, not from how long you keep the app open." },
      { title: "Your list stays yours", body: "Used solo, your to-dos and tank stay on your phone. Friends only see your to-dos in a tank made for sharing them." },
    ],
    faqTitle: "Questions",
    faq: [
      { q: "Which phones can use it?", a: "Doquarium is in closed beta on Android now, and the iPhone version is on the way. Join the Android beta from the button above." },
      { q: "Do I need an account?", a: "No. You can start right away without signing up. Signing in with Google is optional and only backs up your progress so you can keep it on a new phone." },
      { q: "Can friends see my to-dos?", a: "No. In a shared tank, friends see your fish and how many to-dos you finished. Only in a tank made with \"See each other's to-dos\" can they see titles, and you can still hide any to-do with \"Only me\"." },
      { q: "What happens if I keep putting things off?", a: "Leftover to-dos slowly spoil, the water gets cloudy, and your fish gets weaker. Nothing happens all at once. If a fish passes on, it becomes a little ghost, and you can bring it back." },
      { q: "Will it send me lots of notifications?", a: "No. You only get the reminders you set for a to-do, and a note when a friend pokes you. Poke alerts can be turned off in Settings." },
      { q: "Found a bug or have an idea?", a: "In the app, go to Settings, then Contact · Report a bug under Help. You can also email us." },
    ],
    contactTitle: "Say hello",
    contactBody: "Questions, bugs, or ideas? We read every message.",
    privacy: "Privacy Policy",
    deleteAccount: "Delete your account",
    reelLabel: "Doquarium app preview: finish to-dos and your neon fish eats and grows",
  },
  ko: {
    langLabel: "한국어",
    badgeBeta: "안드로이드 베타 · 테스터 모집 중",
    badgeSoon: "곧 출시 · 안드로이드 · 아이폰",
    tagline: "할 일 끝내면 물고기가 냠!",
    lead: "두쿠아리움은 네온 어항이 있는 할 일 앱이에요. 할 일이 곧 물고기 밥이라, 해치우면 물고기가 먹고 쑥쑥 자라요. 미루면 어항이 탁해지고요.",
    storeSoon: "곧 출시",
    betaCta: "안드로이드 베타 참여하기",
    betaSub: "테스터 모집 중 · 출시를 도와주세요",
    storyTitle: "투두 체크, 솔직히 좀 지루하죠?",
    story: [
      "두쿠아리움에선 할 일이 곧 물고기 밥이에요. 오늘 할 일을 해치우면 물고기가 냠냠 먹고 쑥쑥 자라요.",
      "근데 미루면? 할 일이 어항 속에서 썩어요. 물이 탁해지고, 물고기 컨디션도 뚝 떨어져요. 이쯤 되면 도저히 못 미루겠죠.",
    ],
    features: [
      {
        title: "할 일 = 물고기 밥",
        body: [
          "체크 한 번에 밥 한 끼. 해낸 날마다 알에서 어른 물고기까지 쑥쑥 자라요.",
          "할 일을 적으면 빛나는 사료가 되어 어항 속으로 사르르 떨어져요.",
        ],
        shot: "02-eat",
        alt: "네온 어항 아래 할 일 목록, 물고기가 사료를 먹으러 헤엄쳐 가는 모습",
      },
      {
        title: "미루면 어항이 탁해져요",
        body: [
          "미룬 할 일엔 \"N일 지남\" 딱지가 붙고 탁한 김이 모락모락. 물이 흐려지고 물고기도 기운이 없어져요.",
          "눈치 보여서 결국 하게 돼요.",
        ],
        shot: "03-rotten",
        alt: "탁한 초록빛 어항과 며칠 지난 할 일 목록",
      },
      {
        title: "알 깨는 두근거림",
        body: [
          "일반, 희귀, 신비, 전설. 누가 나올지는 깨 봐야 알아요.",
          "전설은 오로라 빛에 반짝이는 꼬리까지 달고 나와요. 다 자란 친구들은 도감에 차곡차곡 모여요.",
        ],
        shot: "04-collection",
        alt: "빗해파리, 고래상어, 해룡, 별빛 해파리가 모인 도감 화면",
      },
      {
        title: "물멍 맛집",
        body: [
          "까만 물속에서 은은하게 빛나는 네온 물고기들. 가만히 보고만 있어도 하루가 정리되는 기분이에요.",
          "다 자란 친구들은 수족관에서 함께 헤엄쳐요. 톡 건드리면 물고기가 다가와서 콕!",
        ],
        shot: "05-aquarium",
        alt: "다 자란 물고기와 거북이, 해파리가 함께 헤엄치는 수족관",
      },
      {
        title: "친구랑 같은 어항",
        body: [
          "방 코드 하나면 단체 어항 오픈. 친구가 할 일을 끝내면 친구 물고기가 냠. 나도 질 수 없죠.",
          "응원, 콕, 축하로 서로의 하루에 리액션을 남겨요. 내 할 일은 내가 보여 주기로 한 방에서만 보여요.",
        ],
        shot: "06-group",
        alt: "친구들의 물고기가 함께 헤엄치는 단체 어항과 할 일 목록",
      },
    ],
    moreTitle: "그리고 이런 것도",
    more: [
      { title: "내 취향대로 고르는 테마", body: "청록 네온, 핑크 네온, 부드러운 카툰 그림체 중에 골라요. 어항마다 다른 테마를 입힐 수 있어요." },
      { title: "열일하면 코인 짤랑", body: "할 일을 끝내면 코인이 쌓여요. 수초, 산호, 동굴 같은 꾸미기로 내 어항을 마음껏 꾸며 보세요." },
      { title: "느긋 or 열정", body: "천천히 키우고 싶으면 느긋 모드, 진짜 긴장감을 원하면 열정 모드. 어항마다 따로 골라요." },
      { title: "비석 대신 유령 물고기", body: "혹시 물고기가 떠나도 귀여운 유령 물고기가 되어 둥둥 떠다녀요. 부활도 있으니까 안심!" },
      { title: "홈 화면 위젯", body: "오늘 할 일이 홈 화면에 바로 떠요. 사료 자리를 톡 누르면 끝! 물고기는 그대로 냠." },
      { title: "가입 없이 바로 시작", body: "바로 쓸 수 있어요. 원하면 구글 계정으로 기록을 백업해서 폰을 바꿔도 이어 쓸 수 있어요." },
    ],
    principlesTitle: "현실로 돌아가게 하는 앱",
    principlesSub: "쇼츠 무한 스크롤 대신, 오늘 해낸 일로 자라는 내 어항.",
    principles: [
      { title: "붙잡지 않아요", body: "끝없는 피드도, 화면을 오래 보게 하는 보상도 없어요. 들어와서 밥 주고, 다시 내 하루로." },
      { title: "코인은 진짜 해낸 일에서", body: "앱을 오래 켜 둔 시간이 아니라, 실제로 해낸 일만큼 어항이 자라요." },
      { title: "내 할 일은 내 것", body: "혼자 쓰면 할 일과 어항은 내 폰에만 있어요. 친구는 할 일을 보여 주기로 한 어항에서만 볼 수 있어요." },
    ],
    faqTitle: "자주 묻는 질문",
    faq: [
      { q: "어떤 폰에서 쓸 수 있나요?", a: "지금은 안드로이드에서 비공개 베타 중이고, 아이폰 버전도 준비하고 있어요. 위의 버튼으로 안드로이드 베타에 참여할 수 있어요." },
      { q: "가입해야 하나요?", a: "아니요. 가입 없이 바로 시작할 수 있어요. 구글 로그인은 선택이고, 폰을 바꿔도 기록을 이어 쓰도록 백업만 해요." },
      { q: "친구가 내 할 일을 볼 수 있나요?", a: "아니요. 단체 어항에서 친구에게는 물고기 모습과 끝낸 개수만 보여요. 방장이 \"할 일 서로 보기\"로 만든 어항에서만 제목이 보이고, 그래도 \"나만 보기\"로 숨길 수 있어요." },
      { q: "계속 미루면 어떻게 되나요?", a: "남은 할 일이 천천히 썩고, 물이 탁해지고, 물고기 기운이 떨어져요. 한 번에 확 죽는 일은 없어요. 물고기가 떠나면 유령 물고기가 되고, 부활시킬 수 있어요." },
      { q: "알림이 많이 오나요?", a: "아니요. 할 일에 직접 맞춘 알림과, 친구가 콕 찔렀을 때만 와요. 콕 알림은 설정에서 끌 수 있어요." },
      { q: "버그를 찾았거나 아이디어가 있어요", a: "앱의 설정(톱니바퀴) → 도움말 아래 \"문의 · 버그 알리기\"에서 바로 보낼 수 있어요. 이메일도 좋아요." },
    ],
    contactTitle: "연락하기",
    contactBody: "궁금한 점, 버그, 아이디어 모두 좋아요. 하나하나 다 읽어요.",
    privacy: "개인정보처리방침",
    deleteAccount: "계정 삭제 안내",
    reelLabel: "두쿠아리움 앱 미리보기: 할 일을 끝내면 네온 물고기가 먹고 자라요",
  },
};
