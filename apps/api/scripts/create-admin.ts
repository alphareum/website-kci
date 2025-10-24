import { AuthService } from "../src/modules/auth/service.js";

const run = async () => {
  const svc = new AuthService();
  const admin = await svc.createAdmin({
    email: "admin@komunitaschineseindonesia.com",
    full_name: "Site Owner",
    role: "owner",
    password: "password123",
  });
  console.log("Created admin:", admin);
};
run();
// To run: `npm run admin:reset` or `npm run admin:reset:sha` or `npm run admin:reset:sha:ps`
