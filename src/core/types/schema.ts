import { z } from "zod";
import { CONTACT_TYPE, STATUS } from "./client";

const contactSchema = z.object(
  {
    type: z.nativeEnum(CONTACT_TYPE, { message: "O tipo do contato deve ser email ou phone" }),
    value: z.string().min(1, "O valor do contato não pode estar vazio"),
  },
  {
    message: "É necessário fornecer pelo menos um contato",
    invalid_type_error: "É necessário fornecer pelo menos um contato",
  }
);

const addressSchema = z.string().min(5, "O endereço deve ter pelo menos 5 caracteres");

export const clientSchema = z.object({
  id: z.string().uuid("ID inválido, deve ser um UUID válido"),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  birthDate: z.coerce.date({ message: "A data de nascimento é obrigatório" }),
  status: z.nativeEnum(STATUS, { message: "O status deve ser active ou inactive" }),
  addresses: z.array(addressSchema).optional(),
  contacts: z.array(contactSchema).nonempty("É necessário fornecer pelo menos um contato"),
});
