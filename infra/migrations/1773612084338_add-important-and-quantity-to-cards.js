exports.up = (pgm) => {
  pgm.addColumn("cards", {
    important: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    revised_quantity: {
      type: "integer",
      notNull: true,
      default: 0,
    },
  });
};

exports.down = false;
