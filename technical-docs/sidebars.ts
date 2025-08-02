import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // But you can create a sidebar manually
  tutorialSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/navigation',
        'user-guide/features',
        'user-guide/visual-tutorials',
        'user-guide/platform-gallery',
        'user-guide/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Technical Documentation',
      items: [
        'technical/architecture',
        'technical/api-reference',
        'technical/database',
        'technical/blockchain',
      ],
    },
  ],
};

export default sidebars;
