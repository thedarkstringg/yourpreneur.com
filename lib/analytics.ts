// Analytics and tracking utilities

export interface UserAction {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: string;
}

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: string;
}

class Analytics {
  private enabled: boolean = true;
  private events: AnalyticsEvent[] = [];

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  track(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);

    // Send to analytics endpoint if configured
    this.sendEvent(event);
  }

  private sendEvent(event: AnalyticsEvent) {
    // Stub: In production, would send to analytics service
    // Example: Mixpanel, Segment, Amplitude, Posthog
    console.debug('[Analytics]', event);
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

// Singleton instance
const analytics = new Analytics();

export { analytics };

// Event helpers
export const trackVentureCreated = (ventureId: string, industry: string) => {
  analytics.track('venture_created', { ventureId, industry });
};

export const trackVentureModified = (ventureId: string, field: string) => {
  analytics.track('venture_modified', { ventureId, field });
};

export const trackEventCreated = (ventureId: string, eventType: string) => {
  analytics.track('event_created', { ventureId, eventType });
};

export const trackTaskCreated = (taskId: string, role: string) => {
  analytics.track('task_created', { taskId, role });
};

export const trackExportAction = (format: 'csv' | 'json' | 'pdf') => {
  analytics.track('export_action', { format });
};

export const trackIntegrationConnected = (integrationType: string) => {
  analytics.track('integration_connected', { integrationType });
};

export const trackSearchPerformed = (query: string, resultCount: number) => {
  analytics.track('search_performed', { query, resultCount });
};

export const trackTimeSpent = (section: string, seconds: number) => {
  analytics.track('time_spent', { section, seconds });
};
