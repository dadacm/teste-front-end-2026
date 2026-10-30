import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    response.status(400).json({
      error: "JSON inválido.",
    });
    return;
  }

  console.error("[BFF Error]:", error);

  response.status(500).json({
    error: "Erro interno do servidor.",
  });
};
