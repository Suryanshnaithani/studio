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
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden"> {/* Added wrapper with overflow:hidden */}
            <Image
            src={data.backCoverImage}
            alt="Luxury Property Background"
            layout="fill"
            objectFit="cover"
            className="back-cover-image" // back-cover-image class has opacity and z-index
            data-ai-hint="city night skyline"
            />
        </div>
      )}
      <div className="back-cover-content">
        {data.backCoverLogo && (
          <Image
            src={data.backCoverLogo}
            alt={`${data.projectName} Logo`}
            width={378} // 100mm
            height={227} // Maintain aspect ratio
            className="back-logo"
            data-ai-hint="developer logo dark"
          />
        )}
        <h2 className="call-to-action">{data.callToAction}</h2>
        <div className="contact-info">
          {/* The border color for h3 is now handled by .contact-info h3 in brochure.css using HSL variables if possible */}
          <h3>{data.contactTitle}</h3>
          <p>Call: <a href={`tel:${data.contactPhone.replace(/\s+/g, '')}`} className="text-[hsl(var(--primary-foreground))] hover:opacity-80">{data.contactPhone}</a></p>
          <p>Email: <a href={`mailto:${data.contactEmail}`} className="text-[hsl(var(--primary-foreground))] hover:opacity-80">{data.contactEmail}</a></p>
          <p>Website: <a href={data.contactWebsite} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary-foreground))] underline hover:opacity-80">{data.contactWebsite}</a></p>
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