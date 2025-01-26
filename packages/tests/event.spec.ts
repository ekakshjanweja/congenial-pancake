import axios from "axios";
import { describe, expect, it } from "vitest";
import { EventInsert } from "../db/schema/event";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = "api/v1";
const BACKEND_ENDPOINT = `${BACKEND_URL}/${BASE_URL}/event`;

describe("events", () => {
  it("Can create an event", async () => {
    const event: EventInsert = {
      eventName: "Test Event",
      description:
        "Test Event Description. Uno Dos Tres Cuatro Cinco Seis Siete Ocho Nueve Diez!",
      adminId: "1",
      bannerUrl: "",
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      locationId: "1",
    };

    const response = await axios.post(`${BACKEND_ENDPOINT}/create`, {
      event,
    });

    expect(response.status).toBe(200);
  });
});
