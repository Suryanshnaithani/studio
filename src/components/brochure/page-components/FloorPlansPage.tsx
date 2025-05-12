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
    <div className="floor-plan break-inside-avoid"> {/* Use column layout from CSS, avoid breaking */}
        <div className="plan-image">
        {plan.image && (
            <Image
            src={plan.image}
            alt={`${plan.name} Floor Plan`}
            width={340} // Guide width
            height={302} // Guide height
            className="w-full h-auto max-h-[120mm] object-contain border border-gray-300 rounded-[2mm]" // Use contain, limit height
            data-ai-hint="architectural floor plan layout" // Updated hint
            />
        )}
        </div>
        <div className="plan-details">
        <h4>{plan.name}</h4>
        <p><strong>Area:</strong> {plan.area}</p>
        {features && features.length > 0 && (
            <>
                <p><strong>Features:</strong></p>
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
  // Note: Current setup puts all on one page. For multi-page, logic would need adjustment.
  const floorPlans = data.floorPlans?.filter(fp => fp.name && fp.area) || []; // Filter out potentially empty plans

  if (floorPlans.length === 0) {
    return null; // Don't render page if no valid floor plans
  }

  return (
    <PageWrapper className="page-light-bg" id="floor-plans-page">
      <div className="page-content">
        <div className="section-title">{data.floorPlansTitle}</div>
        <div className="floor-plans-container">
          {floorPlans.map((plan) => <FloorPlanItem key={plan.id || plan.name} plan={plan} />)}
        </div>
        <p className="plans-disclaimer">{data.floorPlansDisclaimer}</p>
      </div>
    </PageWrapper>
  );
};
