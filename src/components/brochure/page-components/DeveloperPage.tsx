
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface DeveloperPageProps {
  data: BrochureData;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({ data }) => {
  const developerName = data.developerName?.trim();
  const developerDesc1 = data.developerDesc1?.trim();
  const developerDesc2 = data.developerDesc2?.trim();
  const developerImage = data.developerImage?.trim();
  const developerLogo = data.developerLogo?.trim();
  const developerDisclaimer = data.developerDisclaimer?.trim();

  const hasTextContent = developerName || developerDesc1 || developerDesc2 || developerDisclaimer;
  const hasVisualContent = !!developerImage || !!developerLogo;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="developer-page page-muted-bg" id="developer-page">
       {hasVisualContent && developerImage && (
        <div className="developer-image-container">
          <Image
            src={developerImage}
            alt="Developer Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="construction site progress"
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
          />
        </div>
       )}
      <div className="page-content">
        {(developerName || developerDesc1 || developerDesc2 || developerLogo) && (
          <div className="developer-content">
            {developerName && <h2>{developerName}</h2>}
            {developerDesc1 && <p>{developerDesc1}</p>}
            {developerDesc2 && <p>{developerDesc2}</p>}
            {hasVisualContent && developerLogo && (
              <Image
                src={developerLogo}
                alt={`${data.developerName || 'Developer'} Logo`}
                width={170} // Adjusted size
                height={85}  // Adjusted size
                className="developer-logo"
                data-ai-hint="corporate building logo"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
             )}
          </div>
        )}
        {developerDisclaimer && (
          <div className="disclaimer">
            <p>{developerDisclaimer}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
