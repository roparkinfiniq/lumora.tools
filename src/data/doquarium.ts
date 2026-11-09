// Doquarium (mobile to-do app) — product page + privacy policy content.
// Source of truth for the policy: the app's planning note
// "19 개인정보처리방침·계정 삭제" in the doquarium repo. Keep both in sync,
// and update this file whenever the app starts collecting something new
// (ads, payments, Apple sign-in, shared-tank reactions, in-app deletion).

export const DOQUARIUM = {
  contactEmail: "doquarium@gmail.com",
  developer: "Doquarium",
  privacyOfficer: "Park Ra One",
  effectiveDate: { en: "October 9, 2026", ko: "2026년 10월 9일" },
  // Bump whenever the policy text changes (the effective date stays the same before launch).
  lastUpdated: { en: "November 6, 2026", ko: "2026년 11월 6일" },
  storeStatus: "Coming soon",
};

export type PolicyLang = "en" | "ko";

export interface PolicyRow {
  when: string;
  what: string;
  why: string;
  where: string;
}

export interface PolicySection {
  title: string;
  table?: PolicyRow[];
  items: string[];
  ordered?: boolean; // numbered steps instead of bullets
  links?: { label: string; href: string }[]; // buttons shown under the items
}

export interface PolicyDoc {
  heading: string;
  effective?: string;
  intro: string;
  tableHeaders?: [string, string, string, string];
  sections: PolicySection[];
}

const { contactEmail, privacyOfficer, developer, effectiveDate, lastUpdated } = DOQUARIUM;

export const PRIVACY_PATH = "/doquarium/privacy";
export const DELETE_PATH = "/doquarium/delete-account";
// Out on Google Play (래원 2026-11-09). The beta recruiting page is gone:
// old /doquarium/beta links redirect to /doquarium in vercel.json.
export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.lumora.doquarium";
const DELETE_URL = `lumora.tools${DELETE_PATH}`;

