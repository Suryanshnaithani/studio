
'use client';

import React from 'react';
import type { BrochureData } from '@/components/brochure/data-schema';
import type { BrochureStructure } from '@/app/page'; // Import the type
import { CoverPage } from './page-components/CoverPage';
import { IntroPage } from './page-components/IntroPage';
import { DeveloperPage } from './page-components/DeveloperPage';
import { LocationPage } from './page-components/LocationPage';
import { ConnectivityPage } from './page-components/ConnectivityPage';
import { AmenitiesIntroPage } from './page-components/AmenitiesIntroPage';
import { AmenitiesListPage } from './page-components/AmenitiesListPage';
import { AmenitiesGridPage } from './page-components/AmenitiesGridPage';
import { SpecificationsPage } from './page-components/SpecificationsPage';
import { MasterPlanPage } from './page-components/MasterPlanPage';
import { FloorPlansPage } from './page-components/FloorPlansPage';
import { BackCoverPage } from './page-components/BackCoverPage';
import { cn } from '@/lib/utils';

interface BrochurePreviewProps {
  data: BrochureData;
  themeClass: string;
  structure: BrochureStructure;
}

export const BrochurePreview: React.FC<BrochurePreviewProps> = ({ data, themeClass, structure }) => {
  
  const renderStandardStructure = (): (React.ReactNode | null)[] => [
    CoverPage({ data }), // Directly call, they return ReactNode or null
    IntroPage({ data }),
    DeveloperPage({ data }),
    LocationPage({ data }),
    ConnectivityPage({ data }),
    AmenitiesIntroPage({ data }),
    AmenitiesListPage({ data }),
    AmenitiesGridPage({ data }), // This can return an array or null
    SpecificationsPage({ data }),
    MasterPlanPage({ data }),
    FloorPlansPage({ data }), // This can return an array or null
    BackCoverPage({ data }),
  ];

  let pageComponentsCandidate: (React.ReactNode | null)[];
  switch (structure) {
    case 'standard':
    default:
      pageComponentsCandidate = renderStandardStructure();
      break;
  }

  // Flatten and filter out null/undefined/empty fragments
  const validPages = pageComponentsCandidate
    .flat(Infinity) // Fully flatten in case some components return arrays of pages
    .filter(page => page !== null && page !== undefined && (React.isValidElement(page) ? (page.type !== React.Fragment || React.Children.count(page.props.children) > 0) : true) );


  if (validPages.length === 0) {
    return null; 
  }

  return (
    <div className={cn("printable-brochure", themeClass)} id="brochure-content">
      {validPages.map((page, index) => {
        if (React.isValidElement(page)) {
            // Ensure a unique key for each page.
            // The id prop from page components is good, fallback to index.
            const pageKey = (page.props as any)?.id ? `page-${(page.props as any).id}` : `page-${index}`;
            return React.cloneElement(page as React.ReactElement<any>, {
                 isLastPage: index === validPages.length - 1,
                 key: pageKey
            });
        }
        return page; // Should not happen if filtering is correct
      })}
    </div>
  );
};

  