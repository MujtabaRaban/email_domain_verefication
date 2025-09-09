import { db } from '../../db/index';
import { audit_events } from '../../db/schema';

export const auditService = {
  async logEvent(email: string, eventType: string, metadata?: any): Promise<void> {
    await db.insert(audit_events).values({ 
      email, 
      event_type: eventType, 
      metadata 
    });
  }
};