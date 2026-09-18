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

export const CODE_TIARA_RELEASE: CodeTiaraReleaseConfig = {
  version: "v1.8.0",
  releaseDate: "2026-09-18",
  downloads: {
    mac: {
      os: "mac",
      label: "Download for Mac",
      sublabel: "macOS (.dmg) · Apple Silicon & Intel",
      ext: ".dmg",
      // Universal build: one file runs on both Apple Silicon and Intel Macs.
      fileName: "Code.Tiara-1.8.0-universal.dmg",
      url: "https://github.com/roparkinfiniq/lumora.tools/releases/download/Code_Tiara/Code.Tiara-1.8.0-universal.dmg",
    },
    windows: {
      os: "windows",
      label: "Download for PC",
      sublabel: "Windows (.exe)",
      ext: ".exe",
      fileName: "Code.Tiara.Setup.1.8.0.exe",
      url: "https://github.com/roparkinfiniq/lumora.tools/releases/download/Code_Tiara/Code.Tiara.Setup.1.8.0.exe",
    },
  },
  githubReleaseUrl: "https://github.com/roparkinfiniq/lumora.tools/releases",
};
