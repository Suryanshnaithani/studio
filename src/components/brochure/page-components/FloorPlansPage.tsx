
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

const ITEMS_PER_FLOOR_PLAN_PAGE = 3; // Adjusted to 3 floor plans per page

export const FloorPlansPage: React.FC<FloorPlansPageProps> = ({ data }) => {
  const floorPlansTitle = data.floorPlansTitle?.trim();
  const floorPlansDisclaimer = data.floorPlansDisclaimer?.trim();

  const validFloorPlans = data.floorPlans?.filter(fp => 
    fp.name?.trim() || 
    fp.area?.trim() || 
    fp.image?.trim() ||
    (fp.features && fp.features.some(f => f?.trim()))
  ) || [];
  
  const hasFloorPlans = validFloorPlans.length > 0;
  const hasTitle = !!floorPlansTitle;
  const hasDisclaimer = !!floorPlansDisclaimer;

  if (!hasTitle && !hasFloorPlans && !hasDisclaimer) {
    return null;
  }

  const pages = [];

  if (hasFloorPlans) {
    const numPlanPages = Math.ceil(validFloorPlans.length / ITEMS_PER_FLOOR_PLAN_PAGE);

    for (let i = 0; i < numPlanPages; i++) {
      const startIndex = i * ITEMS_PER_FLOOR_PLAN_PAGE;
      const endIndex = startIndex + ITEMS_PER_FLOOR_PLAN_PAGE;
      const pagePlans = validFloorPlans.slice(startIndex, endIndex);

      pages.push(
        <PageWrapper key={`fp-page-${i}`} className="page-light-bg" id={`floor-plans-page-${i}`}>
          <div className="page-content">
            {i === 0 && hasTitle && <div className="section-title">{floorPlansTitle}</div>}
            <div className="floor-plans-container"> {/* Container for current page's plans */}
              {pagePlans.map((plan) => <FloorPlanItem key={plan.id || plan.name} plan={plan} />)}
            </div>
            {i === numPlanPages - 1 && hasDisclaimer && (
              <p className="plans-disclaimer">{floorPlansDisclaimer}</p>
            )}
          </div>
        </PageWrapper>
      );
    }
  } else if (hasTitle || hasDisclaimer) {
    // Render a single page if only title/disclaimer is present, but no plans
    pages.push(
      <PageWrapper key="fp-page-static" className="page-light-bg" id="floor-plans-page-static">
        <div className="page-content">
          {hasTitle && <div className="section-title">{floorPlansTitle}</div>}
          {!hasFloorPlans && hasTitle && <p className="text-center text-muted-foreground italic my-4">Detailed floor plans are available upon request.</p>}
          {hasDisclaimer && <p className="plans-disclaimer">{floorPlansDisclaimer}</p>}
        </div>
      </PageWrapper>
    );
  }
  
  return pages.length > 0 ? <>{pages}</> : null;
};
