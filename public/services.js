const { ipcMain } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const isDev = require("electron-is-dev");
const path = require("path");
const fs = require('fs');

ipcMain.handle('get-all-services', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(prestineFolderPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  return services.services;
});

ipcMain.handle('add-item', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(prestineFolderPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  services.services[args.category] = [...services.services[args.category], args.item];

  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

  return { success: true };
});

ipcMain.handle('delete-item', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(prestineFolderPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  const itemId = args.itemId;

  for (const category in services.services) {
    const categoryItems = services.services[category];
    
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      categoryItems.splice(itemIndex, 1);
      fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
      return { success: true };
    }
  }

  return { success: false, error: 'Item not found' };
});
