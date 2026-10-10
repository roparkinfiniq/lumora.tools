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
  lastUpdated: { en: "October 10, 2026", ko: "2026년 10월 10일" },
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
            what: "Anonymous user ID, nickname, tank name, room code, tank theme and mode, your fish's appearance and status (species, growth stage, size, traits, health, generation), number of to-dos finished today, tank pollution level, last active time, reactions you send to and receive from friends (cheer 💗, poke 🐟, celebrate ✨) and when they were sent",
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
            when: "Signing in with Google (optional)",
            what: "Email address, name, and profile photo from your Google account, plus your sign-in ID",
            why: "Identifying your account, backup and restore",
            where: "Google Firebase servers",
          },
          {
            when: "After signing in (optional)",
            what: "A full backup of your app data, including your to-dos",
            why: "Keeping your progress when you change phones",
            where: "Google Firebase servers (only you can access it)",
          },
        ],
        items: [
          "Your to-dos are not shown to friends. In a shared tank, friends only see your fish and how many to-dos you finished. The one exception is a tank its owner created with \"See each other's to-dos\" turned on: you are told before you join, and friends in that tank can see your to-do titles and whether you finished them (to-dos set to \"Only me\" stay hidden).",
          "Reminders are scheduled on your phone only and are not sent to a server.",
          "If you only use the app on your own, nothing is sent to a server.",
          "The app does not use analytics or ads, and does not collect advertising IDs, location, contacts, or photos.",
        ],
      },
      {
        title: "2. How long we keep it",
        items: [
          "Data on your phone: until you delete it in the app or uninstall the app.",
          "Shared tank data: your member data (including any shared to-do titles) and the reactions you sent or received are removed as soon as you leave the tank. Reactions older than 7 days are deleted when the recipient opens the app, and are removed together with the tank when it is deleted. A tank's name and room code are removed when its last member leaves.",
          "Sign-in and backup data: kept while you have an account so you can sign back in and restore your progress (signing out does not delete the backup). Deleted when you delete your account (in the app or by email). Server copies may take up to 30 days to be fully removed.",
        ],
      },
      {
        title: "3. Sharing and service providers",
        items: [
          "We do not sell your personal information or share it with advertisers.",
          "We use Firebase by Google LLC (authentication and database) to run shared tanks and backups. Shared tank and backup data are stored on Google servers in Seoul, South Korea (asia-northeast3). Sign-in data is processed on Google servers, which may be located outside Korea. Data is transferred over the internet when you use a shared tank or sign in, and is kept for the periods in section 2.",
          "If you do not use shared tanks or sign-in, no personal information is sent to a server, and every single-player feature still works.",
        ],
      },
      {
        title: "4. Your choices and rights",
        items: [
          "You can view, edit, or delete your to-dos, fish, and tanks in the app at any time.",
          "Leave a shared tank in the app to remove your member data from it.",
          "Delete your account in the app: Settings (gear) → Account → Delete account. Your sign-in account, server backup, and place in shared tanks are deleted right away.",
          `No longer have the app? See ${DELETE_URL}, or email ${contactEmail} with the subject "Account deletion request".`,
          `You can also email us to access, correct, or stop the processing of your information.`,
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
          "Backups are protected by security rules so that only your own account can read or write them.",
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
            what: "익명 사용자 ID, 닉네임, 어항 이름, 방 코드, 어항 테마 · 난이도, 물고기 모습과 상태(종류 · 성장 단계 · 크기 · 특징 · 건강 · 세대), 오늘 끝낸 할 일 개수, 어항 오염 정도, 마지막 접속 시각, 친구와 주고받은 반응(💗 응원 · 🐟 콕 · ✨ 축하)과 보낸 시각",
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
            when: "Google로 로그인할 때 (선택)",
            what: "Google 계정의 이메일 주소 · 이름 · 프로필 사진, 로그인 ID",
            why: "계정 확인, 기록 백업 · 복원",
            where: "Google Firebase 서버",
          },
          {
            when: "로그인한 뒤 (선택)",
            what: "할 일을 포함한 앱 기록 전체 (백업)",
            why: "폰을 바꿔도 기록을 이어 쓰기",
            where: "Google Firebase 서버 (본인만 볼 수 있음)",
          },
        ],
        items: [
          "할 일 내용은 친구에게 보이지 않습니다. 단체 어항에서 친구에게는 물고기 모습과 끝낸 개수만 보입니다. 단, 방장이 \"할 일 서로 보기\"로 만든 단체 어항에서는 들어가기 전에 알려 드리고, 그 방 친구들이 할 일 제목과 끝냈는지를 볼 수 있습니다 (\"나만 보기\"로 둔 할 일은 보이지 않습니다).",
          "알림은 폰 안에서만 예약되며, 알림 내용을 서버로 보내지 않습니다.",
          "혼자만 쓰면 서버로 보내는 정보가 없습니다.",
          "앱은 분석 도구나 광고를 쓰지 않고, 광고 식별자 · 위치 · 연락처 · 사진을 모으지 않습니다.",
        ],
      },
      {
        title: "2. 보관 기간",
        items: [
          "폰 안의 기록: 앱에서 지우거나 앱을 지울 때까지",
          "단체 어항 정보: 어항을 나가면 내 멤버 정보(보여 준 할 일 제목 포함)와 주고받은 반응을 바로 지웁니다. 주고받은 반응은 받은 사람이 앱을 열 때 7일이 지난 것부터 지워지고, 어항이 없어지면 함께 지워집니다. 어항 이름과 방 코드는 마지막 멤버가 나가면 지웁니다.",
          "로그인 · 백업 정보: 다시 로그인해 기록을 되찾을 수 있도록 계정이 있는 동안 보관합니다 (로그아웃해도 백업은 남습니다). 계정을 삭제하면(앱 안에서 또는 이메일 요청) 지웁니다. 서버에 남은 복사본이 완전히 지워지기까지 최대 30일이 걸릴 수 있습니다.",
        ],
      },
      {
        title: "3. 다른 곳에 맡기거나 넘기는 정보",
        items: [
          "개발자는 개인정보를 팔거나 광고 회사에 넘기지 않습니다.",
          "서버 운영을 위해 Google LLC의 Firebase(인증 · 데이터베이스)를 씁니다. 단체 어항 · 백업 기록은 대한민국 서울의 Google 서버(asia-northeast3)에, 로그인 정보는 Google 서버(국외 포함)에서 처리됩니다. 단체 어항이나 로그인을 쓸 때 인터넷으로 보내지며, 보관 기간은 위 2번과 같습니다.",
          "단체 어항과 로그인을 쓰지 않으면 서버로 보내는 정보가 없고, 혼자 쓰는 기능은 그대로 다 쓸 수 있습니다.",
        ],
      },
      {
        title: "4. 내 정보 보기 · 고치기 · 지우기",
        items: [
          "할 일 · 물고기 · 어항은 앱 안에서 언제든 보고 고치고 지울 수 있습니다.",
          "단체 어항에서 나가면 그 어항의 내 멤버 정보가 지워집니다.",
          "앱에서 계정 삭제: 설정(톱니바퀴) → 계정 → 계정 삭제. 로그인 계정, 서버 백업, 단체 어항의 내 자리가 바로 지워집니다.",
          `앱을 지웠다면 ${DELETE_URL}/ko 를 보시거나 ${contactEmail} 으로 제목 "계정 삭제 요청"을 보내 주세요.`,
          "내 정보 열람 · 정정 · 처리 정지도 같은 이메일로 요청할 수 있습니다.",
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
          "백업 기록은 보안 규칙으로 본인 계정만 읽고 쓸 수 있게 막습니다.",
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
    intro: `This page explains how to delete your account and data for Doquarium, an app by ${developer}.`,
    sections: [
      {
        title: "In the app (fastest)",
        ordered: true,
        items: [
          "Open the Doquarium app.",
          "Tap the gear (Settings) at the top → Account → Delete account.",
          "Type \"delete\" in the box to turn on the Delete account button, then tap it. (If the app is in Korean, type \"계정 삭제\".)",
          "You may be asked to choose your Google account once more to verify it is you.",
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
          "Your sign-in account (Google email, name, and profile photo).",
          "Your full server backup: to-dos, fish, collection, coins, decorations, tanks, and settings.",
          "Your member data in shared tanks (nickname, fish status, and any shared to-do titles) and the reactions you sent and received. If you were the last member, the tank's name and room code are deleted too.",
        ],
      },
      {
        title: "What is kept",
        items: [
          "Nothing is kept on our servers. Copies in server backups may take up to 30 days to be fully removed.",
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
    intro: `이 페이지는 ${developer}가 만든 앱 「두쿠아리움」의 계정과 데이터를 지우는 방법을 안내합니다.`,
    sections: [
      {
        title: "앱에서 지우기 (가장 빠름)",
        ordered: true,
        items: [
          "두쿠아리움 앱을 엽니다.",
          "맨 위 톱니바퀴(설정) → 계정 → 계정 삭제를 누릅니다.",
          "입력칸에 \"계정 삭제\"를 입력하면 계정 삭제 버튼이 켜집니다. 버튼을 누릅니다. (앱이 영어로 되어 있으면 \"delete\"를 입력합니다.)",
          "본인 확인을 위해 Google 계정을 한 번 더 고를 수 있습니다.",
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
          "로그인 계정 (Google 이메일 · 이름 · 프로필 사진)",
          "서버에 백업된 기록 전체: 할 일 · 물고기 · 도감 · 코인 · 꾸미기 · 어항 · 설정",
          "단체 어항의 내 멤버 정보(닉네임 · 물고기 상태 · 보여 준 할 일 제목)와 주고받은 반응. 내가 마지막 멤버였다면 어항 이름과 방 코드도 지워집니다.",
        ],
      },
      {
        title: "남는 것",
        items: [
          "서버에 남겨 두는 정보는 없습니다. 서버의 백업 복사본이 완전히 지워지기까지 최대 30일이 걸릴 수 있습니다.",
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
