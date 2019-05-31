/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Mainframe OS Documentation', // Title for your website.
  tagline: 'Get started using Mainframe OS.',
  url: 'https://docs.mainframeos.com', // Your website URL
  baseUrl: '/', // Base URL for your project */
  cname: 'docs.mainframeos.com',
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'mainframe-os',
  organizationName: 'MainframeHQ',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'introduction', label: 'Quick Start'},
    {doc: 'platform', label: 'Platform'},
    {doc: 'sdk', label: 'SDK'},
    {doc: 'faq', label: 'FAQ'},
  ],

  /* path to images for header/footer */
  headerIcon: 'img/MF_Symbol_Red-Rose_BG.png',
  footerIcon: 'img/MF_Symbol_Dark_BG.png',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#DA1157',
    secondaryColor: '#00A7E7',
  },

  /* Custom fonts for website */

  fonts: {
    myFont: ['Poppins', 'Serif'],
    myOtherFont: ['Poppins', '-apple-system', 'system-ui'],
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Mainframe`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  // ogImage: 'img/docusaurus.png',
  // twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
