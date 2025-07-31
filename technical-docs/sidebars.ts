import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // But you can create a sidebar manually
  tutorialSidebar: [
    'intro',
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
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/navigation',
        'user-guide/features',
        'user-guide/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
