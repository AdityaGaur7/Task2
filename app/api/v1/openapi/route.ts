const base = {
  openapi: "3.0.3",
  info: {
    title: "Task2 API",
    version: "v1",
    description:
      "Versioned REST API with JWT auth (httpOnly cookie) and role-based access.",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "auth" },
    { name: "tasks" },
    { name: "admin" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "task2_token",
      },
    },
    schemas: {
      ApiOk: {
        type: "object",
        properties: { ok: { type: "boolean", enum: [true] }, data: {} },
        required: ["ok", "data"],
      },
      ApiError: {
        type: "object",
        properties: {
          ok: { type: "boolean", enum: [false] },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {},
            },
            required: ["code", "message"],
          },
        },
        required: ["ok", "error"],
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: ["string", "null"] },
          completed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "title", "completed", "createdAt", "updatedAt"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "email", "role"],
      },
    },
  },
  paths: {
    "/api/v1/auth/register": {
      post: {
        tags: ["auth"],
        summary: "Register",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string", enum: ["USER", "ADMIN"] },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "400": { description: "Validation error" },
          "409": { description: "Email already registered" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["auth"],
        summary: "Logout",
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["auth"],
        summary: "Current user",
        security: [{ cookieAuth: [] }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
    "/api/v1/tasks": {
      get: {
        tags: ["tasks"],
        summary: "List tasks (current user)",
        security: [{ cookieAuth: [] }],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
      post: {
        tags: ["tasks"],
        summary: "Create task",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/tasks/{id}": {
      get: {
        tags: ["tasks"],
        summary: "Get task by id",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
      patch: {
        tags: ["tasks"],
        summary: "Update task",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: ["string", "null"] },
                  completed: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["tasks"],
        summary: "Delete task",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
      },
    },
    "/api/v1/admin/users": {
      get: {
        tags: ["admin"],
        summary: "List users (admin only)",
        security: [{ cookieAuth: [] }],
        responses: { "200": { description: "OK" }, "403": { description: "Forbidden" } },
      },
    },
  },
} as const;

export async function GET() {
  return Response.json(base);
}

