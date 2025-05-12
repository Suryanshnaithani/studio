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
       {data.developerImage && (
        <Image
          src={data.developerImage}
          alt="Developer Background"
          layout="fill"
          objectFit="cover"
          className="developer-image"
          data-ai-hint="city skyline"
        />
       )}
      <div className="page-content">
        <div className="developer-content">
          <h2>{data.developerName}</h2>
          <p>{data.developerDesc1}</p>
          <p>{data.developerDesc2}</p>
          {data.developerLogo && (
            <Image
              src={data.developerLogo}
              alt={`${data.developerName} Logo`}
              width={227} // 60mm
              height={151} // Adjust height as needed
              className="developer-logo"
              data-ai-hint="company logo"
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
