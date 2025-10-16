import { z } from 'zod';
import { readTable, writeTable } from '../../lib/json-store.js';

// Zod schemas for validation
const PersonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  instagram: z.string().nullable(),
  photo: z.string().url().nullable().or(z.literal('')).transform(val => val || null),
});

const CoordinatorSchema = z.object({
  name: z.string().min(1, 'Coordinator name is required'),
  instagram: z.string().nullable(),
  photo: z.string().url().nullable().or(z.literal('')).transform(val => val || null),
});

const MemberSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  role: z.string().min(1, 'Member role is required'),
  photo: z.string().url().nullable().or(z.literal('')).transform(val => val || null),
});

const DivisionSchema = z.object({
  id: z.string().min(1, 'Division ID is required'),
  name: z.string().min(1, 'Division name is required'),
  coordinator: CoordinatorSchema,
  members: z.array(MemberSchema),
});

export const OrganizationSchema = z.object({
  founder: PersonSchema,
  cofounder: PersonSchema,
  divisions: z.array(DivisionSchema).min(1, 'At least one division is required'),
});

export type Organization = z.infer<typeof OrganizationSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Coordinator = z.infer<typeof CoordinatorSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Division = z.infer<typeof DivisionSchema>;

const TABLE_NAME = 'organization';

// Default organization structure
function getDefaultOrganization(): Organization {
  return {
    founder: {
      name: 'Joshua Robert Kurniawan',
      role: 'Founder',
      instagram: 'founderkci',
      photo: null,
    },
    cofounder: {
      name: 'Jonathan Robert Kurniawan',
      role: 'Co-Founder',
      instagram: 'cofounderkci',
      photo: null,
    },
    divisions: [
      {
        id: 'pr-partnership',
        name: 'Public Relations & Partnership Division',
        coordinator: {
          name: 'Nama Koordinator',
          instagram: 'koordinator.pr',
          photo: null,
        },
        members: [
          { name: 'Anggota 1', role: 'Staff PR', photo: null },
          { name: 'Anggota 2', role: 'Staff Partnership', photo: null },
          { name: 'Anggota 3', role: 'Staff PR', photo: null },
        ],
      },
      {
        id: 'media-comms',
        name: 'Media & Communications Division',
        coordinator: {
          name: 'Nama Koordinator',
          instagram: 'koordinator.media',
          photo: null,
        },
        members: [
          { name: 'Anggota 1', role: 'Content Creator', photo: null },
          { name: 'Anggota 2', role: 'Social Media Specialist', photo: null },
        ],
      },
      {
        id: 'membership',
        name: 'Membership & Community Engagement Division',
        coordinator: {
          name: 'Nama Koordinator',
          instagram: 'koordinator.membership',
          photo: null,
        },
        members: [
          { name: 'Anggota 1', role: 'Membership Officer', photo: null },
          { name: 'Anggota 2', role: 'Community Engagement', photo: null },
          { name: 'Anggota 3', role: 'Member Relations', photo: null },
        ],
      },
      {
        id: 'creative-event',
        name: 'Creative & Event Division',
        coordinator: {
          name: 'Nama Koordinator',
          instagram: 'koordinator.event',
          photo: null,
        },
        members: [
          { name: 'Anggota 1', role: 'Event Planner', photo: null },
          { name: 'Anggota 2', role: 'Creative Designer', photo: null },
          { name: 'Anggota 3', role: 'Event Coordinator', photo: null },
        ],
      },
      {
        id: 'creative-support',
        name: 'Creative Support Team',
        coordinator: {
          name: 'Nama Koordinator',
          instagram: 'koordinator.support',
          photo: null },
        members: [
          { name: 'Anggota 1', role: 'Graphic Designer', photo: null },
          { name: 'Anggota 2', role: 'Videographer', photo: null },
        ],
      },
    ],
  };
}

export class OrganizationService {
  /**
   * Get the organization structure
   * Returns the organization data or creates default if not exists
   */
  async getOrganization(): Promise<Organization> {
    const records = await readTable<Organization>(TABLE_NAME, [getDefaultOrganization()]);
    // Since we store single object, take first element
    return records[0] || getDefaultOrganization();
  }

  /**
   * Update the entire organization structure
   * Validates data before saving
   */
  async updateOrganization(data: unknown): Promise<Organization> {
    const validated = OrganizationSchema.parse(data);
    // Store as single-item array for consistency with other tables
    await writeTable(TABLE_NAME, [validated]);
    return validated;
  }
}
