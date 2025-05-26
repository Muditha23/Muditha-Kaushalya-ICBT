import React, { ReactNode } from 'react';

interface SettingItemProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-4 pb-4 border-b border-gray-800">
      <div className="mb-2">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

export default SettingItem;