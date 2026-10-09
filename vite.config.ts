import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';

dotenv.config();

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const route = urlObj.pathname.replace(/^\/api\//, '').split('?')[0];

          try {
            const handlerModule = await server.ssrLoadModule(`./api/${route}.ts`);
            const handler = handlerModule.default;
            if (typeof handler === 'function') {
              const query: Record<string, any> = {};
              urlObj.searchParams.forEach((val, key) => {
                query[key] = val;
              });

              let body: any = {};
              if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                const chunks: Uint8Array[] = [];
                for await (const chunk of req) {
                  chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                }
                const rawBody = Buffer.concat(chunks).toString('utf-8');
                if (rawBody) {
                  try {
                    body = JSON.parse(rawBody);
                  } catch {
                    body = rawBody;
                  }
                }
              }

              const vercelReq: any = Object.assign(req, {
                query,
                body,
                cookies: {}
              });

              const vercelRes: any = Object.assign(res, {
                status: (statusCode: number) => {
                  res.statusCode = statusCode;
                  return vercelRes;
                },
                json: (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return vercelRes;
                },
                send: (data: any) => {
                  res.end(typeof data === 'object' ? JSON.stringify(data) : data);
                  return vercelRes;
                }
              });

              await handler(vercelReq, vercelRes);
              return;
            }
          } catch (err: any) {
            console.error(`[API Dev Error] /api/${route}:`, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiDevPlugin()
  ],
});
