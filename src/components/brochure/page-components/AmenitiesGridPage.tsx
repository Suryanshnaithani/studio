
import React from 'react';
import Image from 'next/image';
import type { BrochureData, AmenityGridItemData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesGridPageProps {
  data: BrochureData;
}

const GridItem: React.FC<{ item: AmenityGridItemData; hint: string }> = ({ item, hint }) => (
  <div className="grid-item">
    {item.image && item.image.trim() !== '' ? (
      <Image
        src={item.image}
        alt={item.label || "Amenity Feature"}
        width={300}
        height={225}
        className="w-full h-full object-cover"
        data-ai-hint={hint}
        onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide broken img */ }}
      />
    ) : (
      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
        {item.label || "Amenity Image"}
      </div>
    )}
    <div className="grid-label">{item.label}</div>
  </div>
);

export const AmenitiesGridPage: React.FC<AmenitiesGridPageProps> = ({ data }) => {
  const hasValidGridItems = data.amenitiesGridItems && data.amenitiesGridItems.some(item => item.label?.trim() || item.image?.trim());
  const hasTitle = !!data.amenitiesGridTitle?.trim();
  const hasDisclaimer = !!data.amenitiesGridDisclaimer?.trim();

  // If no title, no valid grid items, and no disclaimer, consider the page empty.
  if (!hasTitle && !hasValidGridItems && !hasDisclaimer) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="amenities-grid-page">
      <div className="page-content flex flex-col">
        {(hasTitle || hasValidGridItems) && (
            <>
                {hasTitle && <div className="section-title">{data.amenitiesGridTitle}</div>}
                {hasValidGridItems && (
                    <div className="amenities-grid flex-grow">
                    {data.amenitiesGridItems?.filter(item => item.label?.trim() || item.image?.trim()).map((item, index) => (
                        <GridItem key={item.id || `grid-${index}`} item={item} hint={`amenity ${index + 1} lifestyle`} />
                    ))}
                    </div>
                )}
            </>
        )}
        {hasDisclaimer && (
          <div className="mt-auto pt-[3mm] text-center grid-disclaimer">
            <p>{data.amenitiesGridDisclaimer}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
