import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface ConnectivityPageProps {
  data: BrochureData;
}

const renderList = (title: string, items: string[] = []) => {
     if (!items || items.length === 0) return null;
     const heading = items[0]; // Assume first item is the category title
     const listItems = items.slice(1);
     return (
        <ul>
            <h4 className="font-semibold text-base mb-1">{heading}</h4>
            {listItems.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
        </ul>
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
            width={227} // 60mm
            height={227} // 60mm
            className="watermark"
            data-ai-hint="logo abstract"
          />
        )}
        <div className="section-title">{data.connectivityTitle}</div>
        <div className="connectivity-container">
          <div className="connectivity-text">
            <h3>Nearby Points of Interest</h3>
            <div className="list-columns">
              {renderList("Business", data.connectivityPointsBusiness)}
              {renderList("Healthcare", data.connectivityPointsHealthcare)}
            </div>
            <div className="list-columns">
               {renderList("Education", data.connectivityPointsEducation)}
               {renderList("Leisure", data.connectivityPointsLeisure)}
            </div>
            <p className="location-note">{data.connectivityNote}</p>
          </div>
          <div className="connectivity-image">
             {data.connectivityImage && (
              <Image
                src={data.connectivityImage}
                alt="Location Highlight"
                width={605} // approx 0.8 * (210mm - 40mm padding)
                height={756} // 200mm
                objectFit="cover"
                className="w-full h-full object-cover rounded-[2mm]"
                data-ai-hint="city landmarks"
              />
            )}
            <div className="district-label">{data.connectivityDistrictLabel}</div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
