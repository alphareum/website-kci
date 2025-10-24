import { LinksService, UpsertLinkSchema } from './service.js';
export async function linksRoutes(server) {
    const service = new LinksService();
    server.get('/', async () => {
        const links = await service.listLinks();
        return { links };
    });
    server.post('/', async (request) => {
        const payload = UpsertLinkSchema.parse(request.body);
        const link = await service.upsertLink(payload);
        return { link };
    });
    server.delete('/:id', async (request) => {
        const { id } = request.params;
        await service.deleteLink(Number(id));
        return { success: true };
    });
}
//# sourceMappingURL=routes.js.map