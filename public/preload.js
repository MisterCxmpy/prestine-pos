const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  insertTicket: (args) => ipcRenderer.invoke('insert-ticket', args),
  getAllTickets: (args) => ipcRenderer.invoke('get-all-tickets', args),
  checkTicketNumberExists: (args) => ipcRenderer.invoke('check-ticket-number-exists', args),
  getTicketByPhone: (args) => ipcRenderer.invoke('get-ticket-by-phone', args),
  getRecentTickets: (args) => ipcRenderer.invoke("get-recent-tickets", args),
  setTicketToComplete: (args) => ipcRenderer.invoke("set-ticket-to-complete", args),
  getTodaysData: (args) => ipcRenderer.invoke("get-todays-data", args),
  deleteTicketById: (args) => ipcRenderer.invoke("delete-ticket-by-id", args),

  insertUser: (args) => ipcRenderer.invoke('insert-user', args),
  getUserByPhone: (args) => ipcRenderer.invoke('get-user-by-phone', args),
  updateUserTickets: (args) => ipcRenderer.invoke('update-user-tickets', args),
  getAllUsers: (args) => ipcRenderer.invoke('get-all-users', args),
  updateUser: (args) => ipcRenderer.invoke('update-user', args),
  deleteUserById: (args) => ipcRenderer.invoke("delete-user-by-id", args),

  getTodaysPerformance: (args) => ipcRenderer.invoke('get-performance-today', args),
  getAllPerformance: (args) => ipcRenderer.invoke('get-all-performance', args),
  updatePerformance: (args) => ipcRenderer.invoke('update-performance', args),
  createNewDay: (args) => ipcRenderer.invoke('create-new-day', args),

  addItem: (args) => ipcRenderer.invoke('add-item', args),
  deleteItem: (args) => ipcRenderer.invoke('delete-item', args),
  getAllServices: (args) => ipcRenderer.invoke('get-all-services', args)
});