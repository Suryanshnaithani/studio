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
          {data.masterPlanImage ? (
             <figure className="relative">
                 <Image
                    src={data.masterPlanImage}
                    alt="Master Plan Layout"
                    width={700} // Guide width
                    height={500} // Guide height
                    className="w-full h-auto object-contain rounded-[2mm] border border-gray-200 max-h-[160mm]"
                    data-ai-hint="architectural site plan color legend"
                 />
                 {data.masterPlanImageDisclaimer && (
                     <figcaption className="map-disclaimer absolute bottom-1 right-1 text-black bg-white/70">
                        <p>{data.masterPlanImageDisclaimer}</p>
                     </figcaption>
                 )}
             </figure>
          ) : (
               <div className="w-full h-[160mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[2mm] border border-gray-200">
                    Master Plan Placeholder
               </div>
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
