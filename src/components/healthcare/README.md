# Healthcare EHR Preview Components

This directory contains healthcare-specific components for the Ignite Health Systems website, focusing on Electronic Health Record (EHR) system demonstrations and previews.

## Components Overview

### `ehr-preview.tsx` - Comprehensive EHR System Demo

A full-featured, interactive EHR system preview that showcases the Ignite platform's capabilities through a realistic healthcare workflow demonstration.

#### Key Features

**🔥 Fire Theme Integration**
- Uses the fire color palette (fire-500, ember-500, flame-500)
- Animated elements with fire-themed glows and effects
- Gradient backgrounds and smooth transitions

**📱 Responsive Design**
- Mobile-first approach with responsive breakpoints
- Adaptive layouts for desktop, tablet, and mobile
- Collapsible navigation for space optimization

**🎨 Professional Healthcare UI**
- HIPAA-compliant design patterns
- Healthcare-specific iconography
- Clinical data visualization
- Medical workflow patterns

**🤖 AI Integration Showcase**
- Real-time voice transcription simulation
- AI-powered clinical insights
- Automated documentation generation
- Smart recommendations and alerts

**📊 Before/After Workflow Comparison**
- Traditional EHR workflow demonstration
- Ignite AI-powered workflow showcase
- Performance metrics and ROI calculations
- Efficiency comparisons

#### Sections and Views

1. **Dashboard View**
   - AI clinical insights panel
   - Today's schedule overview
   - Performance metrics
   - Quick stats and notifications

2. **Patient Management**
   - Patient list with search/filtering
   - Detailed patient profiles
   - Medical history and vitals
   - Risk scoring and prioritization

3. **Voice Documentation**
   - Interactive voice recording interface
   - Real-time transcription simulation
   - AI suggestions and enhancements
   - SOAP note generation

4. **Message Center**
   - Inbox with priority filtering
   - Lab results notifications
   - Patient communications
   - Colleague consultations

5. **Analytics Dashboard**
   - ROI calculations
   - Efficiency metrics
   - Quality indicators
   - Time savings visualization

6. **Schedule Management**
   - Appointment overview
   - Calendar integration
   - Attendance tracking
   - Time optimization

#### Mock Data Structure

```typescript
interface PatientData {
  id: string
  name: string
  age: number
  mrn: string
  vitals: {
    bloodPressure: string
    heartRate: number
    temperature: number
    oxygenSat: number
    respiratoryRate: number
  }
  allergies: string[]
  medications: Array<{
    name: string
    dosage: string
    frequency: string
  }>
  conditions: string[]
  riskScore: number
}
```

#### Interactive Features

- **Voice Recording Simulation**: Click-to-start recording with live transcript
- **Patient Selection**: Click patients to view detailed information
- **Tab Navigation**: Switch between different EHR sections
- **Workflow Toggle**: Compare traditional vs. Ignite workflows
- **Responsive Navigation**: Collapsible sidebar for mobile

#### Accessibility Features

- WCAG 2.1 AA compliant design
- Keyboard navigation support
- Screen reader optimized
- High contrast color schemes
- Focus indicators and landmarks

#### Usage

```tsx
import { EHRPreview } from "@/components/healthcare/ehr-preview"

export function MyPage() {
  return (
    <div className="container mx-auto">
      <EHRPreview />
    </div>
  )
}
```

#### Customization

The component is highly customizable through:

- **Fire theme variables**: Adjust colors in `tailwind.config.ts`
- **Mock data**: Replace `mockPatients` and `mockMessages` arrays
- **Feature toggles**: Enable/disable specific functionalities
- **Layout variants**: Modify responsive breakpoints and layouts

#### Performance Considerations

- **Lazy loading**: Components load progressively
- **Optimized animations**: GPU-accelerated transforms
- **Memory management**: Cleanup of intervals and timers
- **Bundle size**: Tree-shakeable components

#### Security & Compliance

- **No real patient data**: All data is mock/simulated
- **HIPAA design patterns**: Follows healthcare privacy guidelines
- **Secure state management**: No sensitive data persistence
- **Audit trails**: Action logging for demonstrations

### `dashboard-preview-health.tsx` - Simplified Wrapper

A lightweight wrapper component that imports and displays the main EHR preview.

### Supporting Components

- **Card components**: For data display and organization
- **Progress bars**: For metrics visualization
- **Badges**: For status and priority indicators
- **Avatars**: For user representation
- **Form controls**: For interactive elements

## Design System Integration

### Colors
- **Primary**: Fire theme (#f97316)
- **Secondary**: Ember theme (#ec4899)
- **Success**: Green variants for positive metrics
- **Warning**: Amber for attention items
- **Error**: Red for critical alerts

### Typography
- **Headings**: Inter font family, semibold weights
- **Body text**: Inter, regular weight
- **Data values**: Mono space for numerical data
- **Medical terms**: Consistent formatting

### Spacing
- **Component gaps**: 4-6 spacing units
- **Section padding**: 6-8 spacing units
- **Card padding**: 4-6 spacing units
- **Responsive scaling**: Proportional adjustments

### Animations
- **Entrance**: Fade-in and slide-up effects
- **Interactions**: Hover and focus states
- **Loading states**: Pulse and skeleton patterns
- **Transitions**: Smooth 300ms easing

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Component prop validation
- Error boundary implementation

### Testing Strategy
- Unit tests for data transformations
- Integration tests for user interactions
- Accessibility testing with axe
- Visual regression testing

### Performance Optimization
- React.memo for expensive renders
- useCallback for stable references
- Virtualization for large lists
- Image optimization and lazy loading

### Browser Support
- Modern browsers (ES2018+)
- Progressive enhancement
- Graceful degradation
- Mobile browser optimization

## Deployment Considerations

### Bundle Optimization
- Tree shaking enabled
- Code splitting by route
- Preloading critical resources
- Compression and minification

### Monitoring
- Performance metrics tracking
- Error logging and reporting
- User interaction analytics
- Accessibility auditing

### Updates and Maintenance
- Regular dependency updates
- Security vulnerability scanning
- Performance monitoring
- User feedback integration

## Contributing

When contributing to healthcare components:

1. **Follow HIPAA guidelines**: No real patient data
2. **Maintain accessibility**: Test with screen readers
3. **Update documentation**: Keep README current
4. **Test thoroughly**: Cross-browser and device testing
5. **Review security**: Audit for potential vulnerabilities

## Related Documentation

- [Tailwind Config](../../tailwind.config.ts) - Theme and animation setup
- [Component Library](../ui/) - Base UI components
- [Design System](../../styles/) - Global styles and variables
- [Healthcare Icons](../../assets/healthicons/) - Medical iconography