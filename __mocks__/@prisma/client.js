// __mocks__/@prisma/client.js
// Manual mock for @prisma/client to support Jest tests

// Mock PrismaClientKnownRequestError for error handling
class PrismaClientKnownRequestError extends Error {
  constructor(message, props) {
    super(message);
    this.code = props.code;
    this.meta = props.meta;
  }
}

const Prisma = {
  PrismaClientKnownRequestError,
};

// Mock enums used in application
const CreditCategory = {
  TRIBUTARIO: "TRIBUTARIO",
  COMERCIAL: "COMERCIAL",
  FINANCEIRO: "FINANCEIRO",
  JUDICIAL: "JUDICIAL",
  RURAL: "RURAL",
  IMOBILIARIO: "IMOBILIARIO",
  AMBIENTAL: "AMBIENTAL",
  ESPECIAL: "ESPECIAL",
};

const CreditStatus = {
  DRAFT: "DRAFT",
  PENDING_VALIDATION: "PENDING_VALIDATION",
  VALIDATED: "VALIDATED",
  REJECTED: "REJECTED",
  PENDING_TOKENIZATION: "PENDING_TOKENIZATION",
  TOKENIZED: "TOKENIZED",
  LISTED_FOR_SALE: "LISTED_FOR_SALE",
  IN_NEGOTIATION: "IN_NEGOTIATION",
  NEGOTIATED: "NEGOTIATED",
  SETTLEMENT_PENDING: "SETTLEMENT_PENDING",
  SETTLED: "SETTLED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
};

// Export empty User stub to satisfy imports (TypeScript type only)
const User = {};

module.exports = {
  Prisma,
  CreditCategory,
  CreditStatus,
  User,
}; 