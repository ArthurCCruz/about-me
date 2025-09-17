import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateMessageDto } from "../dto/message.dto";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validateMessageDto = async (data: Record<string, unknown>)
: Promise<CreateMessageDto> => {
  // Check for extra fields
  const allowedFields = ["message"];
  const extraFields = Object.keys(data).filter((key) => !allowedFields.includes(key));

  if (extraFields.length > 0) {
    throw new ValidationError(`Extra fields not allowed: ${extraFields.join(", ")}`);
  }

  const dto = plainToInstance(CreateMessageDto, data);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const errorMessages = errors.map((error) =>
      Object.values(error.constraints || {}).join(", ")
    ).join("; ");
    throw new ValidationError(errorMessages);
  }

  return dto;
};
