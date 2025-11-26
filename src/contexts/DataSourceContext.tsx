/**
 * 🔄 DATA SOURCE CONTEXT
 * Context global para controlar MOCK vs API REAL
 * Facilita desenvolvimento e testes
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

type DataSource = 'mock' | 'api';

interface DataSourceContextType {
  dataSource: DataSource;
  toggleDataSource: () => void;
  isMockMode: boolean;
}

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export const DataSourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Lê do .env - se VITE_USE_MOCK_DATA=false, usa API real
  const initialMode = import.meta.env.VITE_USE_MOCK_DATA === 'false' ? 'api' : 'mock';
  const [dataSource, setDataSource] = useState<DataSource>(initialMode);

  const toggleDataSource = () => {
    setDataSource(prev => prev === 'mock' ? 'api' : 'mock');
  };

  const isMockMode = dataSource === 'mock';

  return (
    <DataSourceContext.Provider value={{ dataSource, toggleDataSource, isMockMode }}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (context === undefined) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};
