
import React from 'react';
import Image from 'next/image';
import type { BrochureData, FloorPlanData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface FloorPlansPageProps {
  data: BrochureData;
}

const FloorPlanItem: React.FC<{ plan: FloorPlanData }> = ({ plan }) => {
   const name = plan.name?.trim();
   const area = plan.area?.trim();
   const image = plan.image?.trim();
   const features = plan.features?.map(f => f?.trim()).filter(Boolean);
   
   const hasContent = name || area || image || (features && features.length > 0);
   if (!hasContent) return null;

   return (
    <div className="floor-plan">
        <div className="plan-image">
        {image ? (
            <Image
            src={image}
            alt={`${name || 'Floor Plan'} Image`}
            width={300}
            height={250}
            className="w-full h-auto max-h-[90mm] object-contain border border-gray-300 rounded-[1.5mm]"
            data-ai-hint="architectural floor plan detailed"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        ) : (
             <div className="w-full h-[90mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-gray-300 text-xs p-2 text-center">
                {name || "Floor Plan"}
            </div>
        )}
        </div>
        <div className="plan-details">
            {name && <h4>{name}</h4>}
            {area && <p><strong>Area:</strong> {area}</p>}
            {features && features.length > 0 && (
                <>
                    <p className="mt-2 mb-1"><strong>Features:</strong></p>
                    <ul>
                        {features.map((feature, index) => <li key={index}>{feature}</li>)}
                    </ul>
                </>
            )}
        </div>
    </div>
   );
};

export const FloorPlansPage: React.FC<FloorPlansPageProps> = ({ data }) => {
  const floorPlansTitle = data.floorPlansTitle?.trim();
  const floorPlansDisclaimer = data.floorPlansDisclaimer?.trim();

  const validFloorPlans = data.floorPlans?.filter(fp => 
    fp.name?.trim() || 
    fp.area?.trim() || 
    fp.image?.trim() ||
    (fp.features && fp.features.some(f => f?.trim()))
  ) || [];
  
  const hasTextContent = floorPlansTitle || floorPlansDisclaimer;
  const hasFloorPlans = validFloorPlans.length > 0;

  if (!hasTextContent && !hasFloorPlans) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="floor-plans-page">
      <div className="page-content">
        {floorPlansTitle && <div className="section-title">{floorPlansTitle}</div>}
        {hasFloorPlans && (
            <div className="floor-plans-container">
            {validFloorPlans.map((plan) => <FloorPlanItem key={plan.id || plan.name} plan={plan} />)}
            </div>
        )}
        {floorPlansDisclaimer && (
            <p className="plans-disclaimer">{floorPlansDisclaimer}</p>
        )}
      </div>
    </PageWrapper>
  );
};
