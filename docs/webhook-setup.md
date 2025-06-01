# Clerk Webhook Setup Guide

This guide will help you set up Clerk webhooks to sync user data with your database.

## Prerequisites

1. A Clerk account with an application created
2. Your application deployed or running locally with a public URL (you can use ngrok for local development)

## Steps to Set Up Webhooks

1. **Log in to your Clerk Dashboard**
   - Go to [dashboard.clerk.dev](https://dashboard.clerk.dev)
   - Select your application

2. **Navigate to Webhooks**
   - In the left sidebar, click on "Webhooks"
   - Click "Add Endpoint"

3. **Configure the Webhook Endpoint**
   - **URL**: Enter your webhook URL (e.g., `https://your-domain.com/api/webhooks/clerk`)
   - **Message Filtering**: Select the events you want to receive:
     - `user.created`
     - `user.updated`
     - `user.deleted`
   - **Version**: Select the latest API version
   - Click "Create"

4. **Copy the Signing Secret**
   - After creating the webhook, you'll see a signing secret
   - Copy this secret and add it to your environment variables as `CLERK_WEBHOOK_SECRET`

5. **Test the Webhook**
   - In the Clerk Dashboard, go to the webhook details
   - Click "Send Example" to send a test event
   - Check your application logs to verify the webhook is received and processed

## Troubleshooting

If webhooks are not working:

1. **Check Environment Variables**
   - Ensure `CLERK_WEBHOOK_SECRET` is correctly set in your environment

2. **Check Logs**
   - Look for webhook-related logs in your application
   - Verify that the webhook endpoint is receiving requests

3. **Check Webhook Status**
   - In the Clerk Dashboard, check the webhook's recent deliveries
   - Look for any failed deliveries and their error messages

4. **Verify Endpoint Accessibility**
   - Ensure your webhook endpoint is publicly accessible
   - For local development, use a tool like ngrok to expose your local server

5. **Implement Fallback Mechanism**
   - Use the `ensureUserExists` function as a fallback in case webhooks