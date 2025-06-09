import { FC } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd: FC<JsonLdProps> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
