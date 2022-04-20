import { shallow } from "enzyme";
import React from "react";
import FoodSearch from "../src/FoodSearch";

import Client from "../src/Client";

jest.mock("../src/Client");

describe("FoodSearch", () => {
  let wrapper;
  const onFoodClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<FoodSearch onFoodClick={onFoodClick} />);
  });

  afterEach(() => {
    onFoodClick.mockClear();
  });

  it("should not display the remove icon", () => {
    expect(wrapper.find(".remove.icon").length).toBe(0);
  });

  it("should display 0 rows", () => {
    expect(wrapper.find("table tbody tr").length).toBe(0);
  });

  describe("user populates search field", () => {
    const value = "brocc";

    beforeEach(() => {
      const input = wrapper.find("input.prompt").first();
      input.simulate("change", { target: { value: value } });
    });

    afterEach(() => {
      Client.search.mockClear();
    });

    it("should update state property `searchValue`", () => {
      expect(wrapper.state().searchValue).toBe(value);
    });

    it("should display the remove icon", () => {
      expect(wrapper.find(".remove.icon").length).toBe(1);
    });

    it("should call `Client.search` with `" + value + "`", () => {
      const firstInvocation = Client.search.mock.calls[0];
      expect(firstInvocation[0]).toBe(value);
    });

    describe("and API returns results", () => {
      const foods = [
        {
          description: "Broccolini",
          kcal: "100",
          protein_g: "11",
          fat_g: "21",
          carbohydrate_g: "31",
        },
        {
          description: "Broccoli rabe",
          kcal: "200",
          protein_g: "12",
          fat_g: "22",
          carbohydrate_g: "32",
        },
      ];
      beforeEach(() => {
        const invocationArgs = Client.search.mock.calls[0];
        const cb = invocationArgs[1];
        cb(foods);
        wrapper.update();
      });

      it("should set the state property `foods`", () => {
        expect(wrapper.state().foods).toEqual(foods);
      });

      it("should show 2 rows", () => {
        expect(wrapper.find("table tbody tr").length).toBe(2);
      });

      foods.forEach((f) => {
        it(`should contain the food '${f.description}'`, () => {
          expect(wrapper.html()).toContain(f.description);
        });
      });

      describe("the user clicks a food item", () => {
        beforeEach(() => {
          const foodRow = wrapper.find("table tbody tr").first();
          foodRow.simulate("click");
        });

        it("should invoke `onFoodClick`", () => {
          const lastCallArgs = onFoodClick.mock.calls[0];
          expect(lastCallArgs).toEqual([foods[0]]);
        });
      });

      describe("then user types more", () => {
        const value2 = value + "x";
        beforeEach(() => {
          const input = wrapper.find("input.prompt").first();
          input.simulate("change", { target: { value: value2 } });
        });

        describe("and API returns no results", () => {
          beforeEach(() => {
            const lastIdx = Client.search.mock.calls.length - 1;
            const invocationArgs = Client.search.mock.calls[lastIdx];
            const cb = invocationArgs[1];
            cb([]);
            wrapper.update();
          });

          it("should set the state property `foods`", () => {
            expect(wrapper.state().foods).toEqual([]);
          });
        });
      });
    });
  });
});
