import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface LocationPageProps {
  data: BrochureData;
}

// Helper to split array into two columns
const splitIntoColumns = (arr: string[]) => {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
};


export const LocationPage: React.FC<LocationPageProps> = ({ data }) => {
  const [col1, col2] = splitIntoColumns(data.keyDistances || []);

  return (
    <PageWrapper className="page-light-bg" id="location-page">
      <div className="page-content">
        {data.locationWatermark && (
           <Image
            src={data.locationWatermark}
            alt="Watermark"
            width={227} // 60mm
            height={227} // 60mm
            className="watermark"
            data-ai-hint="map compass icon"
          />
        )}
        <div className="section-title">{data.locationTitle}</div>
        <div className="location-container">
          <div className="location-text">
            <p>{data.locationDesc1}</p>
            <p>{data.locationDesc2}</p>
            <h3>Key Distances</h3>
            <div className="list-columns">
              <ul>
                {col1.map((item, index) => <li key={`dist1-${index}`}>{item}</li>)}
              </ul>
              <ul>
                {col2.map((item, index) => <li key={`dist2-${index}`}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="location-map">
            {data.locationMapImage && (
              <Image
                src={data.locationMapImage}
                alt="Location Map"
                width={605} // approx 0.8 * (210mm - 40mm padding)
                height={756} // 200mm
                className="w-full h-full object-cover rounded-[2mm]"
                data-ai-hint="stylized city map"
              />
            )}
            <div className="map-disclaimer">
              <p>{data.mapDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};