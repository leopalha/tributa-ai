import { NextApiRequest, NextApiResponse } from 'next';

interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  createdAt: Date;
  lastTriggered?: Date;
}

interface WebhookEvent {
  id: string;
  type: 'TRANSACTION' | 'BLOCK' | 'ANOMALY' | 'RISK_ALERT' | 'CONTRACT_DEPLOY';
  data: any;
  timestamp: Date;
  processed: boolean;
}

// In-memory storage for demo (use database in production)
let webhookSubscriptions: WebhookSubscription[] = [];
let webhookEvents: WebhookEvent[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return handleGetWebhooks(req, res);
      case 'POST':
        return handleCreateWebhook(req, res);
      case 'PUT':
        return handleUpdateWebhook(req, res);
      case 'DELETE':
        return handleDeleteWebhook(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Webhook API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetWebhooks(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  switch (action) {
    case 'list':
      return res.status(200).json({
        webhooks: webhookSubscriptions,
        total: webhookSubscriptions.length
      });

    case 'events':
      const { limit = '50', offset = '0' } = req.query;
      const events = webhookEvents
        .slice(parseInt(offset as string))
        .slice(0, parseInt(limit as string));
      
      return res.status(200).json({
        events,
        total: webhookEvents.length,
        hasMore: webhookEvents.length > parseInt(offset as string) + parseInt(limit as string)
      });

    case 'test':
      const { webhookId } = req.query;
      if (!webhookId) {
        return res.status(400).json({ error: 'Webhook ID required' });
      }
      
      const webhook = webhookSubscriptions.find(w => w.id === webhookId);
      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }
      
      // Send test event
      const testEvent = {
        id: `test-${Date.now()}`,
        type: 'TEST' as any,
        data: {
          message: 'This is a test webhook event',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date(),
        processed: false
      };
      
      const success = await sendWebhookEvent(webhook, testEvent);
      
      return res.status(200).json({
        success,
        message: success ? 'Test event sent successfully' : 'Failed to send test event'
      });

    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}

async function handleCreateWebhook(req: NextApiRequest, res: NextApiResponse) {
  const { url, events, secret } = req.body;

  if (!url || !events || !Array.isArray(events)) {
    return res.status(400).json({ 
      error: 'URL and events array are required',
      example: {
        url: 'https://your-app.com/webhook',
        events: ['TRANSACTION', 'ANOMALY'],
        secret: 'optional-secret-key'
      }
    });
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Validate events
  const validEvents = ['TRANSACTION', 'BLOCK', 'ANOMALY', 'RISK_ALERT', 'CONTRACT_DEPLOY'];
  const invalidEvents = events.filter((event: string) => !validEvents.includes(event));
  if (invalidEvents.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid events',
      invalidEvents,
      validEvents
    });
  }

  const webhook: WebhookSubscription = {
    id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url,
    events,
    isActive: true,
    secret: secret || generateSecret(),
    createdAt: new Date()
  };

  webhookSubscriptions.push(webhook);

  return res.status(201).json({
    webhook,
    message: 'Webhook created successfully'
  });
}

async function handleUpdateWebhook(req: NextApiRequest, res: NextApiResponse) {
  const { webhookId } = req.query;
  const { url, events, isActive, secret } = req.body;

  if (!webhookId) {
    return res.status(400).json({ error: 'Webhook ID required' });
  }

  const webhookIndex = webhookSubscriptions.findIndex(w => w.id === webhookId);
  if (webhookIndex === -1) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  const webhook = webhookSubscriptions[webhookIndex];

  // Update fields if provided
  if (url) {
    try {
      new URL(url);
      webhook.url = url;
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
  }

  if (events) {
    const validEvents = ['TRANSACTION', 'BLOCK', 'ANOMALY', 'RISK_ALERT', 'CONTRACT_DEPLOY'];
    const invalidEvents = events.filter((event: string) => !validEvents.includes(event));
    if (invalidEvents.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid events',
        invalidEvents,
        validEvents
      });
    }
    webhook.events = events;
  }

  if (typeof isActive === 'boolean') {
    webhook.isActive = isActive;
  }

  if (secret) {
    webhook.secret = secret;
  }

  webhookSubscriptions[webhookIndex] = webhook;

  return res.status(200).json({
    webhook,
    message: 'Webhook updated successfully'
  });
}

async function handleDeleteWebhook(req: NextApiRequest, res: NextApiResponse) {
  const { webhookId } = req.query;

  if (!webhookId) {
    return res.status(400).json({ error: 'Webhook ID required' });
  }

  const webhookIndex = webhookSubscriptions.findIndex(w => w.id === webhookId);
  if (webhookIndex === -1) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  const deletedWebhook = webhookSubscriptions.splice(webhookIndex, 1)[0];

  return res.status(200).json({
    webhook: deletedWebhook,
    message: 'Webhook deleted successfully'
  });
}

// Utility functions
function generateSecret(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function sendWebhookEvent(webhook: WebhookSubscription, event: WebhookEvent): Promise<boolean> {
  if (!webhook.isActive) {
    return false;
  }

  try {
    const payload = {
      id: event.id,
      type: event.type,
      data: event.data,
      timestamp: event.timestamp.toISOString()
    };

    // In a real implementation, you would:
    // 1. Sign the payload with the webhook secret
    // 2. Make HTTP request to webhook.url
    // 3. Handle retries and failures
    // 4. Log delivery attempts

    console.log(`Sending webhook to ${webhook.url}:`, payload);
    
    // Simulate HTTP request (replace with actual fetch in production)
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': generateSignature(payload, webhook.secret),
        'User-Agent': 'TributaAI-Webhook/1.0'
      },
      body: JSON.stringify(payload)
    }).catch(() => ({ ok: false }));

    if (response.ok) {
      webhook.lastTriggered = new Date();
      event.processed = true;
      return true;
    }

    return false;
  } catch (error) {
    console.error('Webhook delivery failed:', error);
    return false;
  }
}

function generateSignature(payload: any, secret: string): string {
  // In production, use proper HMAC signing
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

// Function to trigger webhook events (would be called from other parts of the application)
export async function triggerWebhookEvent(type: WebhookEvent['type'], data: any) {
  const event: WebhookEvent = {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: new Date(),
    processed: false
  };

  webhookEvents.push(event);

  // Find webhooks interested in this event type
  const interestedWebhooks = webhookSubscriptions.filter(
    webhook => webhook.isActive && webhook.events.includes(type)
  );

  // Send to all interested webhooks
  const results = await Promise.all(
    interestedWebhooks.map(webhook => sendWebhookEvent(webhook, event))
  );

  return {
    event,
    delivered: results.filter(Boolean).length,
    total: interestedWebhooks.length
  };
}