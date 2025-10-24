import { AuthService, CredentialsSchema, InvalidCredentialsError } from './service.js';
export async function authRoutes(server) {
    const service = new AuthService();
    server.get('/', async () => {
        return { admins: await service.listAdmins() };
    });
    server.post('/login', async (request) => {
        const credentials = CredentialsSchema.parse(request.body);
        try {
            const session = await service.verifyCredentials(credentials);
            return { session };
        }
        catch (error) {
            if (error instanceof InvalidCredentialsError) {
                throw server.httpErrors.unauthorized('Invalid email or password');
            }
            throw error;
        }
    });
}
//# sourceMappingURL=routes.js.map