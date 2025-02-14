import { z } from "zod";
import { clientSchema } from "./schema";

export enum STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum CONTACT_TYPE {
  EMAIL = "email",
  PHONE = "phone",
}

export type Client = z.infer<typeof clientSchema>;