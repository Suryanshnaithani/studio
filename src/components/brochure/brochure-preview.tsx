
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
    <CoverPage key="cover" data={data} />,
    <IntroPage key="intro" data={data} />,
    <DeveloperPage key="developer" data={data} />,
    <LocationPage key="location" data={data} />,
    <ConnectivityPage key="connectivity" data={data} />,
    <AmenitiesIntroPage key="amenities-intro" data={data} />,
    <AmenitiesListPage key="amenities-list" data={data} />,
    // AmenitiesGridPage and FloorPlansPage can return arrays of pages
    ...(Array.isArray(AmenitiesGridPage({ data })) ? AmenitiesGridPage({ data }) : [AmenitiesGridPage({ data })]),
    <SpecificationsPage key="specifications" data={data} />,
    <MasterPlanPage key="master-plan" data={data} />,
    ...(Array.isArray(FloorPlansPage({ data })) ? FloorPlansPage({ data }) : [FloorPlansPage({ data })]),
    <BackCoverPage key="back-cover" data={data} />,
  ];

  let pageComponentsCandidate: (React.ReactNode | null)[];
  switch (structure) {
    case 'standard':
    default:
      pageComponentsCandidate = renderStandardStructure();
      break;
  }

  const validPages = pageComponentsCandidate.flat().filter(page => page !== null && page !== undefined);

  if (validPages.length === 0) {
    return null; 
  }

  return (
    <div className={cn("printable-brochure", themeClass)} id="brochure-content">
      {validPages.map((page, index) => {
        // Check if the page is a valid React element and if it's a PageWrapper or a Fragment containing PageWrappers
        if (React.isValidElement(page)) {
          if (page.type === React.Fragment) {
            // If it's a fragment, we need to clone its children if they are PageWrappers
            // This scenario is less likely with the current flat().filter() but good for robustness
             return React.cloneElement(page, {
              key: `frag-${index}`,
              children: React.Children.map(page.props.children, (child, childIndex) => 
                React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).displayName?.includes('PageWrapper')
                  ? React.cloneElement(child, { isLastPage: index === validPages.length - 1 && childIndex === React.Children.count(page.props.children) - 1 })
                  : child
              )
            });
          } else if (typeof page.type !== 'string' && (page.type as any).displayName?.includes('PageWrapper')) {
             // If it's a PageWrapper directly
            return React.cloneElement(page as React.ReactElement<any>, { isLastPage: index === validPages.length - 1 });
          }
        }
        // Fallback for pages that might not be direct PageWrapper (e.g. from AmenitiesGridPage which returns PageWrappers)
        // This assumes the top-level elements in validPages are the ones we want to mark as last.
        // If a component in validPages itself renders multiple PageWrappers, those internal ones won't be marked here.
        // However, AmenitiesGridPage/FloorPlansPage are designed to return PageWrapper instances directly or in an array.
        return page; 
      })}
    </div>
  );
};
