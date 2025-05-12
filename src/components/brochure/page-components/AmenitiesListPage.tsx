import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesListPageProps {
  data: BrochureData;
}

export const AmenitiesListPage: React.FC<AmenitiesListPageProps> = ({ data }) => {
  const wellnessItems = data.amenitiesWellness?.filter(item => item?.trim());
  const recreationItems = data.amenitiesRecreation?.filter(item => item?.trim());

  return (
    <PageWrapper className="page-light-bg" id="amenities-list-page">
      <div className="page-content">
        <div className="section-title">{data.amenitiesListTitle}</div>
         {/* Use default flex direction (column for print) defined in CSS */}
        <div className="amenities-container">
          <div className="amenities-image">
             {data.amenitiesListImage && (
               <figure className="relative"> {/* Wrap image and disclaimer */}
                 <Image
                    src={data.amenitiesListImage}
                    alt="Swimming Pool Area" // More descriptive alt text
                    width={643} // Guide width
                    height={756} // Guide height
                    className="w-full h-auto max-h-[120mm] object-cover rounded-[2mm]" // Use cover, limit height
                    data-ai-hint="luxury infinity pool lounge" // Updated hint
                 />
                 <figcaption className="map-disclaimer"> {/* Using map-disclaimer style */}
                   <p>{data.amenitiesListImageDisclaimer}</p>
                 </figcaption>
               </figure>
            )}
          </div>
          <div className="amenities-list">
             {wellnessItems && wellnessItems.length > 0 && (
                <>
                    <h3>Wellness & Leisure</h3>
                    <ul>
                    {wellnessItems.map((item, index) => <li key={`well-${index}`}>{item}</li>)}
                    </ul>
                </>
             )}
            {recreationItems && recreationItems.length > 0 && (
                <>
                    <h3>Recreation</h3>
                    <ul>
                    {recreationItems.map((item, index) => <li key={`rec-${index}`}>{item}</li>)}
                    </ul>
                </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
