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
      fileName: "CodeTiara.dmg",
      url: "https://github.com/roparkinfiniq/lumora.tools/releases/download/Code_Tiara/CodeTiara.dmg",
    },
    windows: {
      os: "windows",
      label: "Download for PC",
      sublabel: "Windows (.exe)",
      ext: ".exe",
      fileName: "CodeTiaraSetup.exe",
      url: "https://github.com/roparkinfiniq/lumora.tools/releases/download/Code_Tiara/CodeTiaraSetup.exe",
    },
  },
  githubReleaseUrl: "https://github.com/roparkinfiniq/lumora.tools/releases",
};
