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
        <div className="amenities-container">
          <div className="amenities-image">
             {data.amenitiesListImage && data.amenitiesListImage.trim() !== '' ? (
               <figure className="relative">
                 <Image
                    src={data.amenitiesListImage}
                    alt="Amenities Highlight"
                    width={700} 
                    height={500} 
                    className="w-full h-auto max-h-[90mm] object-cover rounded-[1.5mm]" 
                    data-ai-hint="luxury infinity pool sunset"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 {data.amenitiesListImageDisclaimer && (
                     <figcaption className="map-disclaimer">
                       <p>{data.amenitiesListImageDisclaimer}</p>
                     </figcaption>
                 )}
               </figure>
            ) : (
                <div className="w-full h-[90mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] text-xs p-2 text-center">
                    Amenities Image
                </div>
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
