/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('quick-start')}>Getting Started</a>
            <a href={this.docUrl('web3')}>Guidelines</a>
            <a href={this.docUrl('introduction')}>API Reference</a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://t.me/mainframehq"
              target="_blank"
              rel="noreferrer noopener">
              Telegram
            </a>
            <a href="https://www.youtube.com/c/MainframeHQ">YouTube</a>
            <a
              href="https://twitter.com/Mainframe_HQ"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/MainframeHQ">GitHub</a>
            <a
              className="github-button"
              href="https://github.com/mainframehq/mainframe-os"
              data-icon="octicon-star"
              data-show-count="true"
              aria-label="Star mainframehq/mainframe-os on GitHub">
              Star
            </a>
          </div>
        </section>

        <a
          href="https://www.mainframe.com/developers"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/mainframe_dark.png`}
            alt="Mainframe"
            width="170"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
