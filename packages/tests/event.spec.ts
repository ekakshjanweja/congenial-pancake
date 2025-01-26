import axios from "axios";
import { describe, expect, it } from "vitest";
import { EventInsert } from "../db/schema/event";
import { LocationInsert } from "../db/schema/location";
import { CreateEventSchema, CreateLocationSchema } from "@repo/common";

const BACKEND_URL = "http://localhost:8080";
const BASE_URL = "api/v1";
const BACKEND_ENDPOINT = `${BACKEND_URL}/${BASE_URL}/event`;

describe("events", () => {
  it("Can create a location", async () => {
    const locationInsert: LocationInsert = {
      name: "Test Location",
      description: "Test Location Description",
      imageUrl:
        "https://images.unsplash.com/photo-1736077722346-31ba59414728?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };

    const validLocation = CreateLocationSchema.parse(locationInsert);

    const locationResponse = await axios.post(
      `${BACKEND_URL}/api/v1/location/create`,
      { validLocation }
    );

    expect(locationResponse.status).toBe(200);
  });

  it("Can create an event", async () => {
    const locationInsert: LocationInsert = {
      name: "Test Location",
      description: "Test Location Description",
      imageUrl:
        "https://images.unsplash.com/photo-1736077722346-31ba59414728?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };

    const validLocation = CreateLocationSchema.parse(locationInsert);

    const locationResponse = await axios.post(
      `${BACKEND_URL}/api/v1/location/create`,
      { validLocation }
    );

    expect(locationResponse.status).toBe(200);

    const locationId: string = locationResponse.data.data.loccation.id;

    const event: EventInsert = {
      eventName: "Test Event",
      description:
        "Test Event Description. Uno Dos Tres Cuatro Cinco Seis Siete Ocho Nueve Diez!",
      adminId: "1",
      bannerUrl:
        "https://images.unsplash.com/photo-1736077722346-31ba59414728?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      locationId: locationId,
    };

    const validEvent = CreateEventSchema.parse(event);

    const response = await axios.post(`${BACKEND_ENDPOINT}/create`, {
      validEvent,
    });

    expect(response.status).toBe(200);
  });
});
