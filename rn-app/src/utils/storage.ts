export async function getItem(key: string): Promise<string | null> {
  try {
    // Prefer community AsyncStorage if installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AS = require("@react-native-async-storage/async-storage")?.default;
    if (AS && AS.getItem) {
      return await AS.getItem(key);
    }
  } catch {}
  return null;
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AS = require("@react-native-async-storage/async-storage")?.default;
    if (AS && AS.setItem) {
      await AS.setItem(key, value);
    }
  } catch {}
}

export async function removeItem(key: string): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AS = require("@react-native-async-storage/async-storage")?.default;
    if (AS && AS.removeItem) {
      await AS.removeItem(key);
    }
  } catch {}
}
