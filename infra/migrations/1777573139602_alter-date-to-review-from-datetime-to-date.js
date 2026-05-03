exports.up = (pgm) => {
  pgm.alterColumn("cards", "date_to_review", {
    type: "date",

    default: pgm.func("current_date"),

    using: "date_to_review::date",
  });
};

exports.down = false;
