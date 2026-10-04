import {InMemoryDatabase} from "@src/database/testing/InMemoryDatabase";
import {databaseContract} from "@src/database/testing/DatabaseContract";

databaseContract(() => Promise.resolve(new InMemoryDatabase()));
