import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  backLinkText?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backLink,
  backLinkText = 'Back',
  actions,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          {backLink && (
            <Link
              to={backLink}
              className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mb-2"
            >
              <ArrowLeft size={16} className="mr-1" />
              {backLinkText}
            </Link>
          )}
          <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl sm:truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="mt-4 flex md:mt-0 md:ml-4">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;