import { VARDHATE_DEFAULT_DATA } from './default-data';

// Pure frontend-only helper using localStorage
const LOCAL_STORAGE_KEY = 'vardhate_db';

export async function fetchDatabase() {
  try {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(VARDHATE_DEFAULT_DATA));
      return VARDHATE_DEFAULT_DATA;
    }
    return JSON.parse(localData);
  } catch (error) {
    console.error("Failed to load VARDHATE local database, falling back to static defaults:", error);
    return VARDHATE_DEFAULT_DATA;
  }
}

export async function updateDatabase(dbData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));
    return { status: 'success' };
  } catch (error) {
    console.error("Failed to update local database:", error);
    throw error;
  }
}

export async function login(password) {
  // Local verification based on user requirements
  const cleanPassword = password.trim();
  if (cleanPassword === 'demo') {
    return { status: 'success', role: 'viewer', redirect: 'viewer' };
  } else if (cleanPassword === 'admin123') {
    return { status: 'success', role: 'admin', redirect: 'admin' };
  } else {
    throw new Error('Incorrect access password.');
  }
}

export async function uploadAsset(file) {
  // Mock file upload since backend is removed
  try {
    const objectUrl = URL.createObjectURL(file);
    return { 
      status: 'success', 
      url: objectUrl, 
      filename: file.name 
    };
  } catch (error) {
    console.error("Asset upload simulation failed:", error);
    throw error;
  }
}
