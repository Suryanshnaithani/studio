import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface MasterPlanPageProps {
  data: BrochureData;
}

export const MasterPlanPage: React.FC<MasterPlanPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="master-plan-page">
      <div className="page-content">
        <div className="section-title">{data.masterPlanTitle}</div>
        <div className="master-plan-image">
          {data.masterPlanImage && (
            <Image
              src={data.masterPlanImage}
              alt="Master Plan"
              width={643} // width of content area (210mm - 40mm)
              height={567} // 150mm
              className="w-full h-full object-contain rounded-[2mm]"
              data-ai-hint="architectural site layout"
            />
          )}
           {/* Position disclaimer relative to the image container */}
           <div className="absolute bottom-1 right-1 map-disclaimer">
             <p>{data.masterPlanImageDisclaimer}</p>
           </div>
        </div>
        <div className="master-plan-text">
          <p>{data.masterPlanDesc1}</p>
          <p>{data.masterPlanDesc2}</p>
        </div>
      </div>
    </PageWrapper>
  );
};