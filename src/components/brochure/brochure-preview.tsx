
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
    <AmenitiesGridPage key="amenities-grid" data={data} />,
    <SpecificationsPage key="specifications" data={data} />,
    <MasterPlanPage key="master-plan" data={data} />,
    <FloorPlansPage key="floor-plans" data={data} />,
    <BackCoverPage key="back-cover" data={data} />,
  ];

  let pageComponents: (React.ReactNode | null)[];
  switch (structure) {
    case 'standard':
    default:
      pageComponents = renderStandardStructure();
      break;
  }

  const validPages = pageComponents.filter(page => page !== null && page !== undefined);

  if (validPages.length === 0) {
    return null; // If all pages are empty, render nothing for the brochure itself
  }

  return (
    <div className={cn("printable-brochure", themeClass)} id="brochure-content">
      {validPages}
    </div>
  );
};
