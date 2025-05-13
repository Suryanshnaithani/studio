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
        <div className="section-title">{data.specsTitle}</div>
        <div className="specs-container">
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
                    Specifications Image
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
