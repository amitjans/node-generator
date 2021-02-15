const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const modelwriter = require('./codegen/legacy/model');
const routewriter = require('./codegen/legacy/routes');
const ctrlwriter = require('./codegen/legacy/controller');

if (process.env.NODE_DEV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow, modelWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/index.html"),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
})

function createNewModelWindow() {
    modelWindow = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    //modelWindow.setMenu(null);
    modelWindow.loadURL(url.format({
        pathname: path.join(__dirname, "views/new-model.html"),
        protocol: 'file',
        slashes: true
    }))
    modelWindow.on('closed', () => {
        modelWindow = null;
    })
}

ipcMain.on('model:new', (e, obj) => {
    mainWindow.webContents.send('model:new', obj);
    console.log(obj);
    modelwriter.model(obj, false);
    routewriter.routes(obj);
    ctrlwriter.controller(obj);
    modelWindow.close();
})

const templateMenu = [
    {
        label: 'Opciones',
        submenu: [
            {
                label: 'Nuevo Modelo',
                accelerator: 'Ctrl+N',
                click() {
                    createNewModelWindow();
                }
            },
            {
                label: 'Eliminar modelos',
                click() {
                    mainWindow.webContents.send('products:remove-all')
                }
            },
            {
                label: 'Salir',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    })

}

if (process.env.NODE_DEV !== 'production') {
    templateMenu.push({
        label: 'Desarrollo',
        submenu: [
            {
                label: 'Mostrar/Ocultar Herramientas de Desarrollo',
                accelerator: 'Ctrl+D',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            }, {
                label: 'Actualizar',
                role: 'reload'
            }
        ]
    })
}