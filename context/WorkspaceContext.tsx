"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WorkspaceContextProps {
  workspace: { id: string; name: string } | null;
  setWorkspace: (workspace: { id: string; name: string } | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<{ id: string; name: string } | null>(null);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};