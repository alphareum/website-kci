import { getAllCompanyProfiles, getCompanyProfileBySlug, getCompanyProfileById, createCompanyProfile, updateCompanyProfile, deleteCompanyProfile, UpsertCompanyProfileInputSchema, } from './service.js';
export async function companyProfilesRoutes(fastify) {
    // GET /api/company-profiles - Get all company profiles
    fastify.get('/company-profiles', async (request, reply) => {
        try {
            const profiles = await getAllCompanyProfiles();
            return reply.send({ companyProfiles: profiles });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to fetch company profiles' });
        }
    });
    // GET /api/company-profiles/:slugOrId - Get company profile by slug or ID
    fastify.get('/company-profiles/:slugOrId', async (request, reply) => {
        try {
            const { slugOrId } = request.params;
            // Try to get by ID first (if it's a number)
            const numId = parseInt(slugOrId, 10);
            if (!isNaN(numId)) {
                const profile = await getCompanyProfileById(numId);
                if (profile) {
                    return reply.send({ companyProfile: profile });
                }
            }
            // Try to get by slug
            const profile = await getCompanyProfileBySlug(slugOrId);
            if (!profile) {
                return reply.status(404).send({ error: 'Company profile not found' });
            }
            return reply.send({ companyProfile: profile });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to fetch company profile' });
        }
    });
    // POST /api/admin/company-profiles - Create or update company profile (UPSERT logic)
    // CMS sends ID in body when editing, so we check for it
    fastify.post('/admin/company-profiles', async (request, reply) => {
        try {
            const body = request.body;
            // Check if this is an update (id provided in body)
            if (body.id !== undefined && body.id !== null) {
                const numId = parseInt(body.id, 10);
                if (isNaN(numId)) {
                    return reply.status(400).send({ error: 'Invalid company profile ID' });
                }
                // Extract input without the id field (API expects it without id)
                const { id, ...inputWithoutId } = body;
                const input = UpsertCompanyProfileInputSchema.parse(inputWithoutId);
                // Update existing profile
                const profile = await updateCompanyProfile(numId, input);
                return reply.send({ companyProfile: profile });
            }
            // Create new profile
            const input = UpsertCompanyProfileInputSchema.parse(body);
            const profile = await createCompanyProfile(input);
            return reply.status(201).send({ companyProfile: profile });
        }
        catch (error) {
            fastify.log.error(error);
            if (error.name === 'ZodError') {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            if (error.message.includes('already exists')) {
                return reply.status(409).send({ error: error.message });
            }
            return reply.status(500).send({ error: error.message || 'Failed to save company profile' });
        }
    });
    // PUT /api/admin/company-profiles/:id - Update company profile (standard REST)
    fastify.put('/admin/company-profiles/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const numId = parseInt(id, 10);
            if (isNaN(numId)) {
                return reply.status(400).send({ error: 'Invalid company profile ID' });
            }
            const input = UpsertCompanyProfileInputSchema.parse(request.body);
            const profile = await updateCompanyProfile(numId, input);
            return reply.send({ companyProfile: profile });
        }
        catch (error) {
            fastify.log.error(error);
            if (error.name === 'ZodError') {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            if (error.message.includes('already exists')) {
                return reply.status(409).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Failed to update company profile' });
        }
    });
    // DELETE /api/admin/company-profiles/:id - Delete company profile
    fastify.delete('/admin/company-profiles/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const numId = parseInt(id, 10);
            if (isNaN(numId)) {
                return reply.status(400).send({ error: 'Invalid company profile ID' });
            }
            await deleteCompanyProfile(numId);
            return reply.status(204).send();
        }
        catch (error) {
            fastify.log.error(error);
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: 'Failed to delete company profile' });
        }
    });
}
//# sourceMappingURL=routes.js.map