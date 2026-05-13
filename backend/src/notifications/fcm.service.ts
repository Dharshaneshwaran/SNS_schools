import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FcmService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    try {
      let serviceAccount: any;
      const envServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

      if (envServiceAccount) {
        serviceAccount = JSON.parse(envServiceAccount);
      } else {
        const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
        if (fs.existsSync(serviceAccountPath)) {
          serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        }
      }

      if (serviceAccount) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin initialized successfully');
      } else {
        console.warn('Firebase service account not found (env or file), push notifications will be disabled');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error.message);
    }
  }

  async sendPushNotification(tokens: string[], title: string, body: string, data?: any) {
    if (tokens.length === 0) return { successCount: 0, failureCount: 0, invalidTokens: [] };

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'high_importance_channel',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      const invalidTokens: string[] = [];
      
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error as any;
            // Check for specific error codes that indicate the token is no longer valid
            if (
              error?.code === 'messaging/registration-token-not-registered' ||
              error?.code === 'messaging/invalid-registration-token'
            ) {
              invalidTokens.push(tokens[idx]);
            }
            console.error(`Failed to send to token ${tokens[idx]}:`, error?.message || error);
          }
        });
      }
      
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  async sendToTopic(topic: string, title: string, body: string, data?: any) {
    const message: admin.messaging.Message = {
      topic,
      notification: {
        title,
        body,
      },
      data: data || {},
    };

    try {
      const response = await admin.messaging().send(message);
      console.log(`Successfully sent message to topic ${topic}:`, response);
      return response;
    } catch (error) {
      console.error(`Error sending to topic ${topic}:`, error);
      throw error;
    }
  }
}
