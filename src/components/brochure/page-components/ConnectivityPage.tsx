import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface ConnectivityPageProps {
  data: BrochureData;
}

const renderList = (title: string, items: string[] = []) => {
     if (!items || items.length <= 1) return null; // Need at least title + 1 item
     const heading = items[0]; // Assume first item is the category title
     const listItems = items.slice(1).filter(item => item?.trim()); // Filter empty items
     if (listItems.length === 0) return null;

     return (
        <div className="mb-4 break-inside-avoid"> {/* Added margin and break-inside avoid */}
            <h4 className="font-semibold text-base mb-1">{heading}</h4>
            <ul>
                {listItems.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
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
            width={227} // 60mm
            height={227} // 60mm
            className="watermark"
            data-ai-hint="network lines abstract"
          />
        )}
        <div className="section-title">{data.connectivityTitle}</div>
         {/* Use default flex direction (column for print) defined in CSS */}
        <div className="connectivity-container">
          <div className="connectivity-text">
            <h3>Nearby Points of Interest</h3>
             {/* Render lists directly without columns for better print flow */}
            {renderList("Business", data.connectivityPointsBusiness)}
            {renderList("Healthcare", data.connectivityPointsHealthcare)}
            {renderList("Education", data.connectivityPointsEducation)}
            {renderList("Leisure", data.connectivityPointsLeisure)}
            <p className="location-note">{data.connectivityNote}</p>
          </div>
          <div className="connectivity-image">
             {data.connectivityImage && (
               <figure className="relative"> {/* Wrap image and label */}
                 <Image
                    src={data.connectivityImage}
                    alt="Location Highlight"
                    width={605} // Guide width
                    height={756} // Guide height
                    className="w-full h-auto max-h-[120mm] object-cover rounded-[2mm]" // Use cover, limit height
                    data-ai-hint="cityscape aerial view district" // Updated hint
                 />
                 <figcaption className="district-label">{data.connectivityDistrictLabel}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
