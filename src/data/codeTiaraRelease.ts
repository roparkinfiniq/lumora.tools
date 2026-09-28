export interface DownloadOption {
  os: 'mac' | 'windows';
  label: string;
  sublabel: string;
  ext: string;
  fileName: string;
  url: string;
}

export interface CodeTiaraReleaseConfig {
  version: string;
  releaseDate: string;
  downloads: {
    mac: DownloadOption;
    windows: DownloadOption;
  };
  githubReleaseUrl: string;
}

// Releases live in raonepark/Code_Tiara (one tag per version) — the app's auto-updater reads the same place.
export const CODE_TIARA_RELEASE: CodeTiaraReleaseConfig = {
  version: "v1.8.2",
  releaseDate: "2026-09-28",
  downloads: {
    mac: {
      os: "mac",
      label: "Download for Mac",
      sublabel: "macOS (.dmg) · Apple Silicon & Intel",
      ext: ".dmg",
      // Universal build: one file runs on both Apple Silicon and Intel Macs.
      fileName: "Code-Tiara-1.8.2-universal.dmg",
      url: "https://github.com/raonepark/Code_Tiara/releases/download/v1.8.2/Code-Tiara-1.8.2-universal.dmg",
    },
    windows: {
      os: "windows",
      label: "Download for PC",
      sublabel: "Windows (.exe)",
      ext: ".exe",
      fileName: "Code-Tiara-Setup-1.8.2.exe",
      url: "https://github.com/raonepark/Code_Tiara/releases/download/v1.8.2/Code-Tiara-Setup-1.8.2.exe",
    },
  },
  githubReleaseUrl: "https://github.com/raonepark/Code_Tiara/releases",
};
