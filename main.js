const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
// This is true if you are on Mac
const isMac = process.platform === 'darwin';

// Create the main window
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Image Resizer',
    width: isDev ? 1000 : 500,
    Height: 600,
  });

  // Open devtools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // We don't need path to help here
  // mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
  mainWindow.loadFile('./renderer/index.html');

  // We can load a web page in the app
  // mainWindow.loadURL('https://meetxb.com');
}

// app is ready
app.whenReady().then(() => {
  createMainWindow();

  // Implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // When the app is activated, if there's no window, make sure we create the main window
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// menu template
const menu = [
  ...(isMac ? [] : []),
  {
    role: 'fileMenu',
  },
];

// Another way to setup the menu template
// const menu = [
//   {
//     label: 'File',
//     submenu: [
//       { label: 'Quit', click: () => app.quit(), accelerator: 'CmdOrCtrl+w' },
//     ],
//   },
// ];

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
