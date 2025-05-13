'use client';

import React from 'react';
import type { BrochureData } from '@/components/brochure/data-schema';
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
}

export const BrochurePreview: React.FC<BrochurePreviewProps> = ({ data, themeClass }) => {
  return (
    <div className={cn("printable-brochure", themeClass)} id="brochure-content">
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
    </div>
  );
};