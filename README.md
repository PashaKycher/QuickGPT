# QuickGPT

QuickGPT is a lightweight web application that provides a chat interface backed by a generative language model (Gemini/OpenAI-style) and supports text and AI-generated images. The project follows a client/server architecture with a React + Vite frontend and an Express + Node.js backend using MongoDB for storage.

Key features
- User authentication (JWT)
- Chat creation / management
- Text-based responses via the generative model
- AI image generation and publishing (via ImageKit image generation endpoint)
- Credits system with Stripe checkout + webhook to credit user accounts
- Simple REST API for client-server communication

Repository layout
- `client/` - React frontend built with Vite (JSX, Tailwind CSS)
- `server/` - Express backend, MongoDB via Mongoose, Stripe webhooks, OpenAI/Gemini integration

Quick overview
- Frontend routes: `/` (chat), `/credits`, `/community`
- Backend API endpoints:
  - `GET /` - health check
  - `POST /api/stripe` - Stripe webhook (expects raw JSON body)
  - `/api/user` - user registration/login/profile
  - `/api/chat` - chat creation/list/delete
  - `/api/message` - send text or image prompts
  - `/api/credit` - credit-related endpoints (payments, transactions)

Environment variables
Create a `.env` file in `server/` and provide at least the following values:

```
MONGODB_URL=your_mongo_connection_prefix_or_uri  # e.g. mongodb+srv://user:pass@host
PORT=3000

# OpenAI / Gemini key used by server/configs/openai.js
GEMINI_API_KEY=your_generative_model_api_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint   # used to generate images

# JWT (for user auth)
JWT_SECRET_KEY=some_long_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
```

Notes about the webhook
- The server registers the Stripe webhook at `POST /api/stripe` and uses `express.raw({ type: 'application/json' })` for the raw body. When testing webhooks locally, be sure to forward the raw request body (e.g., with `stripe listen` or `ngrok` configured correctly) and configure the webhook signing secret accordingly.

Development (local)
1. Install dependencies for both server and client.

   Open two terminals (or run sequentially):

   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install

2. Start the server (development):

   cd server
   npm run dev

   This starts the server with `nodemon` and binds to `process.env.PORT || 3000`.

3. Start the client (development):

   cd client
   npm run dev

   Vite will start (usually on http://localhost:5173) and the frontend will communicate with the backend API.

Production notes
- `server` has a `start` script to run `node server.js`.
- `client` has a `build` script (`vite build`) and `preview` for testing a production bundle.

Security & secrets
- Never commit `.env` or secret keys to source control. Use environment management in your hosting platform (e.g., Vercel, Heroku, Railway) or secret managers.

Known configuration / assumptions
- The MongoDB connect string in `server/configs/db.js` appends `/quickgpt` to `MONGODB_URL`. Provide `MONGODB_URL` accordingly.
- The project uses `GEMINI_API_KEY` in `server/configs/openai.js` (the code shows a custom baseURL pointing at Google's generative language endpoint). Ensure the provided key matches the expected service.
- Image generation uses an ImageKit URL endpoint to trigger generation and then uploads the returned image via the ImageKit SDK.

Troubleshooting
- If webhooks fail with signature errors, confirm you are forwarding the raw request body and that `STRIPE_WEBHOOK_SECRET` matches the one configured in your Stripe dashboard.
- If messages return errors from the generative model, confirm `GEMINI_API_KEY` is valid and the model name `gemini-2.0-flash` (used in code) is available for your key.

Contributing
- Small fixes, docs, and bug reports are welcome. Please open an issue or a PR with a clear description and reproduction steps.

License
- MIT-style (please add a LICENSE file as appropriate for your project)
