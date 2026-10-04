import {InMemoryDatabase} from "@src/database/testing/InMemoryDatabase";

/** The one in-memory database every test's mocked database functions share (`SetupApiTests`), emptied before each test. */
export const testDatabase = new InMemoryDatabase();
