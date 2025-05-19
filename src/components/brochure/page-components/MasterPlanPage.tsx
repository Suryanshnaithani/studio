
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface MasterPlanPageProps {
  data: BrochureData;
}

export const MasterPlanPage: React.FC<MasterPlanPageProps> = ({ data }) => {
  const masterPlanTitle = data.masterPlanTitle?.trim();
  const masterPlanDesc1 = data.masterPlanDesc1?.trim();
  const masterPlanDesc2 = data.masterPlanDesc2?.trim();
  const masterPlanImage = data.masterPlanImage?.trim();
  const masterPlanImageDisclaimer = data.masterPlanImageDisclaimer?.trim();

  const hasCoreText = masterPlanTitle || masterPlanDesc1 || masterPlanDesc2;
  const hasCoreVisual = !!masterPlanImage;

  // Core content: title OR description paragraphs OR main master plan image.
  // Disclaimer alone is not enough.
  if (!hasCoreText && !hasCoreVisual) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="master-plan-page">
      <div className="page-content">
        {masterPlanTitle && <div className="section-title">{masterPlanTitle}</div>}
        {(masterPlanImage || masterPlanImageDisclaimer) && ( // Render image container if image OR disclaimer (disclaimer needs image area context)
          <div className="master-plan-image">
            {masterPlanImage ? (
               <figure className="relative">
                   <Image
                      src={masterPlanImage}
                      alt="Master Plan Layout"
                      width={700}
                      height={500}
                      className="w-full h-auto object-contain rounded-[1.5mm] border border-border max-h-[130mm]"
                      data-ai-hint="architectural site plan color legend"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   />
                   {masterPlanImageDisclaimer && (
                       <figcaption className="map-disclaimer">
                          <p>{masterPlanImageDisclaimer}</p>
                       </figcaption>
                   )}
               </figure>
            ) : ( // Only render this placeholder if there's no image but there IS a disclaimer
                masterPlanImageDisclaimer && 
                <div className="w-full min-h-[100mm] max-h-[130mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-border text-xs p-2 text-center">
                    <p className="map-disclaimer !static !bg-transparent !text-muted-foreground !p-0">{masterPlanImageDisclaimer}</p>
                </div>
            )}
          </div>
        )}
        {(masterPlanDesc1 || masterPlanDesc2) && (
          <div className="master-plan-text">
            {masterPlanDesc1 && <p>{masterPlanDesc1}</p>}
            {masterPlanDesc2 && <p>{masterPlanDesc2}</p>}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
