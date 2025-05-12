import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface SpecificationsPageProps {
  data: BrochureData;
}

export const SpecificationsPage: React.FC<SpecificationsPageProps> = ({ data }) => {
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
        <div className="specs-container">
          <div className="specs-image">
            {data.specsImage && (
              <Image
                src={data.specsImage}
                alt="Interior Finish"
                 width={643} // approx 0.5 * (210mm - 40mm padding - 10mm gap)
                 height={756} // 200mm
                 className="w-full h-full object-cover rounded-[2mm]"
                 data-ai-hint="luxury apartment interior"
              />
            )}
            <div className="map-disclaimer"> {/* Using map-disclaimer style */}
              <p>{data.specsImageDisclaimer}</p>
            </div>
          </div>
          <div className="specs-list">
            <h3>Interior Specifications</h3>
            <ul>
              {data.specsInterior?.map((item, index) => <li key={`int-${index}`}>{item}</li>)}
            </ul>
            <h3>Building Features</h3>
            <ul>
               {data.specsBuilding?.map((item, index) => <li key={`bld-${index}`}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};