// import the file to be tested
import { daysRemaining } from "../src/client/js/daysRemaining";

describe("Testing days remaining function", () => {
  test("get the remaining days of two days", () => {
    expect(daysRemaining(new Date("2022-12-9"), new Date("2022-12-1"))).toBe(8);
  });
});
