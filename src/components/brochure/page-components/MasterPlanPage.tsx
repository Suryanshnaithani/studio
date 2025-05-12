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
             <figure className="relative"> {/* Wrap image and disclaimer */}
                 <Image
                    src={data.masterPlanImage}
                    alt="Master Plan Layout" // More descriptive alt text
                    width={643} // Guide width
                    height={567} // Guide height
                    className="w-full h-auto object-contain rounded-[2mm] border border-gray-200" // Use contain, let height be auto
                    data-ai-hint="architectural site layout plan" // Updated hint
                 />
                 {/* Position disclaimer relative to the figure */}
                 <figcaption className="map-disclaimer absolute bottom-1 right-1">
                    <p>{data.masterPlanImageDisclaimer}</p>
                 </figcaption>
             </figure>
          )}
        </div>
        <div className="master-plan-text">
          <p>{data.masterPlanDesc1}</p>
          <p>{data.masterPlanDesc2}</p>
        </div>
      </div>
    </PageWrapper>
  );
};
