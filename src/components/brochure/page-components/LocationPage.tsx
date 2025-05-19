
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
  const locationTitle = data.locationTitle?.trim();
  const locationDesc1 = data.locationDesc1?.trim();
  const locationDesc2 = data.locationDesc2?.trim();
  const locationNote = data.locationNote?.trim();
  const locationMapImage = data.locationMapImage?.trim();
  const locationWatermark = data.locationWatermark?.trim();
  const mapDisclaimer = data.mapDisclaimer?.trim();

  const [col1, col2] = splitIntoColumns(data.keyDistances);
  const hasKeyDistances = col1.length > 0 || col2.length > 0;
  
  const hasTextContent = locationTitle || locationDesc1 || locationDesc2 || hasKeyDistances || locationNote || mapDisclaimer;
  const hasVisualContent = !!locationMapImage || !!locationWatermark;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="location-page">
      <div className="page-content">
        {locationWatermark && (
           <Image
            src={locationWatermark}
            alt="Watermark"
            width={189}
            height={189}
            className="watermark"
            data-ai-hint="map compass icon simple"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {locationTitle && <div className="section-title">{locationTitle}</div>}
        <div className="location-container">
          {(locationDesc1 || locationDesc2 || hasKeyDistances || locationNote) && (
            <div className="location-text">
              {locationDesc1 && <p>{locationDesc1}</p>}
              {locationDesc2 && <p>{locationDesc2}</p>}
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
               {locationNote && <p className="location-note">{locationNote}</p>}
            </div>
          )}
          {(locationMapImage || mapDisclaimer) && (
            <div className="location-map">
              {locationMapImage ? (
                <figure className="relative">
                   <Image
                      src={locationMapImage}
                      alt="Location Map"
                      width={700}
                      height={550}
                      className="w-full h-auto max-h-[100mm] object-contain rounded-[1.5mm] border border-gray-200"
                      data-ai-hint="stylized city map color"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   />
                   {mapDisclaimer && (
                       <figcaption className="map-disclaimer">
                         <p>{mapDisclaimer}</p>
                       </figcaption>
                   )}
                </figure>
              ): (
                   mapDisclaimer && (
                    <div className="w-full h-[100mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] border border-gray-200 text-xs p-2 text-center">
                       <p className="map-disclaimer !static !bg-transparent !text-muted-foreground !p-0">{mapDisclaimer}</p>
                    </div>
                   )
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
