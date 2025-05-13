import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface ConnectivityPageProps {
  data: BrochureData;
}

const renderPointList = (items: string[] = []) => {
     if (!items || items.length <= 1) return null; 
     const heading = items[0]; 
     const listItems = items.slice(1).filter(item => item?.trim()); 
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
         {data.connectivityWatermark && data.connectivityWatermark.trim() !== '' && (
           <Image
            src={data.connectivityWatermark}
            alt="Watermark"
            width={189} 
            height={189} 
            className="watermark"
            data-ai-hint="network lines abstract"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <div className="section-title">{data.connectivityTitle}</div>
        <div className="connectivity-container">
          <div className="connectivity-text">
            <h3>Nearby Points of Interest</h3>
            <div className="list-columns">
                {renderPointList(data.connectivityPointsBusiness)}
                {renderPointList(data.connectivityPointsHealthcare)}
                {renderPointList(data.connectivityPointsEducation)}
                {renderPointList(data.connectivityPointsLeisure)}
            </div>
            <p className="location-note">{data.connectivityNote}</p>
          </div>
          <div className="connectivity-image">
             {data.connectivityImage && data.connectivityImage.trim() !== '' ? (
               <figure className="relative">
                 <Image
                    src={data.connectivityImage}
                    alt="Connectivity Highlight"
                    width={700} 
                    height={500} 
                    className="w-full h-auto max-h-[100mm] object-cover rounded-[1.5mm]" 
                    data-ai-hint="cityscape aerial view highway"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 {data.connectivityDistrictLabel && (
                    <figcaption className="district-label">{data.connectivityDistrictLabel}</figcaption>
                 )}
              </figure>
            ) : (
                 <div className="w-full h-[100mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] text-xs p-2 text-center">
                    Connectivity Image
                </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
