import React from 'react';
import Image from 'next/image';
import type { BrochureData, FloorPlanData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface FloorPlansPageProps {
  data: BrochureData;
}

const FloorPlanItem: React.FC<{ plan: FloorPlanData }> = ({ plan }) => {
   const features = plan.features?.filter(f => f?.trim());
   return (
    <div className="floor-plan">
        <div className="plan-image">
        {plan.image && plan.image.trim() !== '' ? (
            <Image
            src={plan.image}
            alt={`${plan.name} Floor Plan`}
            width={300} 
            height={250} 
            className="w-full h-auto max-h-[90mm] object-contain border border-gray-300 rounded-[1.5mm]"
            data-ai-hint="architectural floor plan detailed"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        ) : (
             <div className="w-full h-[90mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-gray-300 text-xs p-2 text-center">
                {plan.name} Plan
            </div>
        )}
        </div>
        <div className="plan-details">
            <h4>{plan.name}</h4>
            <p><strong>Area:</strong> {plan.area}</p>
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
  const floorPlans = data.floorPlans?.filter(fp => fp.name && fp.area) || [];

  if (floorPlans.length === 0) {
    return null; 
  }

  return (
    <PageWrapper className="page-light-bg" id="floor-plans-page">
      <div className="page-content">
        <div className="section-title">{data.floorPlansTitle}</div>
        <div className="floor-plans-container">
          {floorPlans.map((plan) => <FloorPlanItem key={plan.id || plan.name} plan={plan} />)}
        </div>
        {data.floorPlansDisclaimer && (
            <p className="plans-disclaimer">{data.floorPlansDisclaimer}</p>
        )}
      </div>
    </PageWrapper>
  );
};
