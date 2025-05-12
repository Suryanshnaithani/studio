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

  return (
    <PageWrapper className="page-light-bg" id="specifications-page">
      <div className="page-content">
        {data.specsWatermark && (
           <Image
            src={data.specsWatermark}
            alt="Watermark"
            width={189} // 50mm
            height={189} // 50mm
            className="watermark"
            data-ai-hint="blueprint icon simple"
          />
        )}
        <div className="section-title">{data.specsTitle}</div>
        <div className="specs-container">
          <div className="specs-image">
            {data.specsImage ? (
               <figure className="relative">
                 <Image
                    src={data.specsImage}
                    alt="Interior Finish Example"
                    width={700} // Guide width
                    height={500} // Guide height
                    className="w-full h-auto max-h-[100mm] object-cover rounded-[2mm]" // Adjusted max-height
                    data-ai-hint="luxury apartment detail marble"
                 />
                  {data.specsImageDisclaimer && (
                     <figcaption className="map-disclaimer">
                       <p>{data.specsImageDisclaimer}</p>
                     </figcaption>
                  )}
               </figure>
            ) : (
                 <div className="w-full h-[100mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[2mm]">
                    Image Placeholder
                </div>
            )}
          </div>
          <div className="specs-list">
            {interiorItems && interiorItems.length > 0 && (
                <>
                    <h3>Interior Specifications</h3>
                    <ul>
                    {interiorItems.map((item, index) => <li key={`int-${index}`}>{item}</li>)}
                    </ul>
                </>
            )}
            {buildingItems && buildingItems.length > 0 && (
                <>
                    <h3>Building Features</h3>
                    <ul>
                    {buildingItems.map((item, index) => <li key={`bld-${index}`}>{item}</li>)}
                    </ul>
                </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
