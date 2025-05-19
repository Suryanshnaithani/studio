
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface SpecificationsPageProps {
  data: BrochureData;
}

export const SpecificationsPage: React.FC<SpecificationsPageProps> = ({ data }) => {
  const specsTitle = data.specsTitle?.trim();
  const specsImage = data.specsImage?.trim();
  const specsImageDisclaimer = data.specsImageDisclaimer?.trim();
  const specsWatermark = data.specsWatermark?.trim();

  const interiorItems = data.specsInterior?.map(item => item?.trim()).filter(Boolean);
  const buildingItems = data.specsBuilding?.map(item => item?.trim()).filter(Boolean);
  const hasInteriorItems = interiorItems && interiorItems.length > 0;
  const hasBuildingItems = buildingItems && buildingItems.length > 0;

  const hasCoreText = specsTitle || hasInteriorItems || hasBuildingItems;
  const hasCoreVisual = !!specsImage;

  // Core content: title OR interior/building specs OR main image.
  // Watermark and image disclaimer are secondary.
  if (!hasCoreText && !hasCoreVisual) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="specifications-page">
      <div className="page-content">
        {specsWatermark && (
           <Image
            src={specsWatermark}
            alt="Watermark"
            width={189}
            height={189}
            className="watermark"
            data-ai-hint="blueprint icon simple"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {specsTitle && <div className="section-title">{specsTitle}</div>}
        <div className="specs-container">
          {(specsImage || specsImageDisclaimer) && ( // Render image container if image OR disclaimer (disclaimer needs image area context)
            <div className="specs-image">
              {specsImage ? (
                 <figure className="relative">
                   <Image
                      src={specsImage}
                      alt="Interior Finish Example"
                      width={700}
                      height={500}
                      className="w-full h-auto max-h-[75mm] object-cover rounded-[1.5mm] border border-border"
                      data-ai-hint="luxury apartment detail marble"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   />
                    {specsImageDisclaimer && (
                       <figcaption className="map-disclaimer">
                         <p>{specsImageDisclaimer}</p>
                       </figcaption>
                    )}
                 </figure>
              ) : ( // Only render this placeholder if there's no image but there IS a disclaimer
                  specsImageDisclaimer &&
                  <div className="w-full min-h-[65mm] max-h-[75mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-border text-xs p-2 text-center">
                      <p className="map-disclaimer !static !bg-transparent !text-muted-foreground !p-0">{specsImageDisclaimer}</p>
                  </div>
              )}
            </div>
          )}
          {(hasInteriorItems || hasBuildingItems) && (
            <div className="specs-list">
              {hasInteriorItems && (
                  <>
                      <h3>Interior Specifications</h3>
                      <ul>
                      {interiorItems.map((item, index) => <li key={`int-${index}`}>{item}</li>)}
                      </ul>
                  </>
              )}
              {hasBuildingItems && (
                  <>
                      <h3>Building Features</h3>
                      <ul>
                      {buildingItems.map((item, index) => <li key={`bld-${index}`}>{item}</li>)}
                      </ul>
                  </>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
