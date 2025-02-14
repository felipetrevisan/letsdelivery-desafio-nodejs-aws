import { clientSchema } from "./schema";

export const ClientRequestCreateBody = clientSchema.omit({ id: true });
export const ClientRequestUpdateBody = ClientRequestCreateBody.partial();