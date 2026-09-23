import { demoData } from '../data/demo';
import type { AppData, PhysicalTestPayload } from '../types';

declare global {
  interface Window {
    google?: any;
  }
}

function hasGas() {
  return Boolean(window.google && window.google.script && window.google.script.run);
}

function gasCall<T>(method: string, payload?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const base = window.google && window.google.script && window.google.script.run;
    if (!base) {
      reject(new Error('Google Apps Script недоступен'));
      return;
    }
    const runner = base
      .withSuccessHandler((value: T) => resolve(value))
      .withFailureHandler((error: unknown) => reject(error));
    if (typeof runner[method] !== 'function') {
      reject(new Error('Серверный метод не найден: ' + method));
      return;
    }
    if (payload === undefined) runner[method]();
    else runner[method](payload);
  });
}

export async function loadAppData(): Promise<AppData> {
  if (!hasGas()) return demoData;
  const result = await gasCall<AppData>('getAppData');
  return { ...result, source: 'google-sheets' };
}

export async function savePhysicalTest(payload: PhysicalTestPayload) {
  if (!hasGas()) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { ok: true, demo: true };
  }
  return gasCall<{ ok: boolean; row: number; batteryId: string }>('savePhysicalTest', payload);
}
