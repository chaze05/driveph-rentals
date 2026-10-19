import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { CARS } from "../src/data/cars.ts";
import { filterCars } from "../src/lib/filters.ts";

test("car data integrity", () => {
  assert.equal(CARS.length, 8);
  assert.equal(new Set(CARS.map((car) => car.slug)).size, 8);
  for (const car of CARS) {
    assert.ok(car.dailyRate > 0);
    assert.ok(car.images.length >= 2);
    for (const image of car.images) {
      assert.ok(existsSync(`public${image}`), `missing ${image}`);
    }
  }
});

test("car filtering", () => {
  assert.equal(filterCars(CARS, {}).length, 8);
  assert.ok(filterCars(CARS, { type: "Sports" }).every((car) => car.type === "Sports"));
  assert.equal(filterCars(CARS, { location: "Siargao" }).length, 2);
  assert.ok(filterCars(CARS, { transmission: "Manual" }).every((car) => car.transmission === "Manual"));
  assert.ok(filterCars(CARS, { seats: 7 }).every((car) => car.seats >= 7));
  assert.ok(filterCars(CARS, { maxPrice: 3000 }).every((car) => car.dailyRate <= 3000));
  assert.equal(filterCars(CARS, { query: "hilux" })[0]?.slug, "toyota-hilux");
});
