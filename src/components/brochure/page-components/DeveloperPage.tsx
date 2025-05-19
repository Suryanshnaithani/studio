
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

  const hasCoreText = developerName || developerDesc1 || developerDesc2;
  const hasCoreVisual = !!developerImage || !!developerLogo; // Main background image or developer logo

  // Page should render if there's core text or a core visual. Disclaimer alone is not enough.
  if (!hasCoreText && !hasCoreVisual) {
    return null;
  }

  return (
    <PageWrapper className="developer-page page-muted-bg" id="developer-page">
       {developerImage && (
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
        {(hasCoreText || developerLogo) && ( // Render content box if core text OR just a logo is present
          <div className="developer-content">
            {developerName && <h2>{developerName}</h2>}
            {developerDesc1 && <p>{developerDesc1}</p>}
            {developerDesc2 && <p>{developerDesc2}</p>}
            {developerLogo && (
              <Image
                src={developerLogo}
                alt={`${data.developerName || 'Developer'} Logo`}
                width={170} 
                height={85}  
                className="developer-logo"
                data-ai-hint="corporate building logo"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
             )}
          </div>
        )}
        {developerDisclaimer && ( // Disclaimer can render if other content is present
          <div className="disclaimer">
            <p>{developerDisclaimer}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
