# Uptown — fashion e-commerce full stack app

Uptown is a clean fashion shopping app with a React frontend, Node/Express backend, database storage, email OTP, Google login, saved search history, cart, wishlist, reviews, uploaded review photos, orders, and Razorpay checkout.

Correct hosting plan:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas for real deployment
- Local test database: backend/data/local-db.json when MongoDB is empty
- OTP email: Gmail App Password
- Paywall/payment: Razorpay

---

## What is inside

```txt
uptown-render-vercel-final
├── backend
│   ├── src
│   ├── data
│   ├── package.json
│   └── .env.example
└── frontend
    ├── src
    ├── package.json
    └── .env.example
```

---

## Features

- Homepage opens first.
- Login and signup are popups.
- Every email login/signup sends a fresh OTP.
- OTP is not shown on the website.
- Google login is included.
- Infinite product feed keeps loading as you scroll.
- Categories: Clothing, Shoes, Bags, Accessories, Beauty.
- Segments: dresses, tops, jeans, sneakers, heels, flats, bags, jewellery, watches, beauty and more.
- Product cards use many different live fashion photo URLs.
- Product page has multiple angles, colours, sizes, fit, seller, shipping, returns, terms and details.
- Changing colour changes the product image set.
- Backend cart/bag.
- Backend wishlist.
- Backend search history.
- Backend viewed product history.
- Backend reviews.
- Customer review photo upload.
- Backend orders.
- Razorpay payment checkout.
- Demo payment works locally if Razorpay keys are empty.

---

# PART A — Run it on your laptop first

Do this first so you know the app works before deployment.

## 1. Unzip the folder

After unzipping, you should see:

```txt
backend
frontend
README.md
```

Open the full folder in VS Code.

---

## 2. Start backend

Open VS Code Terminal.

Type:

```bash
cd backend
```

Install backend packages:

```bash
npm install
```

Make your backend secret file:

```bash
cp .env.example .env
```

Open this file:

```txt
backend/.env
```

For the easiest local test, keep `MONGODB_URI` empty. That means the backend will use:

```txt
backend/data/local-db.json
```

Fill local `.env` like this:

```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=write_a_long_random_secret_here

MONGODB_URI=

REQUIRE_EMAIL_OTP=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password_without_spaces
MAIL_FROM=Uptown <yourgmail@gmail.com>

GOOGLE_CLIENT_ID=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Start backend:

```bash
npm start
```

You should see:

```txt
Local JSON database ready: backend/data/local-db.json
Uptown API running on http://localhost:4000
```

Keep this terminal open.

---

## 3. Start frontend

Open a new terminal in VS Code.

Type:

```bash
cd frontend
```

Install frontend packages:

```bash
npm install
```

Make your frontend secret file:

```bash
cp .env.example .env
```

Open:

```txt
frontend/.env
```

Put this:

```env
VITE_API_URL=http://localhost:4000/api
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_CLIENT_ID=
```

Run frontend:

```bash
npm run dev
```

Open the link shown in terminal. Usually it is:

```txt
http://localhost:5173
```

---

# PART B — Make Gmail OTP work

Normal Gmail password will not work.

You need a Google App Password.

## 1. Turn on 2-Step Verification

Open your Google account.

Go to:

```txt
Security → 2-Step Verification → Turn on
```

## 2. Create App Password

In Google account search bar, search:

```txt
App passwords
```

Create a new app password.

Name it:

```txt
Uptown
```

Google gives something like:

```txt
abcd efgh ijkl mnop
```

Remove all spaces:

```txt
abcdefghijklmnop
```

## 3. Put it in backend `.env`

Open:

```txt
backend/.env
```

Set:

```env
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=abcdefghijklmnop
MAIL_FROM=Uptown <yourgmail@gmail.com>
```

Stop backend:

```txt
Control + C
```

Start backend again:

```bash
npm start
```

Now when any user clicks login/signup and enters their email, the OTP should go to that email.

If mail does not arrive, check:

```txt
Inbox
Spam
Promotions
Updates
```

If it still does not arrive, look at the backend terminal. It will show the mail error.

---

# PART C — What MongoDB is used for

MongoDB is the real storage room for the website.

It stores:

```txt
Users
Email verification
Cart / bag
Wishlist
Search history
Viewed product history
Reviews
Review photos
Addresses
Orders
Payment records
```

For local testing, this project can use a JSON file. For real deployment, use MongoDB Atlas.

---

# PART D — Create MongoDB Atlas database

## 1. Open MongoDB Atlas

Create an account.

## 2. Create a free cluster

Click:

```txt
Create Project → Uptown → Create Cluster → Free
```

## 3. Create database user

Go to:

```txt
Database Access → Add New Database User
```

Use:

```txt
Username: uptownuser
Password: make a password and save it
```

## 4. Allow network access

Go to:

```txt
Network Access → Add IP Address → Allow Access From Anywhere
```

For a student/demo project, this is the easiest.

## 5. Copy MongoDB connection string

Go to:

```txt
Database → Connect → Drivers → Copy connection string
```

It looks like:

```txt
mongodb+srv://uptownuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Change it to:

```txt
mongodb+srv://uptownuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/uptown?retryWrites=true&w=majority
```

This will be your `MONGODB_URI`.

---

# PART E — Push to GitHub

## 1. Create GitHub repo

Go to GitHub.

Create a new repo named:

```txt
uptown-render-vercel-final
```

