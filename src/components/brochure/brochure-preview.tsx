
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
  structure: BrochureStructure; // Keep for potential future flexibility, but will default to 'standard'
}

export const BrochurePreview: React.FC<BrochurePreviewProps> = ({ data, themeClass, structure }) => {
  
  // For now, we'll only use the standard structure.
  // The switch can be expanded later if more structures are added.
  const renderStandardStructure = () => (
    <>
      <CoverPage data={data} />
      <IntroPage data={data} />
      <DeveloperPage data={data} />
      <LocationPage data={data} />
      <ConnectivityPage data={data} />
      <AmenitiesIntroPage data={data} />
      <AmenitiesListPage data={data} />
      <AmenitiesGridPage data={data} />
      <SpecificationsPage data={data} />
      <MasterPlanPage data={data} />
      <FloorPlansPage data={data} />
      <BackCoverPage data={data} />
    </>
  );

  let content;
  // Currently, only 'standard' structure is effectively used.
  // This switch is kept for potential future expansion.
  switch (structure) {
    // case 'compact':
    //   content = renderCompactStructure(); // Example for future
    //   break;
    // case 'visual':
    //   content = renderVisualStructure(); // Example for future
    //   break;
    case 'standard':
    default:
      content = renderStandardStructure();
      break;
  }

  return (
    <div className={cn("printable-brochure", themeClass)} id="brochure-content">
      {content}
    </div>
  );
};

    