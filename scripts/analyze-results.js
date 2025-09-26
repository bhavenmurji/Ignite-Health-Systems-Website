/**
 * Analyze existing comparison results
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const config = {
  outputDir: '/Users/bhavenmurji/Development/Ignite Health Systems Website/visual-comparison-results'
};

function analyzeImageStats(imagePath) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const png = PNG.sync.read(buffer);
    return {
      width: png.width,
      height: png.height,
      size: buffer.length,
      pixels: png.width * png.height
    };
  } catch (error) {
    return { error: error.message };
  }
}

function calculatePixelDifference(diffImagePath) {
  try {
    const buffer = fs.readFileSync(diffImagePath);
    const png = PNG.sync.read(buffer);
    
    let diffPixels = 0;
    const totalPixels = png.width * png.height;
    
    // Count non-zero pixels (differences)
    for (let i = 0; i < png.data.length; i += 4) {
      const r = png.data[i];
      const g = png.data[i + 1];
      const b = png.data[i + 2];
      const a = png.data[i + 3];
      
      // If pixel is not fully transparent and not black/white (indicating a difference)
      if (a > 0 && (r !== 0 || g !== 0 || b !== 0) && (r !== 255 || g !== 255 || b !== 255)) {
        diffPixels++;
      }
    }
    
    const diffPercentage = (diffPixels / totalPixels) * 100;
    
    return {
      totalPixels,
      diffPixels,
      diffPercentage: diffPercentage.toFixed(2),
      width: png.width,
      height: png.height
    };
  } catch (error) {
    return { error: error.message };
  }
}

function generateReport() {
  console.log('📊 VISUAL COMPARISON ANALYSIS REPORT');
  console.log('='.repeat(60));
  
  const screenshotsDir = path.join(config.outputDir, 'screenshots');
  const diffsDir = path.join(config.outputDir, 'diffs');
  
  // Analyze screenshots
  console.log('\n📸 SCREENSHOT ANALYSIS:');
  console.log('-'.repeat(40));
  
  const images = [
    'nextjs-desktop.png',
    'original-desktop.png',
    'nextjs-mobile.png',
    'original-mobile.png'
  ];
  
  images.forEach(image => {
    const imagePath = path.join(screenshotsDir, image);
    if (fs.existsSync(imagePath)) {
      const stats = analyzeImageStats(imagePath);
      console.log(`${image}:`);
      console.log(`  📐 Dimensions: ${stats.width} x ${stats.height}`);
      console.log(`  📦 File size: ${(stats.size / 1024).toFixed(1)} KB`);
      console.log(`  🔢 Total pixels: ${stats.pixels.toLocaleString()}`);
    } else {
      console.log(`❌ ${image}: File not found`);
    }
  });
  
  // Analyze differences
  console.log('\n🔍 DIFFERENCE ANALYSIS:');
  console.log('-'.repeat(40));
  
  const diffs = ['desktop-diff.png', 'mobile-diff.png'];
  const results = {};
  
  diffs.forEach(diff => {
    const diffPath = path.join(diffsDir, diff);
    if (fs.existsSync(diffPath)) {
      const analysis = calculatePixelDifference(diffPath);
      const platform = diff.replace('-diff.png', '');
      results[platform] = analysis;
      
      console.log(`${platform.toUpperCase()} DIFFERENCES:`);
      console.log(`  📐 Canvas size: ${analysis.width} x ${analysis.height}`);
      console.log(`  🔢 Total pixels: ${analysis.totalPixels.toLocaleString()}`);
      console.log(`  🔄 Different pixels: ${analysis.diffPixels.toLocaleString()}`);
      console.log(`  📊 Difference percentage: ${analysis.diffPercentage}%`);
      
      if (parseFloat(analysis.diffPercentage) < 1) {
        console.log(`  ✅ EXCELLENT MATCH - Minimal differences`);
      } else if (parseFloat(analysis.diffPercentage) < 5) {
        console.log(`  ⚠️  MINOR DIFFERENCES - Small discrepancies`);
      } else {
        console.log(`  🔴 MAJOR DIFFERENCES - Significant discrepancies`);
      }
    } else {
      console.log(`❌ ${diff}: File not found`);
    }
  });
  
  // Overall assessment
  console.log('\n📋 OVERALL ASSESSMENT:');
  console.log('-'.repeat(40));
  
  const desktopDiff = parseFloat(results.desktop?.diffPercentage || 100);
  const mobileDiff = parseFloat(results.mobile?.diffPercentage || 100);
  const avgDiff = (desktopDiff + mobileDiff) / 2;
  
  console.log(`🖥️  Desktop difference: ${desktopDiff}%`);
  console.log(`📱 Mobile difference: ${mobileDiff}%`);
  console.log(`📊 Average difference: ${avgDiff.toFixed(2)}%`);
  
  if (avgDiff < 1) {
    console.log(`\n🎉 STATUS: EXCELLENT IMPLEMENTATION`);
    console.log(`The Next.js version is an excellent match for the original design!`);
  } else if (avgDiff < 5) {
    console.log(`\n⚡ STATUS: GOOD IMPLEMENTATION WITH MINOR TWEAKS NEEDED`);
    console.log(`The implementation is solid but could benefit from some refinements.`);
  } else {
    console.log(`\n🔧 STATUS: MAJOR REVISIONS NEEDED`);
    console.log(`Significant differences detected that require attention.`);
  }
  
  // Key areas to check
  console.log('\n🔍 KEY AREAS TO INVESTIGATE:');
  console.log('-'.repeat(40));
  
  if (desktopDiff > mobileDiff) {
    console.log(`• Desktop layout needs more attention (${desktopDiff}% vs ${mobileDiff}% mobile)`);
  } else if (mobileDiff > desktopDiff) {
    console.log(`• Mobile responsive design needs refinement (${mobileDiff}% vs ${desktopDiff}% desktop)`);
  }
  
  console.log(`• Check color consistency between implementations`);
  console.log(`• Verify font families and sizes match`);
  console.log(`• Review spacing and padding values`);
  console.log(`• Examine animation and transition effects`);
  console.log(`• Validate responsive breakpoints`);
  
  // Files location
  console.log('\n📁 FILES LOCATION:');
  console.log('-'.repeat(40));
  console.log(`Screenshots: ${screenshotsDir}`);
  console.log(`Differences: ${diffsDir}`);
  console.log(`\nTo view the images, open the files in the above directories.`);
  
  return results;
}

// Run analysis
if (require.main === module) {
  try {
    const results = generateReport();
    
    // Save results to JSON
    const reportPath = path.join(config.outputDir, 'reports', 'analysis-results.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results,
      summary: {
        desktopDiff: parseFloat(results.desktop?.diffPercentage || 100),
        mobileDiff: parseFloat(results.mobile?.diffPercentage || 100),
        avgDiff: (parseFloat(results.desktop?.diffPercentage || 100) + parseFloat(results.mobile?.diffPercentage || 100)) / 2
      }
    }, null, 2));
    
    console.log(`\n💾 Results saved to: ${reportPath}`);
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}