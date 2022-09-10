import { isValidRequest, PlatformAlgorithm } from 'discord-verify';
import {
  APIInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const pubKey = new URL(request.url).pathname.slice(1);

    if (request.method !== 'POST')
      return new Response('Invalid Request', { status: 405 });
    if (!pubKey || pubKey.length !== 64)
      return new Response('Invalid Request', { status: 400 });

    const isValid = await isValidRequest(
      request,
      pubKey,
      PlatformAlgorithm.Cloudflare
    );

    if (isValid) {
      const json = await request.json<APIInteraction>();

      if (json.type === InteractionType.Ping)
        return new Response(
          JSON.stringify({ type: InteractionResponseType.Pong })
        );
      else return new Response(JSON.stringify({}));
    }

    return new Response('Unauthorized', { status: 401 });
  },
};
