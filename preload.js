const { contextBridge, ipcRenderer } = require('electron');

console.log('preload: loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    saveData: async (content) => {
        return await ipcRenderer.invoke('save-data', content);
    },
});
