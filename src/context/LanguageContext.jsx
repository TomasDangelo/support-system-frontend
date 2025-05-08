import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translationsES = {
  ticket: "Ticket",
  subject: "Asunto",
  message: "Descripción",
  status: "Estado",
  priority: "Prioridad",
  createdAt: "Creado el",
  logTitle: "Historial de cambios",
  noLogs: "No hay logs",
  newValue: "Nuevo valor",
  oldValue: "Valor previo",
  edit: "Editar",
  close: "Cerrar",
  archive: "Archivar",
  sortOldest: "Ordenar ascendentemente ↑",
  sortNewest: "Ordenar descendentemente ↓",
  closedBy: "Cerrado por",
  assignedTo: "Asignado a",
  note: "Nota: ",
  action: "Acciones",
  actions: {
    update_status: "Cambio de estado",
    update_priority: "Cambio de prioridad",
    update_content: "Modificación del contenido",
    update_assigned: "Cambio de asignación",
  },
  statuses: {
    open: "Abierto",
    closed: "Cerrado",
    in_progress: "En proceso",
  },
  priorities: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang] = useState('es'); //  expandir a 'en'

  const getTranslations = () => {
    switch (lang) {
      case 'es':
      default:
        return translationsES;
    }
  };

  return (
    <LanguageContext.Provider value={{ translations: getTranslations() }}>
      {children}
    </LanguageContext.Provider>
  );
};
