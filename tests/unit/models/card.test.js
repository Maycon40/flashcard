import orchestrator from "tests/orchestrator";

import card from "@/models/card.ts";

const day = 1000 * 60 * 60 * 24;

describe("@/models/card", () => {
  describe(".getNewBox()", () => {
    test("Without box", () => {
      const newBox = card.getNewBox();

      expect(newBox).toBe(undefined);
    });

    test("With unknow box", () => {
      const newBox = card.getNewBox("unknow box");

      expect(newBox).toBe("unknow box");
    });

    test("With box new and difficulty wrong", () => {
      const newBox = card.getNewBox("new", "wrong");

      expect(newBox).toBe("new");
    });

    test("With box new and difficulty easy", () => {
      const newBox = card.getNewBox("new", "easy");

      expect(newBox).toBe("progress");
    });

    test("With box new and difficulty very easy", () => {
      const newBox = card.getNewBox("new", "very easy");

      expect(newBox).toBe("progress");
    });

    test("With box progress and difficulty wrong", () => {
      const newBox = card.getNewBox("progress", "wrong");

      expect(newBox).toBe("new");
    });

    test("With box progress and difficulty easy", () => {
      const newBox = card.getNewBox("progress", "easy");

      expect(newBox).toBe("progress");
    });

    test("With box progress and difficulty very easy", () => {
      const newBox = card.getNewBox("progress", "very easy");

      expect(newBox).toBe("secure");
    });

    test("With box secure and difficulty wrong", () => {
      const newBox = card.getNewBox("secure", "wrong");

      expect(newBox).toBe("new");
    });

    test("With box secure and difficulty easy", () => {
      const newBox = card.getNewBox("secure", "easy");

      expect(newBox).toBe("secure");
    });

    test("With box secure and difficulty very easy", () => {
      const newBox = card.getNewBox("secure", "very easy");

      expect(newBox).toBe("advanced");
    });

    test("With box advanced and difficulty wrong", () => {
      const newBox = card.getNewBox("advanced", "wrong");

      expect(newBox).toBe("new");
    });

    test("With box advanced and difficulty easy", () => {
      const newBox = card.getNewBox("advanced", "easy");

      expect(newBox).toBe("advanced");
    });

    test("With box advanced and difficulty very easy", () => {
      const newBox = card.getNewBox("advanced", "very easy");

      expect(newBox).toBe("consolidated");
    });

    test("With box consolidated and difficulty wrong", () => {
      const newBox = card.getNewBox("consolidated", "wrong");

      expect(newBox).toBe("new");
    });

    test("With box consolidated and difficulty easy", () => {
      const newBox = card.getNewBox("consolidated", "easy");

      expect(newBox).toBe("advanced");
    });

    test("With box consolidated and difficulty very easy", () => {
      const newBox = card.getNewBox("consolidated", "very easy");

      expect(newBox).toBe("consolidated");
    });
  });

  describe(".getNewDateToReview()", () => {
    test("Without box", () => {
      const dateToReview = card.getNewDateToReview();

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now()).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });

    test("With unknow box", () => {
      const dateToReview = card.getNewDateToReview("unknow box");

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now()).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });

    test("With box new", () => {
      const dateToReview = card.getNewDateToReview("new");

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now() + day).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });

    test("With box progress", () => {
      const dateToReview = card.getNewDateToReview("progress");

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now() + day * 2).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });

    test("With box secure", () => {
      const dateToReview = card.getNewDateToReview("secure");

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now() + day * 5).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });

    test("With box advanced", () => {
      const dateToReview = card.getNewDateToReview("advanced");

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now() + day * 14).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });

    test("With box consolidated", () => {
      const dateToReview = card.getNewDateToReview("consolidated");

      const dateIsSimilar = orchestrator.verifyDateIsSimilar(
        new Date(Date.now() + day * 30).setHours(0, 0, 0, 0),
        new Date(dateToReview),
      );

      expect(dateIsSimilar).toBe(true);
    });
  });
});
