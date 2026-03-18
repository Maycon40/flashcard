import { InternalServerError } from "@/infra/errors";
import { Resource, User } from "@/types/types";

const availableFeatures = [
  // USER
  "create:user",
  "read:user",
  "read:user:self",
  "update:user",
  "update:user:others",

  // SESSION
  "create:session",
  "read:session",

  // ACTIVATE TOKEN
  "read:activation_token",

  // MIGRATION
  "create:migration",
  "read:migration",

  // STATUS
  "read:status",
  "read:status:all",

  // CARD
  "read:card",
  "read:card:all",
  "create:card",
  "update:card",
  "delete:card",

  // DECK
  "read:deck",
  "read:deck:all",
  "create:deck",
  "update:deck",
  "delete:deck",
];

function can(userObject: User, requiredFeature: string, resource?: Resource) {
  validateUser(userObject);
  validateFeature(requiredFeature);

  let authorized = false;

  if (userObject.features?.includes(requiredFeature)) {
    authorized = true;
  }

  if (requiredFeature === "update:user" && resource) {
    authorized = false;

    if (
      userObject.id === resource.id ||
      can(userObject, "update:user:others")
    ) {
      authorized = true;
    }
  }

  return authorized;
}

function filterOutput(userObject: User, feature: string, resouce: any) {
  validateUser(userObject);
  validateFeature(feature);
  validateResource(resouce);

  if (feature === "read:user") {
    return {
      id: resouce.id,
      username: resouce.username,
      features: resouce.features,
      created_at: resouce.created_at,
      updated_at: resouce.updated_at,
    };
  } else if (feature === "read:user:self" && userObject.id === resouce.id) {
    return {
      id: resouce.id,
      username: resouce.username,
      email: resouce.email,
      features: resouce.features,
      created_at: resouce.created_at,
      updated_at: resouce.updated_at,
    };
  } else if (feature === "read:session" && userObject.id === resouce.user_id) {
    return {
      id: resouce.id,
      token: resouce.token,
      user_id: resouce.user_id,
      expires_at: resouce.expires_at,
      created_at: resouce.created_at,
      updated_at: resouce.updated_at,
    };
  } else if (feature === "read:activation_token") {
    return {
      id: resouce.id,
      user_id: resouce.user_id,
      used_at: resouce.used_at,
      expires_at: resouce.expires_at,
      created_at: resouce.created_at,
      updated_at: resouce.updated_at,
    };
  } else if (feature === "read:migration") {
    return resouce.map((migration: any) => {
      return {
        name: migration.name,
        path: migration.path,
        timestamp: migration.timestamp,
      };
    });
  } else if (feature === "read:status") {
    const result: any = {
      updated_at: resouce.updated_at,
      dependencies: {
        database: {
          max_connections: resouce.dependencies.database.max_connections,
          used_connections: resouce.dependencies.database.used_connections,
        },
      },
    };

    if (can(userObject, "read:status:all")) {
      result.dependencies.database.version =
        resouce.dependencies.database.version;
    }

    return result;
  } else if (feature === "read:deck") {
    return {
      id: resouce.id,
      name: resouce.name,
      user_id: resouce.user_id,
      created_at: resouce.created_at,
      updated_at: resouce.updated_at,
    };
  } else if (feature === "read:deck:all") {
    return resouce.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
  } else if (feature === "read:card") {
    return {
      id: resouce.id,
      name: resouce.name,
      description: resouce.description,
      important: resouce.important,
      deck_id: resouce.deck_id,
      deck_name: resouce.deck_name,
      date_to_review: resouce.date_to_review,
      created_at: resouce.created_at,
      updated_at: resouce.updated_at,
    };
  } else if (feature === "read:card:all") {
    return resouce.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        important: item.important,
        deck_id: item.deck_id,
        deck_name: item.deck_name,
        date_to_review: item.date_to_review,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
  }
}

function validateUser(userObject: User) {
  if (!userObject || !userObject.features) {
    throw new InternalServerError({
      cause: "É necessário fornecer um user no model authorization.",
    });
  }
}

function validateFeature(feature: string) {
  if (!feature || !availableFeatures.includes(feature)) {
    throw new InternalServerError({
      cause:
        "É necessário fornecer uma feature conhecida no model authorization.",
    });
  }
}

function validateResource(resource: any) {
  if (!resource) {
    throw new InternalServerError({
      cause: "É necessário fornecer um resource no model authorization.",
    });
  }
}

const authorization = {
  can,
  filterOutput,
};

export default authorization;
