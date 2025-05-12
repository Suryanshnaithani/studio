import React from 'react';
import Image from 'next/image';
import type { BrochureData, FloorPlanData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface FloorPlansPageProps {
  data: BrochureData;
}

const FloorPlanItem: React.FC<{ plan: FloorPlanData }> = ({ plan }) => (
  <div className="floor-plan">
    <div className="plan-image">
       {plan.image && (
        <Image
          src={plan.image}
          alt={`${plan.name} Floor Plan`}
          width={340} // approx 1.2 / 2 * (210mm - 40mm - 10mm)
          height={302} // 80mm
          className="w-full h-full object-contain border border-gray-300 rounded-[2mm]"
          data-ai-hint="architectural floor plan" // Consistent hint
        />
      )}
    </div>
    <div className="plan-details">
      <h4>{plan.name}</h4>
      <p><strong>Area:</strong> {plan.area}</p>
      <p><strong>Features:</strong></p>
      <ul>
        {plan.features?.map((feature, index) => <li key={index}>{feature}</li>)}
      </ul>
    </div>
  </div>
);


export const FloorPlansPage: React.FC<FloorPlansPageProps> = ({ data }) => {
  // Split floor plans into groups of 3 for potentially multiple pages if needed
  // Note: Current setup puts all on one page. For multi-page, logic would need adjustment.
  const floorPlans = data.floorPlans || [];

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