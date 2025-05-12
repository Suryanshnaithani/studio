import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface ConnectivityPageProps {
  data: BrochureData;
}

const renderPointList = (items: string[] = []) => {
     if (!items || items.length <= 1) return null; // Need at least title + 1 item
     const heading = items[0]; // Assume first item is the category title
     const listItems = items.slice(1).filter(item => item?.trim()); // Filter empty items
     if (listItems.length === 0) return null;

     return (
        <div className="connectivity-point-list">
            <h4>{heading}</h4>
            <ul>
                {listItems.map((item, index) => <li key={`${heading}-${index}`}>{item}</li>)}
            </ul>
        </div>
     )
};

export const ConnectivityPage: React.FC<ConnectivityPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="connectivity-page">
      <div className="page-content">
         {data.connectivityWatermark && (
           <Image
            src={data.connectivityWatermark}
            alt="Watermark"
            width={189} // 50mm
            height={189} // 50mm
            className="watermark"
            data-ai-hint="network lines abstract"
          />
        )}
        <div className="section-title">{data.connectivityTitle}</div>
        <div className="connectivity-container">
          <div className="connectivity-text">
            <h3>Nearby Points of Interest</h3>
             {/* Use columns within the text section */}
            <div className="list-columns">
                {renderPointList(data.connectivityPointsBusiness)}
                {renderPointList(data.connectivityPointsHealthcare)}
                {renderPointList(data.connectivityPointsEducation)}
                {renderPointList(data.connectivityPointsLeisure)}
            </div>
            <p className="location-note">{data.connectivityNote}</p>
          </div>
          <div className="connectivity-image">
             {data.connectivityImage ? (
               <figure className="relative">
                 <Image
                    src={data.connectivityImage}
                    alt="Connectivity Highlight"
                    width={700} // Guide width
                    height={500} // Guide height
                    className="w-full h-auto max-h-[100mm] object-cover rounded-[2mm]" // Adjusted max-height
                    data-ai-hint="cityscape aerial view highway"
                 />
                 {data.connectivityDistrictLabel && (
                    <figcaption className="district-label">{data.connectivityDistrictLabel}</figcaption>
                 )}
              </figure>
            ) : (
                 <div className="w-full h-[100mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[2mm]">
                    Image Placeholder
                </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
