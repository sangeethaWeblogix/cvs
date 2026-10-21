'use client';

import { useEffect, useState } from 'react';

interface Props {
  user: string;
  domain: string;
  className?: string;
  children?: React.ReactNode;
}

/** Renders a mailto: link whose href is only set after mount, not during
 * SSR — Cloudflare's Email Address Obfuscation rewrites any literal
 * "mailto:" string it sees in the HTML it proxies into a /cdn-cgi/l/
 * email-protection link (decoded client-side for real browsers), which a
 * non-JS crawler reads as a dead link and 404s on. Since the raw mailto
 * string never appears in the server-rendered HTML here, Cloudflare has
 * nothing to rewrite. */
export default function ObfuscatedEmailLink({ user, domain, className, children }: Props) {
  const [href, setHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    setHref(`mailto:${user}@${domain}`);
  }, [user, domain]);

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer noopener">
      {children ?? `${user}@${domain}`}
    </a>
  );
}
