exports.up = (pgm) => {
  pgm.createTable("cards", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    name: {
      type: "varchar(1000)",
      notNull: true,
    },

    description: {
      type: "varchar(5000)",
      notNull: true,
    },

    date_to_review: {
      type: "timestamptz",
      notNull: true,
    },

    deck_id: {
      type: "uuid",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
