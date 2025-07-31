import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--8">
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <p className="hero__description">
              The ultimate AI-powered DeFi assistant for the CrossFi network. 
              Seamlessly interact with blockchain, execute trades, manage portfolios, 
              and explore the future of decentralized finance with natural language commands.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Get Started →
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/docs/technical/architecture">
                View Architecture →
              </Link>
            </div>
          </div>
          <div className="col col--4">
            <img 
              src="/img/Screenshot 2025-07-30 at 18.59.12.png" 
              alt="Oni AI Agent Interface" 
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - AI-Powered DeFi Assistant`}
      description="The ultimate AI-powered DeFi assistant for the CrossFi network. Execute trades, manage portfolios, and explore DeFi with natural language commands.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.ctaSection}>
          <div className="container">
            <div className="row">
              <div className="col col--12 text--center">
                <Heading as="h2">Ready to Transform Your DeFi Experience?</Heading>
                <p className={styles.ctaDescription}>
                  Join the future of decentralized finance with AI-powered assistance. 
                  Start building, trading, and exploring the CrossFi ecosystem today.
                </p>
                <div className={styles.ctaButtons}>
                  <Link
                    className="button button--primary button--lg"
                    to="/docs/user-guide/features">
                    Explore Features →
                  </Link>
                  <Link
                    className="button button--outline button--lg"
                    href="https://github.com/samthetutor/Oni">
                    View on GitHub →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
