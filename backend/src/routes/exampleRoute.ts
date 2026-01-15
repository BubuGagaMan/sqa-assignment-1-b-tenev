
import { FastifyInstance } from "fastify";
import { ReplyDefault } from "fastify/types/utils.js";

export default async function exampleRoute(app: FastifyInstance) {
  app.get("/exampleRoute", async (_request: any, reply: ReplyDefault) => {
    return { data: "some data" };
  });

  //@TODO - look at serialisation (~50 min) and type box
  const postSchema = {
    schema: {
        body: {
            type: 'object',
            properties: {
                label: { type: 'string' },
                value: { type: 'number' }
            }, 
            required: ['label', 'value']
        }
    }
  }


  app.post('/exampleRoute', postSchema, async (request: any, reply: ReplyDefault) => {
    const { label, value } = request.body

    return { label, value }

  })
}