export const DOQUARIUM_PRIVACY: Record<PolicyLang, PolicyDoc> = {
  en: {
    heading: "Doquarium Privacy Policy",
    effective: `Effective date: ${effectiveDate.en} · Last updated: ${lastUpdated.en}`,
    intro: `${developer} ("we") cares about the privacy of everyone who uses the Doquarium app ("the app"). This policy explains what information the app collects, why, and how it is stored and deleted.`,
    tableHeaders: ["When", "Information", "Purpose", "Where it is stored"],
    sections: [
      {
        title: "1. What we collect and why",
        table: [
          {
            when: "Using the app (everyone)",
            what: "To-dos, fish, collection, coins, decorations, tanks, and settings",
            why: "App features",
            where: "Only on your phone (never sent to a server)",
          },
          {
            when: "Joining or creating a shared tank",
            what: "Anonymous user ID, nickname, tank name, room code, tank theme and mode, your fish's appearance and status (species, growth stage, size, traits, health, generation), your fish's name, a health and pollution forecast for the next 96 hours, decorations you place in the shared tank, any aquariums you show to friends (aquarium name, the fish in it and their names, decorations, small creatures), number of to-dos finished today, tank pollution level, last active time, reactions you send to and receive from friends (cheer 💗, poke 🐟, celebrate ✨) and when they were sent",
            why: "Showing the same tank to the friends you share it with",
            where: "Google Firebase servers",
          },
          {
            when: "Being in a shared tank set to \"See each other's to-dos\"",
            what: "The titles of the to-dos on your current list and whether you finished them today (to-dos set to \"Only me\" are left out)",
            why: "Letting friends in that tank see each other's to-dos",
            where: "Google Firebase servers (only members of that tank can see it)",
          },
          {
            when: "Using a shared tank (poke alerts)",
            what: "This phone's notification address (push token), your anonymous or sign-in user ID, whether poke alerts are on, the alert language, and your phone's time zone. When a friend pokes you, a short record of the two user IDs and the day, so each friend can alert you at most once a day",
            why: "Sending a phone alert when a friend pokes you (\"Sea poked you\", with no to-do content)",
            where: "Google Firebase servers (only the server can read it)",
          },
          {
            when: "Signing in with Google or Apple (optional)",
            what: "Google: email address, name, and profile photo. Apple: email address (or Apple's private relay address, if you chose Hide My Email) and name. Plus your sign-in ID",
            why: "Identifying your account, backup and restore",
            where: "Google Firebase servers",
          },
          {
            when: "After signing in (optional)",
            what: "A full backup of your app data, including your to-dos",
            why: "Keeping your progress when you change phones",
            where: "Google Firebase servers (only you can access it)",
          },
          {
            when: "When you add a photo to a fish in Storage after signing in (optional)",
            what: "A photo you pick or take (one per fish, resized)",
            why: "Keeping your memory photos when you change phones",
            where: "Google Firebase Cloud Storage (USA, only you can see it)",
          },
          {
            when: "Sending a question, bug report, or idea from the app (optional)",
            what: "Your message, up to 3 photos if you attach them, the reply email address if you enter one, app version, phone model, OS version, language, and an anonymous user ID (your to-dos are not included, unless they appear in a photo you attach)",
            why: "Replying to you and fixing bugs",
            where: "Google Firebase servers; attached photos in Firebase Cloud Storage (USA). Only the developer can see them",
          },
          {
            when: "Reporting a friend in a shared tank (optional)",
            what: "The reason and anything you write, your anonymous user ID, and that friend's nickname, user ID, fish names, aquarium names, and to-do titles (if they were visible to you), plus the room ID, app version, phone model, OS version, and language",
            why: "Reviewing the report and taking action if needed",
            where: "Google Firebase servers (only the developer can see it)",
          },
          {
            when: "When the app crashes or hits an error (everyone)",
            what: "Error details and where in the app it happened, phone model, OS version, app version, and a random installation ID that changes if you reinstall the app (no account, name, or to-dos)",
            why: "Finding and fixing bugs",
            where: "Google Firebase Crashlytics",
          },
        ],
        items: [
          "Your to-dos are not shown to friends. In a shared tank, friends see your nickname, your fish (appearance, name, and health), how many to-dos you finished, your decorations in that tank, and any aquariums you show to friends. The one exception is a tank its owner created with \"See each other's to-dos\" turned on: you are told before you join, and friends in that tank can see your to-do titles and whether you finished them (to-dos set to \"Only me\" stay hidden).",
          "Reminders are scheduled on your phone only and are not sent to a server.",
          "If you only use the app on your own, no personal information is sent to a server. The only thing sent is a crash or error report when something goes wrong, which contains no account, name, or to-dos. When the app starts, Google Firebase may issue this phone a random installation ID and notification address, but we do not store them in our database if you only use the app on your own.",
          "Shared tank promise: before creating or joining a shared tank, you agree not to write anything hurtful, such as insults, hate, harassment, or sexual content. We review reports, and anyone who breaks this promise can be removed from shared tanks and blocked from server features (your own solo tanks keep working).",
          "If you are not signed in, memory photos are stored only on your phone and are never sent to a server.",
          "You can also sign in with the same Google or Apple account at lumora.tools/doquarium/app to see your to-dos on a computer. When you add, finish, edit, or delete a to-do (or make a category) there, the page saves that change as a short note in your own mailbox on the server (only your account can read it). Your phone applies the note the next time the app is open and then deletes it. The page keeps no other copy of your to-dos, and your sign-in stays in that browser until you sign out.",
          "The app has no ads and does not track how you use it. It does not collect advertising IDs, location, or contacts. Photos are used only when you pick or take one and attach it to a fish in Storage, and they are never shown to friends.",
        ],
      },
      {
        title: "2. How long we keep it",
        items: [
          "Data on your phone: until you delete it in the app or uninstall the app.",
          "Shared tank data: your member data (including any shared to-do titles) and the reactions you sent or received are removed as soon as you leave the tank. Reactions older than 7 days are deleted when the recipient opens the app, and are removed together with the tank when it is deleted. A tank's name and room code are removed when its last member leaves.",
          "Sign-in and backup data: kept while you have an account so you can sign back in and restore your progress (signing out does not delete the backup). Deleted when you delete your account (in the app or by email). Server copies may take up to 30 days to be fully removed.",
          "Questions, bug reports, and friend reports (including attached photos): deleted once they have been handled, and no later than 1 year after we receive them. You can ask us to delete one sooner by email.",
          "Crash and error reports: kept for 90 days by Firebase Crashlytics, then deleted automatically.",
          "Poke alert data: the notification address is deleted when you sign out or delete your account, and is cleaned up after you uninstall the app (the next time a friend pokes you). The once-a-day record is deleted automatically after 2 days.",
          "Memory photos: deleted when you change or remove the photo, return that fish to the sea, reset your progress, or delete your account. Signing out removes them from that phone only; the server copy stays so you can see them again when you sign back in.",
        ],
      },
      {
        title: "3. Sharing and service providers",
        items: [
          "We do not sell your personal information or share it with advertisers.",
          "If you sign in with Apple, Apple Inc. confirms your Apple ID and passes us only the email address and name you allow. When you delete your account, the app also removes Doquarium's access to your Apple ID.",
          "We use Firebase by Google LLC (authentication, database, Cloud Storage for photos, Cloud Functions, Cloud Messaging push notifications, and Crashlytics crash reporting) to run shared tanks, backups, memory photos, poke alerts, in-app questions, and crash reports. Shared tank, backup, and question data are stored on Google servers in Seoul, South Korea (asia-northeast3). Memory photos and photos attached to questions are stored on Google servers in Oregon, USA (us-west1). Sign-in data, push notifications, and crash reports are processed on Google servers, which may be located outside Korea. Data is transferred over the internet when you use these features or when a crash report is sent, and is kept for the periods in section 2.",
          "If you do not use shared tanks, sign-in, or the in-app question form, no personal information is sent to a server, and every single-player feature still works.",
        ],
      },
      {
        title: "4. Your choices and rights",
        items: [
          "You can view, edit, or delete your to-dos, fish, and tanks in the app at any time.",
          "Leave a shared tank in the app to remove your member data from it.",
          "Turn off poke alerts on this phone: Settings (gear) → Notifications → Poke alerts. You will still see pokes when you open the app.",
          "Delete your account in the app: Settings (gear) → Account → Delete account. Your sign-in account, server backup, and place in shared tanks are deleted right away.",
          `No longer have the app? See ${DELETE_URL}, or email ${contactEmail} with the subject "Account deletion request".`,
          `You can also email us to access, correct, or stop the processing of your information.`,
          "If you are in the European Economic Area or the UK: we process your information to provide the app (contract), to fix bugs and keep it secure (legitimate interests), and for optional features such as sign-in and photos (consent). You can email us to access, correct, delete, restrict, or move your information, or to object to its processing, and you can complain to your local data protection authority.",
        ],
      },
      {
        title: "5. Children",
        items: [
          "The app is not directed at children under 13.",
          "Children under 14 should not use the sign-in feature without a parent or guardian's consent.",
        ],
      },
      {
        title: "6. Security",
        items: [
          "Data sent to our servers uses encrypted connections (HTTPS).",
          "Backups and memory photos are protected by security rules so that only your own account can read or write them.",
        ],
      },
      {
        title: "7. Contact",
        items: [
          `Privacy officer: ${privacyOfficer} (${developer})`,
          `Email: ${contactEmail}`,
        ],
      },
      {
        title: "8. Changes to this policy",
        items: [
          "We will post changes on this page and in the app at least 7 days before they take effect.",
        ],
      },
    ],
  },
  ko: {
    heading: "두쿠아리움 개인정보처리방침",
    effective: `시행일: ${effectiveDate.ko} · 최근 수정일: ${lastUpdated.ko}`,
    intro: `${developer}(이하 "개발자")는 앱 「두쿠아리움」(이하 "앱")을 쓰는 분의 개인정보를 소중히 다룹니다. 이 방침은 앱이 어떤 정보를 왜 모으고, 어떻게 보관하고 지우는지 알려 드립니다.`,
    tableHeaders: ["언제", "모으는 정보", "쓰는 곳", "저장 위치"],
    sections: [
      {
        title: "1. 모으는 정보와 쓰는 곳",
        table: [
          {
            when: "앱을 쓸 때 (누구나)",
            what: "할 일, 물고기 · 도감 · 코인 · 꾸미기 · 어항 기록, 설정",
            why: "앱 기능",
            where: "내 폰에만 (서버로 보내지 않음)",
          },
          {
            when: "단체 어항을 만들거나 들어갈 때",
            what: "익명 사용자 ID, 닉네임, 어항 이름, 방 코드, 어항 테마 · 난이도, 물고기 모습과 상태(종류 · 성장 단계 · 크기 · 특징 · 건강 · 세대), 물고기 이름, 앞으로 96시간의 건강 · 오염 예보, 단체 어항에 놓은 꾸미기, 친구에게 보여 주기로 둔 수족관(이름, 그 안의 물고기와 이름, 꾸미기, 작은 생물), 오늘 끝낸 할 일 개수, 어항 오염 정도, 마지막 접속 시각, 친구와 주고받은 반응(💗 응원 · 🐟 콕 · ✨ 축하)과 보낸 시각",
            why: "친구와 같은 어항을 함께 보기",
            where: "Google Firebase 서버",
          },
          {
            when: "\"할 일 서로 보기\" 단체 어항에 있을 때",
            what: "지금 목록의 할 일 제목과 오늘 끝냈는지 (\"나만 보기\"로 둔 할 일은 빼고)",
            why: "그 방 친구들과 서로의 할 일 보기",
            where: "Google Firebase 서버 (그 방 멤버만 볼 수 있음)",
          },
          {
            when: "단체 어항을 쓸 때 (콕 알림)",
            what: "이 폰의 알림 주소(푸시 토큰), 익명 · 로그인 사용자 ID, 콕 알림 켜짐 여부, 알림 글 언어, 폰의 시간대. 친구가 콕을 보내면 같은 친구의 알림이 하루 한 번만 오도록 두 사람의 사용자 ID와 날짜를 짧게 기록",
            why: "친구가 콕 찔렀을 때 폰에 알림 보내기 (\"바다님이 콕 찔렀어요\", 할 일 내용 없음)",
            where: "Google Firebase 서버 (서버만 읽을 수 있음)",
          },
          {
            when: "Google 또는 Apple로 로그인할 때 (선택)",
            what: "Google: 이메일 주소 · 이름 · 프로필 사진. Apple: 이메일 주소(\"나의 이메일 가리기\"를 골랐다면 Apple이 만든 대신 받는 주소) · 이름. 그리고 로그인 ID",
            why: "계정 확인, 기록 백업 · 복원",
            where: "Google Firebase 서버",
          },
          {
            when: "로그인한 뒤 (선택)",
            what: "할 일을 포함한 앱 기록 전체 (백업)",
            why: "폰을 바꿔도 기록을 이어 쓰기",
            where: "Google Firebase 서버 (본인만 볼 수 있음)",
          },
          {
            when: "로그인한 뒤 보관함 물고기에 사진을 붙일 때 (선택)",
            what: "직접 고르거나 찍은 사진 (물고기마다 1장, 줄여서 저장)",
            why: "폰을 바꿔도 추억 사진을 이어 보기",
            where: "Google Firebase Cloud Storage (미국, 본인만 볼 수 있음)",
          },
          {
            when: "앱에서 문의 · 버그 · 제안을 보낼 때 (선택)",
            what: "보낸 글, (붙였다면) 사진 3장까지, (적었다면) 답장 받을 이메일 주소, 앱 버전, 폰 기종, OS 버전, 언어, 익명 사용자 ID (할 일 내용은 보내지 않음. 단, 붙인 사진에 보이면 함께 전달됨)",
            why: "문의 답장, 버그 고치기",
            where: "Google Firebase 서버, 붙인 사진은 Firebase Cloud Storage (미국). 개발자만 볼 수 있음",
          },
          {
            when: "단체 어항에서 친구를 신고할 때 (선택)",
            what: "신고 까닭과 직접 적은 글, 내 익명 사용자 ID, 그 친구의 별명 · 사용자 ID · 물고기 이름 · 수족관 이름 · 할 일 제목(나에게 보였을 때), 방 번호, 앱 버전, 폰 기종, OS 버전, 언어",
            why: "신고를 살펴보고 필요한 조치를 하기",
            where: "Google Firebase 서버 (개발자만 볼 수 있습니다)",
          },
          {
            when: "앱이 튕기거나 오류가 났을 때 (누구나)",
            what: "오류 내용과 앱의 어느 부분에서 났는지, 폰 기종, OS 버전, 앱 버전, 앱을 다시 깔면 바뀌는 무작위 설치 번호 (계정 · 이름 · 할 일은 보내지 않음)",
            why: "버그 찾고 고치기",
            where: "Google Firebase Crashlytics",
          },
        ],
        items: [
          "할 일 내용은 친구에게 보이지 않습니다. 단체 어항에서 친구에게는 별명, 물고기(모습 · 이름 · 건강), 끝낸 개수, 그 어항의 꾸미기, 보여 주기로 둔 수족관이 보입니다. 단, 방장이 \"할 일 서로 보기\"로 만든 단체 어항에서는 들어가기 전에 알려 드리고, 그 방 친구들이 할 일 제목과 끝냈는지를 볼 수 있습니다 (\"나만 보기\"로 둔 할 일은 보이지 않습니다).",
          "알림은 폰 안에서만 예약되며, 알림 내용을 서버로 보내지 않습니다.",
          "혼자만 쓰면 서버로 보내는 개인정보가 없습니다. 문제가 생겼을 때의 오류 기록만 보내며, 여기에는 계정 · 이름 · 할 일이 들어가지 않습니다. 앱을 켤 때 Google Firebase가 이 폰에 무작위 설치 번호와 알림 주소를 발급할 수 있지만, 혼자만 쓰면 저희 데이터베이스에 저장하지 않습니다.",
          "함께 쓰는 어항 약속: 단체 어항을 만들거나 들어가기 전에, 욕설 · 혐오 · 괴롭힘 · 음란한 글처럼 다른 사람이 불쾌할 글을 쓰지 않기로 동의합니다. 신고가 들어오면 내용을 살펴보고, 약속을 어긴 사람은 단체 어항에서 내보내거나 서버 기능을 쓸 수 없게 할 수 있습니다 (혼자 쓰는 어항은 그대로 쓸 수 있습니다).",
          "로그인하지 않았으면 추억 사진은 폰에만 저장되고 서버로 보내지 않습니다.",
          "같은 Google 또는 Apple 계정으로 lumora.tools/doquarium/app 에 로그인하면 컴퓨터에서도 할 일을 볼 수 있습니다. 웹에서 할 일을 추가 · 끝내기 · 고치기 · 지우거나 카테고리를 만들면, 그 내용이 서버의 내 우편함에 짧은 쪽지로 저장됩니다 (내 계정만 읽을 수 있습니다). 폰에서 앱을 열면 앱이 쪽지를 반영한 뒤 지웁니다. 웹 페이지는 할 일을 따로 보관하지 않으며, 로그인은 로그아웃할 때까지 그 브라우저에만 남습니다.",
          "앱은 광고가 없고 앱을 어떻게 쓰는지 추적하지 않으며, 광고 식별자 · 위치 · 연락처를 모으지 않습니다. 사진은 직접 고르거나 찍어 보관함 물고기에 붙인 것만 쓰며, 친구에게 보이지 않습니다.",
        ],
      },
      {
        title: "2. 보관 기간",
        items: [
          "폰 안의 기록: 앱에서 지우거나 앱을 지울 때까지",
          "단체 어항 정보: 어항을 나가면 내 멤버 정보(보여 준 할 일 제목 포함)와 주고받은 반응을 바로 지웁니다. 주고받은 반응은 받은 사람이 앱을 열 때 7일이 지난 것부터 지워지고, 어항이 없어지면 함께 지워집니다. 어항 이름과 방 코드는 마지막 멤버가 나가면 지웁니다.",
          "로그인 · 백업 정보: 다시 로그인해 기록을 되찾을 수 있도록 계정이 있는 동안 보관합니다 (로그아웃해도 백업은 남습니다). 계정을 삭제하면(앱 안에서 또는 이메일 요청) 지웁니다. 서버에 남은 복사본이 완전히 지워지기까지 최대 30일이 걸릴 수 있습니다.",
          "문의 · 버그 글 · 친구 신고 (붙인 사진 포함): 처리한 뒤 지우고, 늦어도 받은 날부터 1년 안에 지웁니다. 더 일찍 지워 달라고 이메일로 요청할 수 있습니다.",
          "오류 기록: Firebase Crashlytics가 90일 동안 보관한 뒤 저절로 지웁니다.",
          "콕 알림 정보: 알림 주소는 로그아웃하거나 계정을 지우면 지우고, 앱을 지우면 다음에 친구가 콕을 보낼 때 정리합니다. 하루 한 번 기록은 2일 뒤 저절로 지워집니다.",
          "추억 사진: 사진을 바꾸거나 지울 때, 그 물고기를 바다로 돌려보낼 때, 진행 상황을 초기화할 때, 계정을 삭제할 때 지웁니다. 로그아웃하면 그 폰에서만 지우고, 서버에는 남아 다시 로그인하면 볼 수 있습니다.",
        ],
      },
      {
        title: "3. 다른 곳에 맡기거나 넘기는 정보",
        items: [
          "개발자는 개인정보를 팔거나 광고 회사에 넘기지 않습니다.",
          "Apple로 로그인하면 Apple Inc.가 Apple ID를 확인하고, 내가 허락한 이메일 주소와 이름만 넘겨줍니다. 계정을 지우면 앱이 내 Apple ID에 준 두쿠아리움의 접근 권한도 함께 끊습니다.",
          "서버 운영을 위해 Google LLC의 Firebase(인증 · 데이터베이스 · Cloud Storage 사진 저장 · Cloud Functions · Cloud Messaging 푸시 알림 · Crashlytics 오류 기록)를 씁니다. 단체 어항 · 백업 · 문의 기록은 대한민국 서울의 Google 서버(asia-northeast3)에, 추억 사진과 문의에 붙인 사진은 미국(오리건)의 Google 서버(us-west1)에, 로그인 정보 · 푸시 알림 · 오류 기록은 Google 서버(국외 포함)에서 처리됩니다. 이 기능을 쓸 때나 오류 기록이 보내질 때 인터넷으로 보내지며, 보관 기간은 위 2번과 같습니다.",
          "국외 이전 (추억 사진 · 문의에 붙인 사진): 이전받는 자 Google LLC · 이전 국가 미국(오리건, us-west1) · 이전 시점과 방법: 로그인한 뒤 보관함 물고기에 사진을 붙일 때, 또는 문의 · 버그 알리기에 사진을 붙여 보낼 때 인터넷으로 · 항목: 사진 파일 · 보관 기간: 위 2번과 같음 · 거부 방법: 로그인하지 않거나 사진을 붙이지 않으면 보내지 않습니다 (다른 기능은 그대로 쓸 수 있습니다).",
          "단체 어항 · 로그인 · 앱 안 문의를 쓰지 않으면 서버로 보내는 개인정보가 없고, 혼자 쓰는 기능은 그대로 다 쓸 수 있습니다.",
        ],
      },
      {
        title: "4. 내 정보 보기 · 고치기 · 지우기",
        items: [
          "할 일 · 물고기 · 어항은 앱 안에서 언제든 보고 고치고 지울 수 있습니다.",
          "단체 어항에서 나가면 그 어항의 내 멤버 정보가 지워집니다.",
          "이 폰의 콕 알림 끄기: 설정(톱니바퀴) → 알림 → 콕 알림. 꺼도 앱을 열면 콕은 그대로 보입니다.",
          "앱에서 계정 삭제: 설정(톱니바퀴) → 계정 → 계정 삭제. 로그인 계정, 서버 백업, 단체 어항의 내 자리가 바로 지워집니다.",
          `앱을 지웠다면 ${DELETE_URL}/ko 를 보시거나 ${contactEmail} 으로 제목 "계정 삭제 요청"을 보내 주세요.`,
          "내 정보 열람 · 정정 · 처리 정지도 같은 이메일로 요청할 수 있습니다.",
          "유럽 경제 지역(EEA) · 영국에서 쓰는 경우: 앱 제공(계약), 오류 수정과 보안(정당한 이익), 로그인 · 사진 같은 선택 기능(동의)을 근거로 정보를 처리합니다. 같은 이메일로 열람 · 정정 · 삭제 · 처리 제한 · 이동 · 이의 제기를 요청할 수 있고, 거주 국가의 개인정보 감독기관에 불만을 제기할 수 있습니다.",
        ],
      },
      {
        title: "5. 어린이",
        items: [
          "앱은 만 13세 미만 어린이를 대상으로 하지 않습니다.",
          "만 14세 미만은 보호자의 동의 없이 로그인 기능을 쓰지 말아 주세요.",
        ],
      },
      {
        title: "6. 안전하게 지키는 방법",
        items: [
          "서버와 주고받는 정보는 암호화된 연결(HTTPS)로 보냅니다.",
          "백업 기록과 추억 사진은 보안 규칙으로 본인 계정만 읽고 쓸 수 있게 막습니다.",
        ],
      },
      {
        title: "7. 개인정보 보호책임자 · 문의",
        items: [
          `책임자: ${privacyOfficer} (${developer})`,
          `이메일: ${contactEmail}`,
        ],
      },
      {
        title: "8. 방침이 바뀌면",
        items: ["바뀐 내용은 이 페이지와 앱에서 시행 7일 전에 알립니다."],
      },
    ],
  },
};

