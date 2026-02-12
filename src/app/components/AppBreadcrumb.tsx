import React from 'react';
import { useLocation, Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';

export function AppBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on the landing page (root /)
  if (pathnames.length === 0) {
    return null;
  }

  // Define the root of the app breadcrumb
  const root = { label: 'Dashboard', path: '/dashboard' };

  // Filter out 'dashboard' from pathnames if it's the first segment, 
  // because we treat it as root.
  const displayPathnames = pathnames[0] === 'dashboard' 
    ? pathnames.slice(1) 
    : pathnames;

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {/* Root Item */}
        <BreadcrumbItem>
          {displayPathnames.length === 0 ? (
             <BreadcrumbPage className="font-medium text-emerald-700">{root.label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={root.path} className="text-slate-500 hover:text-emerald-700 transition-colors">{root.label}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Path Items */}
        {displayPathnames.map((value, index) => {
          // Calculate path to this item
          const originalIndex = pathnames.indexOf(value);
          const to = `/${pathnames.slice(0, originalIndex + 1).join('/')}`;

          const isLast = index === displayPathnames.length - 1;
          
          let formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
          
          // Special handling for "Order Details"
          if (value.match(/^(ORD-|[0-9])/)) {
              formattedValue = "Order Details"; // Or specific ID if preferred
          }

          return [
              <BreadcrumbSeparator key={`${to}-sep`} className="text-slate-400" />,
              <BreadcrumbItem key={`${to}-item`}>
                {isLast ? (
                  <BreadcrumbPage className="font-medium text-emerald-700">{formattedValue}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={to} className="text-slate-500 hover:text-emerald-700 transition-colors">{formattedValue}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}