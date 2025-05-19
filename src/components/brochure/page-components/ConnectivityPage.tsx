
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface ConnectivityPageProps {
  data: BrochureData;
}

const renderPointList = (items: string[] = [], categoryKey: string) => {
     const trimmedItems = items?.map(item => item?.trim()).filter(Boolean) || [];
     if (trimmedItems.length <= 1) return null; // Needs a heading and at least one point
     const heading = trimmedItems[0];
     const listItems = trimmedItems.slice(1);
     if (listItems.length === 0) return null;

     return (
        <div className="connectivity-point-list">
            <h4>{heading}</h4>
            <ul>
                {listItems.map((item, index) => <li key={`${categoryKey}-${index}`}>{item}</li>)}
            </ul>
        </div>
     )
};

export const ConnectivityPage: React.FC<ConnectivityPageProps> = ({ data }) => {
  const connectivityTitle = data.connectivityTitle?.trim();
  const connectivityNote = data.connectivityNote?.trim();
  const connectivityImage = data.connectivityImage?.trim();
  const connectivityDistrictLabel = data.connectivityDistrictLabel?.trim();
  const connectivityWatermark = data.connectivityWatermark?.trim();

  const businessPoints = renderPointList(data.connectivityPointsBusiness, 'business');
  const healthcarePoints = renderPointList(data.connectivityPointsHealthcare, 'healthcare');
  const educationPoints = renderPointList(data.connectivityPointsEducation, 'education');
  const leisurePoints = renderPointList(data.connectivityPointsLeisure, 'leisure');

  const hasPointLists = businessPoints || healthcarePoints || educationPoints || leisurePoints;
  const hasTextContent = connectivityTitle || hasPointLists || connectivityNote;
  const hasVisualContent = !!connectivityImage || !!connectivityDistrictLabel || !!connectivityWatermark;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="connectivity-page">
      <div className="page-content">
         {connectivityWatermark && (
           <Image
            src={connectivityWatermark}
            alt="Watermark"
            width={189}
            height={189}
            className="watermark"
            data-ai-hint="network lines abstract"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {connectivityTitle && <div className="section-title">{connectivityTitle}</div>}
        <div className="connectivity-container">
          {(hasPointLists || connectivityNote) && (
            <div className="connectivity-text">
                {hasPointLists && (
                    <>
                        <h3>Nearby Points of Interest</h3>
                        <div className="list-columns">
                            {businessPoints}
                            {healthcarePoints}
                            {educationPoints}
                            {leisurePoints}
                        </div>
                    </>
                )}
                {connectivityNote && <p className="location-note">{connectivityNote}</p>}
            </div>
          )}
          {(connectivityImage || connectivityDistrictLabel) && (
              <div className="connectivity-image">
                {connectivityImage ? (
                <figure className="relative">
                    <Image
                        src={connectivityImage}
                        alt="Connectivity Highlight"
                        width={700}
                        height={500}
                        className="w-full h-auto max-h-[100mm] object-cover rounded-[1.5mm]"
                        data-ai-hint="cityscape aerial view highway"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {connectivityDistrictLabel && (
                        <figcaption className="district-label">{connectivityDistrictLabel}</figcaption>
                    )}
                </figure>
                ) : (
                    connectivityDistrictLabel && (
                        <div className="w-full h-[100mm] bg-muted flex items-center justify-center text-muted-foreground rounded-[1.5mm] text-xs p-2 text-center">
                           <span className="district-label !static !transform-none !bg-transparent !text-muted-foreground">{connectivityDistrictLabel}</span>
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
