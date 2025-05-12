import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface BackCoverPageProps {
  data: BrochureData;
}

export const BackCoverPage: React.FC<BackCoverPageProps> = ({ data }) => {
  return (
    <PageWrapper className="back-cover" id="back-cover-page">
      {data.backCoverImage && (
        <Image
          src={data.backCoverImage}
          alt="Luxury Property Background"
          layout="fill"
          objectFit="cover"
          className="back-cover-image"
          data-ai-hint="abstract texture"
        />
      )}
      <div className="back-cover-content">
        {data.backCoverLogo && (
          <Image
            src={data.backCoverLogo}
            alt={`${data.projectName} Logo`}
            width={378} // 100mm
            height={227} // Maintain aspect ratio
            className="back-logo"
            data-ai-hint="company logo dark"
          />
        )}
        <h2 className="call-to-action">{data.callToAction}</h2>
        <div className="contact-info">
          <h3>{data.contactTitle}</h3>
          <p>Call: {data.contactPhone}</p>
          <p>Email: {data.contactEmail}</p>
          <p>Website: <a href={data.contactWebsite} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-300">{data.contactWebsite}</a></p>
          <p>Visit: {data.contactAddress}</p>
        </div>
      </div>
      <div className="full-disclaimer">
        <p>{data.fullDisclaimer}</p>
        <p>{data.reraDisclaimer}</p>
      </div>
    </PageWrapper>
  );
};
