# Optimized Music Player Rollback Procedure

## Emergency Rollback Process

### Quick Rollback (< 5 minutes)

If immediate rollback is required due to critical issues:

1. **Revert index.html changes**
   ```bash
   # Replace the script loading section in index.html
   # Change lines 481-485 back to:
   const scripts = ['js/music-player.js', 'js/form-optimizer.js'];
   ```

2. **Restore original music player**
   ```bash
   cp deployment-backups/music-player.js.backup.[timestamp] js/music-player.js
   ```

3. **Remove new files (optional cleanup)**
   ```bash
   rm js/optimized-music-player.js
   rm js/web-audio-converter.js
   ```

### Full Rollback with Verification (< 15 minutes)

#### Step 1: Backup Current State
```bash
# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup current optimized files
cp js/optimized-music-player.js "deployment-backups/optimized-music-player.js.rollback.$TIMESTAMP"
cp js/web-audio-converter.js "deployment-backups/web-audio-converter.js.rollback.$TIMESTAMP"
cp index.html "deployment-backups/index.html.rollback.$TIMESTAMP"
```

#### Step 2: Restore Original Files
```bash
# Find the most recent backup
BACKUP_FILE=$(ls -t deployment-backups/music-player.js.backup.* | head -1)

# Restore original music player
cp "$BACKUP_FILE" js/music-player.js

# Restore original index.html configuration
# Manually edit index.html lines 481-485 to:
```

```javascript
// Original configuration in index.html
const scripts = ['js/music-player.js', 'js/form-optimizer.js'];
scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
});
```

#### Step 3: Clean Up New Files
```bash
# Remove optimized music player files
rm js/optimized-music-player.js
rm js/web-audio-converter.js
```

#### Step 4: Verification
1. **Clear browser cache**
   - Hard refresh (Ctrl+F5 / Cmd+Shift+R)
   - Clear application cache in DevTools

2. **Test basic functionality**
   - Page loads without errors
   - Original music player initializes
   - Audio controls work
   - No console errors

3. **Performance check**
   - Page load speed normal
   - No memory leaks
   - Core Web Vitals stable

### Rollback Triggers

Execute immediate rollback if:

- **Critical Errors**
  - Page fails to load
  - JavaScript errors prevent site function
  - Audio completely broken
  - Mobile site unusable

- **Performance Issues**
  - Page load time > 3 seconds
  - Core Web Vitals scores drop significantly
  - Memory usage spikes
  - CPU usage excessive

- **User Experience Issues**
  - Audio controls unresponsive
  - Volume control broken
  - Mobile layout broken
  - Accessibility features broken

### Recovery Testing Checklist

After rollback, verify:

- [ ] Page loads successfully
- [ ] No JavaScript console errors
- [ ] Original music player loads
- [ ] Play/pause functionality works
- [ ] Volume control responsive
- [ ] Progress bar updates
- [ ] Mobile layout intact
- [ ] Cross-browser compatibility
- [ ] Accessibility features functional
- [ ] Core Web Vitals stable

### Communication Plan

#### Internal Team
1. **Immediate notification** (Slack/Teams)
   - Issue description
   - Rollback status
   - ETA for resolution

2. **Post-rollback update**
   - Confirmation of stable state
   - Root cause analysis plan
   - Next steps timeline

#### External (if applicable)
- No user-facing notification needed for backend rollback
- Monitor support channels for user reports
- Prepare communication if issues persist

### File Locations Reference

#### Original Files (Preserved)
```
deployment-backups/
├── music-player.js.backup.[timestamp]    # Original player
├── index.html.backup.[timestamp]         # Original HTML
└── deployment-log.[timestamp].md         # Deployment notes
```

#### Deployed Files (To Remove)
```
js/
├── optimized-music-player.js             # Remove during rollback
└── web-audio-converter.js                # Remove during rollback
```

#### Core Files (Never Change)
```
assets/media/
└── Backing music.mov                     # Leave in place
```

### Prevention for Future Deployments

1. **Staging Environment**
   - Always test in staging first
   - Load test with real traffic patterns
   - Cross-browser validation

2. **Feature Flags**
   - Implement gradual rollout
   - A/B testing capability
   - Instant disable switch

3. **Monitoring**
   - Real-time error tracking
   - Performance monitoring
   - User experience metrics

4. **Automated Testing**
   - Pre-deployment verification
   - Post-deployment health checks
   - Automated rollback triggers

### Contact Information

- **Primary Engineer**: [Deploy Team Lead]
- **Backup Engineer**: [Secondary Contact]
- **System Administrator**: [Ops Team]
- **Emergency Escalation**: [Manager/CTO]

### Deployment Log

Record all actions taken:

```
Date: [Date]
Time: [Time]
Action: [Rollback Initiated/Completed]
Reason: [Issue Description]
Files Changed: [List]
Verification: [Pass/Fail]
Notes: [Additional Details]
```

---

**Remember**: When in doubt, rollback immediately. A working site with the old player is better than a broken site with the new player.

**Recovery Time Objective (RTO)**: < 15 minutes  
**Recovery Point Objective (RPO)**: Zero data loss (static files only)