import { z } from 'zod';
declare const PersonSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    instagram: z.ZodNullable<z.ZodString>;
    photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
}, "strip", z.ZodTypeAny, {
    role: string;
    name: string;
    instagram: string | null;
    photo: string | null;
}, {
    role: string;
    name: string;
    instagram: string | null;
    photo: string | null;
}>;
declare const CoordinatorSchema: z.ZodObject<{
    name: z.ZodString;
    instagram: z.ZodNullable<z.ZodString>;
    photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
}, "strip", z.ZodTypeAny, {
    name: string;
    instagram: string | null;
    photo: string | null;
}, {
    name: string;
    instagram: string | null;
    photo: string | null;
}>;
declare const MemberSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
}, "strip", z.ZodTypeAny, {
    role: string;
    name: string;
    photo: string | null;
}, {
    role: string;
    name: string;
    photo: string | null;
}>;
declare const DivisionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    coordinator: z.ZodObject<{
        name: z.ZodString;
        instagram: z.ZodNullable<z.ZodString>;
        photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        instagram: string | null;
        photo: string | null;
    }, {
        name: string;
        instagram: string | null;
        photo: string | null;
    }>;
    members: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        role: z.ZodString;
        photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
    }, "strip", z.ZodTypeAny, {
        role: string;
        name: string;
        photo: string | null;
    }, {
        role: string;
        name: string;
        photo: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    coordinator: {
        name: string;
        instagram: string | null;
        photo: string | null;
    };
    members: {
        role: string;
        name: string;
        photo: string | null;
    }[];
}, {
    id: string;
    name: string;
    coordinator: {
        name: string;
        instagram: string | null;
        photo: string | null;
    };
    members: {
        role: string;
        name: string;
        photo: string | null;
    }[];
}>;
export declare const OrganizationSchema: z.ZodObject<{
    founder: z.ZodObject<{
        name: z.ZodString;
        role: z.ZodString;
        instagram: z.ZodNullable<z.ZodString>;
        photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
    }, "strip", z.ZodTypeAny, {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    }, {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    }>;
    cofounder: z.ZodObject<{
        name: z.ZodString;
        role: z.ZodString;
        instagram: z.ZodNullable<z.ZodString>;
        photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
    }, "strip", z.ZodTypeAny, {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    }, {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    }>;
    divisions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        coordinator: z.ZodObject<{
            name: z.ZodString;
            instagram: z.ZodNullable<z.ZodString>;
            photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            instagram: string | null;
            photo: string | null;
        }, {
            name: string;
            instagram: string | null;
            photo: string | null;
        }>;
        members: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            role: z.ZodString;
            photo: z.ZodEffects<z.ZodUnion<[z.ZodNullable<z.ZodString>, z.ZodLiteral<"">]>, string | null, string | null>;
        }, "strip", z.ZodTypeAny, {
            role: string;
            name: string;
            photo: string | null;
        }, {
            role: string;
            name: string;
            photo: string | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        coordinator: {
            name: string;
            instagram: string | null;
            photo: string | null;
        };
        members: {
            role: string;
            name: string;
            photo: string | null;
        }[];
    }, {
        id: string;
        name: string;
        coordinator: {
            name: string;
            instagram: string | null;
            photo: string | null;
        };
        members: {
            role: string;
            name: string;
            photo: string | null;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    founder: {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    };
    cofounder: {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    };
    divisions: {
        id: string;
        name: string;
        coordinator: {
            name: string;
            instagram: string | null;
            photo: string | null;
        };
        members: {
            role: string;
            name: string;
            photo: string | null;
        }[];
    }[];
}, {
    founder: {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    };
    cofounder: {
        role: string;
        name: string;
        instagram: string | null;
        photo: string | null;
    };
    divisions: {
        id: string;
        name: string;
        coordinator: {
            name: string;
            instagram: string | null;
            photo: string | null;
        };
        members: {
            role: string;
            name: string;
            photo: string | null;
        }[];
    }[];
}>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Coordinator = z.infer<typeof CoordinatorSchema>;
export type Member = z.infer<typeof MemberSchema>;
export type Division = z.infer<typeof DivisionSchema>;
export declare class OrganizationService {
    /**
     * Get the organization structure
     * Returns the organization data or creates default if not exists
     */
    getOrganization(): Promise<Organization>;
    /**
     * Update the entire organization structure
     * Validates data before saving
     */
    updateOrganization(data: unknown): Promise<Organization>;
}
export {};
