
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface CoverPageProps {
  data: BrochureData;
}

export const CoverPage: React.FC<CoverPageProps> = ({ data }) => {
  const projectName = data.projectName?.trim();
  const projectTagline = data.projectTagline?.trim();
  const coverImage = data.coverImage?.trim();
  const projectLogo = data.projectLogo?.trim();
  const reraInfo = data.reraInfo?.trim();

  // A cover page needs at least a project name OR a cover image to be meaningful.
  // Logo, tagline, RERA are secondary for this check.
  if (!projectName && !coverImage) {
    return null;
  }

  return (
    <PageWrapper className="cover-page" id="cover-page">
      {coverImage && (
        <div className="cover-image-container">
          <Image
            src={coverImage}
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
        {projectLogo && (
          <Image
            src={projectLogo}
            alt={`${projectName || 'Project'} Logo`}
            width={227} // approx 60mm at 96dpi
            height={114} // maintain aspect ratio
            className="project-logo"
            data-ai-hint="minimalist company logo"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {projectName && <h1 className="project-name">{projectName}</h1>}
        {projectTagline && <p className="project-tagline">{projectTagline}</p>}
      </div>
      {reraInfo && (
        <div className="rera-text">
          {reraInfo.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};
