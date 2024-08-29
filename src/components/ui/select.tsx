import React, { useState } from 'react';

// Componente Select
export const Select: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="select">{children}</div>;
};

// Componente SelectTrigger
export const SelectTrigger: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => {
  return (
    <div className="select-trigger" onClick={onClick}>
      {children}
    </div>
  );
};

// Componente SelectValue
export const SelectValue: React.FC<{ value: string }> = ({ value }) => {
  return <div className="select-value">{value}</div>;
};

// Componente SelectContent
export const SelectContent: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
  return isOpen ? <div className="select-content">{children}</div> : null;
};

// Componente SelectItem
export const SelectItem: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => {
  return (
    <div className="select-item" onClick={onClick}>
      {children}
    </div>
  );
};
