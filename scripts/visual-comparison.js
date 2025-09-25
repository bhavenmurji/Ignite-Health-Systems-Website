/**
 * Visual Comparison Tool using Puppeteer
 * Compares Next.js site (localhost:3000) with original HTML site
 * Provides pixel-perfect analysis of visual differences
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
  waitForContent: 3000,
  threshold: 0.1, // Pixel difference threshold
  includeAA: false // Include anti-aliasing differences
};

class VisualComparator {
  constructor() {
    this.browser = null;
    this.results = {
      desktop: {},
      mobile: {},
      sections: {},
      fonts: {},
      colors: {},
      animations: {},
      layout: {},
      overall: {}
    };
  }

  async initialize() {
    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to false to see what's happening
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });

    // Create output directory
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // Create subdirectories
    ['screenshots', 'diffs', 'reports'].forEach(dir => {
      const dirPath = path.join(config.outputDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async captureScreenshots(viewport, suffix = '') {
    console.log(`📸 Capturing screenshots for ${suffix || 'desktop'}...`);
    
    const page = await this.browser.newPage();
    await page.setViewport(viewport);

    // Capture Next.js site
    console.log('  → Capturing Next.js site...');
    await page.goto(config.nextjsUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, config.waitForContent));
    
    // Wait for any animations to complete
    await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    });

    const nextjsScreenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    // Capture original HTML site
    console.log('  → Capturing original HTML site...');
    await page.goto(`file://${config.originalHtmlPath}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, config.waitForContent));
    
    // Wait for any animations to complete
    await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
    });

    const originalScreenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    // Save screenshots
    const screenshotDir = path.join(config.outputDir, 'screenshots');
    fs.writeFileSync(
      path.join(screenshotDir, `nextjs-${suffix || 'desktop'}.png`), 
      nextjsScreenshot
    );
    fs.writeFileSync(
      path.join(screenshotDir, `original-${suffix || 'desktop'}.png`), 
      originalScreenshot
    );

    await page.close();
    return { nextjsScreenshot, originalScreenshot };
  }

  async captureSectionScreenshots(viewport, suffix = '') {
    console.log(`📸 Capturing section-by-section screenshots for ${suffix || 'desktop'}...`);
    
    const page = await this.browser.newPage();
    await page.setViewport(viewport);

    const sections = [
      { name: 'header', selector: 'header, .header, nav' },
      { name: 'hero', selector: '.hero, .hero-section, #hero' },
      { name: 'problem', selector: '.problem, .problem-section, #problem' },
      { name: 'solution', selector: '.solution, .solution-section, #solution' },
      { name: 'platform', selector: '.platform, .platform-section, #platform' },
      { name: 'approach', selector: '.approach, .approach-section, #approach' },
      { name: 'founder', selector: '.founder, .founder-section, #founder' },
      { name: 'cta', selector: '.cta, .cta-section, #cta' },
      { name: 'footer', selector: 'footer, .footer' }
    ];

    for (const section of sections) {
      try {
        console.log(`  → Capturing section: ${section.name}...`);
        
        // Next.js site
        await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const nextjsElement = await page.$(section.selector);
        if (nextjsElement) {
          const nextjsSection = await nextjsElement.screenshot({ type: 'png' });
          fs.writeFileSync(
            path.join(config.outputDir, 'screenshots', `nextjs-section-${section.name}-${suffix || 'desktop'}.png`),
            nextjsSection
          );
        }

        // Original HTML site
        await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const originalElement = await page.$(section.selector);
        if (originalElement) {
          const originalSection = await originalElement.screenshot({ type: 'png' });
          fs.writeFileSync(
            path.join(config.outputDir, 'screenshots', `original-section-${section.name}-${suffix || 'desktop'}.png`),
            originalSection
          );
        }

      } catch (error) {
        console.warn(`  ⚠️  Could not capture section ${section.name}: ${error.message}`);
      }
    }

    await page.close();
  }

  async analyzeColorSchemes() {
    console.log('🎨 Analyzing color schemes...');
    
    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);

    const colorAnalysis = {
      nextjs: {},
      original: {}
    };

    // Analyze Next.js colors
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
    colorAnalysis.nextjs = await page.evaluate(() => {
      const colors = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.color && styles.color !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.color);
        }
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.backgroundColor);
        }
        if (styles.borderColor && styles.borderColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.borderColor);
        }
      });

      return Array.from(colors).sort();
    });

    // Analyze original colors
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
    colorAnalysis.original = await page.evaluate(() => {
      const colors = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.color && styles.color !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.color);
        }
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.backgroundColor);
        }
        if (styles.borderColor && styles.borderColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(styles.borderColor);
        }
      });

      return Array.from(colors).sort();
    });

    await page.close();
    return colorAnalysis;
  }

  async analyzeFonts() {
    console.log('🔤 Analyzing fonts...');
    
    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);

    const fontAnalysis = {
      nextjs: {},
      original: {}
    };

    // Analyze Next.js fonts
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
    fontAnalysis.nextjs = await page.evaluate(() => {
      const fonts = new Set();
      const sizes = new Set();
      const weights = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.fontFamily) fonts.add(styles.fontFamily);
        if (styles.fontSize) sizes.add(styles.fontSize);
        if (styles.fontWeight) weights.add(styles.fontWeight);
      });

      return {
        families: Array.from(fonts).sort(),
        sizes: Array.from(sizes).sort(),
        weights: Array.from(weights).sort()
      };
    });

    // Analyze original fonts
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
    fontAnalysis.original = await page.evaluate(() => {
      const fonts = new Set();
      const sizes = new Set();
      const weights = new Set();
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.fontFamily) fonts.add(styles.fontFamily);
        if (styles.fontSize) sizes.add(styles.fontSize);
        if (styles.fontWeight) weights.add(styles.fontWeight);
      });

      return {
        families: Array.from(fonts).sort(),
        sizes: Array.from(sizes).sort(),
        weights: Array.from(weights).sort()
      };
    });

    await page.close();
    return fontAnalysis;
  }

  async analyzeLayout() {
    console.log('📐 Analyzing layout and positioning...');
    
    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);

    const layoutAnalysis = {
      nextjs: {},
      original: {}
    };

    const analyzePageLayout = async () => {
      return await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const layouts = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          if (rect.width > 0 && rect.height > 0) {
            layouts.push({
              tag: el.tagName.toLowerCase(),
              className: el.className || '',
              id: el.id || '',
              position: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              },
              styles: {
                position: styles.position,
                display: styles.display,
                flexDirection: styles.flexDirection,
                justifyContent: styles.justifyContent,
                alignItems: styles.alignItems,
                margin: styles.margin,
                padding: styles.padding
              }
            });
          }
        });
        
        return layouts;
      });
    };

    // Analyze Next.js layout
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    layoutAnalysis.nextjs = await analyzePageLayout();

    // Analyze original layout
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    layoutAnalysis.original = await analyzePageLayout();

    await page.close();
    return layoutAnalysis;
  }

  async analyzeAnimations() {
    console.log('🎬 Analyzing animations and transitions...');
    
    const page = await this.browser.newPage();
    await page.setViewport(config.viewport);

    const animationAnalysis = {
      nextjs: {},
      original: {}
    };

    const analyzePageAnimations = async () => {
      return await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const animations = [];
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          
          if (styles.animationName && styles.animationName !== 'none') {
            animations.push({
              element: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
              animationName: styles.animationName,
              animationDuration: styles.animationDuration,
              animationTimingFunction: styles.animationTimingFunction,
              animationDelay: styles.animationDelay,
              animationIterationCount: styles.animationIterationCount
            });
          }
          
          if (styles.transition && styles.transition !== 'all 0s ease 0s') {
            animations.push({
              element: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
              transition: styles.transition
            });
          }
        });
        
        return animations;
      });
    };

    // Analyze Next.js animations
    await page.goto(config.nextjsUrl, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    animationAnalysis.nextjs = await analyzePageAnimations();

    // Analyze original animations
    await page.goto(`file://${config.originalHtmlPath}`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    animationAnalysis.original = await analyzePageAnimations();

    await page.close();
    return animationAnalysis;
  }

  compareImages(img1Buffer, img2Buffer, diffPath) {
    const img1 = PNG.sync.read(img1Buffer);
    const img2 = PNG.sync.read(img2Buffer);
    
    // Ensure images are same size
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);
    
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
      img1.data, img2.data, diff.data, 
      width, height, 
      { threshold: config.threshold, includeAA: config.includeAA }
    );
    
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    
    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;
    
    return {
      totalPixels,
      diffPixels: numDiffPixels,
      diffPercentage: diffPercentage.toFixed(2),
      width,
      height
    };
  }

  generateReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        visualDifferencesFound: analysis.desktop.diffPercentage > 0 || analysis.mobile.diffPercentage > 0,
        majorDifferencesDetected: analysis.desktop.diffPercentage > 5 || analysis.mobile.diffPercentage > 5,
        desktopDiffPercentage: analysis.desktop.diffPercentage,
        mobileDiffPercentage: analysis.mobile.diffPercentage
      },
      desktop: analysis.desktop,
      mobile: analysis.mobile,
      colorSchemes: analysis.colors,
      fonts: analysis.fonts,
      layout: analysis.layout,
      animations: analysis.animations
    };

    // Generate detailed analysis
    const detailedReport = this.generateDetailedAnalysis(report);

    // Save JSON report
    fs.writeFileSync(
      path.join(config.outputDir, 'reports', 'comparison-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Save detailed HTML report
    fs.writeFileSync(
      path.join(config.outputDir, 'reports', 'detailed-analysis.html'),
      detailedReport
    );

    return report;
  }

  generateDetailedAnalysis(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Comparison Report - Ignite Health Systems</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .summary { background: #e3f2fd; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px; }
        .diff-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #1976d2; }
        .high-diff { color: #d32f2f; }
        .medium-diff { color: #f57c00; }
        .low-diff { color: #388e3c; }
        .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .comparison-item { background: #f8f9fa; padding: 15px; border-radius: 6px; }
        .image-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .image-item { text-align: center; }
        .image-item img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
        .differences-list { background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 10px 0; }
        .differences-list ul { margin: 0; padding-left: 20px; }
        .color-palette { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0; }
        .color-swatch { width: 40px; height: 40px; border: 1px solid #ddd; border-radius: 4px; position: relative; }
        .font-sample { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .layout-diff { background: #ffebee; padding: 10px; margin: 5px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Visual Comparison Report</h1>
            <p><strong>Ignite Health Systems Website</strong></p>
            <p>Next.js Implementation vs. Original HTML</p>
            <p>Generated: ${report.timestamp}</p>
        </div>

        <div class="summary">
            <h2>Executive Summary</h2>
            <div class="diff-stats">
                <div class="stat-card">
                    <div class="stat-value ${report.summary.desktopDiffPercentage > 5 ? 'high-diff' : report.summary.desktopDiffPercentage > 1 ? 'medium-diff' : 'low-diff'}">${report.summary.desktopDiffPercentage}%</div>
                    <div>Desktop Difference</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value ${report.summary.mobileDiffPercentage > 5 ? 'high-diff' : report.summary.mobileDiffPercentage > 1 ? 'medium-diff' : 'low-diff'}">${report.summary.mobileDiffPercentage}%</div>
                    <div>Mobile Difference</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value ${report.summary.majorDifferencesDetected ? 'high-diff' : 'low-diff'}">${report.summary.majorDifferencesDetected ? 'Yes' : 'No'}</div>
                    <div>Major Differences</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Visual Differences Analysis</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>Desktop Comparison</h3>
                    <p><strong>Total Pixels:</strong> ${report.desktop.totalPixels?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Different Pixels:</strong> ${report.desktop.diffPixels?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Difference:</strong> ${report.desktop.diffPercentage || 'N/A'}%</p>
                </div>
                <div class="comparison-item">
                    <h3>Mobile Comparison</h3>
                    <p><strong>Total Pixels:</strong> ${report.mobile.totalPixels?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Different Pixels:</strong> ${report.mobile.diffPixels?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Difference:</strong> ${report.mobile.diffPercentage || 'N/A'}%</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Color Scheme Analysis</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>Next.js Colors</h3>
                    <div class="color-palette">
                        ${report.colorSchemes?.nextjs?.slice(0, 20).map(color => 
                            `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`
                        ).join('') || '<p>No color data available</p>'}
                    </div>
                </div>
                <div class="comparison-item">
                    <h3>Original Colors</h3>
                    <div class="color-palette">
                        ${report.colorSchemes?.original?.slice(0, 20).map(color => 
                            `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`
                        ).join('') || '<p>No color data available</p>'}
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Typography Analysis</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>Next.js Fonts</h3>
                    ${report.fonts?.nextjs?.families?.slice(0, 10).map(font => 
                        `<div class="font-sample" style="font-family: ${font}">${font}</div>`
                    ).join('') || '<p>No font data available</p>'}
                </div>
                <div class="comparison-item">
                    <h3>Original Fonts</h3>
                    ${report.fonts?.original?.families?.slice(0, 10).map(font => 
                        `<div class="font-sample" style="font-family: ${font}">${font}</div>`
                    ).join('') || '<p>No font data available</p>'}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Animation & Transitions</h2>
            <div class="comparison-grid">
                <div class="comparison-item">
                    <h3>Next.js Animations</h3>
                    ${report.animations?.nextjs?.length > 0 ? 
                        report.animations.nextjs.map(anim => 
                            `<div class="layout-diff">
                                <strong>${anim.element}</strong><br>
                                ${anim.animationName ? `Animation: ${anim.animationName}` : ''}
                                ${anim.transition ? `Transition: ${anim.transition}` : ''}
                            </div>`
                        ).join('') : '<p>No animations detected</p>'}
                </div>
                <div class="comparison-item">
                    <h3>Original Animations</h3>
                    ${report.animations?.original?.length > 0 ? 
                        report.animations.original.map(anim => 
                            `<div class="layout-diff">
                                <strong>${anim.element}</strong><br>
                                ${anim.animationName ? `Animation: ${anim.animationName}` : ''}
                                ${anim.transition ? `Transition: ${anim.transition}` : ''}
                            </div>`
                        ).join('') : '<p>No animations detected</p>'}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Recommendations</h2>
            <div class="differences-list">
                <h3>Priority Fixes Needed:</h3>
                <ul>
                    ${report.summary.desktopDiffPercentage > 5 ? '<li>🔴 <strong>HIGH:</strong> Significant desktop visual differences detected</li>' : ''}
                    ${report.summary.mobileDiffPercentage > 5 ? '<li>🔴 <strong>HIGH:</strong> Significant mobile visual differences detected</li>' : ''}
                    ${report.summary.desktopDiffPercentage > 1 && report.summary.desktopDiffPercentage <= 5 ? '<li>🟡 <strong>MEDIUM:</strong> Moderate desktop differences need attention</li>' : ''}
                    ${report.summary.mobileDiffPercentage > 1 && report.summary.mobileDiffPercentage <= 5 ? '<li>🟡 <strong>MEDIUM:</strong> Moderate mobile differences need attention</li>' : ''}
                    ${report.summary.desktopDiffPercentage <= 1 && report.summary.mobileDiffPercentage <= 1 ? '<li>🟢 <strong>LOW:</strong> Minimal differences detected - excellent match!</li>' : ''}
                </ul>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  async run() {
    try {
      await this.initialize();
      
      console.log('🔍 Starting comprehensive visual comparison...');
      
      // Capture desktop screenshots
      console.log('\n📱 Desktop Analysis...');
      const desktopScreenshots = await this.captureScreenshots(config.viewport, 'desktop');
      await this.captureSectionScreenshots(config.viewport, 'desktop');
      
      // Capture mobile screenshots
      console.log('\n📱 Mobile Analysis...');
      const mobileScreenshots = await this.captureScreenshots(config.mobileViewport, 'mobile');
      await this.captureSectionScreenshots(config.mobileViewport, 'mobile');
      
      // Compare images
      console.log('\n🔍 Comparing images...');
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
      
      // Analyze various aspects
      const colorAnalysis = await this.analyzeColorSchemes();
      const fontAnalysis = await this.analyzeFonts();
      const layoutAnalysis = await this.analyzeLayout();
      const animationAnalysis = await this.analyzeAnimations();
      
      // Compile results
      const fullAnalysis = {
        desktop: desktopDiff,
        mobile: mobileDiff,
        colors: colorAnalysis,
        fonts: fontAnalysis,
        layout: layoutAnalysis,
        animations: animationAnalysis
      };
      
      // Generate report
      console.log('\n📊 Generating comprehensive report...');
      const report = this.generateReport(fullAnalysis);
      
      console.log('\n✅ Analysis complete!');
      console.log(`📁 Results saved to: ${config.outputDir}`);
      console.log(`📊 Desktop difference: ${desktopDiff.diffPercentage}%`);
      console.log(`📱 Mobile difference: ${mobileDiff.diffPercentage}%`);
      console.log(`📝 Detailed report: ${path.join(config.outputDir, 'reports', 'detailed-analysis.html')}`);
      
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

// Execute if run directly
if (require.main === module) {
  const comparator = new VisualComparator();
  comparator.run()
    .then(report => {
      console.log('\n🎉 Comparison completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Comparison failed:', error);
      process.exit(1);
    });
}

module.exports = VisualComparator;