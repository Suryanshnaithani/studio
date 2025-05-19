
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface CoverPageProps {
  data: BrochureData;
}

export const CoverPage: React.FC<CoverPageProps> = ({ data }) => {
  const hasProjectName = data.projectName?.trim();
  const hasProjectTagline = data.projectTagline?.trim();
  const hasCoverImage = data.coverImage?.trim();
  const hasProjectLogo = data.projectLogo?.trim();
  const hasReraInfo = data.reraInfo?.trim();

  // If no meaningful content, don't render the page
  if (!hasProjectName && !hasProjectTagline && !hasCoverImage && !hasProjectLogo && !hasReraInfo) {
    return null;
  }

  return (
    <PageWrapper className="cover-page" id="cover-page">
      {hasCoverImage && (
        <div className="cover-image-container">
          <Image
            src={data.coverImage!}
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
        {hasProjectLogo && (
          <Image
            src={data.projectLogo!}
            alt={`${data.projectName || 'Project'} Logo`}
            width={227} // approx 60mm at 96dpi
            height={114} // maintain aspect ratio
            className="project-logo"
            data-ai-hint="minimalist company logo"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {hasProjectName && <h1 className="project-name">{data.projectName}</h1>}
        {hasProjectTagline && <p className="project-tagline">{data.projectTagline}</p>}
      </div>
      {hasReraInfo && (
        <div className="rera-text">
          {data.reraInfo!.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};
