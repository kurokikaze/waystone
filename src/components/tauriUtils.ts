import { getCurrent as tauriGetCurrent, Window } from "@tauri-apps/api/window";

const mockCurrentWindow = {
    setSize: async () => {},
    setResizable: async () => {},
}

// Current version of Tauri doesn't check for __TAURI_INTERNALS__ inside getCurrent
// So we mock it here for easier debugging
export function getCurrent() {
    if ('__TAURI_INTERNALS__' in window) {
        return tauriGetCurrent();
    }

    return mockCurrentWindow
}