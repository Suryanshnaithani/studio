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
            width={227} // 60mm
            height={227} // 60mm
            className="watermark"
            data-ai-hint="blueprint icon abstract"
          />
        )}
        <div className="section-title">{data.specsTitle}</div>
         {/* Use default flex direction (column for print) defined in CSS */}
        <div className="specs-container">
          <div className="specs-image">
            {data.specsImage && (
               <figure className="relative"> {/* Wrap image and disclaimer */}
                 <Image
                    src={data.specsImage}
                    alt="Interior Finish Example" // More descriptive alt text
                    width={643} // Guide width
                    height={756} // Guide height
                    className="w-full h-auto max-h-[120mm] object-cover rounded-[2mm]" // Use cover, limit height
                    data-ai-hint="luxury apartment interior detail" // Updated hint
                 />
                 <figcaption className="map-disclaimer"> {/* Using map-disclaimer style */}
                   <p>{data.specsImageDisclaimer}</p>
                 </figcaption>
               </figure>
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
