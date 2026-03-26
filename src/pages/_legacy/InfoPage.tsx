import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';

interface InfoPageProps {
  title: string;
  legalWarning?: boolean;
  content?: React.ReactNode;
}

export default function InfoPage({ title, legalWarning, content }: InfoPageProps) {
  return (
    <>
      <SEO title={`${title} | SnusFriend`} description={`${title} — SnusFriend`} />
      <Layout showNicotineWarning={false}>
        <div className="container py-16 max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>
          {content ? (
            <div className="prose prose-sm text-muted-foreground space-y-4">
              {content}
            </div>
          ) : (
            <div className="prose prose-sm text-muted-foreground">
              <p>This page is currently being prepared. Please check back soon.</p>
              <p>
                If you have questions, please email us at{' '}
                <a href="mailto:support@snusfriend.com" className="text-primary hover:underline">
                  support@snusfriend.com
                </a>
              </p>
            </div>
          )}
          {legalWarning && (
            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              This page requires legal review. Draft content only — do not go live without solicitor sign-off.
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
