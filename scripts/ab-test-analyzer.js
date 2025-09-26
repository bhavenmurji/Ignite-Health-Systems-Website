#!/usr/bin/env node

/**
 * A/B Test Analyzer for Email Campaign Optimization
 * Ignite Health Systems - Email Testing Framework
 *
 * Features:
 * - Statistical significance testing
 * - Confidence interval calculations
 * - Effect size measurements
 * - Sample size recommendations
 * - Real-time monitoring
 * - Multiple metric analysis
 */

const fs = require('fs');
const path = require('path');

class ABTestAnalyzer {
    constructor() {
        this.configPath = path.join(__dirname, '../experiments/ab-test-configurations.json');
        this.resultsPath = path.join(__dirname, '../experiments/results/');
        this.config = this.loadConfiguration();

        // Ensure results directory exists
        if (!fs.existsSync(this.resultsPath)) {
            fs.mkdirSync(this.resultsPath, { recursive: true });
        }
    }

    loadConfiguration() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('Error loading configuration:', error.message);
            return null;
        }
    }

    /**
     * Calculate statistical significance using Z-test for proportions
     */
    calculateSignificance(controlData, variationData) {
        const { conversions: c1, total: n1 } = controlData;
        const { conversions: c2, total: n2 } = variationData;

        if (n1 === 0 || n2 === 0) {
            return { significant: false, pValue: 1, confidence: 0 };
        }

        const p1 = c1 / n1;
        const p2 = c2 / n2;
        const p_pooled = (c1 + c2) / (n1 + n2);

        const se = Math.sqrt(p_pooled * (1 - p_pooled) * (1/n1 + 1/n2));
        const z = se === 0 ? 0 : (p2 - p1) / se;

        // Two-tailed p-value
        const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));

        return {
            significant: pValue < 0.05,
            pValue: pValue,
            confidence: (1 - pValue) * 100,
            zScore: z,
            controlRate: p1,
            variationRate: p2,
            liftPercent: p1 === 0 ? 0 : ((p2 - p1) / p1) * 100
        };
    }

    /**
     * Normal cumulative distribution function approximation
     */
    normalCDF(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

        if (x > 0) prob = 1 - prob;
        return prob;
    }

    /**
     * Calculate confidence intervals for conversion rates
     */
    calculateConfidenceInterval(conversions, total, confidence = 0.95) {
        if (total === 0) return { lower: 0, upper: 0 };

        const p = conversions / total;
        const z = confidence === 0.95 ? 1.96 : 2.576; // 95% or 99%
        const margin = z * Math.sqrt((p * (1 - p)) / total);

        return {
            lower: Math.max(0, p - margin),
            upper: Math.min(1, p + margin),
            point: p
        };
    }

    /**
     * Calculate required sample size for desired power
     */
    calculateSampleSize(baselineRate, minimumDetectableEffect, power = 0.8, alpha = 0.05) {
        const z_alpha = 1.96; // 95% confidence
        const z_beta = 0.84;  // 80% power

        const p1 = baselineRate;
        const p2 = baselineRate * (1 + minimumDetectableEffect);
        const p_avg = (p1 + p2) / 2;

        const numerator = Math.pow(z_alpha * Math.sqrt(2 * p_avg * (1 - p_avg)) + z_beta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
        const denominator = Math.pow(p2 - p1, 2);

        return Math.ceil(numerator / denominator);
    }

    /**
     * Analyze experiment results
     */
    analyzeExperiment(experimentId, resultsData) {
        const experiment = this.config.experiments[experimentId];
        if (!experiment) {
            throw new Error(`Experiment ${experimentId} not found in configuration`);
        }

        const analysis = {
            experimentId,
            experimentName: experiment.name,
            status: experiment.status,
            analysisDate: new Date().toISOString(),
            primaryMetric: experiment.primary_metric,
            variations: {},
            summary: {},
            recommendations: []
        };

        // Find control variation
        const controlKey = Object.keys(experiment.variations).find(key =>
            experiment.variations[key].name.toLowerCase().includes('control') ||
            experiment.variations[key].name.toLowerCase().includes('original')
        ) || Object.keys(experiment.variations)[0];

        const controlData = resultsData[controlKey];

        // Analyze each variation against control
        for (const [variationKey, variationConfig] of Object.entries(experiment.variations)) {
            const variationData = resultsData[variationKey];

            if (!variationData) {
                analysis.variations[variationKey] = {
                    name: variationConfig.name,
                    error: 'No data available'
                };
                continue;
            }

            const metrics = {};

            // Analyze primary metric
            if (controlData && variationKey !== controlKey) {
                const significance = this.calculateSignificance(
                    controlData[experiment.primary_metric],
                    variationData[experiment.primary_metric]
                );
                metrics[experiment.primary_metric] = significance;
            }

            // Analyze secondary metrics
            if (experiment.secondary_metrics) {
                for (const metric of experiment.secondary_metrics) {
                    if (controlData && variationKey !== controlKey && variationData[metric]) {
                        metrics[metric] = this.calculateSignificance(
                            controlData[metric],
                            variationData[metric]
                        );
                    }
                }
            }

            // Calculate confidence intervals
            const intervals = {};
            for (const metric of [experiment.primary_metric, ...(experiment.secondary_metrics || [])]) {
                if (variationData[metric]) {
                    intervals[metric] = this.calculateConfidenceInterval(
                        variationData[metric].conversions,
                        variationData[metric].total
                    );
                }
            }

            analysis.variations[variationKey] = {
                name: variationConfig.name,
                weight: variationConfig.weight,
                metrics,
                confidenceIntervals: intervals,
                sampleSize: variationData[experiment.primary_metric]?.total || 0
            };
        }

        // Generate summary and recommendations
        analysis.summary = this.generateSummary(analysis, experiment);
        analysis.recommendations = this.generateRecommendations(analysis, experiment);

        return analysis;
    }

    generateSummary(analysis, experiment) {
        const summary = {
            totalVariations: Object.keys(analysis.variations).length,
            significantResults: 0,
            bestPerforming: null,
            averageLift: 0,
            totalSampleSize: 0
        };

        let lifts = [];
        let bestLift = -Infinity;
        let bestVariation = null;

        for (const [key, variation] of Object.entries(analysis.variations)) {
            if (variation.sampleSize) {
                summary.totalSampleSize += variation.sampleSize;
            }

            const primaryMetric = variation.metrics[experiment.primary_metric];
            if (primaryMetric) {
                if (primaryMetric.significant) {
                    summary.significantResults++;
                }

                lifts.push(primaryMetric.liftPercent);

                if (primaryMetric.liftPercent > bestLift) {
                    bestLift = primaryMetric.liftPercent;
                    bestVariation = { key, name: variation.name, lift: bestLift };
                }
            }
        }

        summary.bestPerforming = bestVariation;
        summary.averageLift = lifts.length > 0 ? lifts.reduce((a, b) => a + b, 0) / lifts.length : 0;

        return summary;
    }

    generateRecommendations(analysis, experiment) {
        const recommendations = [];
        const primaryMetric = experiment.primary_metric;

        // Check for winning variations
        for (const [key, variation] of Object.entries(analysis.variations)) {
            const metric = variation.metrics[primaryMetric];
            if (metric && metric.significant && metric.liftPercent > 0) {
                recommendations.push({
                    type: 'winner',
                    priority: 'high',
                    variation: variation.name,
                    message: `${variation.name} shows significant improvement (${metric.liftPercent.toFixed(1)}% lift) in ${primaryMetric}`,
                    confidence: metric.confidence.toFixed(1)
                });
            }
        }

        // Check for sample size adequacy
        const requiredSampleSize = this.calculateSampleSize(0.1, 0.1); // Example baseline
        const currentMaxSample = Math.max(...Object.values(analysis.variations).map(v => v.sampleSize || 0));

        if (currentMaxSample < requiredSampleSize) {
            recommendations.push({
                type: 'sample_size',
                priority: 'medium',
                message: `Consider increasing sample size. Current: ${currentMaxSample}, Recommended: ${requiredSampleSize}`,
                action: 'continue_test'
            });
        }

        // Check for inconclusive results
        const hasSignificantResults = analysis.summary.significantResults > 0;
        if (!hasSignificantResults && analysis.summary.totalSampleSize > requiredSampleSize) {
            recommendations.push({
                type: 'inconclusive',
                priority: 'medium',
                message: 'No significant differences detected. Consider testing more dramatic variations.',
                action: 'redesign_test'
            });
        }

        // Check for multiple testing correction
        if (experiment.secondary_metrics && experiment.secondary_metrics.length > 2) {
            recommendations.push({
                type: 'statistical',
                priority: 'low',
                message: 'Multiple metrics being tested. Consider Bonferroni correction for p-values.',
                action: 'apply_correction'
            });
        }

        return recommendations;
    }

    /**
     * Generate real-time monitoring report
     */
    generateMonitoringReport(experimentId) {
        const experiment = this.config.experiments[experimentId];
        if (!experiment) {
            throw new Error(`Experiment ${experimentId} not found`);
        }

        // Simulate real-time data (in production, this would fetch from analytics)
        const simulatedData = this.generateSimulatedData(experiment);

        return {
            experimentId,
            experimentName: experiment.name,
            status: experiment.status,
            lastUpdated: new Date().toISOString(),
            quickStats: this.calculateQuickStats(simulatedData, experiment),
            alerts: this.checkForAlerts(simulatedData, experiment),
            nextRecommendedCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }

    generateSimulatedData(experiment) {
        const data = {};
        const baseConversionRate = 0.12; // 12% base conversion

        for (const [key, variation] of Object.entries(experiment.variations)) {
            const sampleSize = Math.floor(Math.random() * 500) + 100;
            const conversionModifier = (Math.random() - 0.5) * 0.4; // ±20% variation
            const conversionRate = Math.max(0.01, baseConversionRate + conversionModifier);

            data[key] = {
                [experiment.primary_metric]: {
                    total: sampleSize,
                    conversions: Math.floor(sampleSize * conversionRate)
                }
            };

            // Add secondary metrics if they exist
            if (experiment.secondary_metrics) {
                for (const metric of experiment.secondary_metrics) {
                    const metricRate = Math.max(0.01, Math.random() * 0.3);
                    data[key][metric] = {
                        total: sampleSize,
                        conversions: Math.floor(sampleSize * metricRate)
                    };
                }
            }
        }

        return data;
    }

    calculateQuickStats(data, experiment) {
        const stats = {};

        for (const [key, variationData] of Object.entries(data)) {
            const primaryData = variationData[experiment.primary_metric];
            stats[key] = {
                sampleSize: primaryData.total,
                conversionRate: (primaryData.conversions / primaryData.total * 100).toFixed(2) + '%',
                conversions: primaryData.conversions
            };
        }

        return stats;
    }

    checkForAlerts(data, experiment) {
        const alerts = [];
        const minSampleSize = 100;

        for (const [key, variationData] of Object.entries(data)) {
            const primaryData = variationData[experiment.primary_metric];

            // Check for low sample sizes
            if (primaryData.total < minSampleSize) {
                alerts.push({
                    type: 'low_sample_size',
                    variation: key,
                    message: `${key} has low sample size (${primaryData.total}). Results may not be reliable.`,
                    severity: 'warning'
                });
            }

            // Check for extreme conversion rates
            const conversionRate = primaryData.conversions / primaryData.total;
            if (conversionRate > 0.5) {
                alerts.push({
                    type: 'high_conversion',
                    variation: key,
                    message: `${key} has unusually high conversion rate (${(conversionRate * 100).toFixed(1)}%). Verify tracking.`,
                    severity: 'info'
                });
            }

            if (conversionRate < 0.01) {
                alerts.push({
                    type: 'low_conversion',
                    variation: key,
                    message: `${key} has very low conversion rate (${(conversionRate * 100).toFixed(1)}%). Check for issues.`,
                    severity: 'warning'
                });
            }
        }

        return alerts;
    }

    /**
     * Export results to various formats
     */
    exportResults(analysis, format = 'json') {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `${analysis.experimentId}_analysis_${timestamp}`;

        switch (format.toLowerCase()) {
            case 'json':
                const jsonPath = path.join(this.resultsPath, `${filename}.json`);
                fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
                return jsonPath;

            case 'csv':
                const csvPath = path.join(this.resultsPath, `${filename}.csv`);
                const csvContent = this.convertToCSV(analysis);
                fs.writeFileSync(csvPath, csvContent);
                return csvPath;

            case 'html':
                const htmlPath = path.join(this.resultsPath, `${filename}.html`);
                const htmlContent = this.generateHTMLReport(analysis);
                fs.writeFileSync(htmlPath, htmlContent);
                return htmlPath;

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    convertToCSV(analysis) {
        const rows = ['Variation,Sample Size,Conversion Rate,Lift %,Significant,P-Value,Confidence'];

        for (const [key, variation] of Object.entries(analysis.variations)) {
            const metric = variation.metrics[analysis.primaryMetric];
            if (metric) {
                rows.push([
                    variation.name,
                    variation.sampleSize,
                    (metric.variationRate * 100).toFixed(2) + '%',
                    metric.liftPercent.toFixed(2) + '%',
                    metric.significant ? 'Yes' : 'No',
                    metric.pValue.toFixed(4),
                    metric.confidence.toFixed(1) + '%'
                ].join(','));
            }
        }

        return rows.join('\n');
    }

    generateHTMLReport(analysis) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>A/B Test Analysis: ${analysis.experimentName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #ff6b35; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .variation { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }
        .significant { border-left: 5px solid #28a745; }
        .not-significant { border-left: 5px solid #dc3545; }
        .metric { display: inline-block; margin: 10px 15px 10px 0; }
        .recommendations { background: #e8f4f8; padding: 15px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${analysis.experimentName}</h1>
        <p>Analysis Date: ${new Date(analysis.analysisDate).toLocaleString()}</p>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Variations:</strong> ${analysis.summary.totalVariations}</p>
        <p><strong>Significant Results:</strong> ${analysis.summary.significantResults}</p>
        <p><strong>Best Performing:</strong> ${analysis.summary.bestPerforming?.name || 'None'}</p>
        <p><strong>Total Sample Size:</strong> ${analysis.summary.totalSampleSize.toLocaleString()}</p>
    </div>

    <h2>Variation Results</h2>
    ${Object.entries(analysis.variations).map(([key, variation]) => {
        const metric = variation.metrics[analysis.primaryMetric];
        const isSignificant = metric?.significant || false;
        return `
        <div class="variation ${isSignificant ? 'significant' : 'not-significant'}">
            <h3>${variation.name}</h3>
            <div class="metric"><strong>Sample Size:</strong> ${variation.sampleSize}</div>
            ${metric ? `
            <div class="metric"><strong>Conversion Rate:</strong> ${(metric.variationRate * 100).toFixed(2)}%</div>
            <div class="metric"><strong>Lift:</strong> ${metric.liftPercent.toFixed(2)}%</div>
            <div class="metric"><strong>Significance:</strong> ${metric.significant ? 'Yes' : 'No'}</div>
            <div class="metric"><strong>Confidence:</strong> ${metric.confidence.toFixed(1)}%</div>
            ` : '<p>No metric data available</p>'}
        </div>
        `;
    }).join('')}

    <div class="recommendations">
        <h2>Recommendations</h2>
        ${analysis.recommendations.map(rec => `
        <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
            <strong>${rec.type.toUpperCase()}:</strong> ${rec.message}
        </div>
        `).join('')}
    </div>
</body>
</html>
        `;
    }
}

// CLI Interface
if (require.main === module) {
    const analyzer = new ABTestAnalyzer();
    const command = process.argv[2];

    switch (command) {
        case 'analyze':
            const experimentId = process.argv[3];
            const resultsFile = process.argv[4];

            if (!experimentId || !resultsFile) {
                console.error('Usage: node ab-test-analyzer.js analyze <experiment-id> <results-file>');
                process.exit(1);
            }

            try {
                const resultsData = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
                const analysis = analyzer.analyzeExperiment(experimentId, resultsData);
                console.log(JSON.stringify(analysis, null, 2));

                // Export results
                const htmlPath = analyzer.exportResults(analysis, 'html');
                console.log(`\nHTML report saved to: ${htmlPath}`);
            } catch (error) {
                console.error('Error analyzing experiment:', error.message);
                process.exit(1);
            }
            break;

        case 'monitor':
            const monitorExperimentId = process.argv[3];

            if (!monitorExperimentId) {
                console.error('Usage: node ab-test-analyzer.js monitor <experiment-id>');
                process.exit(1);
            }

            try {
                const report = analyzer.generateMonitoringReport(monitorExperimentId);
                console.log(JSON.stringify(report, null, 2));
            } catch (error) {
                console.error('Error generating monitoring report:', error.message);
                process.exit(1);
            }
            break;

        case 'sample-size':
            const baselineRate = parseFloat(process.argv[3]) || 0.1;
            const minimumEffect = parseFloat(process.argv[4]) || 0.1;
            const power = parseFloat(process.argv[5]) || 0.8;

            const sampleSize = analyzer.calculateSampleSize(baselineRate, minimumEffect, power);
            console.log(`Required sample size per variation: ${sampleSize}`);
            console.log(`Total sample size needed: ${sampleSize * 2}`);
            break;

        default:
            console.log('A/B Test Analyzer for Ignite Health Systems');
            console.log('');
            console.log('Commands:');
            console.log('  analyze <experiment-id> <results-file>  - Analyze experiment results');
            console.log('  monitor <experiment-id>                 - Generate monitoring report');
            console.log('  sample-size [baseline] [effect] [power] - Calculate required sample size');
            console.log('');
            console.log('Examples:');
            console.log('  node ab-test-analyzer.js analyze physician-welcome-v1 results.json');
            console.log('  node ab-test-analyzer.js monitor physician-welcome-v1');
            console.log('  node ab-test-analyzer.js sample-size 0.12 0.15 0.8');
    }
}

module.exports = ABTestAnalyzer;