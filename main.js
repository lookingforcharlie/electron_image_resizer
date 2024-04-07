const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');

const gitTester = 'April 7, 00:06';

const isDev = process.env.NODE_ENV !== 'production';
// This is true if you are on Mac
const isMac = process.platform === 'darwin';

let mainWindow;
// Create the main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Image Resizer',
    width: isDev ? 1000 : 500,
    Height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
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

// Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: 'About Image Resizer',
    width: 300,
    Height: 300,
  });

  // We don't need path to help here
  // mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
  aboutWindow.loadFile('./renderer/about.html');
}

// app is ready
app.whenReady().then(() => {
  createMainWindow();

  // Implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove mainWindow from memory on close
  mainWindow.on('close', () => (mainMenu = null));

  // When the app is activated, if there's no window, make sure we create the main window
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: () => createAboutWindow(),
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },

  // if it's not Mac or on Windows
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: () => createAboutWindow(),
            },
          ],
        },
      ]
    : []),
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

// Respond to ipcRenderer resize
ipcMain.on('image:resize', (event, options) => {
  options.dest = path.join(os.homedir(), 'imageresizer');
  resizeImage(options);
  console.log(options);
});

// Resize the image
// resizeImg() returns a promise
//
async function resizeImage({ imgPath, width, height, dest }) {
  try {
    const NewImage = await resizeImg(fs.readFileSync(imgPath), {
      width: +width, // width comes in as a string, converting it into a number
      height: +height, // same as width
    });

    // Create file name
    const filename = path.basename(imgPath);

    // Create destination folder if not exists
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write file to destination
    fs.writeFileSync(path.join(dest, filename), NewImage);

    // Send success message to render
    mainWindow.webContents.send('image:done');

    // Open dest folder, so user can see the image
    shell.openPath(dest);
  } catch (error) {}
}

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
