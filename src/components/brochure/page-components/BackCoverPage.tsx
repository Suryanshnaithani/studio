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
      {data.backCoverImage && data.backCoverImage.trim() !== '' && (
        <div className="back-cover-image-container">
            <Image
            src={data.backCoverImage}
            alt="Luxury Property Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="city night skyline"
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
            />
        </div>
      )}
      <div className="back-cover-content">
        {data.backCoverLogo && data.backCoverLogo.trim() !== '' && (
          <Image
            src={data.backCoverLogo}
            alt={`${data.projectName || 'Project'} Logo`}
            width={302} // approx 80mm
            height={151} // maintain aspect ratio
            className="back-logo"
            data-ai-hint="developer logo dark"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {data.callToAction && <h2 className="call-to-action">{data.callToAction}</h2>}
        {(data.contactTitle || data.contactPhone || data.contactEmail || data.contactWebsite || data.contactAddress) && (
            <div className="contact-info">
            {data.contactTitle && <h3>{data.contactTitle}</h3>}
            {data.contactPhone && <p>Call: <a href={`tel:${data.contactPhone.replace(/\s+/g, '')}`} className="text-[hsl(var(--primary-foreground))] hover:opacity-80">{data.contactPhone}</a></p>}
            {data.contactEmail && <p>Email: <a href={`mailto:${data.contactEmail}`} className="text-[hsl(var(--primary-foreground))] hover:opacity-80">{data.contactEmail}</a></p>}
            {data.contactWebsite && <p>Website: <a href={data.contactWebsite} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary-foreground))] underline hover:opacity-80">{data.contactWebsite}</a></p>}
            {data.contactAddress && <p>Visit: {data.contactAddress}</p>}
            </div>
        )}
      </div>
      {(data.fullDisclaimer || data.reraDisclaimer) && (
        <div className="full-disclaimer">
            {data.fullDisclaimer && <p>{data.fullDisclaimer}</p>}
            {data.reraDisclaimer && <p className="mt-2">{data.reraDisclaimer}</p>}
        </div>
      )}
    </PageWrapper>
  );
};