import {InMemoryAccountStore} from "@src/database/testing/InMemoryAccountStore";
import {accountStoreContract} from "@src/database/testing/AccountStoreContract";

accountStoreContract(() => Promise.resolve(new InMemoryAccountStore()));
