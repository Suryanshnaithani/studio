
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
        <div className="cover-image-container">
          <Image
            src={data.coverImage}
            alt="Luxury Property Cover"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="modern building facade"
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="cover-content">
        {data.projectLogo && data.projectLogo.trim() !== '' && (
          <Image
            src={data.projectLogo}
            alt={`${data.projectName || 'Project'} Logo`}
            width={227} // approx 60mm at 96dpi
            height={114} // maintain aspect ratio
            className="project-logo"
            data-ai-hint="minimalist company logo"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <h1 className="project-name">{data.projectName}</h1>
        <p className="project-tagline">{data.projectTagline}</p>
      </div>
      {data.reraInfo && (
        <div className="rera-text">
          {data.reraInfo.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};
