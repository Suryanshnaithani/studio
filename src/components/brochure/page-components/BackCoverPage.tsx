
import React from 'react';
import Image from 'next/image';
import type { BrochureData } from '@/components/brochure/data-schema';
import { PageWrapper } from './PageWrapper';

interface BackCoverPageProps {
  data: BrochureData;
}

export const BackCoverPage: React.FC<BackCoverPageProps> = ({ data }) => {
  const backCoverImage = data.backCoverImage?.trim();
  const backCoverLogo = data.backCoverLogo?.trim();
  const callToAction = data.callToAction?.trim();
  const contactTitle = data.contactTitle?.trim();
  const contactPhone = data.contactPhone?.trim();
  const contactEmail = data.contactEmail?.trim();
  const contactWebsite = data.contactWebsite?.trim();
  const contactAddress = data.contactAddress?.trim();
  const fullDisclaimer = data.fullDisclaimer?.trim();
  const reraDisclaimer = data.reraDisclaimer?.trim();

  const hasContactInfo = contactTitle || contactPhone || contactEmail || contactWebsite || contactAddress;
  const hasDisclaimers = fullDisclaimer || reraDisclaimer;
  const hasVisuals = backCoverImage || backCoverLogo;

  // If there's no significant content, don't render the page. 
  // Call to action is important, so it's a primary check.
  if (!callToAction && !hasContactInfo && !hasDisclaimers && !hasVisuals && !data.projectName?.trim()) {
    return null; 
  }


  return (
    <PageWrapper className="back-cover" id="back-cover-page">
      {backCoverImage && (
        <div className="back-cover-image-container">
            <Image
            src={backCoverImage}
            alt="Luxury Property Background"
            layout="fill"
            objectFit="cover"
            data-ai-hint="city night skyline"
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
            />
        </div>
      )}
      <div className="back-cover-content">
        {backCoverLogo && (
          <Image
            src={backCoverLogo}
            alt={`${data.projectName || 'Project'} Logo`}
            width={302} // approx 80mm
            height={151} // maintain aspect ratio
            className="back-logo"
            data-ai-hint="developer logo dark"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {callToAction && <h2 className="call-to-action">{callToAction}</h2>}
        {hasContactInfo && (
            <div className="contact-info">
            {contactTitle && <h3>{contactTitle}</h3>}
            {contactPhone && <p>Call: <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="text-[hsl(var(--primary-foreground))] hover:opacity-80">{contactPhone}</a></p>}
            {contactEmail && <p>Email: <a href={`mailto:${contactEmail}`} className="text-[hsl(var(--primary-foreground))] hover:opacity-80">{contactEmail}</a></p>}
            {contactWebsite && <p>Website: <a href={contactWebsite} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary-foreground))] underline hover:opacity-80">{contactWebsite}</a></p>}
            {contactAddress && <p>Visit: {contactAddress}</p>}
            </div>
        )}
      </div>
      {hasDisclaimers && (
        <div className="full-disclaimer">
            {fullDisclaimer && <p>{fullDisclaimer}</p>}
            {reraDisclaimer && <p className="mt-2">{reraDisclaimer}</p>}
        </div>
      )}
    </PageWrapper>
  );
};
