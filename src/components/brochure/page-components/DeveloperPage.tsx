import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface DeveloperPageProps {
  data: BrochureData;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({ data }) => {
  const hasTextContent = data.developerName || data.developerDesc1 || data.developerDesc2 || data.developerDisclaimer;
  const hasVisualContent = !!data.developerImage || !!data.developerLogo;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="developer-page" id="developer-page">
       {data.developerImage && data.developerImage.trim() !== '' && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <Image
            src={data.developerImage}
            alt="Developer Background"
            layout="fill"
            objectFit="cover"
            className="developer-image"
            data-ai-hint="construction site progress"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
       )}
      <div className="page-content">
        {(data.developerName || data.developerDesc1 || data.developerDesc2 || data.developerLogo) && (
          <div className="developer-content">
            {data.developerName && <h2>{data.developerName}</h2>}
            {data.developerDesc1 && <p>{data.developerDesc1}</p>}
            {data.developerDesc2 && <p>{data.developerDesc2}</p>}
            {data.developerLogo && data.developerLogo.trim() !== '' && (
              <Image
                src={data.developerLogo}
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
        {data.developerDisclaimer && (
          <div className="disclaimer">
            <p>{data.developerDisclaimer}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};