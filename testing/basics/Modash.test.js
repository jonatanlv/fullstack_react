import Modash from "./Modash";

describe("Modash", () => {
  describe("truncate()", () => {
    const string = "there was one catch, and that was CATCH-22";

    it("truncates a string", () => {
      expect(Modash.truncate(string, 19)).toBe("there was one catch...");
    });

    it("no-ops if <= length", () => {
      expect(Modash.truncate(string, string.length)).toBe(string);
    });
  });

  describe("capitalize()", () => {
    it("capitalizes the string", () => {
      expect(
        Modash.capitalize("there was one catch, and that was CATCH-22")
      ).toBe("There was one catch, and that was catch-22");
    });
  });

  describe("camelCase()", () => {
    const result = "thereWasOneCatch";

    it("string with spaces", () => {
      expect(Modash.camelCase("there was one catch")).toBe(result);
    });

    it("string with dashes", () => {
      expect(Modash.camelCase("there-was-one-catch")).toBe(result);
    });

    it("string with underscores", () => {
      expect(Modash.camelCase("there_was_one_catch")).toBe(result);
    });
  });
});
