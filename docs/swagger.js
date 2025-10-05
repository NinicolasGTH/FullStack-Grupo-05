export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API de Jogos",
    description: "API para catálogo de jogos com wishlist",
    version: "1.0.0"
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Servidor local"
    }
  ],
  tags: [
    { name: "Auth", description: "Endpoints de autenticação" },
    { name: "Games", description: "Endpoints de jogos" },
    { name: "Wishlist", description: "Endpoints de wishlist" }
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Nicolas" },
                  email: { type: "string", example: "nicolas@email.com" },
                  password: { type: "string", example: "senha123" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Usuário registrado com sucesso",
            content: {
              "application/json": {
                example: {
                  message: "Usuário registrado com sucesso",
                  user: { id: "123", name: "Nicolas", email: "nicolas@email.com", role: "user" }
                }
              }
            }
          },
          400: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                example: { error: "Dados inválidos" }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login de usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "nicolas@email.com" },
                  password: { type: "string", example: "senha123" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                example: {
                  token: "JWT_TOKEN_AQUI",
                  user: { id: "123", name: "Nicolas", email: "nicolas@email.com", role: "user" }
                }
              }
            }
          },
          401: { description: "Credenciais inválidas" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obter perfil do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Perfil do usuário",
            content: {
              "application/json": {
                example: { id: "123", name: "Nicolas", email: "nicolas@email.com", role: "user", wishlist: [] }
              }
            }
          },
          401: {
            description: "Token inválido/expirado",
            content: {
              "application/json": {
                example: { error: "Token inválido ou expirado" }
              }
            }
          }
        }
      }
    },
    "/games": {
      get: {
        tags: ["Games"],
        summary: "Listar todos os jogos",
        parameters: [
          { in: "query", name: "q", schema: { type: "string" }, description: "Buscar por título" },
          { in: "query", name: "upcoming", schema: { type: "boolean" }, description: "Filtrar lançamentos futuros" }
        ],
        responses: {
          200: {
            description: "Lista de jogos",
            content: {
              "application/json": {
                example: [
                  { id: "1", title: "Super Game", genres: ["RPG", "Aventura"], platforms: ["PC", "PS5"], releaseDate: "2026-01-01" }
                ]
              }
            }
          }
        }
      },
      post: {
        tags: ["Games"],
        summary: "Criar novo jogo (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Super Game" },
                  description: { type: "string", example: "Um jogo incrível" },
                  genres: { type: "array", items: { type: "string" }, example: ["RPG", "Aventura"] },
                  platforms: { type: "array", items: { type: "string" }, example: ["PC", "PS5"] },
                  coverUrl: { type: "string", example: "https://exemplo.com/capa.jpg" },
                  releaseDate: { type: "string", format: "date", example: "2026-01-01" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Jogo criado",
            content: {
              "application/json": {
                example: { message: "Jogo criado com sucesso", game: { id: "1", title: "Super Game" } }
              }
            }
          },
          403: {
            description: "Acesso negado (não é admin)",
            content: {
              "application/json": {
                example: { error: "Acesso negado" }
              }
            }
          }
        }
      }
    },
    "/wishlist": {
      get: {
        tags: ["Wishlist"],
        summary: "Listar wishlist do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de jogos na wishlist",
            content: {
              "application/json": {
                example: [ { id: "1", title: "Super Game" } ]
              }
            }
          }
        }
      }
    },
    "/wishlist/{gameId}": {
      post: {
        tags: ["Wishlist"],
        summary: "Adicionar jogo à wishlist",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "gameId", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Jogo adicionado à wishlist",
            content: {
              "application/json": {
                example: { message: "Jogo adicionado à wishlist" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Wishlist"],
        summary: "Remover jogo da wishlist",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "gameId", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Jogo removido da wishlist",
            content: {
              "application/json": {
                example: { message: "Jogo removido da wishlist" }
              }
            }
          }
        }
      }
    }
  }
};