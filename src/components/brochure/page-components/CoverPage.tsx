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
      {data.coverImage && (
        <Image
          src={data.coverImage}
          alt="Luxury Property Cover"
          layout="fill"
          objectFit="cover"
          className="cover-image"
          priority // Load first image quickly
          data-ai-hint="modern building facade"
        />
      )}
      <div className="cover-content">
        {data.projectLogo && (
          <Image
            src={data.projectLogo}
            alt={`${data.projectName} Logo`}
            width={302} // 80mm approx
            height={151} // maintain aspect ratio if possible
            className="project-logo"
            data-ai-hint="minimalist company logo"
          />
        )}
        <h1 className="project-name">{data.projectName}</h1>
        <p className="project-tagline">{data.projectTagline}</p>
      </div>
      <div className="rera-text">
        {data.reraInfo.split('\n').map((line, index) => (
          <p key={index} className="text-[10.66px] leading-tight">{line}</p> // Adjust font size/leading if needed
        ))}
      </div>
    </PageWrapper>
  );
};