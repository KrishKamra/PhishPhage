export const SITE = {
  name: 'PhishPhage',
  version: '1.1.0',
  edition: 'SOC',
  author: 'Krish Kamra',
  year: 2026,
  license: 'MIT',
  repo: 'https://github.com/KrishKamra/PhishPhage',
  repoLabel: 'KrishKamra/PhishPhage',
  authorUrl: 'https://github.com/KrishKamra',
  docs: 'https://github.com/KrishKamra/PhishPhage/blob/main/docs/architecture.md',
  apiSpec: 'https://github.com/KrishKamra/PhishPhage/blob/main/docs/api-spec.md',
  licenseUrl: 'https://github.com/KrishKamra/PhishPhage/blob/main/LICENSE',
  security: 'https://github.com/KrishKamra/PhishPhage/blob/main/SECURITY.md',
  contributing: 'https://github.com/KrishKamra/PhishPhage/blob/main/CONTRIBUTING.md',
} as const;

export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

export function analyzeShortcutLabel(): string {
  return isApplePlatform() ? '⌘↵' : 'Ctrl+↵';
}

export function analyzeModifierLabel(): string {
  return isApplePlatform() ? '⌘' : 'Ctrl';
}
