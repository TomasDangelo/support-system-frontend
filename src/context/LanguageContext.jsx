import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translationsES = {
  ticket: "Ticket",
  subject: "Asunto",
  message: "Mensaje",
  status: "Estado",
  priority: "Prioridad",
  createdAt: "Creado en",
  logTitle: "Historial de cambios",
  noLogs: "No hay logs",
  actions: {
    update_status: "Cambio de estado",
    update_priority: "Cambio de prioridad",
    update_content: "Modificación del contenido"
  },
  statuses: {
    open: "Abierto",
    closed: "Cerrado",
    in_progress: "En proceso",
    archived: "Archivado"
  },
  priorities: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang] = useState('es'); // podrías expandir a 'en', 'fr', etc.

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
