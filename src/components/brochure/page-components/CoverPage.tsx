import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface CoverPageProps {
  data: BrochureData;
}

export const CoverPage: React.FC<CoverPageProps> = ({ data }) => {
  return (
    <PageWrapper className="cover-page" id="cover-page">
      {data.coverImage && data.coverImage.trim() !== '' && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <Image
            src={data.coverImage}
            alt="Luxury Property Cover"
            layout="fill"
            objectFit="cover"
            className="cover-image" 
            priority 
            data-ai-hint="modern building facade"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="cover-content">
        {data.projectLogo && data.projectLogo.trim() !== '' && (
          <Image
            src={data.projectLogo}
            alt={`${data.projectName} Logo`}
            width={302} 
            height={151} 
            className="project-logo"
            data-ai-hint="minimalist company logo"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <h1 className="project-name">{data.projectName}</h1>
        <p className="project-tagline">{data.projectTagline}</p>
      </div>
      <div className="rera-text">
        {data.reraInfo.split('\n').map((line, index) => (
          <p key={index} className="text-[8.5px] leading-tight">{line}</p>
        ))}
      </div>
    </PageWrapper>
  );
};
