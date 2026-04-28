# Razorpay Integration Guide

Your website is fully programmed to accept payments via Razorpay (including Credit/Debit Cards, UPI, and QR Codes). All successful payments are automatically saved to your MongoDB database.

To take it out of "Demo Mode" and activate the real payment modal, you must configure your API keys on your hosting platforms.

## Step 1: Get your Razorpay Keys
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Look at the top of the screen and ensure the switch is set to **Test Mode**.
3. On the left menu, click **Account & Settings**, then click **API Keys** under the 'Website and app settings' section.
4. Click **Generate Test Key**.
5. It will show you a `Key Id` (starts with `rzp_test_...`) and a `Key Secret`. Keep this tab open.

## Step 2: Add Keys to Render (Backend)
1. Go to your Render Dashboard (`srv-d7n36mfavr4c73fck07g`).
2. Click **Environment** on the left menu.
3. Click "Add Environment Variable" and add two new variables:
   - Key: `RAZORPAY_KEY_ID` | Value: *(Paste your Key Id here)*
   - Key: `RAZORPAY_KEY_SECRET` | Value: *(Paste your Key Secret here)*
4. Click **Save Changes**. (Render will automatically redeploy the backend).

## Step 3: Add Key to Vercel (Frontend)
1. Go to your Vercel Dashboard for your project (`uptown-render-vercel-final`).
2. Click the **Settings** tab at the top.
3. On the left-hand menu, click **Environment Variables**.
4. Add a new variable:
   - Key: `VITE_RAZORPAY_KEY_ID`
   - Value: *(Paste your Key Id here)*
5. Click the **Save** button.

## Step 4: Force a Redeploy on Vercel (Crucial!)
Vercel will NOT apply the new variable until you rebuild the site.
1. At the top of the Vercel screen, click the **Deployments** tab.
2. Find the very top deployment (the most recent one).
3. Click the **three dots (`...`)** on the far right side of that deployment.
4. Click **Redeploy** from the dropdown menu, then click **Redeploy** again to confirm.

Wait about 60 seconds for the deployment to finish (green checkmark).

## Step 5: Test the Payment
1. Go to your live website.
2. Do a **Hard Refresh** (`Command + Shift + R` on Mac or `Ctrl + F5` on Windows) to clear your cache.
3. Add an item to your bag, open the Checkout Page, and click "Pay Securely".
4. The official Razorpay Modal will pop up over your screen!
