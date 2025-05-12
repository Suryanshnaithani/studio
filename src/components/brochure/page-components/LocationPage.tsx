import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface LocationPageProps {
  data: BrochureData;
}

// Helper to split array into two columns
const splitIntoColumns = (arr: string[]) => {
  if (!arr) return [[], []];
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
        {/* Use default flex direction (column for print) defined in CSS */}
        <div className="location-container">
          <div className="location-text">
            <p>{data.locationDesc1}</p>
            <p>{data.locationDesc2}</p>
            <h3>Key Distances</h3>
            <div className="list-columns">
              {col1.length > 0 && (
                <ul>
                    {col1.map((item, index) => <li key={`dist1-${index}`}>{item}</li>)}
                </ul>
              )}
               {col2.length > 0 && (
                 <ul>
                    {col2.map((item, index) => <li key={`dist2-${index}`}>{item}</li>)}
                 </ul>
                )}
            </div>
             <p className="location-note">{data.locationNote}</p>
          </div>
          <div className="location-map">
            {data.locationMapImage && (
              <figure className="relative"> {/* Wrap image and disclaimer */}
                 <Image
                    src={data.locationMapImage}
                    alt="Location Map"
                    width={605} // Maintain aspect ratio calculation guide if needed
                    height={756} // Maintain aspect ratio calculation guide if needed
                    className="w-full h-auto max-h-[120mm] object-contain rounded-[2mm] border border-gray-200" // Use contain, limit height
                    data-ai-hint="stylized city map region" // Updated hint
                 />
                 <figcaption className="map-disclaimer">
                   <p>{data.mapDisclaimer}</p>
                 </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
