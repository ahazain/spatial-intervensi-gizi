import React from 'react';
import { Activity } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Activity className="text-teal-600 mr-2" />
      <div className="flex flex-col">
        <span className="font-bold text-teal-700 leading-none">SIG Gizi</span>
        <span className="text-[10px] text-teal-600 leading-none">Kota Surabaya</span>
      </div>
    </div>
  );
};

export default Logo;