// Google Play "Delete account URL" page: must name the app and developer,
// list the steps, and say what is deleted / kept and for how long.
export const DOQUARIUM_DELETE: Record<PolicyLang, PolicyDoc> = {
  en: {
    heading: "Delete your Doquarium account and data",
    intro: `This page explains how to delete your account and data for the Doquarium app (developer: ${developer}).`,
    sections: [
      {
        title: "In the app (fastest)",
        ordered: true,
        items: [
          "Open the Doquarium app.",
          "Tap the gear (Settings) at the top → Account → Delete account.",
          "Type \"delete\" in the box to turn on the Delete account button, then tap it. (If the app is in Korean, type \"계정 삭제\".)",
          "You may be asked to sign in with your Google or Apple account once more to verify it is you.",
          "Your account and server data are deleted right away. The app then asks whether to also erase the data stored on this phone.",
        ],
      },
      {
        title: "Without the app (by email)",
        items: [
          `Email ${contactEmail} with the subject "Account deletion request" and the email address you used to sign in.`,
          "We will verify that the request comes from the account owner, delete your data within 7 days, and reply.",
        ],
      },
      {
        title: "What is deleted",
        items: [
          "Your sign-in account (email, name, and profile photo from Google, or email and name from Apple). If you signed in with Apple, Doquarium's access to your Apple ID is removed too.",
          "Your full server backup: to-dos, fish, collection, coins, decorations, tanks, and settings.",
          "Your member data in shared tanks (nickname, fish status, and any shared to-do titles) and the reactions you sent and received. If you were the last member, the tank's name and room code are deleted too.",
          "This phone's notification address for poke alerts.",
          "Memory photos backed up to the server.",
        ],
      },
      {
        title: "What is kept",
        items: [
          "Apart from the items below, nothing linked to your account is kept on our servers. Copies in server backups may take up to 30 days to be fully removed.",
          "In shared tanks you were part of, your join record (user ID and room code) and your nickname next to any shared small creatures you added may remain. Email us if you want them deleted.",
          "If a friend reported you, that report (including your nickname and user ID) is kept until it is handled (at most 1 year).",
          "Questions or bug reports you sent from the app, including attached photos, are kept until they are handled (at most 1 year), and crash reports for 90 days. They are not linked to your account; email us if you want a question deleted sooner.",
          "If you choose to keep the data on your phone, it stays only on that phone until you delete it or uninstall the app.",
        ],
      },
      {
        title: "Never signed in?",
        items: [
          "Then there is no account to delete. Leaving a shared tank in the app removes your data from it, and uninstalling the app removes everything stored on your phone.",
          `Need help? Email ${contactEmail}.`,
        ],
      },
    ],
  },
  ko: {
    heading: "두쿠아리움 계정과 데이터 삭제하기",
    intro: `이 페이지는 「두쿠아리움」 앱(개발자: ${developer})의 계정과 데이터를 지우는 방법을 안내합니다.`,
    sections: [
      {
        title: "앱에서 지우기 (가장 빠름)",
        ordered: true,
        items: [
          "두쿠아리움 앱을 엽니다.",
          "맨 위 톱니바퀴(설정) → 계정 → 계정 삭제를 누릅니다.",
          "입력칸에 \"계정 삭제\"를 입력하면 계정 삭제 버튼이 켜집니다. 버튼을 누릅니다. (앱이 영어로 되어 있으면 \"delete\"를 입력합니다.)",
          "본인 확인을 위해 Google 또는 Apple 계정으로 한 번 더 로그인할 수 있습니다.",
          "계정과 서버 기록이 바로 지워집니다. 이어서 이 폰의 기록도 지울지 한 번 더 묻습니다.",
        ],
      },
      {
        title: "앱이 없을 때 (이메일로 요청)",
        items: [
          `${contactEmail} 으로 제목 "계정 삭제 요청"과 함께, 로그인에 쓴 이메일 주소를 적어 보내 주세요.`,
          "계정 주인이 보낸 요청인지 확인한 뒤 7일 안에 지우고 답장드립니다.",
        ],
      },
      {
        title: "지워지는 것",
        items: [
          "로그인 계정 (Google의 이메일 · 이름 · 프로필 사진, 또는 Apple의 이메일 · 이름). Apple로 로그인했다면 내 Apple ID에 준 두쿠아리움의 접근 권한도 끊습니다.",
          "서버에 백업된 기록 전체: 할 일 · 물고기 · 도감 · 코인 · 꾸미기 · 어항 · 설정",
          "단체 어항의 내 멤버 정보(닉네임 · 물고기 상태 · 보여 준 할 일 제목)와 주고받은 반응. 내가 마지막 멤버였다면 어항 이름과 방 코드도 지워집니다.",
          "이 폰의 콕 알림 주소",
          "서버에 백업된 추억 사진",
        ],
      },
      {
        title: "남는 것",
        items: [
          "아래를 빼면 계정과 이어진 정보는 서버에 남기지 않습니다. 서버의 백업 복사본이 완전히 지워지기까지 최대 30일이 걸릴 수 있습니다.",
          "함께 쓰던 단체 어항의 입장 기록(사용자 ID · 방 코드)과, 내가 넣어 준 공용 작은 생물 옆의 별명은 남을 수 있습니다. 지우고 싶으면 이메일로 알려 주세요.",
          "친구가 나를 신고했다면 그 신고 글(내 별명 · 사용자 ID 포함)은 처리할 때까지(최대 1년) 남습니다.",
          "앱에서 보낸 문의 · 버그 글과 붙인 사진은 처리할 때까지(최대 1년), 오류 기록은 90일 동안 남습니다. 계정과 이어져 있지 않으며, 문의 글을 더 일찍 지우고 싶으면 이메일로 알려 주세요.",
          "이 폰의 기록을 남기기로 고르면, 지우거나 앱을 지울 때까지 그 폰에만 남습니다.",
        ],
      },
      {
        title: "로그인한 적이 없다면",
        items: [
          "지울 계정이 없습니다. 앱에서 단체 어항을 나가면 그 어항의 내 정보가 지워지고, 앱을 지우면 폰에 있던 기록이 모두 지워집니다.",
          `도움이 필요하면 ${contactEmail} 으로 연락 주세요.`,
        ],
      },
    ],
  },
};
