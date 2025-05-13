import React from 'react';
import Image from 'next/image';
import type { BrochureData, FloorPlanData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface FloorPlansPageProps {
  data: BrochureData;
}

const FloorPlanItem: React.FC<{ plan: FloorPlanData }> = ({ plan }) => {
   const features = plan.features?.filter(f => f?.trim());
   const hasContent = plan.name || plan.area || (features && features.length > 0) || plan.image;
   if (!hasContent) return null;

   return (
    <div className="floor-plan">
        <div className="plan-image">
        {plan.image && plan.image.trim() !== '' ? (
            <Image
            src={plan.image}
            alt={`${plan.name || 'Floor Plan'} Image`}
            width={300}
            height={250}
            className="w-full h-auto max-h-[90mm] object-contain border border-gray-300 rounded-[1.5mm]"
            data-ai-hint="architectural floor plan detailed"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        ) : (
             <div className="w-full h-[90mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-gray-300 text-xs p-2 text-center">
                {plan.name || "Floor Plan"}
            </div>
        )}
        </div>
        <div className="plan-details">
            {plan.name && <h4>{plan.name}</h4>}
            {plan.area && <p><strong>Area:</strong> {plan.area}</p>}
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
  const validFloorPlans = data.floorPlans?.filter(fp => fp.name || fp.area || (fp.features && fp.features.some(f => f?.trim())) || fp.image) || [];
  const hasTextContent = data.floorPlansTitle || data.floorPlansDisclaimer;
  const hasFloorPlans = validFloorPlans.length > 0;

  if (!hasTextContent && !hasFloorPlans) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="floor-plans-page">
      <div className="page-content">
        {data.floorPlansTitle && <div className="section-title">{data.floorPlansTitle}</div>}
        {hasFloorPlans && (
            <div className="floor-plans-container">
            {validFloorPlans.map((plan) => <FloorPlanItem key={plan.id || plan.name} plan={plan} />)}
            </div>
        )}
        {data.floorPlansDisclaimer && (
            <p className="plans-disclaimer">{data.floorPlansDisclaimer}</p>
        )}
      </div>
    </PageWrapper>
  );
};