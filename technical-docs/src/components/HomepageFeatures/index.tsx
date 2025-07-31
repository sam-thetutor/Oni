import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: ReactNode;
  link?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI-Powered Trading',
    image: '/img/features/dca-trading.png',
    description: (
      <>
        Execute intelligent DCA (Dollar Cost Averaging) strategies with AI-driven insights. 
        Set up automated trading plans and let the AI optimize your entry and exit points 
        based on market conditions and your risk profile.
      </>
    ),
    link: '/docs/user-guide/features#dca-trading',
  },
  {
    title: 'Smart Payment Links',
    image: '/img/features/payment-links.png',
    description: (
      <>
        Create and manage intelligent payment links with real-time blockchain monitoring. 
        Track payments, manage global and fixed payment links, and receive instant 
        notifications when transactions are completed.
      </>
    ),
    link: '/docs/user-guide/features#payment-links',
  },
  {
    title: 'Gamified Leaderboard',
    image: '/img/features/leaderboard.png',
    description: (
      <>
        Compete with other traders in a gamified environment. Earn points for successful 
        trades, complete challenges, and climb the weekly leaderboard. Turn trading into 
        an engaging social experience.
      </>
    ),
    link: '/docs/user-guide/features#leaderboard',
  },
  {
    title: 'Intelligent AI Agent',
    image: '/img/features/ai-agent.png',
    description: (
      <>
        Interact with your DeFi portfolio using natural language. Ask questions about 
        your holdings, get market insights, execute trades, and receive personalized 
        recommendations powered by advanced AI.
      </>
    ),
    link: '/docs/user-guide/features#ai-agent',
  },
  {
    title: 'Instant Token Swaps',
    image: '/img/features/dca-trading.png',
    description: (
      <>
        Execute lightning-fast token swaps with real-time price quotes and minimal slippage. 
        Swap between XFI, USDT, USDC, and other supported tokens with AI-optimized 
        routing for the best possible rates.
      </>
    ),
    link: '/docs/user-guide/features#swaps',
  },
];

function Feature({title, image, description, link}: FeatureItem) {
  const cardContent = (
    <>
      <div className="text--center">
        <img src={image} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </>
  );

  return (
    <div className={clsx('col col--4')}>
      {link ? (
        <Link to={link} className={styles.featureLink}>
          {cardContent}
        </Link>
      ) : (
        <div className={styles.featureCard}>
          {cardContent}
        </div>
      )}
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--12 text--center">
            <Heading as="h2" className={styles.featuresTitle}>Powerful Features</Heading>
            <p className={styles.featuresSubtitle}>
              Discover what makes Oni the ultimate AI-powered DeFi assistant
            </p>
          </div>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
