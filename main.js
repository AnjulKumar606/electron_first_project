import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile('index.html');

    // Open devtools so you can see errors during development
    win.webContents.openDevTools({mode: 'detach'});
};
app.whenReady().then(() => {
    console.log('main: app ready');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC handler (async)
ipcMain.handle('save-data', async (_, content) => {
    try {
        await fs.promises.writeFile(path.join(__dirname, 'data.txt'), content, 'utf8');
        return 'Data saved successfully!';
    } catch (err) {
        console.error('save-data error', err);
        throw err;
    }
});