Do not add README on GitHub because this folder already has one.

## 2. Push from VS Code terminal

Go to the main project folder:

```bash
cd ..
```

Make sure you are inside the folder that contains both `backend` and `frontend`.

Run:

```bash
git init
git add .
git commit -m "Deploy Uptown fashion app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/uptown-render-vercel-final.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

Do not push `.env` files.

---

# PART F — Deploy backend on Render

## 1. Open Render

Click:

```txt
New + → Web Service
```

Connect your GitHub repo.

Choose:

```txt
uptown-render-vercel-final
```

## 2. Fill backend settings

Use exactly:

```txt
Name: uptown-backend
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

## 3. Add Render environment variables

In Render, add these:

```env
PORT=4000
NODE_ENV=production
CLIENT_URL=http://localhost:5173
JWT_SECRET=write_a_very_long_random_secret_here

MONGODB_URI=mongodb+srv://uptownuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/uptown?retryWrites=true&w=majority

REQUIRE_EMAIL_OTP=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password_without_spaces
MAIL_FROM=Uptown <yourgmail@gmail.com>

GOOGLE_CLIENT_ID=your_google_client_id_if_using_google_login

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Click:

```txt
Create Web Service
```

Wait until it says:

```txt
Live
```

## 4. Test backend

Open:

```txt
https://YOUR-RENDER-BACKEND.onrender.com/api/health
```

You should see:

```json
{
  "ok": true,
  "app": "Uptown API",
  "database": "mongodb"
}
```

---

# PART G — Deploy frontend on Vercel

## 1. Open Vercel

Click:

```txt
Add New → Project
```

Import the same GitHub repo:

```txt
uptown-render-vercel-final
```

## 2. Fill frontend settings

Use exactly:

```txt
Framework Preset: Vite
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 3. Add Vercel environment variables

Use your real Render backend link:

```env
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_CLIENT_ID=your_google_client_id_if_using_google_login
```

Click:

```txt
Deploy
```

Vercel will give a frontend link like:

```txt
https://uptown-render-vercel-final.vercel.app
```

---

# PART H — Connect Render backend to Vercel frontend

Copy your Vercel frontend link.

Go back to Render.

Open:

```txt
uptown-backend → Environment
```

Change:

```env
CLIENT_URL=http://localhost:5173
```

to:

```env
CLIENT_URL=https://YOUR-VERCEL-FRONTEND.vercel.app
```

Click:

```txt
Save Changes
```

Then click:

```txt
Manual Deploy → Deploy latest commit
```

Now your frontend and backend are connected.

---

# PART I — Add Google Login

## 1. Open Google Cloud Console

Create a project named:

```txt
Uptown
```

## 2. Configure OAuth screen

Go to:

```txt
APIs & Services → OAuth consent screen
```

Choose external, add app name, email, and save.

## 3. Create OAuth Client ID

Go to:

```txt
APIs & Services → Credentials → Create Credentials → OAuth client ID
```

Choose:

```txt
Web application
```

Add Authorized JavaScript origins:

```txt
http://localhost:5173
https://YOUR-VERCEL-FRONTEND.vercel.app
```

Copy the Client ID.

## 4. Put Client ID in both places

Render backend:

```env
GOOGLE_CLIENT_ID=your_google_client_id
```

Vercel frontend:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Redeploy both Render and Vercel.

---

# PART J — Create Razorpay paywall / payment checkout

## 1. Open Razorpay Dashboard

Use Test Mode first.

Go to:

```txt
Account & Settings → API Keys → Generate Test Key
```

You get:

```txt
Key ID
Key Secret
```

## 2. Put keys in Render backend

Render backend gets both:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 3. Put only Key ID in Vercel frontend

Vercel frontend gets only:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

Never put `RAZORPAY_KEY_SECRET` in frontend.

## 4. Redeploy

After adding Razorpay keys:

```txt
Redeploy Render backend
Redeploy Vercel frontend
```

## 5. Test payment

Open your Vercel website.

Do:

```txt
Login
Add product to bag
Open bag
Fill delivery details
Click Pay and place order
Razorpay popup opens
Use Razorpay test payment
Order gets saved
```

If Razorpay keys are empty, the app uses demo payment mode for local testing.

---

# PART K — Final testing checklist

Test in this order:

```txt
1. Homepage opens first
2. Products show
3. Scroll down and more products keep loading
4. Categories work
5. Product page opens
6. Product has multiple images
7. Colour change changes image set
8. Size selection works
9. Login opens popup
10. Signup opens popup
11. OTP goes to email
12. Google login works after Client ID setup
13. Add to bag works
14. Wishlist works
15. Search history is stored
16. Viewed history is stored
17. Review and photo upload works
18. Checkout opens payment
19. Order is stored
```

---

# If OTP does not come

Check these:

```txt
1. Gmail 2-Step Verification is on
2. You used Google App Password, not normal Gmail password
3. You removed spaces from the app password
4. SMTP_USER is your Gmail address
5. MAIL_FROM uses the same Gmail address
6. Render environment variables are saved
7. Render backend is redeployed
8. Mail is not in Spam or Promotions
```

Then open:

```txt
Render → uptown-backend → Logs
```

The log will usually say exactly what is wrong.

Common errors:

```txt
Invalid login = wrong Gmail app password
Missing credentials = SMTP_USER or SMTP_PASS is empty
Connection timeout = SMTP host/port issue
```
