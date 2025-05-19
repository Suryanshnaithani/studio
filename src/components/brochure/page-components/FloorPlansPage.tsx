
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
            className="w-full h-auto max-h-[75mm] object-contain border border-border rounded-[1.5mm]"
            data-ai-hint="architectural floor plan detailed"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        ) : (
             <div className="w-full min-h-[70mm] max-h-[75mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-border text-xs p-2 text-center">
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

const ITEMS_PER_FLOOR_PLAN_PAGE = 3; 

export const FloorPlansPage: React.FC<FloorPlansPageProps> = ({ data }) => {
  const floorPlansTitle = data.floorPlansTitle?.trim();
  const floorPlansDisclaimer = data.floorPlansDisclaimer?.trim();

  const validFloorPlans = data.floorPlans?.filter(fp => 
    fp.name?.trim() || 
    fp.area?.trim() || 
    fp.image?.trim() ||
    (fp.features && fp.features.some(f => f?.trim()))
  ) || [];
  
  // Core content for the section: title OR actual floor plans. Disclaimer alone is not enough.
  const hasCoreContentForSection = !!floorPlansTitle || validFloorPlans.length > 0;
  if (!hasCoreContentForSection) {
    return null;
  }

  const pages = [];

  if (validFloorPlans.length > 0) {
    const numPlanPages = Math.ceil(validFloorPlans.length / ITEMS_PER_FLOOR_PLAN_PAGE);

    for (let i = 0; i < numPlanPages; i++) {
      const startIndex = i * ITEMS_PER_FLOOR_PLAN_PAGE;
      const endIndex = startIndex + ITEMS_PER_FLOOR_PLAN_PAGE;
      const pagePlans = validFloorPlans.slice(startIndex, endIndex);

      pages.push(
        <PageWrapper key={`fp-page-${i}`} className="page-light-bg" id={`floor-plans-page-${i}`}>
          <div className="page-content">
            {i === 0 && floorPlansTitle && <div className="section-title">{floorPlansTitle}</div>}
            <div className="floor-plans-container"> 
              {pagePlans.map((plan) => <FloorPlanItem key={plan.id || plan.name} plan={plan} />)}
            </div>
            {i === numPlanPages - 1 && floorPlansDisclaimer && (
              <p className="plans-disclaimer">{floorPlansDisclaimer}</p>
            )}
          </div>
        </PageWrapper>
      );
    }
  } else if (floorPlansTitle) { // Only render this static page if there's a title (and no plans)
    pages.push(
      <PageWrapper key="fp-page-static" className="page-light-bg" id="floor-plans-page-static">
        <div className="page-content">
          {floorPlansTitle && <div className="section-title">{floorPlansTitle}</div>}
          <p className="text-center text-muted-foreground italic my-4">Detailed floor plans are available upon request.</p>
          {floorPlansDisclaimer && <p className="plans-disclaimer">{floorPlansDisclaimer}</p>}
        </div>
      </PageWrapper>
    );
  }
  
  return pages.length > 0 ? <>{pages}</> : null;
};
