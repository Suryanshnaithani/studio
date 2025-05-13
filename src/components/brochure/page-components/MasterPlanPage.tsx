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
          {data.masterPlanImage && data.masterPlanImage.trim() !== '' ? (
             <figure className="relative">
                 <Image
                    src={data.masterPlanImage}
                    alt="Master Plan Layout"
                    width={700} 
                    height={500} 
                    className="w-full h-auto object-contain rounded-[1.5mm] border border-gray-200 max-h-[150mm]"
                    data-ai-hint="architectural site plan color legend"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 {data.masterPlanImageDisclaimer && (
                     <figcaption className="map-disclaimer">
                        <p>{data.masterPlanImageDisclaimer}</p>
                     </figcaption>
                 )}
             </figure>
          ) : (
               <div className="w-full h-[150mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-gray-200 text-xs p-2 text-center">
                    Master Plan Image
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
