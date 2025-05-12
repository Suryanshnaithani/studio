import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesListPageProps {
  data: BrochureData;
}

export const AmenitiesListPage: React.FC<AmenitiesListPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="amenities-list-page">
      <div className="page-content">
        <div className="section-title">{data.amenitiesListTitle}</div>
        <div className="amenities-container">
          <div className="amenities-image">
             {data.amenitiesListImage && (
              <Image
                src={data.amenitiesListImage}
                alt="Swimming Pool"
                 width={643} // approx 0.5 * (210mm - 40mm padding - 10mm gap)
                 height={756} // 200mm
                 className="w-full h-full object-cover rounded-[2mm]"
                 data-ai-hint="luxury infinity pool"
              />
            )}
            <div className="map-disclaimer"> {/* Using map-disclaimer style for consistency */}
              <p>{data.amenitiesListImageDisclaimer}</p>
            </div>
          </div>
          <div className="amenities-list">
            <h3>Wellness & Leisure</h3>
            <ul>
              {data.amenitiesWellness?.map((item, index) => <li key={`well-${index}`}>{item}</li>)}
            </ul>
            <h3>Recreation</h3>
            <ul>
              {data.amenitiesRecreation?.map((item, index) => <li key={`rec-${index}`}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};