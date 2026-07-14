import { InternalServerError } from "@/infra/errors";
import { Resource, User } from "@/types/types";

const availableFeatures = [
  // USER
  "create:user",
  "read:user",
  "read:user:self",
  "update:user",
  "update:user:others",
  "delete:user",

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

  // RECOVERY
  "create:recovery_token",
  "create:recovery_token:username",
  "read:recovery_token",
  "update:recovery_token",

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

  // LIBRARY
  "read:library",
  "read:library:all",
  "read:library:deck",
  "read:library:card",
  "create:library",

  // APP
  "read:app",
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

function filterOutput(userObject: User, feature: string, resource: any) {
  validateUser(userObject);
  validateFeature(feature);
  validateResource(resource);

  if (feature === "read:user") {
    return {
      id: resource.id,
      username: resource.username,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  } else if (feature === "read:user:self" && userObject.id === resource.id) {
    return {
      id: resource.id,
      username: resource.username,
      email: resource.email,
      features: resource.features,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  } else if (feature === "read:session" && userObject.id === resource.user_id) {
    return {
      id: resource.id,
      token: resource.token,
      user_id: resource.user_id,
      expires_at: resource.expires_at,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  } else if (feature === "read:activation_token") {
    return {
      id: resource.id,
      user_id: resource.user_id,
      used_at: resource.used_at,
      expires_at: resource.expires_at,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  } else if (feature === "read:migration") {
    return resource.map((migration: any) => {
      return {
        name: migration.name,
        path: migration.path,
        timestamp: migration.timestamp,
      };
    });
  } else if (feature === "read:status") {
    const result: any = {
      updated_at: resource.updated_at,
      dependencies: {
        database: {
          max_connections: resource.dependencies.database.max_connections,
          used_connections: resource.dependencies.database.used_connections,
        },
      },
    };

    if (can(userObject, "read:status:all")) {
      result.dependencies.database.version =
        resource.dependencies.database.version;
    }

    return result;
  } else if (feature === "read:recovery_token") {
    return {
      used_at: resource.used_at,
      expires_at: resource.expires_at,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  } else if (feature === "read:deck") {
    if (Array.isArray(resource)) {
      return resource.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });
    }

    return {
      id: resource.id,
      name: resource.name,
      user_id: resource.user_id,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    };
  } else if (feature === "read:card") {
    if (Array.isArray(resource)) {
      return resource.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          box: item.box,
          important: item.important,
          deck_id: item.deck_id,
          deck_name: item.deck_name,
          date_to_review: item.date_to_review,
          created_at: item.created_at,
          updated_at: item.updated_at,
          published_at: item.published_at,
        };
      });
    }

    return {
      id: resource.id,
      name: resource.name,
      description: resource.description,
      box: resource.box,
      important: resource.important,
      deck_id: resource.deck_id,
      deck_name: resource.deck_name,
      date_to_review: resource.date_to_review,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
      published_at: resource.published_at,
    };
  } else if (feature === "read:library:all") {
    return resource.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        username: item.username,
        deck_id: item.deck_id,
        deck_name: item.deck_name,
        published_at: item.published_at,
      };
    });
  } else if (feature === "read:library:deck") {
    return resource.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        username: item.username,
      };
    });
  } else if (feature === "read:library:card") {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description,
      deck_id: resource.deck_id,
      deck_name: resource.deck_name,
      username: resource.username,
      published_at: resource.published_at,
    };
  } else if (feature === "read:app") {
    return {
      minVersionRequired: resource.minVersionRequired,
      latestVersion: resource.latestVersion,
      updateUrl: resource.updateUrl,
      updated_at: resource.updated_at,
    };
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
