import { CreateMessageSchema, MessagingService } from './service.js';
export async function messagingRoutes(server) {
    const service = new MessagingService();
    server.get('/', async () => ({ messages: await service.listMessages() }));
    server.post('/', async (request) => {
        const payload = CreateMessageSchema.parse(request.body);
        const message = await service.createMessage(payload);
        return { message };
    });
}
//# sourceMappingURL=routes.js.map