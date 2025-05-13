import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface DeveloperPageProps {
  data: BrochureData;
}

export const DeveloperPage: React.FC<DeveloperPageProps> = ({ data }) => {
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
        <div className="developer-content">
          <h2>{data.developerName}</h2>
          <p>{data.developerDesc1}</p>
          <p>{data.developerDesc2}</p>
          {data.developerLogo && data.developerLogo.trim() !== '' && (
            <Image
              src={data.developerLogo}
              alt={`${data.developerName} Logo`}
              width={227} 
              height={151} 
              className="developer-logo"
              data-ai-hint="corporate building logo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
           )}
        </div>
        <div className="disclaimer">
          <p>{data.developerDisclaimer}</p>
        </div>
      </div>
    </PageWrapper>
  );
};
