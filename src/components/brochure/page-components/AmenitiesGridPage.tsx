
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

  if (!imageSrc && !labelText) return null;

  return (
    <div className="grid-item border border-border">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={labelText || "Amenity Feature"}
          width={300}
          height={225}
          className="w-full h-full object-cover"
          data-ai-hint={hint}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs p-2 text-center border border-border">
          {labelText || "Amenity Image"}
        </div>
      )}
      {labelText && <div className="grid-label">{labelText}</div>}
    </div>
  );
};

const ITEMS_PER_AMENITIES_GRID_PAGE = 6;

export const AmenitiesGridPage: React.FC<AmenitiesGridPageProps> = ({ data }) => {
  const amenitiesGridTitle = data.amenitiesGridTitle?.trim();
  const amenitiesGridDisclaimer = data.amenitiesGridDisclaimer?.trim();

  const validGridItems = data.amenitiesGridItems?.filter(item => item.label?.trim() || item.image?.trim()) || [];

  const hasCoreContentForSection = !!amenitiesGridTitle || validGridItems.length > 0;
  if (!hasCoreContentForSection && !amenitiesGridDisclaimer) { // Only render if title, items, OR disclaimer exists
    return null;
  }
  
  // If only disclaimer exists, but no title or items, it's still considered "empty" for actual page generation,
  // unless the intent is to have a disclaimer-only page for some reason (which is unlikely for this component).
  // The primary check for returning null is whether there is a title or items.
  if (!amenitiesGridTitle && validGridItems.length === 0) {
      return null;
  }


  const pages: React.ReactNode[] = [];

  if (validGridItems.length > 0) {
    const numGridPages = Math.ceil(validGridItems.length / ITEMS_PER_AMENITIES_GRID_PAGE);

    for (let i = 0; i < numGridPages; i++) {
      const startIndex = i * ITEMS_PER_AMENITIES_GRID_PAGE;
      const endIndex = startIndex + ITEMS_PER_AMENITIES_GRID_PAGE;
      const pageGridItems = validGridItems.slice(startIndex, endIndex);

      pages.push(
        <PageWrapper key={`ag-page-${i}`} className="page-light-bg" id={`amenities-grid-page-${i}`}>
          <div className="page-content flex flex-col">
            {i === 0 && amenitiesGridTitle && <div className="section-title">{amenitiesGridTitle}</div>}
            <div className="amenities-grid">
              {pageGridItems.map((item, index) => (
                  <GridItem key={item.id || `grid-item-${i}-${index}`} item={item} hint={`amenity lifestyle ${startIndex + index + 1}`} />
              ))}
            </div>
            {i === numGridPages - 1 && amenitiesGridDisclaimer && (
              <div className="mt-auto pt-[3mm] text-center grid-disclaimer">
                <p>{amenitiesGridDisclaimer}</p>
              </div>
            )}
          </div>
        </PageWrapper>
      );
    }
  } else if (amenitiesGridTitle) {
     pages.push(
      <PageWrapper key="ag-page-static" className="page-light-bg" id="amenities-grid-page-static">
        <div className="page-content flex flex-col">
          {amenitiesGridTitle && <div className="section-title">{amenitiesGridTitle}</div>}
          <p className="text-center text-muted-foreground italic my-4">A wide array of amenities are available. Please inquire for details.</p>
          {amenitiesGridDisclaimer && (
            <div className="mt-auto pt-[3mm] text-center grid-disclaimer">
              <p>{amenitiesGridDisclaimer}</p>
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  return pages.length > 0 ? pages : null;
};
