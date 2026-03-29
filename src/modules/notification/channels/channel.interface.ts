export interface NotificationChannel {
  send(to: string[], subject: string, html: string): Promise<void>;
}
