
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface IntroPageProps {
  data: BrochureData;
}

export const IntroPage: React.FC<IntroPageProps> = ({ data }) => {
  const introTitle = data.introTitle?.trim();
  const introParagraph1 = data.introParagraph1?.trim();
  const introParagraph2 = data.introParagraph2?.trim();
  const introParagraph3 = data.introParagraph3?.trim();
  const introWatermark = data.introWatermark?.trim();

  const hasCoreText = introTitle || introParagraph1 || introParagraph2 || introParagraph3;

  // The page should render if there's any core text content. Watermark is purely decorative.
  if (!hasCoreText) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="intro-page">
      <div className="page-content">
        {introWatermark && (
           <Image
            src={introWatermark}
            alt="Watermark"
            width={227}
            height={227}
            className="watermark"
            data-ai-hint="geometric pattern subtle"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {/* Render section title and intro text container even if some paragraphs are empty, as long as one is not */}
        {introTitle && <div className="section-title">{introTitle.replace('[Project Name]', data.projectName?.trim() || 'This Project')}</div>}
        <div className="intro-text">
        {introParagraph1 && <p>{introParagraph1.replace('[Project Name]', data.projectName?.trim() || 'this project')}</p>}
        {introParagraph2 && <p>{introParagraph2.replace('[Project Name]', data.projectName?.trim() || 'this project')}</p>}
        {introParagraph3 && <p>{introParagraph3.replace('[Project Name]', data.projectName?.trim() || 'this project')}</p>}
        </div>
      </div>
    </PageWrapper>
  );
};
