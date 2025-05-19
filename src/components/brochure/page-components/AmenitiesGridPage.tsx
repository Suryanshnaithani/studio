
import React from 'react';
import Image from 'next/image';
import type { BrochureData, AmenityGridItemData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface AmenitiesGridPageProps {
  data: BrochureData;
}

const GridItem: React.FC<{ item: AmenityGridItemData; hint: string }> = ({ item, hint }) => {
  const imageSrc = item.image?.trim();
  const labelText = item.label?.trim();

  if (!imageSrc && !labelText) return null; // Don't render if item is completely empty

  return (
    <div className="grid-item">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={labelText || "Amenity Feature"}
          width={300}
          height={225}
          className="w-full h-full object-cover"
          data-ai-hint={hint}
          onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide broken img */ }}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
          {labelText || "Amenity Image"}
        </div>
      )}
      {labelText && <div className="grid-label">{labelText}</div>}
    </div>
  );
};

export const AmenitiesGridPage: React.FC<AmenitiesGridPageProps> = ({ data }) => {
  const amenitiesGridTitle = data.amenitiesGridTitle?.trim();
  const amenitiesGridDisclaimer = data.amenitiesGridDisclaimer?.trim();
  
  const validGridItems = data.amenitiesGridItems?.filter(item => item.label?.trim() || item.image?.trim()) || [];
  const hasValidGridItems = validGridItems.length > 0;

  if (!amenitiesGridTitle && !hasValidGridItems && !amenitiesGridDisclaimer) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="amenities-grid-page">
      <div className="page-content flex flex-col">
        {(amenitiesGridTitle || hasValidGridItems) && (
            <>
                {amenitiesGridTitle && <div className="section-title">{amenitiesGridTitle}</div>}
                {hasValidGridItems && (
                    <div className="amenities-grid flex-grow">
                    {validGridItems.map((item, index) => (
                        <GridItem key={item.id || `grid-${index}`} item={item} hint={`amenity ${index + 1} lifestyle`} />
                    ))}
                    </div>
                )}
            </>
        )}
        {amenitiesGridDisclaimer && (
          <div className="mt-auto pt-[3mm] text-center grid-disclaimer">
            <p>{amenitiesGridDisclaimer}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
