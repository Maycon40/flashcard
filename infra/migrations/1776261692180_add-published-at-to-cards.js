exports.up = (pgm) => {
  pgm.addColumn("cards", {
    published_at: {
      type: "timestamptz",
    },
  });
};

exports.down = false;
