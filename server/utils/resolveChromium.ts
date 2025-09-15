import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

/**
 * Try to resolve a Chrome/Chromium executable path that exists on this machine.
 * Prefer explicit env vars, then Puppeteer's bundled path, then common Windows installs.
 */
export function resolveChromiumExecutablePath(): string | null {
  const candidatePaths: Array<string | undefined> = []

  // 1) Environment overrides
  candidatePaths.push(process.env.CHROME_PATH)
  candidatePaths.push(process.env.PUPPETEER_EXECUTABLE_PATH)

  // 2) Puppeteer's suggested path (may throw when Chromium not downloaded)
  try {
    const p = puppeteer.executablePath?.()
    if (p) candidatePaths.push(p)
  } catch {
    // ignore
  }

  // 3) Common Windows locations (Chrome and Edge)
  const programFiles = process.env['PROGRAMFILES'] || 'C:/Program Files'
  const programFilesX86 = process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)'
  const localAppData = process.env['LOCALAPPDATA'] || 'C:/Users/Default/AppData/Local'

  const commonWindowsExecutables = [
    path.join(programFiles, 'Google/Chrome/Application/chrome.exe'),
    path.join(programFilesX86, 'Google/Chrome/Application/chrome.exe'),
    path.join(programFiles, 'Microsoft/Edge/Application/msedge.exe'),
    path.join(programFilesX86, 'Microsoft/Edge/Application/msedge.exe'),
    path.join(localAppData, 'Chromium/Application/chrome.exe'),
  ]
  candidatePaths.push(...commonWindowsExecutables)

  for (const candidate of candidatePaths) {
    if (!candidate) continue
    try {
      if (fs.existsSync(candidate)) return candidate
    } catch {
      // ignore
    }
  }

  return null
}

export function buildPuppeteerLaunchOptions() {
  const executablePath = resolveChromiumExecutablePath()
  const base = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
    ],
    timeout: 60000,
  } as const

  // Only set executablePath if we found a valid one. Otherwise let Puppeteer decide.
  return executablePath ? { ...base, executablePath } : base
}



