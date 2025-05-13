import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface SpecificationsPageProps {
  data: BrochureData;
}

export const SpecificationsPage: React.FC<SpecificationsPageProps> = ({ data }) => {
  const interiorItems = data.specsInterior?.filter(item => item?.trim());
  const buildingItems = data.specsBuilding?.filter(item => item?.trim());
  const hasInteriorItems = interiorItems && interiorItems.length > 0;
  const hasBuildingItems = buildingItems && buildingItems.length > 0;

  const hasTextContent = data.specsTitle || hasInteriorItems || hasBuildingItems;
  const hasVisualContent = !!data.specsImage || !!data.specsWatermark;
  const hasDisclaimer = !!data.specsImageDisclaimer;

  if (!hasTextContent && !hasVisualContent && !hasDisclaimer) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="specifications-page">
      <div className="page-content">
        {data.specsWatermark && data.specsWatermark.trim() !== '' && (
           <Image
            src={data.specsWatermark}
            alt="Watermark"
            width={189}
            height={189}
            className="watermark"
            data-ai-hint="blueprint icon simple"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {data.specsTitle && <div className="section-title">{data.specsTitle}</div>}
        <div className="specs-container">
          {(data.specsImage || data.specsImageDisclaimer) && (
            <div className="specs-image">
              {data.specsImage && data.specsImage.trim() !== '' ? (
                 <figure className="relative">
                   <Image
                      src={data.specsImage}
                      alt="Interior Finish Example"
                      width={700}
                      height={500}
                      className="w-full h-auto max-h-[90mm] object-cover rounded-[1.5mm]"
                      data-ai-hint="luxury apartment detail marble"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   />
                    {data.specsImageDisclaimer && (
                       <figcaption className="map-disclaimer">
                         <p>{data.specsImageDisclaimer}</p>
                       </figcaption>
                    )}
                 </figure>
              ) : (
                   <div className="w-full h-[90mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] text-xs p-2 text-center">
                      {data.specsImageDisclaimer ? data.specsImageDisclaimer : "Specifications Image Area"}
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