const { contextBridge, ipcRenderer } = require('electron');

console.log('preload: loadeded');

contextBridge.exposeInMainWorld('electronAPI', {
    saveData: async (content) => {
        return await ipcRenderer.invoke('save-data', content);
    },
});
