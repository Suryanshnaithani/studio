import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface IntroPageProps {
  data: BrochureData;
}

export const IntroPage: React.FC<IntroPageProps> = ({ data }) => {
  return (
    <PageWrapper className="page-light-bg" id="intro-page">
      <div className="page-content">
        {data.introWatermark && data.introWatermark.trim() !== '' && (
           <Image
            src={data.introWatermark}
            alt="Watermark"
            width={227} 
            height={227} 
            className="watermark"
            data-ai-hint="geometric pattern subtle"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <div className="section-title">{data.introTitle}</div>
        <div className="intro-text">
          <p>{data.introParagraph1}</p>
          <p>{data.introParagraph2}</p>
          <p>{data.introParagraph3}</p>
        </div>
      </div>
    </PageWrapper>
  );
};
