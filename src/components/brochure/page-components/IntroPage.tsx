
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

  const hasTextContent = introTitle || introParagraph1 || introParagraph2 || introParagraph3;
  const hasVisualContent = !!introWatermark;

  if (!hasTextContent && !hasVisualContent) {
    return null;
  }

  return (
    <PageWrapper className="page-light-bg" id="intro-page">
      <div className="page-content">
        {hasVisualContent && introWatermark && (
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
        {hasTextContent && (
            <>
                {introTitle && <div className="section-title">{introTitle.replace('[Project Name]', data.projectName?.trim() || 'This Project')}</div>}
                <div className="intro-text">
                {introParagraph1 && <p>{introParagraph1.replace('[Project Name]', data.projectName?.trim() || 'this project')}</p>}
                {introParagraph2 && <p>{introParagraph2.replace('[Project Name]', data.projectName?.trim() || 'this project')}</p>}
                {introParagraph3 && <p>{introParagraph3.replace('[Project Name]', data.projectName?.trim() || 'this project')}</p>}
                </div>
            </>
        )}
      </div>
    </PageWrapper>
  );
};
