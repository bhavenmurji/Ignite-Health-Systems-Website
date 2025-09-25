/**
 * Quick Visual Comparison Tool using Puppeteer
 * Fast comparison of Next.js site vs original HTML site
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

// Configuration
const config = {
  nextjsUrl: 'http://localhost:3000',
  originalHtmlPath: '/Users/bhavenmurji/Development/Ignite Health Systems Website/index.html',
  outputDir: '/Users/bhavenmurji/Development/Ignite Health Systems Website/visual-comparison-results',
  viewport: {
    width: 1920,
    height: 1080
  },
  mobileViewport: {
    width: 390,
    height: 844
  },
  waitForContent: 2000,
  threshold: 0.1
};

class QuickComparator {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    console.log('🚀 Launching browser for quick comparison...');
    this.browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    ['screenshots', 'diffs', 'reports'].forEach(dir => {
      const dirPath = path.join(config.outputDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async captureComparison(viewport, suffix = '') {
    console.log(`📸 Capturing ${suffix || 'desktop'} comparison...`);
    
    const page = await this.browser.newPage();
    await page.setViewport(viewport);

    // Capture Next.js site
    console.log('  → Next.js site...');
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, config.waitForContent));
    const nextjsScreenshot = await page.screenshot({ fullPage: true, type: 'png' });

    // Capture original HTML site
    console.log('  → Original HTML site...');
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, config.waitForContent));
    const originalScreenshot = await page.screenshot({ fullPage: true, type: 'png' });

    // Save screenshots
    const screenshotDir = path.join(config.outputDir, 'screenshots');
    fs.writeFileSync(path.join(screenshotDir, `nextjs-${suffix || 'desktop'}.png`), nextjsScreenshot);
    fs.writeFileSync(path.join(screenshotDir, `original-${suffix || 'desktop'}.png`), originalScreenshot);

    await page.close();
    return { nextjsScreenshot, originalScreenshot };
  }

  compareImages(img1Buffer, img2Buffer, diffPath) {
    const img1 = PNG.sync.read(img1Buffer);
    const img2 = PNG.sync.read(img2Buffer);
    
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);
    
    // Create canvases of the same size
    const canvas1 = new PNG({ width, height });
    const canvas2 = new PNG({ width, height });
    const diff = new PNG({ width, height });
    
    // Fill with white background
    canvas1.data.fill(255);
    canvas2.data.fill(255);
    
    // Copy original images to canvases
    PNG.bitblt(img1, canvas1, 0, 0, img1.width, img1.height, 0, 0);
    PNG.bitblt(img2, canvas2, 0, 0, img2.width, img2.height, 0, 0);
    
    const numDiffPixels = pixelmatch(
      canvas1.data, canvas2.data, diff.data, 
      width, height, 
      { threshold: config.threshold, includeAA: false }
    );
    
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    
    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;
    
    return {
      totalPixels,
      diffPixels: numDiffPixels,
      diffPercentage: diffPercentage.toFixed(2),
      width,
      height,
      img1Dimensions: { width: img1.width, height: img1.height },
      img2Dimensions: { width: img2.width, height: img2.height }
    };
  }

  async analyzeColors() {
    console.log('🎨 Analyzing color schemes...');
    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);

    // Next.js colors
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
    const nextjsColors = await page.evaluate(() => {
      const colors = new Set();
      document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        [styles.color, styles.backgroundColor, styles.borderColor].forEach(color => {
          if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            colors.add(color);
          }
        });
      });
      return Array.from(colors).slice(0, 20); // Top 20 colors
    });

    // Original colors
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
    const originalColors = await page.evaluate(() => {
      const colors = new Set();
      document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        [styles.color, styles.backgroundColor, styles.borderColor].forEach(color => {
          if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            colors.add(color);
          }
        });
      });
      return Array.from(colors).slice(0, 20); // Top 20 colors
    });

    await page.close();
    return { nextjs: nextjsColors, original: originalColors };
  }

  async analyzeFonts() {
    console.log('🔤 Analyzing fonts...');
    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);

    // Next.js fonts
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
    const nextjsFonts = await page.evaluate(() => {
      const fonts = new Set();
      const sizes = new Set();
      document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div').forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.fontFamily) fonts.add(styles.fontFamily);
        if (styles.fontSize) sizes.add(styles.fontSize);
      });
      return { families: Array.from(fonts).slice(0, 10), sizes: Array.from(sizes).slice(0, 15) };
    });

    // Original fonts
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
    const originalFonts = await page.evaluate(() => {
      const fonts = new Set();
      const sizes = new Set();
      document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div').forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.fontFamily) fonts.add(styles.fontFamily);
        if (styles.fontSize) sizes.add(styles.fontSize);
      });
      return { families: Array.from(fonts).slice(0, 10), sizes: Array.from(sizes).slice(0, 15) };
    });

    await page.close();
    return { nextjs: nextjsFonts, original: originalFonts };
  }

  generateQuickReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        desktopDiffPercentage: analysis.desktop.diffPercentage,
        mobileDiffPercentage: analysis.mobile.diffPercentage,
        majorDifferencesDetected: analysis.desktop.diffPercentage > 5 || analysis.mobile.diffPercentage > 5,
        status: analysis.desktop.diffPercentage < 1 ? 'EXCELLENT_MATCH' : 
               analysis.desktop.diffPercentage < 5 ? 'MINOR_DIFFERENCES' : 'MAJOR_DIFFERENCES'
      },
      desktop: analysis.desktop,
      mobile: analysis.mobile,
      colors: analysis.colors,
      fonts: analysis.fonts
    };

    // Generate console report
    console.log('\n📊 COMPARISON RESULTS');
    console.log('='.repeat(50));
    console.log(`🖥️  Desktop Difference: ${report.summary.desktopDiffPercentage}%`);
    console.log(`📱 Mobile Difference: ${report.summary.mobileDiffPercentage}%`);
    console.log(`📈 Status: ${report.summary.status}`);
    console.log(`🔍 Major Issues: ${report.summary.majorDifferencesDetected ? 'YES' : 'NO'}`);
    
    if (analysis.colors) {
      console.log('\n🎨 COLOR ANALYSIS');
      console.log(`Next.js colors: ${analysis.colors.nextjs.length} unique`);
      console.log(`Original colors: ${analysis.colors.original.length} unique`);
    }
    
    if (analysis.fonts) {
      console.log('\n🔤 FONT ANALYSIS');
      console.log(`Next.js fonts: ${analysis.fonts.nextjs.families.length} families`);
      console.log(`Original fonts: ${analysis.fonts.original.families.length} families`);
    }

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    fs.writeFileSync(path.join(config.outputDir, 'reports', 'quick-report.html'), htmlReport);
    
    // Save JSON
    fs.writeFileSync(path.join(config.outputDir, 'reports', 'quick-report.json'), JSON.stringify(report, null, 2));

    return report;
  }

  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Visual Comparison Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { text-align: center; margin-bottom: 40px; }
        .title { font-size: 2.5rem; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .subtitle { font-size: 1.1rem; color: #64748b; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 10px 0; }
        .excellent { background: #dcfce7; color: #166534; }
        .minor { background: #fef3c7; color: #d97706; }
        .major { background: #fecaca; color: #dc2626; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2rem; font-weight: 700; margin-bottom: 5px; }
        .metric-label { color: #64748b; font-size: 0.9rem; }
        .low-diff { color: #059669; }
        .medium-diff { color: #d97706; }
        .high-diff { color: #dc2626; }
        .section { margin: 30px 0; }
        .section-title { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
        .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .comparison-item { background: #f8fafc; padding: 20px; border-radius: 8px; }
        .image-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .image-item { text-align: center; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .image-item img { max-width: 100%; height: auto; border-radius: 4px; }
        .color-palette { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
        .color-swatch { width: 32px; height: 32px; border-radius: 4px; border: 1px solid #e2e8f0; position: relative; }
        .recommendations { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Visual Comparison Report</h1>
            <p class="subtitle">Next.js vs Original HTML Implementation</p>
            <div class="status-badge ${report.summary.status === 'EXCELLENT_MATCH' ? 'excellent' : report.summary.status === 'MINOR_DIFFERENCES' ? 'minor' : 'major'}">
                ${report.summary.status.replace('_', ' ')}
            </div>
            <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value ${report.summary.desktopDiffPercentage > 5 ? 'high-diff' : report.summary.desktopDiffPercentage > 1 ? 'medium-diff' : 'low-diff'}">${report.summary.desktopDiffPercentage}%</div>
                <div class="metric-label">Desktop Difference</div>
            </div>
            <div class="metric-card">
                <div class="metric-value ${report.summary.mobileDiffPercentage > 5 ? 'high-diff' : report.summary.mobileDiffPercentage > 1 ? 'medium-diff' : 'low-diff'}">${report.summary.mobileDiffPercentage}%</div>
                <div class="metric-label">Mobile Difference</div>
            </div>
            <div class="metric-card">
                <div class="metric-value ${report.summary.majorDifferencesDetected ? 'high-diff' : 'low-diff'}">${report.summary.majorDifferencesDetected ? 'YES' : 'NO'}</div>
                <div class="metric-label">Major Issues</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Screenshots Comparison</h2>
            <div class="image-gallery">
                <div class="image-item">
                    <h3>Next.js Desktop</h3>
                    <img src="../screenshots/nextjs-desktop.png" alt="Next.js Desktop">
                </div>
                <div class="image-item">
                    <h3>Original Desktop</h3>
                    <img src="../screenshots/original-desktop.png" alt="Original Desktop">
                </div>
                <div class="image-item">
                    <h3>Next.js Mobile</h3>
                    <img src="../screenshots/nextjs-mobile.png" alt="Next.js Mobile">
                </div>
                <div class="image-item">
                    <h3>Original Mobile</h3>
                    <img src="../screenshots/original-mobile.png" alt="Original Mobile">
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Difference Analysis</h2>
            <div class="image-gallery">
                <div class="image-item">
                    <h3>Desktop Differences</h3>
                    <img src="../diffs/desktop-diff.png" alt="Desktop Differences">
                    <p>${report.desktop.diffPixels.toLocaleString()} different pixels out of ${report.desktop.totalPixels.toLocaleString()}</p>
                </div>
                <div class="image-item">
                    <h3>Mobile Differences</h3>
                    <img src="../diffs/mobile-diff.png" alt="Mobile Differences">
                    <p>${report.mobile.diffPixels.toLocaleString()} different pixels out of ${report.mobile.totalPixels.toLocaleString()}</p>
                </div>
            </div>
        </div>

        ${report.colors ? `
        <div class="section">
            <h2 class="section-title">Color Analysis</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>Next.js Colors (Top 20)</h3>
                    <div class="color-palette">
                        ${report.colors.nextjs.map(color => `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`).join('')}
                    </div>
                </div>
                <div class="comparison-item">
                    <h3>Original Colors (Top 20)</h3>
                    <div class="color-palette">
                        ${report.colors.original.map(color => `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        ${report.fonts ? `
        <div class="section">
            <h2 class="section-title">Typography Analysis</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>Next.js Fonts</h3>
                    <p><strong>Font Families:</strong> ${report.fonts.nextjs.families.length}</p>
                    <p><strong>Font Sizes:</strong> ${report.fonts.nextjs.sizes.length}</p>
                </div>
                <div class="comparison-item">
                    <h3>Original Fonts</h3>
                    <p><strong>Font Families:</strong> ${report.fonts.original.families.length}</p>
                    <p><strong>Font Sizes:</strong> ${report.fonts.original.sizes.length}</p>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="recommendations">
            <h3>Recommendations</h3>
            ${report.summary.status === 'EXCELLENT_MATCH' ? 
              '<p>✅ Excellent match! The Next.js implementation closely matches the original design.</p>' :
              report.summary.status === 'MINOR_DIFFERENCES' ?
              '<p>⚠️ Minor differences detected. Consider reviewing spacing, colors, or fonts for closer alignment.</p>' :
              '<p>🔴 Major differences detected. Significant visual discrepancies need immediate attention.</p>'
            }
        </div>
    </div>
</body>
</html>
    `;
  }

  async run() {
    try {
      await this.initialize();
      
      console.log('🔍 Starting quick visual comparison...');
      
      // Capture screenshots
      const desktopScreenshots = await this.captureComparison(config.viewport, 'desktop');
      const mobileScreenshots = await this.captureComparison(config.mobileViewport, 'mobile');
      
      // Compare images
      console.log('📊 Comparing images...');
      const desktopDiff = this.compareImages(
        desktopScreenshots.nextjsScreenshot,
        desktopScreenshots.originalScreenshot,
        path.join(config.outputDir, 'diffs', 'desktop-diff.png')
      );
      
      const mobileDiff = this.compareImages(
        mobileScreenshots.nextjsScreenshot,
        mobileScreenshots.originalScreenshot,
        path.join(config.outputDir, 'diffs', 'mobile-diff.png')
      );
      
      // Quick analysis
      const colors = await this.analyzeColors();
      const fonts = await this.analyzeFonts();
      
      // Generate report
      const fullAnalysis = {
        desktop: desktopDiff,
        mobile: mobileDiff,
        colors,
        fonts
      };
      
      const report = this.generateQuickReport(fullAnalysis);
      
      console.log(`\n📁 Results saved to: ${config.outputDir}`);
      console.log(`📝 Report: ${path.join(config.outputDir, 'reports', 'quick-report.html')}`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Error during comparison:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Execute
if (require.main === module) {
  const comparator = new QuickComparator();
  comparator.run()
    .then(report => {
      console.log('\n🎉 Quick comparison completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Quick comparison failed:', error);
      process.exit(1);
    });
}

module.exports = QuickComparator;