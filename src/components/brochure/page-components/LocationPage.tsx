import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface LocationPageProps {
  data: BrochureData;
}

const splitIntoColumns = (arr: string[] = []) => {
  const filteredArr = arr.filter(item => item?.trim());
  const mid = Math.ceil(filteredArr.length / 2);
  return [filteredArr.slice(0, mid), filteredArr.slice(mid)];
};

export const LocationPage: React.FC<LocationPageProps> = ({ data }) => {
  const [col1, col2] = splitIntoColumns(data.keyDistances);
  const hasKeyDistances = col1.length > 0 || col2.length > 0;
  const hasTextContent = data.locationTitle || data.locationDesc1 || data.locationDesc2 || hasKeyDistances || data.locationNote;
  const hasVisualContent = !!data.locationMapImage || !!data.locationWatermark;
  const hasMapDisclaimer = !!data.mapDisclaimer;

  if (!hasTextContent && !hasVisualContent && !hasMapDisclaimer) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="location-page">
      <div className="page-content">
        {data.locationWatermark && data.locationWatermark.trim() !== '' && (
           <Image
            src={data.locationWatermark}
            alt="Watermark"
            width={189}
            height={189}
            className="watermark"
            data-ai-hint="map compass icon simple"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {data.locationTitle && <div className="section-title">{data.locationTitle}</div>}
        <div className="location-container">
          {(data.locationDesc1 || data.locationDesc2 || hasKeyDistances || data.locationNote) && (
            <div className="location-text">
              {data.locationDesc1 && <p>{data.locationDesc1}</p>}
              {data.locationDesc2 && <p>{data.locationDesc2}</p>}
              {hasKeyDistances && (
                <>
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
                </>
              )}
               {data.locationNote && <p className="location-note">{data.locationNote}</p>}
            </div>
          )}
          {(data.locationMapImage || data.mapDisclaimer) && (
            <div className="location-map">
              {data.locationMapImage && data.locationMapImage.trim() !== '' ? (
                <figure className="relative">
                   <Image
                      src={data.locationMapImage}
                      alt="Location Map"
                      width={700}
                      height={550}
                      className="w-full h-auto max-h-[100mm] object-contain rounded-[1.5mm] border border-gray-200"
                      data-ai-hint="stylized city map color"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   />
                   {data.mapDisclaimer && (
                       <figcaption className="map-disclaimer">
                         <p>{data.mapDisclaimer}</p>
                       </figcaption>
                   )}
                </figure>
              ): (
                   <div className="w-full h-[100mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-gray-200 text-xs p-2 text-center">
                      {data.mapDisclaimer ? data.mapDisclaimer : "Location Map Area"}
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};