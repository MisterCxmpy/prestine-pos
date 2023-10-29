const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  insertTicket: (args) => ipcRenderer.invoke('insert-ticket', args),
  getAllTickets: (args) => ipcRenderer.invoke('get-all-tickets', args),
  checkTicketNumberExists: (args) => ipcRenderer.invoke('check-ticket-number-exists', args),
  getTicketByPhone: (args) => ipcRenderer.invoke('get-ticket-by-phone', args),
  getRecentTickets: (args) => ipcRenderer.invoke("get-recent-tickets", args),
  setTicketToComplete: (args) => ipcRenderer.invoke("set-ticket-to-complete", args),

  insertUser: (args) => ipcRenderer.invoke('insert-user', args),
  getUserByPhone: (args) => ipcRenderer.invoke('get-user-by-phone', args),
  updateUserTickets: (args) => ipcRenderer.invoke('update-user-tickets', args),
  getAllUsers: (args) => ipcRenderer.invoke('get-all-users', args),
});