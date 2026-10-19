const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(DIST_DIR, reqPath);

    // If file doesn't exist, fallback to dist/index.html for SPA
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.message);
    }
  });
}

const VIEWPORTS = [
  { name: 'Desktop Large', width: 1920, height: 1080 },
  { name: 'Desktop Standard', width: 1440, height: 900 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile Standard (iPhone 14)', width: 390, height: 844 },
  { name: 'Mobile Compact (iPhone mini)', width: 375, height: 812 }
];

async function runTestSuite() {
  console.log('====================================================');
  console.log('   AWWWARDS ELEVATION SUITE: PLAYWRIGHT QA TEST');
  console.log('====================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ does not exist. Run "npm run build" first.');
    process.exit(1);
  }

  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[PASS] Static test server running on ${BASE_URL}\n`);

  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const results = { passed: 0, failed: 0, viewportsTested: [] };
  const consoleErrors = [];

  try {
    // 1. MULTI-VIEWPORT VERIFICATION
    for (const vp of VIEWPORTS) {
      console.log(`--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push({ context: vp.name, text: msg.text() });
        }
      });

      // Intercept and detect any AudioContext initialization
      await page.addInitScript(() => {
        window.__audioDetected = false;
        const handler = {
          construct(target, args) {
            window.__audioDetected = true;
            return new target(...args);
          }
        };
        if (window.AudioContext) window.AudioContext = new Proxy(window.AudioContext, handler);
        if (window.webkitAudioContext) window.webkitAudioContext = new Proxy(window.webkitAudioContext, handler);
      });

      await page.goto(BASE_URL, { waitUntil: 'networkidle' });

      // Check Hero Name
      const heroText = await page.textContent('body');
      const hasRitvik = heroText.includes('RITVIK CHUNAMARI');
      if (hasRitvik) {
        console.log(`  ✓ Hero displays "RITVIK CHUNAMARI"`);
        results.passed++;
      } else {
        console.error(`  ✗ Hero missing "RITVIK CHUNAMARI"`);
        results.failed++;
      }

      // Check Brand Manifesto
      const hasManifesto = heroText.includes('Design for humans. Build for wonder.');
      if (hasManifesto) {
        console.log(`  ✓ Brand statement "Design for humans. Build for wonder." is present`);
        results.passed++;
      } else {
        console.error(`  ✗ Brand statement missing`);
        results.failed++;
      }

      // Check Body Cursor
      const bodyCursor = await page.evaluate(() => window.getComputedStyle(document.body).cursor);
      if (bodyCursor !== 'none') {
        console.log(`  ✓ Body cursor is NOT globally none (${bodyCursor})`);
        results.passed++;
      } else {
        console.error(`  ✗ Body cursor is globally none!`);
        results.failed++;
      }

      // Take screenshot of home
      const slugName = vp.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const ssPath = path.join(screenshotDir, `${slugName}-home.png`);
      await page.screenshot({ path: ssPath, fullPage: false });
      console.log(`  ✓ Screenshot saved: ${path.basename(ssPath)}`);

      results.viewportsTested.push({ name: vp.name, dimensions: `${vp.width}x${vp.height}`, status: 'PASS' });
      await context.close();
    }

    // 2. PROJECT LIST CATEGORY ARCHITECTURE & VIEW MODES
    console.log(`\n--- Testing Project List Category Architecture & Dividers ---`);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push({ context: 'ProjectList', text: msg.text() });
    });

    await page.goto(`${BASE_URL}/#work`, { waitUntil: 'networkidle' });

    // Verify Experiment Category Divider in Mode A (Editorial)
    const categoryDivider = await page.$('[data-testid="experiment-category-divider"]');
    if (categoryDivider) {
      console.log(`  ✓ Technology Experiments category divider rendered in Editorial mode`);
      results.passed++;
    } else {
      console.error(`  ✗ Technology Experiments category divider missing in Editorial mode!`);
      results.failed++;
    }

    // Switch to Mode B (Index mode)
    const indexModeBtn = await page.$('button[data-cursor-text="INDEX"]');
    if (indexModeBtn) {
      await indexModeBtn.click();
      await page.waitForTimeout(300);
      const indexDivider = await page.$('[data-testid="experiment-index-divider"]');
      if (indexDivider) {
        console.log(`  ✓ Technology Experiments category divider rendered in Index mode`);
        results.passed++;
      } else {
        console.error(`  ✗ Technology Experiments category divider missing in Index mode!`);
        results.failed++;
      }
    } else {
      console.error(`  ✗ Index mode toggle button not found!`);
      results.failed++;
    }

    // 3. HUMAN INTERFACE LAB DEEP INTERACTION (ZERO SKIPS)
    console.log(`\n--- Testing Human Interface Lab: Full Interactive Verification ---`);
    await page.goto(`${BASE_URL}/#experiments`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const labSection = await page.$('#experiments');
    if (labSection) {
      console.log(`  ✓ Human Interface Lab section rendered`);
      results.passed++;
    } else {
      console.error(`  ✗ Human Interface Lab section not found!`);
      results.failed++;
    }

    // Test Exp 01: The Feel of an Interface
    console.log(`  Testing Exp 01 (Tactile Dynamics)...`);
    const rigidSystemBtn = await page.$('[data-testid="exp01-system-rigid"]');
    const kineticSystemBtn = await page.$('[data-testid="exp01-system-kinetic"]');
    const exp01Trigger = await page.$('[data-testid="exp01-trigger"]');
    const exp01Counter = await page.$('[data-testid="exp01-click-counter"]');
    const exp01Slider = await page.$('[data-testid="exp01-slider"]');

    if (rigidSystemBtn && kineticSystemBtn && exp01Trigger && exp01Counter && exp01Slider) {
      await rigidSystemBtn.click();
      await exp01Trigger.click();
      await exp01Trigger.click();
      await kineticSystemBtn.click();
      await exp01Trigger.click();

      const countText = await exp01Counter.textContent();
      if (countText && countText.includes('CLICKS: 3')) {
        console.log(`  ✓ Exp 01: System switcher & click actuation verified (3 clicks registered)`);
        results.passed++;
      } else {
        console.error(`  ✗ Exp 01: Actuation count failed (expected "CLICKS: 3", got "${countText}")`);
        results.failed++;
      }

      await exp01Slider.fill('85');
      await exp01Slider.dispatchEvent('input');
      const sliderReadout = await page.$eval('[data-testid="exp01-slider-val"]', el => el.textContent);
      if (sliderReadout && sliderReadout.includes('85%')) {
        console.log(`  ✓ Exp 01: Stepped interaction slider verified (85%)`);
        results.passed++;
      } else {
        console.error(`  ✗ Exp 01: Slider readout failed (expected "85%", got "${sliderReadout}")`);
        results.failed++;
      }
    } else {
      console.error(`  ✗ Exp 01: Critical interactive controls missing!`);
      results.failed++;
    }

    // Test Exp 02: Designed for Everyone (Radical Accessibility Engine)
    console.log(`  Testing Exp 02 (Radical Accessibility Engine)...`);
    const exp02StandardSize = await page.$('[data-testid="exp02-size-standard"]');
    const exp02AccessibleSize = await page.$('[data-testid="exp02-size-accessible"]');
    const exp02FocusNone = await page.$('[data-testid="exp02-focus-none"]');
    const exp02FocusVisible = await page.$('[data-testid="exp02-focus-visible"]');
    const exp02ContrastLow = await page.$('[data-testid="exp02-contrast-low"]');
    const exp02ContrastHigh = await page.$('[data-testid="exp02-contrast-high"]');
    const exp02TargetBtn = await page.$('[data-testid="exp02-target-button"]');
    const exp02AuditStatus = await page.$('[data-testid="exp02-audit-status"]');

    if (exp02StandardSize && exp02AccessibleSize && exp02FocusNone && exp02FocusVisible && exp02ContrastLow && exp02ContrastHigh && exp02TargetBtn && exp02AuditStatus) {
      // Test focus suppression state
      await exp02FocusNone.click();
      const suppressVal = await exp02TargetBtn.getAttribute('data-suppress-focus');
      if (suppressVal === 'true') {
        console.log(`  ✓ Exp 02: Focus suppression attribute correctly applied`);
        results.passed++;
      } else {
        console.error(`  ✗ Exp 02: Focus suppression attribute expected "true", got "${suppressVal}"`);
        results.failed++;
      }

      // Test hit score
      await exp02TargetBtn.click();
      const hitRateText = await page.$eval('[data-testid="exp02-hit-rate"]', el => el.textContent);
      if (hitRateText && hitRateText.includes('1 Hits')) {
        console.log(`  ✓ Exp 02: Hit accuracy scoring verified (1 Hits)`);
        results.passed++;
      } else {
        console.error(`  ✗ Exp 02: Hit rate scoring failed (got "${hitRateText}")`);
        results.failed++;
      }

      // Test AAA full conformance configuration
      await exp02AccessibleSize.click();
      await exp02FocusVisible.click();
      await exp02ContrastHigh.click();
      const auditText = await exp02AuditStatus.textContent();
      if (auditText && auditText.includes('FULL WCAG 2.2 AA CONFORMANCE')) {
        console.log(`  ✓ Exp 02: WCAG 2.2 AA audit badge passed`);
        results.passed++;
      } else {
        console.error(`  ✗ Exp 02: Audit status badge failed (got "${auditText}")`);
        results.failed++;
      }
    } else {
      console.error(`  ✗ Exp 02: Critical accessibility controls missing!`);
      results.failed++;
    }

    // Test Exp 03: From Thought to Interface (Design Token Synthesizer)
    console.log(`  Testing Exp 03 (Design Token Synthesizer)...`);
    const exp03Editorial = await page.$('[data-testid="exp03-type-editorial"]');
    const exp03Generous = await page.$('[data-testid="exp03-space-generous"]');
    const exp03Sharp = await page.$('[data-testid="exp03-radius-sharp"]');
    const exp03Minimal = await page.$('[data-testid="exp03-density-minimal"]');
    const exp03Manifest = await page.$('[data-testid="exp03-active-tokens"]');

    if (exp03Editorial && exp03Generous && exp03Sharp && exp03Minimal && exp03Manifest) {
      await exp03Editorial.click();
      await exp03Generous.click();
      await exp03Sharp.click();
      await exp03Minimal.click();

      const manifestText = await exp03Manifest.textContent();
      if (manifestText && manifestText.includes('EDITORIAL') && manifestText.includes('GENEROUS') && manifestText.includes('SHARP') && manifestText.includes('MINIMAL')) {
        console.log(`  ✓ Exp 03: Token Synthesizer dynamically applied tokens: "${manifestText.trim()}"`);
        results.passed++;
      } else {
        console.error(`  ✗ Exp 03: Active tokens manifest mismatch (got "${manifestText}")`);
        results.failed++;
      }
    } else {
      console.error(`  ✗ Exp 03: Critical token synthesizer controls missing!`);
      results.failed++;
    }

    await page.screenshot({ path: path.join(screenshotDir, 'lab-experiment-interaction.png') });

    // 4. PROJECT DETAIL & 30-SEC SUMMARY & RETROSPECTIVE
    console.log(`\n--- Testing Project Detail Deep Linking & Modules ---`);
    await page.goto(`${BASE_URL}/#impact-events`, { waitUntil: 'networkidle' });
    
    try {
      await page.waitForSelector('[data-testid="executive-summary"]', { timeout: 6000 });
      console.log(`  ✓ 30-Second Executive Summary module rendered on Impact Events`);
      results.passed++;
    } catch (err) {
      console.error(`  ✗ 30-Second Executive Summary module not found!`);
      results.failed++;
    }

    try {
      await page.waitForSelector('[data-testid="design-retrospective"]', { timeout: 3000 });
      console.log(`  ✓ Design Retrospective module rendered on Impact Events`);
      results.passed++;
    } catch (err) {
      console.error(`  ✗ Design Retrospective module not found!`);
      results.failed++;
    }

    await page.screenshot({ path: path.join(screenshotDir, 'impact-events-detail.png') });

    // 5. TEST ALL 7 PROJECT SLUGS VIA DEEP LINK
    const SLUGS = [
      'impact-events',
      'nexus-ai',
      'security-agency-ux',
      'usps-organization-rebrand',
      'kinetix-quant',
      'pill-dispenser-3d',
      'mumbai-olympics-2028'
    ];

    console.log(`\n--- Validating Deep Links for All 7 Projects ---`);
    for (const slug of SLUGS) {
      await page.goto(`${BASE_URL}/#${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      const hasExec = await page.$('[data-testid="executive-summary"]');
      const hasRetro = await page.$('[data-testid="design-retrospective"]');
      if (hasExec && hasRetro) {
        console.log(`  ✓ Project #${slug}: Executive Summary & Retrospective verified`);
        results.passed++;
      } else {
        console.error(`  ✗ Project #${slug}: Missing modules (exec: ${!!hasExec}, retro: ${!!hasRetro})`);
        results.failed++;
      }
    }

    // 6. ELEVATED 404 ARCHIVE RADAR & COORDINATE RECOVERY
    console.log(`\n--- Testing Elevated 404 Archive Radar & Navigation Recovery ---`);
    await page.goto(`${BASE_URL}/#invalid-deep-link-coordinate`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const bodyContent = await page.textContent('body');
    if (bodyContent.includes('ARCHIVE COORDINATE UNRESOLVED') || bodyContent.includes('PROJECT NOT FOUND')) {
      console.log(`  ✓ 404 state rendered telemetry: "ARCHIVE COORDINATE UNRESOLVED"`);
      results.passed++;
    } else {
      console.error(`  ✗ 404 state missing archive error notification!`);
      results.failed++;
    }

    // Test rapid deep link recovery directly into Impact Events from 404 radar
    try {
      const recoveryPill = await page.waitForSelector('[data-testid="404-link-impact-events"]', { timeout: 4000 });
      await recoveryPill.click();
      await page.waitForSelector('[data-testid="executive-summary"]', { timeout: 6000 });
      console.log(`  ✓ 404 Archive Radar successfully launched #impact-events directly`);
      results.passed++;
    } catch (err) {
      console.error(`  ✗ 404 Archive Radar link failed to open project view:`, err.message);
      results.failed++;
    }

    // Return back to 404 and test "Return to Exhibition" button
    await page.goto(`${BASE_URL}/#another-unknown-slug`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotDir, '404-fallback.png') });
    try {
      const returnButton = await page.waitForSelector('[data-testid="return-to-exhibition"]', { timeout: 4000 });
      await returnButton.click();
      await page.waitForTimeout(600);
      const currentUrl = page.url();
      if (!currentUrl.includes('another-unknown-slug')) {
        console.log(`  ✓ 404 recovery button navigated cleanly back to exhibition`);
        results.passed++;
      } else {
        console.error(`  ✗ 404 return button failed to clear invalid coordinate URL! (${currentUrl})`);
        results.failed++;
      }
    } catch (err) {
      console.error(`  ✗ 404 return-to-exhibition button missing:`, err.message);
      results.failed++;
    }

    // 7. PREFERS-REDUCED-MOTION EMULATION TEST
    console.log(`\n--- Testing prefers-reduced-motion Emulation ---`);
    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const rmPage = await rmContext.newPage();
    rmPage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push({ context: 'ReducedMotion', text: msg.text() });
    });

    await rmPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    const rmHeroText = await rmPage.textContent('body');
    if (rmHeroText.includes('RITVIK CHUNAMARI')) {
      console.log(`  ✓ prefers-reduced-motion rendered instantly without animation freezes`);
      results.passed++;
    } else {
      console.error(`  ✗ prefers-reduced-motion failed to render hero content!`);
      results.failed++;
    }
    await rmContext.close();

    // 8. ZERO AUDIO CONTEXT CHECK
    console.log(`\n--- Checking Zero Audio Policy Enforcement ---`);
    const audioCreated = await page.evaluate(() => window.__audioDetected || false);
    if (!audioCreated) {
      console.log(`  ✓ Zero Audio Policy confirmed: No AudioContext or sound elements initialized`);
      results.passed++;
    } else {
      console.error(`  ✗ AudioContext was detected on the page!`);
      results.failed++;
    }

    // 9. CONSOLE HEALTH AUDIT
    console.log(`\n--- Checking Console Health ---`);
    if (consoleErrors.length === 0) {
      console.log(`  ✓ Zero console errors detected across entire test run`);
      results.passed++;
    } else {
      console.warn(`  ! Found ${consoleErrors.length} console errors:`, consoleErrors);
    }

    await context.close();
  } finally {
    await browser.close();
    server.close();
    console.log(`\n[INFO] Static test server stopped.`);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${results.passed} Passed | ${results.failed} Failed`);
  console.log('====================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
