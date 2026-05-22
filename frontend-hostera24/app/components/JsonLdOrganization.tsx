import {
  CONTACT_EMAIL,
  DEFAULT_DESCRIPTION,
  OPERATOR_NAME,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

export function JsonLdOrganization() {
  const url = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        legalName: OPERATOR_NAME,
        url,
        email: CONTACT_EMAIL,
        description: DEFAULT_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url,
        inLanguage: "ro-RO",
        publisher: { "@type": "Organization", name: SITE_NAME },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
