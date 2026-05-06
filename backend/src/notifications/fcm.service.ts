import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
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
        serviceAccount = require(serviceAccountPath);
      }

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.warn('Firebase Admin initialization failed. Push notifications may not work.', error.message);
    }
  }

  async sendPushNotification(tokens: string[], title: string, body: string, data?: any) {
    if (tokens.length === 0) return;

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
      console.log(`${response.successCount} messages were sent successfully`);
      
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            console.error(`Failed to send to token ${tokens[idx]}:`, resp.error);
          }
        });
        // You could potentially remove failed tokens from DB here
      }
      
      return response;
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
