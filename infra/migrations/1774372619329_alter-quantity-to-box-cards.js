exports.up = (pgm) => {
  pgm.renameColumn("cards", "revised_quantity", "box");

  pgm.alterColumn("cards", "box", {
    type: "varchar(100)",
    using: "box::varchar",
    notNull: true,
    default: "new",
  });
};

exports.down = false;
