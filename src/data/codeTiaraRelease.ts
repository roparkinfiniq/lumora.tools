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
  version: "v1.7.5",
  releaseDate: "2026-09-16",
  downloads: {
    mac: {
      os: "mac",
      label: "Download for Mac",
      sublabel: "macOS (.dmg)",
      ext: ".dmg",
      fileName: "Code.Tiara-1.7.5-arm64.dmg",
      url: "https://github.com/roparkinfiniq/lumora.tools/releases/download/Code_Tiara/Code.Tiara-1.7.5-arm64.dmg",
    },
    windows: {
      os: "windows",
      label: "Download for PC",
      sublabel: "Windows (.exe)",
      ext: ".exe",
      fileName: "Code.Tiara.Setup.1.7.5.exe",
      url: "https://github.com/roparkinfiniq/lumora.tools/releases/download/Code_Tiara/Code.Tiara.Setup.1.7.5.exe",
    },
  },
  githubReleaseUrl: "https://github.com/roparkinfiniq/lumora.tools/releases",
};
